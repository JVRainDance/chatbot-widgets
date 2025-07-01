(function() {
    // Create iframe for the chat widget
    const iframe = document.createElement('iframe');
    iframe.src = 'https://jvraindance.github.io/chatbot-widgets/chat-widget.html';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.pointerEvents = 'none';
    iframe.id = 'raindance-chat-widget';
    
    // Create container div
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.right = '0';
    container.style.width = '420px';
    container.style.height = '680px';
    container.style.pointerEvents = 'auto';
    container.style.zIndex = '9999';
    
    // Allow pointer events only on the iframe content
    iframe.style.pointerEvents = 'auto';
    
    // Append iframe to container and container to body
    container.appendChild(iframe);
    document.body.appendChild(container);
    
    // Pass configuration to iframe
    iframe.onload = function() {
        const config = {
            webhookUrl: window.raindanceChatConfig?.webhookUrl || 'https://raindance.app.n8n.cloud/webhook/a0d536ef-e072-4844-8090-2ee9b36f9fb8/chat'
        };
        iframe.contentWindow.postMessage({
            type: 'chat-config',
            config: config
        }, '*');
    };
})();
