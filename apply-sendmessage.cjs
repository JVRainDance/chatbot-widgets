const fs = require('fs');

// Read the secure sendMessage from BIM.js
const bimContent = fs.readFileSync('chatbot_BIM.js', 'utf8');
const sendMessageMatch = bimContent.match(/async sendMessage\(\) \{[\s\S]*?finally \{[\s\S]*?\n        \}/);

if (!sendMessageMatch) {
    console.error('Could not extract sendMessage from BIM.js');
    process.exit(1);
}

const secureSendMessage = sendMessageMatch[0];

const files = ['chatbot_BIM2.js', 'chatbot_RAPID.js', 'chatbot_RBM.js', 'chatbot_Skylark.js'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const currentSendMatch = content.match(/async sendMessage\(\) \{[\s\S]*?catch \(error\) \{[\s\S]*?\n        \}/);
    
    if (currentSendMatch) {
        content = content.replace(currentSendMatch[0], secureSendMessage);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ ${file} updated`);
    } else {
        console.log(`⚠️  ${file} - pattern not found`);
    }
});

console.log('\n✅ All updates complete!');
