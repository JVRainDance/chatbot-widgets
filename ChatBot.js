(function() {
    // Prevent multiple instances
    if (window.ChatWidgetLoaded) return;
    window.ChatWidgetLoaded = true;

    // ===== CUSTOMIZATION CONFIG =====
    // Edit this section for each client
    const config = {
        // API Configuration
        webhookUrl: 'https://raindance.app.n8n.cloud/webhook/6f4cf690-6d7f-4ef8-bf84-88f98eeae1f8/chat',

        // Colors & Branding (Matching Joshua's Website Theme)
        primaryColor: '#8b5cf6',        // Main brand color (purple from website)
        primaryColorHover: '#a78bfa',   // Hover state (lighter purple)
        secondaryColor: '#16162a',      // Bot message background (dark card color)
        textColor: '#d1d5db',           // Bot message text color (light gray)
        borderColor: 'rgba(139, 92, 246, 0.2)',  // Border with purple tint
        inputBorderColor: 'rgba(139, 92, 246, 0.3)', // Input field border
        backgroundColor: '#1a1a2e',     // Main window background
        userMessageColor: '#8b5cf6',    // User message bubble
        
        // Positioning & Layout
        position: 'bottom-right',       // Options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        buttonOffset: '30px',           // Distance from screen edge
        windowWidth: '400px',
        windowHeight: '650px',
        buttonSize: '65px',
        
        // Content & Text
        title: 'Sage',
        placeholder: 'Type your message...',
        sendButtonText: 'Send',
        
        // Logo Configuration
        showLogo: true,                 // Set to true to show logo in header
        logoUrl: '/favicon.svg',        // URL to your logo image
        logoSize: '32px',               // Logo dimensions (square)
        logoPosition: 'left',           // 'left' or 'right' of title
        
        // Behavior
        autoOpenDelay: 2000,            // Delay before auto-opening widget (milliseconds)
        autoOpen: true,                 // Auto-open widget on page load
        initialGreeting: "Hello, I'm Sage. AI Assistant for Joshua. How can I help you today?",  // Initial greeting message
        
        // Animation
        animationDuration: '0.3s',      // Widget open/close animation speed
        
        // Typography
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        headerFontSize: '18px',
        messageFontSize: '14px',
        
        // Border Radius (for rounded corners)
        borderRadius: '16px',           // Main window border radius
        buttonBorderRadius: '50%',      // Chat button border radius
        messageBorderRadius: '12px',    // Message bubbles border radius
        inputBorderRadius: '10px'       // Input field border radius
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
            display: flex !important;
            position: fixed !important;
            z-index: 2147483647 !important;
            opacity: 1 !important;
            visibility: visible !important;
            ${positionStyles.button.top ? `top: ${positionStyles.button.top};` : ''}
            ${positionStyles.button.bottom ? `bottom: ${positionStyles.button.bottom};` : ''}
            ${positionStyles.button.left ? `left: ${positionStyles.button.left};` : ''}
            ${positionStyles.button.right ? `right: ${positionStyles.button.right};` : ''}
            background: linear-gradient(135deg, ${config.primaryColor}, ${config.primaryColorHover});
            color: white;
            border: none;
            border-radius: ${config.buttonBorderRadius};
            width: ${config.buttonSize};
            height: ${config.buttonSize};
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2);
            transition: all ${config.animationDuration} ease;
            align-items: center;
            justify-content: center;
            font-family: ${config.fontFamily};
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2);
            }
            50% {
                box-shadow: 0 4px 25px rgba(139, 92, 246, 0.6), 0 0 50px rgba(139, 92, 246, 0.3);
            }
        }
        
        .chat-widget-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.4);
            animation: none;
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
            background: ${config.backgroundColor};
            border-radius: ${config.borderRadius};
            box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(139, 92, 246, 0.3);
            border: 1px solid ${config.borderColor};
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
            background: ${config.backgroundColor};
        }
        
        .chat-widget-messages::-webkit-scrollbar {
            width: 8px;
        }
        
        .chat-widget-messages::-webkit-scrollbar-track {
            background: rgba(139, 92, 246, 0.1);
            border-radius: 4px;
        }
        
        .chat-widget-messages::-webkit-scrollbar-thumb {
            background: ${config.primaryColor};
            border-radius: 4px;
        }
        
        .chat-widget-messages::-webkit-scrollbar-thumb:hover {
            background: ${config.primaryColorHover};
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
        
        .chat-widget-message-bubble a {
            color: #c77dff;
            text-decoration: underline;
            transition: color 0.2s;
        }
        
        .chat-widget-message-bubble a:hover {
            color: #e0aaff;
            text-decoration: underline;
        }
        
        .chat-widget-message.user .chat-widget-message-bubble a {
            color: #ffffff;
            text-decoration: underline;
        }
        
        /* Markdown styling */
        .chat-widget-message-bubble p {
            margin: 0 0 8px 0;
        }
        
        .chat-widget-message-bubble p:last-child {
            margin-bottom: 0;
        }
        
        .chat-widget-message-bubble h1,
        .chat-widget-message-bubble h2,
        .chat-widget-message-bubble h3,
        .chat-widget-message-bubble h4,
        .chat-widget-message-bubble h5,
        .chat-widget-message-bubble h6 {
            margin: 12px 0 8px 0;
            font-weight: 600;
            line-height: 1.3;
        }
        
        .chat-widget-message-bubble h1 { font-size: 1.5em; }
        .chat-widget-message-bubble h2 { font-size: 1.3em; }
        .chat-widget-message-bubble h3 { font-size: 1.1em; }
        .chat-widget-message-bubble h4,
        .chat-widget-message-bubble h5,
        .chat-widget-message-bubble h6 { font-size: 1em; }
        
        .chat-widget-message-bubble code {
            background: rgba(139, 92, 246, 0.2);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        .chat-widget-message-bubble pre {
            background: rgba(0, 0, 0, 0.3);
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 8px 0;
        }
        
        .chat-widget-message-bubble pre code {
            background: none;
            padding: 0;
        }
        
        .chat-widget-message-bubble ul,
        .chat-widget-message-bubble ol {
            margin: 8px 0;
            padding-left: 24px;
        }
        
        .chat-widget-message-bubble li {
            margin: 4px 0;
        }
        
        .chat-widget-message-bubble blockquote {
            border-left: 3px solid ${config.primaryColor};
            padding-left: 12px;
            margin: 8px 0;
            font-style: italic;
            opacity: 0.9;
        }
        
        .chat-widget-message-bubble hr {
            border: none;
            border-top: 1px solid ${config.borderColor};
            margin: 12px 0;
        }
        
        .chat-widget-message-bubble em {
            font-style: italic;
        }
        
        .chat-widget-message-bubble strong {
            font-weight: 600;
        }
        
        .chat-widget-input-area {
            border-top: 1px solid ${config.borderColor};
            padding: 16px;
            background: ${config.backgroundColor};
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
            padding: 10px 14px;
            font-size: ${config.messageFontSize};
            outline: none;
            font-family: ${config.fontFamily};
            background: ${config.secondaryColor};
            color: ${config.textColor};
            transition: all 0.3s ease;
        }
        
        .chat-widget-input::placeholder {
            color: rgba(209, 213, 219, 0.5);
        }
        
        .chat-widget-input:focus {
            border-color: ${config.primaryColor};
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
            background: rgba(22, 22, 42, 0.8);
        }
        
        .chat-widget-send {
            background: ${config.primaryColor};
            color: white;
            border: none;
            border-radius: ${config.inputBorderRadius};
            padding: 10px 20px;
            cursor: pointer;
            font-size: ${config.messageFontSize};
            font-weight: 500;
            transition: all 0.3s ease;
            font-family: ${config.fontFamily};
            box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
        }
        
        .chat-widget-send:hover {
            background: ${config.primaryColorHover};
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
            transform: translateY(-1px);
        }
        
        .chat-widget-send:active {
            transform: translateY(0);
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
            width: 8px;
            height: 8px;
            background: ${config.primaryColor};
            border-radius: 50%;
            animation: typing 1.4s infinite;
            box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
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
            

            // Add HTML
            
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

            // Add initial greeting and auto-open
            if (config.initialGreeting) {
                this.addMessage(config.initialGreeting, false);
            }
            
            if (config.autoOpen) {
                console.log('Chat widget initialized. Opening in', config.autoOpenDelay, 'ms');
                setTimeout(() => {
                    this.toggle();
                }, config.autoOpenDelay);
            }
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
                if (e.key === 'Enter') this.sendMessage();
            });
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

        async addMessage(message, isUser = false) {
            const messagesContainer = this.shadowRoot.getElementById('chat-widget-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-widget-message ${isUser ? 'user' : 'bot'}`;
            
            const bubble = document.createElement('div');
            bubble.className = 'chat-widget-message-bubble';
            
            if (!isUser) {
                // Load marked library if not already loaded
                if (typeof marked === 'undefined') {
                    await this.loadMarkedLibrary();
                }
                
                // Use marked to render full markdown
                if (typeof marked !== 'undefined') {
                    // Configure marked options
                    marked.setOptions({
                        breaks: true, // Convert \n to <br>
                        gfm: true,    // GitHub Flavored Markdown
                        sanitize: false, // Allow HTML (we'll sanitize manually)
                        headerIds: false, // Don't add IDs to headers
                        mangle: false
                    });
                    
                    // Render markdown to HTML
                    let html = marked.parse(message);
                    
                    // Sanitize: Only allow safe HTML tags
                    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr'];
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    
                    // Remove any script tags or dangerous elements
                    const scripts = tempDiv.querySelectorAll('script, iframe, object, embed');
                    scripts.forEach(el => el.remove());
                    
                    // Get sanitized HTML
                    html = tempDiv.innerHTML;
                    
                    bubble.innerHTML = html;
                } else {
                    // Fallback to basic formatting if marked fails to load
                    let formattedMessage = message
                        .replace(/\n/g, '<br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
                    
                    formattedMessage = formattedMessage.replace(/(https?:\/\/[^\s<]+)/g, 
                        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
                    
                    bubble.innerHTML = formattedMessage;
                }
            } else {
                bubble.textContent = message;
            }
            
            messageDiv.appendChild(bubble);
            messagesContainer.appendChild(messageDiv);
            // Use requestAnimationFrame to batch DOM operations and prevent forced reflow
            requestAnimationFrame(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });
        }

        loadMarkedLibrary() {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (typeof marked !== 'undefined') {
                    resolve();
                    return;
                }
                
                // Check if script is already being loaded
                if (document.querySelector('script[data-marked-loader]')) {
                    // Wait for it to load
                    const checkInterval = setInterval(() => {
                        if (typeof marked !== 'undefined') {
                            clearInterval(checkInterval);
                            resolve();
                        }
                    }, 100);
                    setTimeout(() => {
                        clearInterval(checkInterval);
                        if (typeof marked === 'undefined') {
                            reject(new Error('Marked library failed to load'));
                        }
                    }, 5000);
                    return;
                }
                
                // Load marked from CDN
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js';
                script.setAttribute('data-marked-loader', 'true');
                script.onload = () => {
                    if (typeof marked !== 'undefined') {
                        resolve();
                    } else {
                        reject(new Error('Marked library loaded but not available'));
                    }
                };
                script.onerror = () => reject(new Error('Failed to load marked library'));
                document.head.appendChild(script);
            });
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
            // Use requestAnimationFrame to batch DOM operations and prevent forced reflow
            requestAnimationFrame(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });
        }

        hideTyping() {
            const typing = this.shadowRoot.getElementById('chat-widget-typing');
            if (typing) typing.remove();
        }

        async sendMessage() {
            const input = this.shadowRoot.getElementById('chat-widget-input');
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
