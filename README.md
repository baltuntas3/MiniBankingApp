# 🏦 Mini Banking App

A modern, full-stack banking application built with Spring Boot and React, featuring account management, money transfers, and transaction history with pagination support.

## 🚀 Features

### 💰 Account Management
- **Multi-Currency Support**: TRY, USD, and GOLD accounts
- **Account Creation**: Create new accounts with initial balance
- **Account Details**: View comprehensive account information
- **Account Search**: Search accounts by number or name (case-insensitive)
- **Account Updates**: Modify account names and settings

### 💸 Money Transfers
- **Inter-Account Transfers**: Transfer money between your accounts
- **Same Currency**: Transfers between accounts of the same currency
- **Real-time Balance Updates**: Instant balance reflection after transfers
- **Transfer Validation**: Comprehensive validation for sufficient funds

### 📊 Transaction History
- **Paginated History**: View transaction history with pagination
- **Transaction Filtering**: Filter by date range, type, and amount
- **Transaction Types**: Support for deposits, withdrawals, and transfers
- **Recent Transactions**: Quick view of recent account activity

### 🎨 User Interface
- **Modern Design**: Clean, responsive Material Design-inspired UI
- **Dark/Light Theme**: Toggle between dark and light themes
- **Mobile Responsive**: Optimized for all screen sizes
- **Real-time Search**: Debounced search with loading states
- **Smooth Animations**: CSS transitions and hover effects

### 🔐 Security
- **JWT Authentication**: Secure token-based authentication
- **User Registration**: Create new user accounts
- **Protected Routes**: Route-level access control
- **Input Validation**: Comprehensive client and server-side validation

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Database**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Security**: Spring Security + JWT
- **Documentation**: OpenAPI 3 (Swagger)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Language**: JavaScript (ES6+)
- **State Management**: Jotai
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with CSS Variables
- **Build Tool**: Vite

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15
- **Web Server**: Nginx (for frontend)
- **Health Checks**: Application-level health monitoring

## 📋 Prerequisites

- **Docker**: Version 20.0+ 
- **Docker Compose**: Version 2.0+
- **Git**: For cloning the repository

*Alternative (for local development):*
- **Java**: JDK 21+
- **Node.js**: Version 18+
- **PostgreSQL**: Version 13+
- **Maven**: Version 3.8+

## 🚀 Quick Start with Docker

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MiniBankingApp
```

### 2. Start the Application
```bash
docker-compose up -d
```

This command will:
- Build the backend Spring Boot application
- Build the frontend React application  
- Start PostgreSQL database
- Set up networking between services
- Run health checks

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html

### 4. Stop the Application
```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

## 🖥 Local Development Setup

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend/MiniBankingApp
npm install
npm run dev
```

### Database Setup
```bash
# Using Docker for PostgreSQL
docker run --name minibanking-postgres \
  -e POSTGRES_DB=minibanking \
  -e POSTGRES_USER=minibanking \
  -e POSTGRES_PASSWORD=minibanking123 \
  -p 5432:5432 -d postgres:15-alpine
```

## 📱 Usage Guide

### 1. User Registration
1. Navigate to http://localhost:3000
2. Click "Register" to create a new account
3. Fill in username, email, first name, last name, and password
4. Click "Register" to create your account

### 2. Login
1. Use your registered credentials to log in
2. You'll be redirected to the dashboard

### 3. Create Accounts
1. From the dashboard, click "Accounts"
2. Click "Create New Account"
3. Choose account type (TRY, USD, or GOLD)
4. Enter account name and initial balance
5. Click "Create Account"

### 4. Transfer Money
1. From the dashboard, click "Transfer Money"
2. Select source and destination accounts
3. Enter transfer amount
4. Add optional description
5. Click "Transfer"

### 5. View Transactions
1. Click on any account card
2. View recent transactions or click "View Full History"
3. Use pagination controls to navigate through transactions
4. Apply filters to find specific transactions

### 6. Search Accounts
1. In the Accounts section, use the search boxes
2. Search by account number or account name
3. Results update automatically as you type (debounced)

## 🔧 Configuration

### Environment Variables

#### Backend
- `SPRING_DATASOURCE_URL`: PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: JWT token expiration time in milliseconds

#### Frontend
- API endpoints are configured in `src/api/axiosConfig.js`
- Theme preferences are stored in localStorage

### Docker Configuration

The application uses Docker Compose with the following services:
- **database**: PostgreSQL 15 with persistent volume
- **backend**: Spring Boot application with health checks
- **frontend**: React app served by Nginx with API proxy

## 📊 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Account Endpoints
- `POST /api/accounts/search` - Search accounts with filters
- `POST /api/accounts` - Create new account
- `GET /api/accounts/{id}` - Get account details
- `PUT /api/accounts/{id}` - Update account
- `DELETE /api/accounts/{id}` - Delete account

### Transfer Endpoints
- `POST /api/transfers` - Create money transfer
- `GET /api/transactions/account/{accountId}/paginated` - Get paginated transactions

For complete API documentation, visit: http://localhost:8080/swagger-ui.html

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend/MiniBankingApp
npm test
```

## 🛡 Security Features

- **JWT Authentication**: Stateless authentication with secure tokens
- **CORS Configuration**: Properly configured cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: JPA/Hibernate with parameterized queries
- **XSS Protection**: React's built-in XSS protection
- **Docker Security**: Non-root users in Docker containers

## 🔄 Development Workflow

### Adding New Features
1. Create feature branch from `main`
2. Implement backend changes with tests
3. Update API documentation
4. Implement frontend changes
5. Test the complete flow
6. Create pull request

### Database Migrations
- JPA/Hibernate handles schema updates automatically
- For production, consider using Flyway or Liquibase

## 📈 Performance Features

- **Pagination**: Large datasets are paginated for better performance
- **Debounced Search**: Search inputs are debounced to reduce API calls
- **Lazy Loading**: Components and routes are loaded on demand
- **Database Indexing**: Proper indexes on frequently queried columns
- **Nginx Caching**: Static assets are cached by Nginx
- **Gzip Compression**: Response compression for better network performance

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps
# Check logs
docker-compose logs database
```

#### Frontend Can't Connect to Backend
```bash
# Check if backend is healthy
curl http://localhost:8080/actuator/health
# Check nginx proxy configuration
docker-compose logs frontend
```

#### Build Failures
```bash
# Clean rebuild
docker-compose build --no-cache
# Check individual service logs
docker-compose logs backend
docker-compose logs frontend
```

### Health Checks
All services include health checks:
- **Database**: `pg_isready` command
- **Backend**: Spring Boot Actuator health endpoint
- **Frontend**: Nginx health endpoint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spring Boot Team**: For the excellent framework
- **React Team**: For the powerful frontend library
- **PostgreSQL**: For the reliable database
- **Docker**: For containerization capabilities

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/swagger-ui.html`
- Review the application logs using `docker-compose logs`

---

**Built with ❤️ using Spring Boot and React**