(function() {
    // Prevent multiple instances
    if (window.ChatWidgetLoaded) return;
    window.ChatWidgetLoaded = true;

    // ===== CUSTOMIZATION CONFIG =====
    // Edit this section for each client
    const config = {
        // API Configuration - USE YOUR VERCEL PROXY URL
        proxyUrl: 'https://your-project.vercel.app/api/chat',  // UPDATE THIS
        botId: 'RAPID',  // Bot identifier: ChatBot, BIM, BIM2, RAPID, RBM, Raindance, or Skylark

        // Security
        maxMessageLength: 500,  // Maximum characters per message
        clientRateLimit: 3,     // Max messages per minute (client-side)

        // Colors & Branding
        primaryColor: '#D86C0C',
        primaryColorHover: '#D86C0C',
        secondaryColor: '#f3f4f6',
        textColor: '#374151',
        borderColor: '#e5e7eb',
        inputBorderColor: '#d1d5db',

        // Positioning & Layout
        position: 'bottom-right',
        buttonOffset: '20px',
        windowWidth: '380px',
        windowHeight: '600px',
        buttonSize: '60px',

        // Content & Text
        title: 'Chat',
        welcomeMessage: 'Hello! How can I help you today?',
        placeholder: 'Type your message...',
        sendButtonText: 'Send',

        // Logo Configuration
        showLogo: false,
        logoUrl: '',
        logoSize: '32px',
        logoPosition: 'left',

        // Behavior
        welcomeDelay: 1000,
        autoOpen: false,

        // Animation
        animationDuration: '0.3s',

        // Typography
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        headerFontSize: '18px',
        messageFontSize: '14px',

        // Border Radius
        borderRadius: '12px',
        buttonBorderRadius: '50%',
        messageBorderRadius: '12px',
        inputBorderRadius: '8px'
    };

    // Calculate position styles based on config
    const getPositionStyles = () => {
        const positions = config.position.split('-');
        const vertical = positions[0];
        const horizontal = positions[1];

        return {
            button: {
                [vertical]: config.buttonOffset,
                [horizontal]: config.buttonOffset
            },
            window: {
                [vertical]: vertical === 'bottom' ? '90px' : config.buttonOffset,
                [horizontal]: config.buttonOffset
            }
        };
    };

    const positionStyles = getPositionStyles();

    // Generate CSS with config values
    const styles = `
        .chat-widget-container * {
            box-sizing: border-box;
        }

        .chat-widget-button {
            display: flex !important;
            position: fixed !important;
            z-index: 2147483647 !important;
            opacity: 1 !important;
            visibility: visible !important;
            ${positionStyles.button.top ? `top: ${positionStyles.button.top};` : ''}
            ${positionStyles.button.bottom ? `bottom: ${positionStyles.button.bottom};` : ''}
            ${positionStyles.button.left ? `left: ${positionStyles.button.left};` : ''}
            ${positionStyles.button.right ? `right: ${positionStyles.button.right};` : ''}
            background-color: ${config.primaryColor};
            color: white;
            border: none;
            border-radius: ${config.buttonBorderRadius};
            width: ${config.buttonSize};
            height: ${config.buttonSize};
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all ${config.animationDuration} ease;
            align-items: center;
            justify-content: center;
            font-family: ${config.fontFamily};
        }

        .chat-widget-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
            background-color: ${config.primaryColorHover};
        }

        .chat-widget-window {
            position: fixed;
            ${positionStyles.window.top ? `top: ${positionStyles.window.top};` : ''}
            ${positionStyles.window.bottom ? `bottom: ${positionStyles.window.bottom};` : ''}
            ${positionStyles.window.left ? `left: ${positionStyles.window.left};` : ''}
            ${positionStyles.window.right ? `right: ${positionStyles.window.right};` : ''}
            width: ${config.windowWidth};
            height: ${config.windowHeight};
            max-height: calc(100vh - 120px);
            background: white;
            border-radius: ${config.borderRadius};
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 10000;
            display: none;
            flex-direction: column;
            font-family: ${config.fontFamily};
        }

        .chat-widget-window.show {
            display: flex;
            animation: slideUp ${config.animationDuration} ease-out;
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .chat-widget-header {
            background: ${config.primaryColor};
            color: white;
            padding: 16px;
            border-radius: ${config.borderRadius} ${config.borderRadius} 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        .chat-widget-header-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            ${config.logoPosition === 'right' ? 'flex-direction: row-reverse;' : ''}
        }

        .chat-widget-logo {
            width: ${config.logoSize};
            height: ${config.logoSize};
            border-radius: 4px;
            object-fit: contain;
            ${config.showLogo ? '' : 'display: none;'}
        }

        .chat-widget-header h3 {
            margin: 0;
            font-size: ${config.headerFontSize};
            font-weight: 600;
        }

        .chat-widget-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
            flex-shrink: 0;
        }

        .chat-widget-close:hover {
            background-color: rgba(255,255,255,0.2);
        }

        .chat-widget-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: white;
        }

        .chat-widget-message {
            margin-bottom: 12px;
            display: flex;
        }

        .chat-widget-message.user {
            justify-content: flex-end;
        }

        .chat-widget-message.bot {
            justify-content: flex-start;
        }

        .chat-widget-message-bubble {
            max-width: 80%;
            padding: 12px;
            border-radius: ${config.messageBorderRadius};
            word-wrap: break-word;
            font-size: ${config.messageFontSize};
        }

        .chat-widget-message.user .chat-widget-message-bubble {
            background: ${config.primaryColor};
            color: white;
        }

        .chat-widget-message.bot .chat-widget-message-bubble {
            background: ${config.secondaryColor};
            color: ${config.textColor};
        }

        .chat-widget-input-area {
            border-top: 1px solid ${config.borderColor};
            padding: 16px;
            background: white;
            border-radius: 0 0 ${config.borderRadius} ${config.borderRadius};
        }

        .chat-widget-input-container {
            display: flex;
            gap: 8px;
        }

        .chat-widget-input {
            flex: 1;
            border: 1px solid ${config.inputBorderColor};
            border-radius: ${config.inputBorderRadius};
            padding: 8px 12px;
            font-size: ${config.messageFontSize};
            outline: none;
            font-family: ${config.fontFamily};
        }

        .chat-widget-input:focus {
            border-color: ${config.primaryColor};
            box-shadow: 0 0 0 2px ${config.primaryColor}20;
        }

        .chat-widget-send {
            background: ${config.primaryColor};
            color: white;
            border: none;
            border-radius: ${config.inputBorderRadius};
            padding: 8px 16px;
            cursor: pointer;
            font-size: ${config.messageFontSize};
            transition: background-color 0.2s;
            font-family: ${config.fontFamily};
        }

        .chat-widget-send:hover:not(:disabled) {
            background: ${config.primaryColorHover};
        }

        .chat-widget-send:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .chat-widget-char-count {
            font-size: 11px;
            color: #6b7280;
            text-align: right;
            margin-top: 4px;
        }

        .chat-widget-char-count.warning {
            color: #f59e0b;
        }

        .chat-widget-char-count.error {
            color: #ef4444;
        }

        .chat-widget-typing {
            display: flex;
            gap: 4px;
            padding: 12px;
            background: ${config.secondaryColor};
            border-radius: ${config.messageBorderRadius};
            align-items: center;
        }

        .chat-widget-dot {
            width: 6px;
            height: 6px;
            background: #6b7280;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }

        .chat-widget-dot:nth-child(2) { animation-delay: 0.2s; }
        .chat-widget-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
            0%, 60%, 100% { opacity: 0.3; }
            30% { opacity: 1; }
        }

        @media (max-width: 420px) {
            .chat-widget-window {
                width: calc(100vw - 20px);
                ${positionStyles.window.right ? 'right: 10px;' : ''}
                ${positionStyles.window.left ? 'left: 10px;' : ''}
                ${positionStyles.window.bottom ? 'bottom: 80px;' : ''}
                ${positionStyles.window.top ? 'top: 80px;' : ''}
            }
        }
    `;

    // Generate HTML with config values
    const chatHTML = `
        <div class="chat-widget-container">
            <button class="chat-widget-button" id="chat-widget-toggle" aria-label="Open chat widget">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
     xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>
            </button>

            <div class="chat-widget-window" id="chat-widget-window">
                <div class="chat-widget-header">
                    <div class="chat-widget-header-content">
                        <img src="${config.logoUrl}" alt="Logo" class="chat-widget-logo" id="chat-widget-logo">
                        <h3>${config.title}</h3>
                    </div>
                    <button class="chat-widget-close" id="chat-widget-close" aria-label="Close chat widget">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
     xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2">
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</svg>
                    </button>
                </div>

                <div class="chat-widget-messages" id="chat-widget-messages"></div>

                <div class="chat-widget-input-area">
                    <div class="chat-widget-input-container">
                        <input type="text" class="chat-widget-input" id="chat-widget-input" placeholder="${config.placeholder}" maxlength="${config.maxMessageLength}">
                        <button class="chat-widget-send" id="chat-widget-send">${config.sendButtonText}</button>
                    </div>
                    <div class="chat-widget-char-count" id="chat-widget-char-count"></div>
                </div>
            </div>
        </div>
    `;

    // Secure Chat Widget Class
    class ChatWidget {
        constructor() {
            this.isOpen = false;
            this.sessionId = this.generateSecureSessionId();
            this.messageTimes = [];  // Track message timestamps for rate limiting
            this.isSending = false;  // Prevent double-sends
            this.init();
        }

        // Secure session ID generation using crypto API
        generateSecureSessionId() {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                // Fallback for browsers without randomUUID
                const array = new Uint8Array(16);
                crypto.getRandomValues(array);
                return 'session-' + Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
            } else {
                // Ultimate fallback (not as secure, but better than Math.random)
                console.warn('Crypto API not available, using less secure session ID');
                return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            }
        }

        // Client-side rate limiting check
        checkClientRateLimit() {
            const now = Date.now();
            // Remove messages older than 1 minute
            this.messageTimes = this.messageTimes.filter(time => now - time < 60000);

            if (this.messageTimes.length >= config.clientRateLimit) {
                return false;
            }

            this.messageTimes.push(now);
            return true;
        }

        init() {
            // Create shadow DOM for style isolation
            const container = document.createElement('div');
            const shadow = container.attachShadow({ mode: 'open' });
            this.shadowRoot = shadow;

            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            shadow.appendChild(styleSheet);

            const widgetWrapper = document.createElement('div');
            widgetWrapper.innerHTML = chatHTML;
            shadow.appendChild(widgetWrapper);

            document.body.appendChild(container);

            // Handle logo loading errors
            if (config.showLogo && config.logoUrl) {
                const logo = this.shadowRoot.getElementById('chat-widget-logo');
                logo.onerror = () => {
                    logo.style.display = 'none';
                };
            }

            // Bind events
            this.bindEvents();

            // Auto-open if configured
            if (config.autoOpen) {
                setTimeout(() => this.toggle(), 500);
            }

            // Add welcome message
            setTimeout(() => {
                this.addMessage(config.welcomeMessage, false);
            }, config.welcomeDelay);
        }

        bindEvents() {
            const toggleBtn = this.shadowRoot.getElementById('chat-widget-toggle');
            const closeBtn = this.shadowRoot.getElementById('chat-widget-close');
            const input = this.shadowRoot.getElementById('chat-widget-input');
            const sendBtn = this.shadowRoot.getElementById('chat-widget-send');

            toggleBtn.addEventListener('click', () => this.toggle());
            closeBtn.addEventListener('click', () => this.close());
            sendBtn.addEventListener('click', () => this.sendMessage());

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Character counter
            input.addEventListener('input', () => {
                this.updateCharCount();
            });
        }

        updateCharCount() {
            const input = this.shadowRoot.getElementById('chat-widget-input');
            const charCount = this.shadowRoot.getElementById('chat-widget-char-count');
            const length = input.value.length;
            const max = config.maxMessageLength;

            if (length > 0) {
                charCount.textContent = `${length}/${max}`;

                if (length >= max) {
                    charCount.className = 'chat-widget-char-count error';
                } else if (length >= max * 0.9) {
                    charCount.className = 'chat-widget-char-count warning';
                } else {
                    charCount.className = 'chat-widget-char-count';
                }
            } else {
                charCount.textContent = '';
            }
        }

        toggle() {
            const window = this.shadowRoot.getElementById('chat-widget-window');
            if (this.isOpen) {
                this.close();
            } else {
                window.classList.add('show');
                this.isOpen = true;
                this.shadowRoot.getElementById('chat-widget-input').focus();
            }
        }

        close() {
            const window = this.shadowRoot.getElementById('chat-widget-window');
            window.classList.remove('show');
            this.isOpen = false;
        }

        addMessage(message, isUser = false) {
            const messagesContainer = this.shadowRoot.getElementById('chat-widget-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-widget-message ${isUser ? 'user' : 'bot'}`;

            const bubble = document.createElement('div');
            bubble.className = 'chat-widget-message-bubble';

            if (!isUser) {
                // Format bot messages (basic sanitization)
                let formattedMessage = message
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                bubble.innerHTML = formattedMessage;
            } else {
                // User messages: plain text only (no HTML)
                bubble.textContent = message;
            }

            messageDiv.appendChild(bubble);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        showTyping() {
            const messagesContainer = this.shadowRoot.getElementById('chat-widget-messages');
            const typingDiv = document.createElement('div');
            typingDiv.id = 'chat-widget-typing';
            typingDiv.className = 'chat-widget-message bot';
            typingDiv.innerHTML = `
                <div class="chat-widget-typing">
                    <div class="chat-widget-dot"></div>
                    <div class="chat-widget-dot"></div>
                    <div class="chat-widget-dot"></div>
                </div>
            `;
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        hideTyping() {
            const typing = this.shadowRoot.getElementById('chat-widget-typing');
            if (typing) typing.remove();
        }

        async sendMessage() {
            if (this.isSending) return;  // Prevent double-send

            const input = this.shadowRoot.getElementById('chat-widget-input');
            const sendBtn = this.shadowRoot.getElementById('chat-widget-send');
            const message = input.value.trim();

            // Validation
            if (!message) return;

            if (message.length > config.maxMessageLength) {
                this.addMessage(`Message is too long (max ${config.maxMessageLength} characters)`, false);
                return;
            }

            // Client-side rate limiting
            if (!this.checkClientRateLimit()) {
                this.addMessage('You are sending messages too quickly. Please wait a moment.', false);
                return;
            }

            this.isSending = true;
            sendBtn.disabled = true;

            this.addMessage(message, true);
            input.value = '';
            this.updateCharCount();
            this.showTyping();

            try {
                const response = await fetch(config.proxyUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Bot-ID': config.botId
                    },
                    body: JSON.stringify({
                        action: 'sendMessage',
                        sessionId: this.sessionId,
                        chatInput: message
                    })
                });

                this.hideTyping();

                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After');
                    this.addMessage(`Rate limit exceeded. Please wait ${retryAfter || 60} seconds.`, false);
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    this.addMessage(errorData.output || 'Sorry, I encountered an error. Please try again.', false);
                    return;
                }

                const data = await response.json();

                if (data.output) {
                    this.addMessage(data.output, false);
                } else {
                    this.addMessage('Sorry, I encountered an error. Please try again.', false);
                }
            } catch (error) {
                console.error('Chat widget error:', error);
                this.hideTyping();
                this.addMessage('Sorry, I couldn\'t connect. Please check your internet connection.', false);
            } finally {
                this.isSending = false;
                sendBtn.disabled = false;
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ChatWidget());
    } else {
        new ChatWidget();
    }
})();
