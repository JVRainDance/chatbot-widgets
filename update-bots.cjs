// Script to update all chatbot files to use secure proxy
const fs = require('fs');
const path = require('path');

const PROXY_URL = 'https://chatbot-widgets-sigma.vercel.app/api/chat';

const bots = [
    { file: 'chatbot_BIM.js', botId: 'BIM', title: 'BIM Chat', color: '#55AFD3' },
    { file: 'chatbot_BIM2.js', botId: 'BIM2', title: 'BIM Chat', color: '#3ddca9' },
    { file: 'chatbot_RAPID.js', botId: 'RAPID', title: 'RAPID Chat', color: '#D86C0C' },
    { file: 'chatbot_RBM.js', botId: 'RBM', title: 'RBM Chat', color: '#087ecf' },
    { file: 'chatbot_Raindance.js', botId: 'Raindance', title: 'Raindance Bot', color: 'linear-gradient(to right, #ed0789 30%, #f27024 100%)' },
    { file: 'chatbot_Skylark.js', botId: 'Skylark', title: 'Sage', color: '#8b5cf6' }
];

bots.forEach(bot => {
    const filePath = path.join(__dirname, bot.file);
    let content = fs.readFileSync(filePath, 'utf8');

    console.log(`Updating ${bot.file}...`);

    // Update webhook URL to proxy URL
    content = content.replace(
        /webhookUrl:\s*'https:\/\/raindance\.app\.n8n\.cloud\/webhook\/[^']+'/,
        `proxyUrl: '${PROXY_URL}',\n        botId: '${bot.botId}',\n\n        // Security\n        maxMessageLength: 500,\n        clientRateLimit: 3,\n\n        // API Configuration (OLD - REMOVED)`
    );

    // Update session ID generation
    content = content.replace(
        /generateSessionId\(\) {\s*return 'session-' \+ Math\.random\(\)\.toString\(36\)\.substr\(2, 9\);\s*}/,
        `generateSecureSessionId() {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                const array = new Uint8Array(16);
                crypto.getRandomValues(array);
                return 'session-' + Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
            } else {
                console.warn('Crypto API not available, using less secure session ID');
                return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            }
        }

        checkClientRateLimit() {
            const now = Date.now();
            this.messageTimes = this.messageTimes.filter(time => now - time < 60000);
            if (this.messageTimes.length >= config.clientRateLimit) {
                return false;
            }
            this.messageTimes.push(now);
            return true;
        }`
    );

    // Update constructor
    content = content.replace(
        /this\.sessionId = this\.generateSessionId\(\);/,
        `this.sessionId = this.generateSecureSessionId();
            this.messageTimes = [];
            this.isSending = false;`
    );

    // Update fetch call
    content = content.replace(
        /const response = await fetch\(config\.webhookUrl,/,
        `const response = await fetch(config.proxyUrl,`
    );

    // Add X-Bot-ID header
    content = content.replace(
        /'Content-Type': 'application\/json'/,
        `'Content-Type': 'application/json',\n                        'X-Bot-ID': config.botId`
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${bot.file} updated`);
});

console.log('\n✅ All bots updated successfully!');
console.log('\nNext steps:');
console.log('1. Test one bot to verify it works');
console.log('2. Check Vercel logs: vercel logs --follow');
console.log('3. Deploy the updated files');
