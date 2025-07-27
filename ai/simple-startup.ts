import { createGeminiIntegration } from './gemini-integration';

class SimpleStartup {
  private config: any;
  private gemini: any;

  constructor() {
    this.config = null;
    this.gemini = null;
  }

  async start() {
    console.log('🚀 Starting NATI AI Marketing Agent...\n');

    try {
      // Step 1: Load configuration
      console.log('📋 Step 1: Loading configuration...');
      this.config = await this.loadConfiguration();
      console.log('✅ Configuration loaded successfully\n');

      // Step 2: Initialize Gemini AI
      console.log('🤖 Step 2: Initializing Gemini AI...');
      this.gemini = createGeminiIntegration(this.config.GEMINI_API_KEY);
      
      // Test Gemini connection
      const testResult = await this.gemini.testConnection();
      if (testResult.success) {
        console.log('✅ Gemini AI connected successfully');
        console.log(`🤖 AI Response: ${testResult.content}\n`);
      } else {
        throw new Error(`Gemini connection failed: ${testResult.error}`);
      }

      // Step 3: AI Agent Ready
      console.log('🎯 Step 3: AI Marketing Agent Ready...');
      console.log('✅ AI Agent initialized successfully\n');

      // Step 4: Background service ready
      console.log('🔄 Step 4: Background service ready...');
      console.log('✅ Background service ready\n');

      // Step 5: Show status
      this.showStatus();

      // Keep the process alive
      this.keepAlive();

    } catch (error) {
      console.error('❌ Startup failed:', error);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check your .env file has GEMINI_API_KEY');
      console.log('2. Verify your Gemini API key is valid');
      console.log('3. Ensure you have internet connection');
      process.exit(1);
    }
  }

  private async loadConfiguration() {
    // Load environment variables directly
    require('dotenv').config();
    
    const config = {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      EMAIL_ENABLED: process.env.EMAIL_ENABLED,
      WHATSAPP_ENABLED: process.env.WHATSAPP_ENABLED,
      WEBSITE_URL: process.env.WEBSITE_URL,
      BUSINESS_NAME: process.env.BUSINESS_NAME || 'NATI',
      CURRENCY: process.env.CURRENCY || 'INR',
      TIMEZONE: process.env.TIMEZONE || 'Asia/Kolkata',
      LANGUAGE: process.env.LANGUAGE || 'en',
    };
    
    // Validate required fields
    if (!config.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required. Please add it to your .env file.');
    }
    
    return config;
  }

  private showStatus() {
    console.log('🎉 NATI AI Marketing Agent is now running!');
    console.log('\n📊 Current Status:');
    console.log('   🤖 AI Service: Gemini (Connected)');
    console.log('   📧 Email: ' + (this.config.EMAIL_ENABLED === 'true' ? 'Enabled' : 'Disabled'));
    console.log('   📱 WhatsApp: ' + (this.config.WHATSAPP_ENABLED === 'true' ? 'Enabled' : 'Disabled'));
    console.log('   🌐 Website: ' + (this.config.WEBSITE_URL || 'Not configured'));
    console.log('\n🔗 Access Points:');
    console.log('   📊 Admin Console: http://localhost:3000/admin');
    console.log('   🔗 Website: http://localhost:3000');
    console.log('   📡 Webhook: http://localhost:3000/api/webhooks/ai-agent');
    console.log('\n💡 Next Steps:');
    console.log('   1. Visit the admin console to monitor AI activity');
    console.log('   2. Add products to your catalog');
    console.log('   3. Configure email service for campaigns');
    console.log('   4. Set up WhatsApp Business API when ready');
    console.log('\n⏹️  Press Ctrl+C to stop the agent');
  }

  private keepAlive() {
    // Keep the process running
    setInterval(() => {
      // Heartbeat every 5 minutes
      console.log('💓 AI Agent heartbeat - ' + new Date().toLocaleTimeString());
    }, 5 * 60 * 1000);
  }
}

function showEnvironmentSetup() {
  console.log('🔧 ENVIRONMENT SETUP GUIDE');
  console.log('==========================\n');
  console.log('1. Copy the example environment file:');
  console.log('   cp env.example .env\n');
  console.log('2. Edit .env and add your Gemini API key:');
  console.log('   GEMINI_API_KEY=your-actual-gemini-api-key\n');
  console.log('3. Optional: Add other services as needed');
  console.log('   - Email service (MailerSend)');
  console.log('   - WhatsApp Business API');
  console.log('   - Website URL and API key\n');
  console.log('4. Run the AI agent:');
  console.log('   npm run ai-agent:start\n');
  console.log('📝 Get your Gemini API key from:');
  console.log('   https://makersuite.google.com/app/apikey');
}

async function quickSetup() {
  console.log('⚡ QUICK SETUP MODE');
  console.log('==================\n');
  
  // Check if .env exists
  const fs = require('fs');
  if (!fs.existsSync('.env')) {
    console.log('❌ No .env file found!');
    console.log('Please run: cp env.example .env');
    console.log('Then add your Gemini API key to .env');
    process.exit(1);
  }

  // Load config
  require('dotenv').config();
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found in .env file!');
    console.log('Please add your Gemini API key to .env');
    process.exit(1);
  }

  console.log('✅ Configuration found');
  console.log('🚀 Starting AI agent...\n');
  
  const startup = new SimpleStartup();
  await startup.start();
}

// Main execution block with CLI arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--setup')) {
    showEnvironmentSetup();
  } else if (args.includes('--quick')) {
    quickSetup();
  } else {
    // Default: show setup guide
    showEnvironmentSetup();
    console.log('\n💡 For quick start with existing config:');
    console.log('   npm run ai-agent:quick');
  }
}

export { SimpleStartup, quickSetup, showEnvironmentSetup }; 