(function() {
    // Create chat button
    var button = document.createElement('button');
    button.innerHTML = '💬';
    button.style.cssText = 'position:fixed;bottom:30px;right:30px;width:60px;height:60px;border-radius:50%;background:#007bff;color:white;border:none;cursor:pointer;z-index:1000;font-size:24px;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
    
    // Create chat iframe (hidden initially)
    var iframe = document.createElement('iframe');
    iframe.src = 'https://JVRainDance.github.io/chatbot-widgets/client1/chatbot.html';
    iframe.style.cssText = 'position:fixed;bottom:100px;right:30px;width:370px;height:500px;border:none;z-index:999;display:none;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
    
    // Toggle chat window when button clicked
    button.onclick = function() {
        if (iframe.style.display === 'none') {
            iframe.style.display = 'block';
            button.innerHTML = '✖';
        } else {
            iframe.style.display = 'none';
            button.innerHTML = '💬';
        }
    };
    
    // Add to website
    document.body.appendChild(button);
    document.body.appendChild(iframe);
})();
