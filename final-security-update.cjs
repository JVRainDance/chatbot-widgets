// Final security update script - applies full security enhancements
const fs = require('fs');
const path = require('path');

const files = [
    'chatbot_BIM2.js',
    'chatbot_RAPID.js',
    'chatbot_RBM.js',
    'chatbot_Raindance.js',
    'chatbot_Skylark.js'
];

const sendMessageSecure = `        async sendMessage() {
            if (this.isSending) return;

            const input = this.shadowRoot.getElementById('chat-widget-input');
            const sendBtn = this.shadowRoot.getElementById('chat-widget-send');
            const message = input.value.trim();

            if (!message) return;

            if (message.length > config.maxMessageLength) {
                this.addMessage(\`Message is too long (max \${config.maxMessageLength} characters)\`, false);
                return;
            }

            if (!this.checkClientRateLimit()) {
                this.addMessage('You are sending messages too quickly. Please wait a moment.', false);
                return;
            }

            this.isSending = true;
            if (sendBtn) sendBtn.disabled = true;

            this.addMessage(message, true);
            input.value = '';
            this.showTyping();

            try {
                const response = await fetch(config.proxyUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',
                        'X-Bot-ID': config.botId },
                    body: JSON.stringify({
                        action: 'sendMessage',
                        sessionId: this.sessionId,
                        chatInput: message
                    })
                });

                this.hideTyping();

                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After');
                    this.addMessage(\`Rate limit exceeded. Please wait \${retryAfter || 60} seconds.\`, false);
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
                this.addMessage('Sorry, I couldn\\'t connect. Please check your internet connection.', false);
            } finally {
                this.isSending = false;
                if (sendBtn) sendBtn.disabled = false;
            }
        }`;

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');

    console.log(`Updating ${file}...`);

    // Find and replace the sendMessage function
    const sendMessageRegex = /async sendMessage\(\) \{[\s\S]*?\n        \}\n    \}/;

    if (sendMessageRegex.test(content)) {
        content = content.replace(sendMessageRegex, sendMessageSecure + '\n    }');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file} updated`);
    } else {
        console.log(`⚠️  ${file} - sendMessage pattern not found, skipping`);
    }
});

console.log('\n✅ Security updates complete!');
