# Leaderboard App Assessment

## Project Description

A full-stack AWS Lambda-compatible Node.js application built with TypeScript that implements a real-time leaderboard system. The application features user authentication via AWS Cognito, score submission and storage in DynamoDB, and real-time notifications through WebSocket connections when users achieve high scores.

### Key Features

- **Authentication**: AWS Cognito integration with USER_PASSWORD_AUTH flow
- **Score Management**: Submit and retrieve scores from DynamoDB leaderboard table
- **Real-time Notifications**: WebSocket notifications for scores above 1000
- **Leaderboard Display**: Top scores retrieval with IAM credentials
- **Responsive UI**: Modern React frontend with TypeScript

## Overall Folder Structure

```
leaderboard_app/
├── leaderboard-backend/     # Serverless backend functions
├── leaderboard-frontend/    # React frontend application
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

### Why This Structure?

The project follows a monorepo structure with clear separation between frontend and backend. This approach:

- Keeps related code in one repository for easier development and deployment
- Allows for shared configuration and documentation
- Simplifies CI/CD pipeline management
- Makes it easier to maintain consistency between frontend and backend

## Frontend Structure

```
leaderboard-frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   └── dashboard/       # Dashboard-specific components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── screens/
│   │   ├── auth/            # Authentication screens
│   │   └── dashboard/       # Dashboard screens
│   ├── services/            # API and authentication services
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── public/                  # Static assets
├── package.json
└── tsconfig.json
```

## Frontend Tools

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **CSS Modules**: Scoped styling for components
- **Context API**: State management for authentication
- **Custom Hooks**: Reusable logic (useAuth, etc.)
- **Service Layer**: Centralized API communication

## Deployment Steps

_[To be filled in]_

## Backend Structure

```
leaderboard-backend/
├── src/
│   ├── functions/
│   │   ├── auth/            # Authentication Lambda functions
│   │   └── scores/          # Score management functions
│   ├── services/            # Business logic services
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── serverless.yml           # Serverless Framework configuration
├── package.json
└── env.example.txt          # Environment variables template
```

## Backend Tools

- **Serverless Framework**: Infrastructure as Code and deployment
- **AWS Lambda**: Serverless compute functions
- **TypeScript**: Type-safe backend development
- **AWS SDK**: AWS service integrations
- **DynamoDB**: NoSQL database for score storage
- **API Gateway**: REST and WebSocket API management
- **Cognito**: User authentication and management

## Why Serverless?

Serverless architecture was chosen for this project because:

1. **Scalability**: Automatic scaling based on demand without managing infrastructure
2. **Cost Efficiency**: Pay only for actual compute time used
3. **Rapid Development**: Focus on business logic rather than infrastructure management
4. **AWS Integration**: Seamless integration with other AWS services (Cognito, DynamoDB, API Gateway)
5. **Event-Driven**: Perfect for real-time features like WebSocket notifications
6. **Maintenance**: No server maintenance, patching, or monitoring required

## Backend Deployment

The backend is deployed using the Serverless Framework:

```bash
# Install dependencies
cd leaderboard-backend
npm install

# Deploy to AWS
npm run deploy
```

The deployment creates:

- Lambda functions for authentication and score management
- API Gateway endpoints (REST and WebSocket)
- DynamoDB tables for leaderboard and WebSocket connections
- IAM roles and policies
- CloudWatch logs for monitoring

## Issues Encountered

### ✅ Fixed Issues

1. **CORS Issues**:
   - **Problem**: Frontend couldn't communicate with backend due to CORS restrictions
   - **Solution**: Added proper CORS headers in API Gateway and Lambda response functions
   - **Implementation**: Configured CORS in `serverless.yml` and added headers in response utilities

### ❌ Unresolved Issues

1. **WebSocket Notification Connection**:
   - **Problem**: Backend unable to establish WebSocket connections for real-time notifications
   - **Impact**: High-score notifications (scores > 1000) are not being sent to connected clients
   - **Status**: Investigation ongoing - likely related to WebSocket API Gateway configuration or connection management

## Room for Improvement

### Backend Improvements

1. **Structured Response Objects**:
   - **Current State**: Basic response structure without standardized error handling
   - **Improvement Needed**: Implement consistent response format with status codes, messages, and data
   - **Reason for Not Implementing**: Frontend integration was completed successfully with current structure, and time constraints prevented refactoring

### Frontend Improvements

1. **Clean Architecture Implementation**:

   - **Current State**: Simple component-based structure with some service separation
   - **Improvement Needed**: Implement clean architecture with proper separation of concerns (presentation, domain, data layers)
   - **Reason for Not Implementing**: This is a lightweight project with time constraints. Clean architecture would have been overengineering and could have extended development time significantly

2. **State Management**:

   - **Current State**: Using React Context for authentication state
   - **Improvement Needed**: Consider Redux Toolkit or Zustand for more complex state management
   - **Reason for Not Implementing**: Current state management is sufficient for the project scope

3. **Testing**:
   - **Current State**: No automated tests implemented
   - **Improvement Needed**: Unit tests for components and integration tests for API calls
   - **Reason for Not Implementing**: Time constraints focused on core functionality delivery

## Getting Started

### Prerequisites

- Node.js 18+
- AWS CLI configured
- Serverless Framework CLI

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd leaderboard_app
```

2. Install backend dependencies:

```bash
cd leaderboard-backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../leaderboard-frontend
npm install
```

4. Configure environment variables:

```bash
# Backend
cd ../leaderboard-backend
cp env.example.txt .env
# Edit .env with your AWS credentials and configuration

# Frontend
cd ../leaderboard-frontend
# Create .env file with API endpoints
```

5. Deploy backend:

```bash
cd ../leaderboard-backend
npm run deploy
```

6. Start frontend development server:

```bash
cd ../leaderboard-frontend
npm start
```

## Contributing

This is an assessment project. For production use, consider implementing the improvements listed above and adding comprehensive testing.

## License

This project is created for assessment purposes.
