# NatiStore - Modern E-commerce Platform

A modern, scalable e-commerce platform built with [Medusa](https://medusajs.com/), Next.js, and TypeScript following industry best practices.

## 🏗️ Architecture

```
natistore/
├── apps/
│   ├── storefront/         # Next.js e-commerce frontend
│   ├── admin/             # Medusa admin dashboard
│   └── customer-portal/   # Customer account portal
├── packages/
│   ├── medusa-backend/    # Medusa e-commerce backend
│   ├── shared-ui/         # Shared UI components
│   └── shared-utils/      # Common utilities
├── infrastructure/
│   ├── docker/
│   └── k8s/
└── docs/
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/natimango/natistore.git
   cd natistore
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development environment**
   ```bash
   # Start all services
   npm run docker:up
   
   # Or start individual services
   npm run storefront:dev
   npm run admin:dev
   npm run backend:dev
   ```

5. **Access the applications**
   - Storefront: http://localhost:3000
   - Admin Dashboard: http://localhost:7001
   - Medusa Backend: http://localhost:9000

## 📦 Available Scripts

### Root Level
- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications
- `npm run start` - Start all applications in production mode
- `npm run lint` - Lint all applications
- `npm run test` - Run tests across all applications

### Individual Applications
- `npm run storefront:dev` - Start storefront development server
- `npm run admin:dev` - Start admin dashboard development server
- `npm run backend:dev` - Start Medusa backend development server

### Docker Commands
- `npm run docker:up` - Start all services with Docker Compose
- `npm run docker:down` - Stop all services
- `npm run docker:build` - Build all Docker images

## 🏛️ Project Structure

### Apps

#### Storefront (`apps/storefront/`)
Next.js e-commerce frontend with:
- Product catalog and search
- Shopping cart and checkout
- Customer authentication
- Order management
- Responsive design with Tailwind CSS

#### Admin Dashboard (`apps/admin/`)
Medusa admin dashboard for:
- Product management
- Order processing
- Customer management
- Analytics and reporting
- Inventory management

#### Customer Portal (`apps/customer-portal/`)
Customer account portal with:
- Order history
- Profile management
- Address book
- Wishlist
- Loyalty points

### Packages

#### Medusa Backend (`packages/medusa-backend/`)
Core e-commerce backend with:
- RESTful API
- Authentication & authorization
- Payment processing
- Order management
- Inventory tracking
- Plugin system

#### Shared UI (`packages/shared-ui/`)
Reusable UI components:
- Design system components
- Form components
- Navigation components
- Modal and overlay components

#### Shared Utils (`packages/shared-utils/`)
Common utilities and types:
- API client utilities
- TypeScript definitions
- Helper functions
- Constants and configurations

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/natistore

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret

# Medusa
MEDUSA_BACKEND_URL=http://localhost:9000

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# File Storage (Optional)
S3_BUCKET=your-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

### Docker Configuration

The project includes a complete Docker setup with:
- PostgreSQL database
- Redis cache
- Medusa backend
- Storefront application
- Admin dashboard
- Nginx reverse proxy

## 🚀 Deployment

### Production Deployment

1. **Build the applications**
   ```bash
   npm run build
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Or deploy to cloud platforms**
   - Vercel (Storefront)
   - Railway (Backend)
   - AWS/GCP/Azure

### Kubernetes Deployment

Kubernetes manifests are available in `infrastructure/k8s/`:
- Database deployment
- Backend deployment
- Frontend deployment
- Ingress configuration
- Service mesh setup

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific app
npm run test --workspace=storefront

# Run tests with coverage
npm run test:coverage
```

## 📚 Documentation

- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [API Reference](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- [GitHub Issues](https://github.com/natimango/natistore/issues)
- [Discord Community](https://discord.gg/medusajs)
- [Documentation](https://docs.medusajs.com/)

## 🔗 Related Projects

- [AI Platform](https://github.com/natimango/ai-platform) - Separate AI services repository
- [Medusa](https://medusajs.com/) - The e-commerce engine
- [Next.js](https://nextjs.org/) - The React framework
