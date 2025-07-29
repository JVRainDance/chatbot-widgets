const TechnicalSEOAgent = require('./src/index');

console.log('🚀 Launching Technical SEO Agent...\n');

const agent = new TechnicalSEOAgent();

console.log('📊 Starting server...');
agent.startServer();

console.log('\n🌐 Frontend will be available at: http://localhost:3000');
console.log('📱 API endpoints available at: http://localhost:3000/health');
console.log('\n💡 Usage:');
console.log('   • Open http://localhost:3000 in your browser');
console.log('   • Enter a URL to analyze');
console.log('   • View results and download reports');
console.log('\n🛑 Press Ctrl+C to stop the server'); 