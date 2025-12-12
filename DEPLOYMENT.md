# Secure Chatbot Deployment Guide

## 🚀 Quick Start

### Step 1: Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Initialize Vercel project**:
   ```bash
   cd c:\Users\AlkahestV\Documents\GitHub\chatbot-widgets
   npm install
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Note your deployment URL** (e.g., `https://chatbot-widgets-xyz.vercel.app`)

### Step 2: Configure Environment Variables

In your Vercel dashboard (https://vercel.com/your-username/your-project/settings/environment-variables):

Add these environment variables:

```
WEBHOOK_CHATBOT=https://raindance.app.n8n.cloud/webhook/b597fca9-95c7-429b-b375-0dc41d09066a/chat
WEBHOOK_BIM=https://raindance.app.n8n.cloud/webhook/8a2b3071-fbaa-48f8-9431-b715df58f52b/chat
WEBHOOK_BIM2=https://raindance.app.n8n.cloud/webhook/4ef533d5-cdd1-4840-aca2-a9c614e11171/chat
WEBHOOK_RAPID=https://raindance.app.n8n.cloud/webhook/a0d536ef-e072-4844-8090-2ee9b36f9fb8/chat
WEBHOOK_RBM=https://raindance.app.n8n.cloud/webhook/1184e628-1f25-497a-b09f-662832480696/chat
WEBHOOK_RAINDANCE=https://raindance.app.n8n.cloud/webhook/b7183c87-d1c1-497e-8cec-f76f7b2a938d/chat
WEBHOOK_SKYLARK=https://raindance.app.n8n.cloud/webhook/6f4cf690-6d7f-4ef8-bf84-88f98eeae1f8/chat
ALLOWED_ORIGINS=*
```

**IMPORTANT**: Set these for the **Production** environment!

### Step 3: Update Your Chatbot Files

For each chatbot file, update the configuration:

**OLD (Insecure)**:
```javascript
webhookUrl: 'https://raindance.app.n8n.cloud/webhook/....'
```

**NEW (Secure)**:
```javascript
proxyUrl: 'https://your-project.vercel.app/api/chat',  // Your Vercel URL
botId: 'BIM',  // Bot identifier
```

### Step 4: Test Your Chatbot

1. Update one chatbot file (e.g., `chatbot_BIM.js`) with the new configuration
2. Host it on a test page
3. Send a message
4. Check Vercel logs: `vercel logs --follow`

## 📋 Bot ID Reference

Use these exact bot IDs in your config:

| Bot File | Bot ID |
|----------|--------|
| ChatBot.js | `ChatBot` |
| chatbot_BIM.js | `BIM` |
| chatbot_BIM2.js | `BIM2` |
| chatbot_RAPID.js | `RAPID` |
| chatbot_RBM.js | `RBM` |
| chatbot_Raindance.js | `Raindance` |
| chatbot_Skylark.js | `Skylark` |

## 🔒 Security Features Now Active

### ✅ Server-Side (Vercel Proxy)
- ✅ Rate limiting (5 messages/minute, 50/hour per user)
- ✅ Input validation (max 500 characters)
- ✅ Suspicious content detection
- ✅ Hidden webhook URLs
- ✅ Request logging with IP tracking
- ✅ CORS protection
- ✅ Bot authentication via X-Bot-ID header

### ✅ Client-Side (Widget)
- ✅ Secure session IDs (crypto.randomUUID)
- ✅ Client-side rate limiting (3 messages/minute)
- ✅ Input length validation
- ✅ Character counter
- ✅ Double-send prevention
- ✅ Better error handling

## 🎯 Migration Checklist

For each chatbot file:

- [ ] Copy `chatbot_secure_template.js`
- [ ] Update `proxyUrl` to your Vercel URL
- [ ] Update `botId` to match bot name
- [ ] Update branding (colors, title, etc.)
- [ ] Test on staging/dev site first
- [ ] Deploy to production
- [ ] Monitor Vercel logs for issues

## 📊 Monitoring

### View Logs
```bash
vercel logs --follow
```

### Check for Abuse
Look for patterns like:
- Same IP sending many requests
- 429 (rate limit) errors
- 400 (validation) errors
- Suspicious message content

### Example Log Output
```
[BIM] Message from 123.45.67.89 (session: abc123): How much does...
Rate limit exceeded: 123.45.67.89-session-xyz
```

## 🔧 Advanced Configuration

### Restrict to Specific Domains

Update `ALLOWED_ORIGINS` in Vercel:
```
ALLOWED_ORIGINS=https://example.com,https://www.example.com
```

### Adjust Rate Limits

Edit `api/chat.js`:
```javascript
const CONFIG = {
  MAX_MESSAGE_LENGTH: 500,           // Change as needed
  RATE_LIMIT_PER_MINUTE: 5,         // Change as needed
  RATE_LIMIT_PER_HOUR: 50,          // Change as needed
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*']
};
```

Then redeploy:
```bash
vercel --prod
```

## 🆘 Troubleshooting

### Error: "Invalid bot configuration"
- Check `botId` matches exactly (case-sensitive)
- Verify environment variables are set in Vercel

### Error: "Webhook not configured"
- Check environment variable names match exactly
- Redeploy after adding environment variables

### Error: "Rate limit exceeded"
- Normal for spam/bot protection
- User needs to wait before sending more messages

### CORS Errors
- Add your domain to `ALLOWED_ORIGINS`
- Redeploy Vercel

## 💰 Cost Savings

Before:
- ❌ Direct API access exposed
- ❌ Anyone can spam your webhook
- ❌ Unlimited API costs

After:
- ✅ Proxy protects webhooks
- ✅ Rate limiting prevents spam
- ✅ 5 msg/min × 60 min = max 300 msg/hour per user
- ✅ Vercel free tier: 100GB bandwidth, 100k invocations/month

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `api/chat.js` | Vercel serverless proxy function |
| `vercel.json` | Vercel configuration |
| `package.json` | Node dependencies |
| `.env.example` | Environment variables template |
| `chatbot_secure_template.js` | Secure chatbot widget template |
| `DEPLOYMENT.md` | This file |

## 🔄 Update Process

When updating the proxy logic:

1. Edit `api/chat.js`
2. Test locally: `vercel dev`
3. Deploy: `vercel --prod`
4. No need to update chatbot widgets

When updating widget design:

1. Edit `chatbot_secure_template.js`
2. Copy changes to specific bot files
3. No Vercel deployment needed

## 📞 Support

Issues? Check:
1. Vercel logs: `vercel logs`
2. Browser console (F12)
3. Environment variables configured correctly
4. Bot ID matches exactly
