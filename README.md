# AgroNet API

A comprehensive backend API for the AgroNet agricultural marketplace platform built with NestJS, MongoDB Atlas, and TypeScript.

## Features

- **User Management**: Registration, authentication, and profile management
- **Product Management**: CRUD operations for agricultural products
- **Order Processing**: Complete order lifecycle management
- **Messaging System**: Communication between buyers and farmers
- **Review System**: Product reviews and ratings
- **Geolocation Services**: Location-based services for farmers and buyers
- **Admin Panel**: Administrative controls and monitoring

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB Atlas
- **Language**: TypeScript
- **Authentication**: JWT
- **Validation**: Class Validator
- **Testing**: Jest

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/techymuideen/agronet-api.git
   cd agronet-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your MongoDB Atlas connection string and other configurations.

4. **Start the development server:**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3001`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agronet?retryWrites=true&w=majority

# Application Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## API Endpoints

### Health Check
- `GET /` - API status
- `GET /health` - Detailed health information

### User Management
- `POST /user` - Create new user
- `GET /user/:id` - Get user by ID
- `PUT /user/:id` - Update user
- `DELETE /user/:id` - Delete user

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token

### Products
- `GET /product` - List all products
- `POST /product` - Create new product
- `GET /product/:id` - Get product by ID
- `PUT /product/:id` - Update product
- `DELETE /product/:id` - Delete product

### Orders
- `GET /order` - List orders
- `POST /order` - Create new order
- `GET /order/:id` - Get order by ID
- `PUT /order/:id` - Update order status

### Reviews
- `GET /review` - List reviews
- `POST /review` - Create review
- `GET /review/product/:productId` - Get reviews for product

### Messages
- `GET /message` - List messages
- `POST /message` - Send message
- `GET /message/thread/:threadId` - Get message thread

## Project Structure

```
src/
├── admin/              # Admin module
├── auth/               # Authentication module
├── farmer-application/ # Farmer application module
├── geolocation/        # Geolocation services
├── message/           # Messaging system
├── order/             # Order management
├── product/           # Product management
├── review/            # Review system
├── users/             # User management
├── app.module.ts      # Main application module
├── app.controller.ts  # Root controller
├── app.service.ts     # Root service
└── main.ts           # Application entry point
```

## Scripts

```bash
# Development
npm run start:dev      # Start development server with hot reload
npm run start:debug    # Start with debugging enabled

# Production
npm run build          # Build the application
npm run start:prod     # Start production server

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

## Database Schema

The application uses MongoDB with Mongoose schemas for the following entities:

- **Users**: User accounts (buyers, farmers, admins)
- **Products**: Agricultural products
- **Orders**: Order transactions
- **Reviews**: Product reviews and ratings
- **Messages**: Communication threads
- **Farmer Applications**: Applications to become verified farmers

## Error Handling

The API implements comprehensive error handling:

- **ConflictException**: For duplicate resources (e.g., email already exists)
- **ValidationPipe**: For request validation
- **Global Exception Filter**: For unhandled errors
- **MongoDB Error Handling**: For database-specific errors

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Using bcryptjs
- **Input Validation**: Class-validator for request validation
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Environment Variables**: Secure configuration management

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions for Render and other platforms.

### Quick Deploy to Render

1. Push your code to GitHub
2. Connect your repository to Render
3. Set environment variables
4. Deploy!

Your API will be live at: `https://your-service-name.onrender.com`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)
- Deployed on [Render](https://render.com/)
