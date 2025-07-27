# 🏺 NATI - Complete E-commerce & AI Platform

A comprehensive, AI-powered e-commerce platform for handcrafted Indian products with advanced analytics, marketing automation, and customer intelligence.

## 🏗️ System Architecture

### **Consumer-Facing Platform: natistore.in**
- **E-commerce Engine**: Medusa.js
- **Content Management**: Strapi CMS
- **Frontend**: Next.js with Tailwind CSS
- **AI Integration**: Real-time recommendations and personalization

### **Internal Platform: admin.natistore.in**
- **Admin Dashboard**: Next.js with comprehensive analytics
- **AI Agents**: Marketing automation and customer intelligence
- **Analytics**: Real-time business intelligence
- **Communication**: Email, SMS, and notification management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for development)
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- Gemini API Key

### 1. Clone and Setup
```bash
git clone <repository-url>
cd nati-website
cp .env.example .env
# Edit .env with your configuration
```

### 2. Environment Configuration
```bash
# Required Environment Variables
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### 3. Start All Services
```bash
# Start all services with Docker Compose
docker-compose up -d

# Or start individual services
docker-compose up postgres redis -d
docker-compose up medusa-backend -d
docker-compose up ai-service -d
docker-compose up analytics-service -d
docker-compose up communication-service -d
docker-compose up strapi-cms -d
docker-compose up n8n -d
docker-compose up admin-frontend -d
docker-compose up ecommerce-frontend -d
```

## 📊 Service Ports & URLs

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Admin Frontend | 3000 | http://localhost:3000 | Admin Dashboard |
| AI Service | 3001 | http://localhost:3001 | AI & ML Services |
| Analytics Service | 3002 | http://localhost:3002 | Analytics & Reporting |
| Communication Service | 3003 | http://localhost:3003 | Email, SMS, Notifications |
| E-commerce Frontend | 3004 | http://localhost:3004 | Customer Store |
| Medusa Backend | 9000 | http://localhost:9000 | E-commerce API |
| Strapi CMS | 1337 | http://localhost:1337 | Content Management |
| N8N Workflows | 5678 | http://localhost:5678 | Automation Workflows |
| PostgreSQL | 5432 | localhost:5432 | Database |
| Redis | 6379 | localhost:6379 | Cache & Sessions |

## 🧠 AI Service Features

### Customer Intelligence
- **Customer Segmentation**: Automatic categorization based on behavior
- **Churn Prediction**: AI-powered risk assessment
- **Lifetime Value**: Predictive customer value modeling
- **Personalization**: Dynamic content and product recommendations

### Marketing Automation
- **Campaign Optimization**: AI-driven marketing strategy
- **A/B Testing**: Automated testing and optimization
- **Content Generation**: AI-powered marketing content
- **Timing Optimization**: Best time to send communications

### Product Intelligence
- **Pricing Strategy**: Dynamic pricing recommendations
- **Inventory Forecasting**: Demand prediction and stock optimization
- **Product Recommendations**: Personalized product suggestions
- **Trend Analysis**: Market trend identification

### Analytics & Insights
- **Real-time Analytics**: Live business metrics
- **Predictive Analytics**: Future trend forecasting
- **Customer Journey**: Complete customer path analysis
- **Performance Metrics**: Comprehensive KPI tracking

## 🛍️ E-commerce Features

### Product Management
- **Multi-category Products**: Jewelry, Home Decor, Textiles, Collectibles
- **Inventory Management**: Real-time stock tracking
- **Pricing Strategies**: Dynamic and AI-optimized pricing
- **Media Management**: Rich product images and videos

### Shopping Experience
- **AI Recommendations**: Personalized product suggestions
- **Advanced Search**: Intelligent product discovery
- **Wishlist & Favorites**: Customer preference tracking
- **Shopping Cart**: Real-time cart management

### Checkout & Payment
- **Multiple Payment Methods**: Cards, UPI, Digital Wallets
- **Secure Checkout**: PCI-compliant payment processing
- **Order Tracking**: Real-time order status updates
- **Customer Support**: Integrated support system

## 📈 Analytics & Reporting

### Business Intelligence
- **Revenue Analytics**: Comprehensive financial reporting
- **Customer Analytics**: Behavior and segmentation analysis
- **Product Performance**: Sales and inventory analytics
- **Marketing ROI**: Campaign effectiveness tracking

### Real-time Dashboards
- **Executive Dashboard**: High-level business metrics
- **Marketing Dashboard**: Campaign performance
- **Sales Dashboard**: Revenue and order tracking
- **Customer Dashboard**: Customer behavior insights

### Custom Reports
- **Scheduled Reports**: Automated report generation
- **Custom Metrics**: Business-specific KPIs
- **Data Export**: Multiple format support
- **API Access**: Programmatic data access

## 🔄 Automation & Workflows

### N8N Workflows
- **Cart Abandonment**: Automated recovery campaigns
- **Customer Onboarding**: Welcome sequence automation
- **Inventory Alerts**: Low stock notifications
- **Order Processing**: Automated order fulfillment

### AI-Powered Automation
- **Content Generation**: Automated marketing content
- **Customer Service**: AI chatbot integration
- **Price Optimization**: Dynamic pricing automation
- **Inventory Management**: Automated reordering

## 🛠️ Development

### Local Development
```bash
# Install dependencies for all services
cd services/ai-service && npm install
cd ../analytics-service && npm install
cd ../communication-service && npm install
cd ../strapi-cms && npm install

# Start development servers
cd services/ai-service && npm run dev
cd ../analytics-service && npm run dev
cd ../communication-service && npm run dev
cd ../strapi-cms && npm run dev
```

### API Documentation
- **AI Service**: http://localhost:3001/api/v1/docs
- **Analytics Service**: http://localhost:3002/api/v1/docs
- **Communication Service**: http://localhost:3003/api/v1/docs
- **Medusa Backend**: http://localhost:9000/docs
- **Strapi CMS**: http://localhost:1337/documentation

### Database Schema
```sql
-- Main databases
nati_main      -- E-commerce data
nati_ai        -- AI insights and models
nati_analytics -- Analytics and reporting
nati_communication -- Communication logs
nati_cms       -- Content management
nati_n8n       -- Workflow automation
```

## 🔒 Security & Compliance

### Data Protection
- **GDPR Compliance**: Customer data protection
- **PCI DSS**: Secure payment processing
- **Data Encryption**: End-to-end encryption
- **Access Control**: Role-based permissions

### API Security
- **JWT Authentication**: Secure API access
- **Rate Limiting**: API abuse prevention
- **CORS Configuration**: Cross-origin security
- **Input Validation**: Data sanitization

## 📱 Mobile & PWA

### Progressive Web App
- **Offline Support**: Cached content access
- **Push Notifications**: Real-time updates
- **App-like Experience**: Native app feel
- **Cross-platform**: Works on all devices

### Mobile Optimization
- **Responsive Design**: Mobile-first approach
- **Touch-friendly**: Optimized for touch
- **Fast Loading**: Optimized performance
- **Native Features**: Camera, GPS integration

## 🚀 Deployment

### Production Setup
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# SSL Certificate setup
certbot --nginx -d natistore.in -d admin.natistore.in
```

### Monitoring & Logging
- **Application Monitoring**: Performance tracking
- **Error Tracking**: Real-time error monitoring
- **Log Aggregation**: Centralized logging
- **Health Checks**: Service health monitoring

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow TypeScript/ESLint standards
2. **Testing**: Write unit and integration tests
3. **Documentation**: Update API documentation
4. **Security**: Follow security best practices

### Git Workflow
```bash
# Feature development
git checkout -b feature/ai-customer-insights
# Make changes
git commit -m "feat: add customer intelligence insights"
git push origin feature/ai-customer-insights
# Create pull request
```

## 📞 Support

### Documentation
- **API Docs**: Comprehensive API documentation
- **User Guides**: Step-by-step tutorials
- **Video Tutorials**: Visual learning resources
- **FAQ**: Common questions and answers

### Contact
- **Technical Support**: tech@natistore.in
- **Business Inquiries**: business@natistore.in
- **Customer Support**: support@natistore.in

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Indian artisan community** 