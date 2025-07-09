(function() {
    // Prevent multiple instances
    if (window.ChatWidgetLoaded) return;
    window.ChatWidgetLoaded = true;
    
    // Configuration - you can customize this for each client
    const config = {
        webhookUrl: 'https://raindance.app.n8n.cloud/webhook/a0d536ef-e072-4844-8090-2ee9b36f9fb8/chat',
        primaryColor: '#2563eb',
        position: 'bottom-right' // bottom-right, bottom-left, etc.
    };

    // CSS Styles
    const styles = `
        .chat-widget-container * {
            box-sizing: border-box;
        }
        
        .chat-widget-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background-color: ${config.primaryColor};
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .chat-widget-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        
        .chat-widget-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            height: 600px;
            max-height: calc(100vh - 120px);
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 10000;
            display: none;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .chat-widget-window.show {
            display: flex;
            animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .chat-widget-header {
            background: ${config.primaryColor};
            color: white;
            padding: 16px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-widget-header h3 {
            margin: 0;
            font-size: 18px;
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
            border-radius: 12px;
            word-wrap: break-word;
        }
        
        .chat-widget-message.user .chat-widget-message-bubble {
            background: ${config.primaryColor};
            color: white;
        }
        
        .chat-widget-message.bot .chat-widget-message-bubble {
            background: #f3f4f6;
            color: #374151;
        }
        
        .chat-widget-input-area {
            border-top: 1px solid #e5e7eb;
            padding: 16px;
            background: white;
            border-radius: 0 0 12px 12px;
        }
        
        .chat-widget-input-container {
            display: flex;
            gap: 8px;
        }
        
        .chat-widget-input {
            flex: 1;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 14px;
            outline: none;
        }
        
        .chat-widget-input:focus {
            border-color: ${config.primaryColor};
            box-shadow: 0 0 0 2px ${config.primaryColor}20;
        }
        
        .chat-widget-send {
            background: ${config.primaryColor};
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        }
        
        .chat-widget-send:hover {
            background: ${config.primaryColor}dd;
        }
        
        .chat-widget-typing {
            display: flex;
            gap: 4px;
            padding: 12px;
            background: #f3f4f6;
            border-radius: 12px;
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
                right: 10px;
                left: 10px;
                bottom: 80px;
            }
        }
    `;

    // HTML Structure
    const chatHTML = `
        <div class="chat-widget-container">
            <button class="chat-widget-button" id="chat-widget-toggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
            
            <div class="chat-widget-window" id="chat-widget-window">
                <div class="chat-widget-header">
                    <h3>Chat Assistant</h3>
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
                        <input type="text" class="chat-widget-input" id="chat-widget-input" placeholder="Type your message...">
                        <button class="chat-widget-send" id="chat-widget-send">Send</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Chat Widget Class
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

            // Bind events
            this.bindEvents();

            // Add welcome message
            setTimeout(() => {
                this.addMessage('Hello! Welcome to our chat. How can I help you today?', false);
            }, 1000);
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
