// Vercel Serverless Function - Secure Chatbot Proxy
// Protects n8n webhooks with rate limiting, validation, and authentication

// Simple in-memory rate limiting (for production, use Redis/Upstash)
const rateLimitStore = new Map();

// Webhook configuration - KEEP THESE SECRET!
const WEBHOOK_CONFIG = {
  'ChatBot': process.env.WEBHOOK_CHATBOT,
  'BIM': process.env.WEBHOOK_BIM,
  'BIM2': process.env.WEBHOOK_BIM2,
  'RAPID': process.env.WEBHOOK_RAPID,
  'RBM': process.env.WEBHOOK_RBM,
  'Raindance': process.env.WEBHOOK_RAINDANCE,
  'Skylark': process.env.WEBHOOK_SKYLARK
};

// Configuration
const CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  RATE_LIMIT_PER_MINUTE: 5,
  RATE_LIMIT_PER_HOUR: 50,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*']
};

// Rate limiting helper
function checkRateLimit(identifier) {
  const now = Date.now();
  const userLimits = rateLimitStore.get(identifier) || {
    minute: [],
    hour: []
  };

  // Clean old entries
  userLimits.minute = userLimits.minute.filter(t => now - t < 60000); // 1 minute
  userLimits.hour = userLimits.hour.filter(t => now - t < 3600000); // 1 hour

  // Check limits
  if (userLimits.minute.length >= CONFIG.RATE_LIMIT_PER_MINUTE) {
    return {
      allowed: false,
      reason: 'Rate limit exceeded: Too many messages per minute',
      retryAfter: 60
    };
  }

  if (userLimits.hour.length >= CONFIG.RATE_LIMIT_PER_HOUR) {
    return {
      allowed: false,
      reason: 'Rate limit exceeded: Too many messages per hour',
      retryAfter: 3600
    };
  }

  // Add timestamp
  userLimits.minute.push(now);
  userLimits.hour.push(now);
  rateLimitStore.set(identifier, userLimits);

  return { allowed: true };
}

// Validate and sanitize input
function validateInput(data) {
  const errors = [];

  // Validate action
  if (data.action !== 'sendMessage') {
    errors.push('Invalid action');
  }

  // Validate sessionId
  if (!data.sessionId || typeof data.sessionId !== 'string') {
    errors.push('Invalid session ID');
  }

  // Validate message
  if (!data.chatInput || typeof data.chatInput !== 'string') {
    errors.push('Invalid message');
  } else {
    // Check length
    if (data.chatInput.length > CONFIG.MAX_MESSAGE_LENGTH) {
      errors.push(`Message too long (max ${CONFIG.MAX_MESSAGE_LENGTH} characters)`);
    }

    // Check for suspicious patterns (excessive special chars, scripts, etc.)
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // event handlers like onclick=
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(data.chatInput)) {
        errors.push('Message contains suspicious content');
        break;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// CORS headers helper
function getCorsHeaders(origin) {
  const allowedOrigin = CONFIG.ALLOWED_ORIGINS.includes('*') ||
                        CONFIG.ALLOWED_ORIGINS.includes(origin)
    ? origin
    : CONFIG.ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Bot-ID',
    'Access-Control-Max-Age': '86400',
  };
}

// Main handler
export default async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer || 'unknown';

  // Set CORS headers
  const corsHeaders = getCorsHeaders(origin);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      output: 'Sorry, an error occurred. Please try again.'
    });
  }

  try {
    // Get bot ID from header
    const botId = req.headers['x-bot-id'];
    if (!botId || !WEBHOOK_CONFIG[botId]) {
      console.error('Invalid bot ID:', botId);
      return res.status(400).json({
        error: 'Invalid bot configuration',
        output: 'Sorry, an error occurred. Please try again.'
      });
    }

    const webhookUrl = WEBHOOK_CONFIG[botId];
    if (!webhookUrl) {
      console.error('Webhook URL not configured for bot:', botId);
      return res.status(500).json({
        error: 'Webhook not configured',
        output: 'Sorry, the chatbot is not properly configured.'
      });
    }

    // Parse request body
    const data = req.body;

    // Validate input
    const validation = validateInput(data);
    if (!validation.valid) {
      console.warn('Validation failed:', validation.errors);
      return res.status(400).json({
        error: validation.errors.join(', '),
        output: 'Sorry, your message could not be processed. Please check your input.'
      });
    }

    // Rate limiting (use IP + sessionId for better tracking)
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] ||
                     req.headers['x-real-ip'] ||
                     'unknown';
    const rateLimitKey = `${clientIp}-${data.sessionId}`;

    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      console.warn('Rate limit exceeded:', rateLimitKey);
      res.setHeader('Retry-After', rateCheck.retryAfter.toString());
      return res.status(429).json({
        error: rateCheck.reason,
        output: 'You are sending messages too quickly. Please wait a moment and try again.'
      });
    }

    // Log request (for monitoring)
    console.log(`[${botId}] Message from ${clientIp} (session: ${data.sessionId}):`,
                data.chatInput.substring(0, 50) + '...');

    // Forward to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Chatbot-Proxy/1.0'
      },
      body: JSON.stringify({
        action: data.action,
        sessionId: data.sessionId,
        chatInput: data.chatInput,
        // Add metadata
        _metadata: {
          timestamp: new Date().toISOString(),
          clientIp: clientIp,
          origin: origin,
          botId: botId
        }
      })
    });

    if (!response.ok) {
      console.error('Webhook error:', response.status, await response.text());
      return res.status(502).json({
        error: 'Webhook error',
        output: 'Sorry, I encountered an error. Please try again in a moment.'
      });
    }

    const result = await response.json();

    // Return response
    return res.status(200).json(result);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      output: 'Sorry, I encountered an error. Please try again.'
    });
  }
}
