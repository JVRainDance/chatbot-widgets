(function() {
    // Prevent multiple instances
    if (window.ChatWidgetLoaded) return;
    window.ChatWidgetLoaded = true;

    // ===== CUSTOMIZATION CONFIG =====
    // Edit this section for each client
    const config = {
        // API Configuration
        webhookUrl: 'https://raindance.app.n8n.cloud/webhook/a0d536ef-e072-4844-8090-2ee9b36f9fb8/chat',
        
        // Colors & Branding
        primaryColor: '#2563eb',        // Main brand color (button, header, user messages)
        primaryColorHover: '#1d4ed8',   // Hover state for primary color
        secondaryColor: '#f3f4f6',      // Bot message background
        textColor: '#374151',           // Bot message text color
        borderColor: '#e5e7eb',         // Border colors
        inputBorderColor: '#d1d5db',    // Input field border
        
        // Positioning & Layout
        position: 'bottom-right',       // Options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        buttonOffset: '20px',           // Distance from screen edge
        windowWidth: '380px',
        windowHeight: '600px',
        buttonSize: '60px',
        
        // Content & Text
        title: 'Chat Assistant',
        welcomeMessage: 'Hello! Welcome to our chat. How can I help you today?',
        placeholder: 'Type your message...',
        sendButtonText: 'Send',
        
        // Logo Configuration
        showLogo: false,                // Set to true to show logo in header
        logoUrl: '',                    // URL to your logo image
        logoSize: '32px',               // Logo dimensions (square)
        logoPosition: 'left',           // 'left' or 'right' of title
        
        // Behavior
        welcomeDelay: 1000,             // Delay before showing welcome message (milliseconds)
        autoOpen: false,                // Auto-open widget on page load
        
        // Animation
        animationDuration: '0.3s',      // Widget open/close animation speed
        
        // Typography
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        headerFontSize: '18px',
        messageFontSize: '14px',
        
        // Border Radius (for rounded corners)
        borderRadius: '12px',           // Main window border radius
        buttonBorderRadius: '50%',      // Chat button border radius
        messageBorderRadius: '12px',    // Message bubbles border radius
        inputBorderRadius: '8px'        // Input field border radius
    };

    // Calculate position styles based on config
    const getPositionStyles = () => {
        const positions = config.position.split('-');
        const vertical = positions[0]; // top or bottom
        const horizontal = positions[1]; // left or right
        
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
            position: fixed;
            ${positionStyles.button.top ? `top: ${positionStyles.button.top};` : ''}
            ${positionStyles.button.bottom ? `bottom: ${positionStyles.button.bottom};` : ''}
            ${positionStyles.button.left ? `left: ${positionStyles.button.left};` : ''}
            ${positionStyles.button.right ? `right: ${positionStyles.button.right};` : ''}
            z-index: 10000;
            background-color: ${config.primaryColor};
            color: white;
            border: none;
            border-radius: ${config.buttonBorderRadius};
            width: ${config.buttonSize};
            height: ${config.buttonSize};
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all ${config.animationDuration} ease;
            display: flex;
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
        
        .chat-widget-send:hover {
            background: ${config.primaryColorHover};
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
            <button class="chat-widget-button" id="chat-widget-toggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
            
            <div class="chat-widget-window" id="chat-widget-window">
                <div class="chat-widget-header">
                    <div class="chat-widget-header-content">
                        <img src="${config.logoUrl}" alt="Logo" class="chat-widget-logo" id="chat-widget-logo">
                        <h3>${config.title}</h3>
                    </div>
                    <button class="chat-widget-close" id="chat-widget-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="chat-widget-messages" id="chat-widget-messages"></div>
                
                <div class="chat-widget-input-area">
                    <div class="chat-widget-input-container">
                        <input type="text" class="chat-widget-input" id="chat-widget-input" placeholder="${config.placeholder}">
                        <button class="chat-widget-send" id="chat-widget-send">${config.sendButtonText}</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Chat Widget Class (functionality preserved)
    class ChatWidget {
        constructor() {
            this.isOpen = false;
            this.sessionId = this.generateSessionId();
            this.init();
        }

        generateSessionId() {
            return 'session-' + Math.random().toString(36).substr(2, 9);
        }

        init() {
            // Add styles
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);

            // Add HTML
            const container = document.createElement('div');
            container.innerHTML = chatHTML;
            document.body.appendChild(container);

            // Handle logo loading errors
            if (config.showLogo && config.logoUrl) {
                const logo = document.getElementById('chat-widget-logo');
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
            const toggleBtn = document.getElementById('chat-widget-toggle');
            const closeBtn = document.getElementById('chat-widget-close');
            const input = document.getElementById('chat-widget-input');
            const sendBtn = document.getElementById('chat-widget-send');

            toggleBtn.addEventListener('click', () => this.toggle());
            closeBtn.addEventListener('click', () => this.close());
            sendBtn.addEventListener('click', () => this.sendMessage());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }

        toggle() {
            const window = document.getElementById('chat-widget-window');
            if (this.isOpen) {
                this.close();
            } else {
                window.classList.add('show');
                this.isOpen = true;
                document.getElementById('chat-widget-input').focus();
            }
        }

        close() {
            const window = document.getElementById('chat-widget-window');
            window.classList.remove('show');
            this.isOpen = false;
        }

        addMessage(message, isUser = false) {
            const messagesContainer = document.getElementById('chat-widget-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-widget-message ${isUser ? 'user' : 'bot'}`;
            
            const bubble = document.createElement('div');
            bubble.className = 'chat-widget-message-bubble';
            
            if (!isUser) {
                // Format bot messages
                let formattedMessage = message
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                bubble.innerHTML = formattedMessage;
            } else {
                bubble.textContent = message;
            }
            
            messageDiv.appendChild(bubble);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        showTyping() {
            const messagesContainer = document.getElementById('chat-widget-messages');
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
            const typing = document.getElementById('chat-widget-typing');
            if (typing) typing.remove();
        }

        async sendMessage() {
            const input = document.getElementById('chat-widget-input');
            const message = input.value.trim();
            
            if (!message) return;
            
            this.addMessage(message, true);
            input.value = '';
            this.showTyping();
            
            try {
                const response = await fetch(config.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'sendMessage',
                        sessionId: this.sessionId,
                        chatInput: message
                    })
                });
                
                const data = await response.json();
                this.hideTyping();
                
                if (data.output) {
                    this.addMessage(data.output, false);
                } else {
                    this.addMessage('Sorry, I encountered an error. Please try again.', false);
                }
            } catch (error) {
                console.error('Chat widget error:', error);
                this.hideTyping();
                this.addMessage('Sorry, I couldn\'t connect. Please try again.', false);
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