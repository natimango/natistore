# 🚀 GEMINI API SETUP GUIDE

## **Quick Start with Gemini API**

### **Step 1: Get Your Gemini API Key**

1. **Visit Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Create a new API key** (it's free!)
4. **Copy the API key** (starts with `AIza...`)

### **Step 2: Configure Your Environment**

1. **Copy the example environment file**:
   ```bash
   cp env.example .env
   ```

2. **Edit the .env file** and add your Gemini API key:
   ```bash
   # Open .env in your text editor
   nano .env
   ```

3. **Add your Gemini API key**:
   ```ini
   GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyHere
   ```

### **Step 3: Test Your Setup**

1. **Test the Gemini API connection**:
   ```bash
   npm run ai-agent:test
   ```

2. **You should see**:
   ```
   🧪 Testing Gemini API Integration...
   ✅ Gemini API key found
   🔗 Initializing Gemini integration...
   📡 Test 1: Basic Connection
   ✅ Connection successful!
   🤖 AI Response: Hello! I'm your AI assistant for NATI...
   ```

### **Step 4: Start Your AI Agent**

1. **Start the AI marketing agent**:
   ```bash
   npm run ai-agent:start
   ```

2. **You should see**:
   ```
   🚀 Starting NATI AI Marketing Agent...
   📋 Step 1: Loading configuration...
   ✅ Configuration loaded successfully
   🤖 Step 2: Initializing Gemini AI...
   ✅ Gemini AI connected successfully
   🎯 Step 3: Initializing AI Marketing Agent...
   ✅ AI Agent initialized successfully
   🔄 Step 4: Starting background service...
   ✅ Background service started
   🎉 NATI AI Marketing Agent is now running!
   ```

### **Step 5: Access Your Admin Console**

1. **Open your browser** and go to: http://localhost:3000/admin
2. **You'll see** the complete admin dashboard with:
   - 📊 Real-time metrics
   - 🤖 AI agent status
   - 👥 Customer intelligence
   - 🎯 Campaign management
   - 📈 Analytics
   - ⚙️ Settings

---

## **What You Can Do Now**

### **✅ Working Features**
- 🤖 **AI-powered customer insights**
- 📧 **Personalized marketing messages**
- 🛍️ **Product recommendations**
- 💰 **Dynamic pricing suggestions**
- 📦 **Inventory forecasting**
- 🎯 **Campaign optimization**
- ⚠️ **Churn prevention strategies**

### **📱 Next Steps (Optional)**
1. **Add Email Service** (MailerSend/SendGrid)
2. **Set up WhatsApp Business API**
3. **Configure your website URL**
4. **Add products to your catalog**

---

## **Troubleshooting**

### **❌ "GEMINI_API_KEY not found"**
- Check your `.env` file exists
- Verify the API key is correctly added
- Make sure there are no extra spaces

### **❌ "Connection failed"**
- Check your internet connection
- Verify your API key is valid
- Ensure you have API quota available

### **❌ "Module not found"**
- Run: `npm install`
- Make sure all dependencies are installed

---

## **Cost Information**

### **💰 Gemini API Pricing**
- **Free Tier**: 15 requests per minute
- **Paid Tier**: $0.00025 per 1K characters input
- **Perfect for testing and small businesses**

### **📊 Estimated Monthly Costs**
- **100 customers**: ~$5-10/month
- **500 customers**: ~$20-40/month
- **1000 customers**: ~$40-80/month

---

## **Success! 🎉**

Your AI marketing agent is now running with Gemini API! 

**What's happening:**
- 🤖 AI is analyzing customer data
- 📊 Generating insights and recommendations
- 🎯 Creating personalized marketing strategies
- 📈 Optimizing your business performance

**Next:**
1. Visit the admin console
2. Explore the AI features
3. Add your first products
4. Start your D2C journey!

---

## **Need Help?**

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify your API key is correct
3. Ensure all dependencies are installed
4. Check your internet connection

**Ready to build your D2C empire? Let's go! 🚀** 