# Connector Framework Manager - Frontend

Frontend UI for the Connector Framework Manager, built with Next.js. Provides a modern interface for listing connectors, managing connections, running OAuth flows, and displaying connector-specific UIs.

## Overview

This Next.js frontend provides:
- Modern React-based user interface
- Connector listing and management
- OAuth flow integration
- Connection status management
- Plugin-based screens for different connectors
- Responsive design with Tailwind CSS

## Environment Setup

### 1. Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Frontend Configuration
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_BASE_URL=http://localhost:3000

# NextAuth Configuration (if needed for session management)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here-minimum-32-characters

# Optional: App Configuration
NEXT_PUBLIC_APP_NAME=Connector Framework Manager
```

### 2. Backend Integration

Ensure the backend is configured and running:

1. **Backend must be running** on the configured `BACKEND_BASE_URL`
2. **CORS must be properly configured** in the backend to allow frontend requests
3. **OAuth redirect URI** should point to: `{FRONTEND_BASE_URL}/oauth/callback`

## Development

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend README)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.local.example .env.local
# Edit .env.local with your settings
```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Preview Mode**: http://localhost:3000/preview.html

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Architecture

### Configuration Management

The frontend uses a centralized configuration system:

- **Config Utility**: `src/lib/config.ts` - Manages environment variables and API endpoints
- **API Client**: `src/lib/api-client.ts` - Typed API client for backend communication

### API Integration

The frontend communicates with the backend through:

- **RESTful API calls** to the backend
- **OAuth flow handling** via callback pages
- **Typed interfaces** matching backend schemas
- **Error handling** for API failures

### OAuth Flow

The OAuth integration works as follows:

1. **User initiates OAuth** from frontend
2. **Frontend calls backend** `/api/oauth/{connector}/authorize`
3. **Backend returns authorization URL** with state parameter
4. **User is redirected** to third-party OAuth provider
5. **Provider redirects** to frontend `/oauth/callback` page
6. **Frontend processes callback** and calls backend to complete flow

### File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Homepage
│   ├── not-found.tsx      # 404 page
│   └── oauth/
│       └── callback/
│           └── page.tsx   # OAuth callback handler
├── lib/                   # Utilities and configuration
│   ├── config.ts          # Environment and API configuration
│   └── api-client.ts      # Typed API client
└── components/            # Reusable React components (to be added)
```

## API Client Usage

The frontend includes a typed API client for backend communication:

```typescript
import { apiClient } from '@/lib/api-client';

// List connectors
const connectors = await apiClient.getConnectors();

// Create a connection
const connection = await apiClient.createConnection({
  connector_key: 'jira',
  config_data: { /* connector-specific config */ }
});

// Initiate OAuth flow
const { authorization_url } = await apiClient.initiateOAuth('slack');
window.location.href = authorization_url;
```

## OAuth Configuration

Each connector requires OAuth configuration in both frontend and backend:

### Frontend OAuth Handling

1. **Initiate OAuth**: Use `apiClient.initiateOAuth(connectorKey)`
2. **Handle Callback**: The `/oauth/callback` page processes OAuth responses
3. **Error Handling**: OAuth errors are displayed to the user

### OAuth Redirect URI

All OAuth applications must be configured with the redirect URI:
```
http://localhost:3000/oauth/callback
```

For production, update to your production domain:
```
https://your-domain.com/oauth/callback
```

## Styling and Theme

The frontend uses:

- **Tailwind CSS** for utility-first styling
- **Ocean Professional Theme** with blue and amber accents
- **Modern design** with clean aesthetics, subtle shadows, and rounded corners
- **Responsive layout** that works on desktop and mobile

### Color Scheme

- **Primary**: `#2563EB` (Blue)
- **Secondary**: `#F59E0B` (Amber)
- **Success**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Background**: `#f9fafb` (Light Gray)
- **Surface**: `#ffffff` (White)
- **Text**: `#111827` (Dark Gray)

## Building and Deployment

### Development Build

```bash
npm run build
npm run start
```

### Production Deployment

1. **Set production environment variables**
2. **Build the application**: `npm run build`
3. **Deploy to hosting platform** (Vercel, Netlify, etc.)
4. **Configure custom domain** and update OAuth redirect URIs

### Environment Variables for Production

Update environment variables for production:

```env
NEXT_PUBLIC_BACKEND_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_FRONTEND_BASE_URL=https://your-frontend-domain.com
NEXTAUTH_URL=https://your-frontend-domain.com
```

## Integration with Backend

### API Endpoints Used

The frontend integrates with these backend endpoints:

- **GET** `/api/connectors/` - List available connectors
- **GET** `/api/connectors/{key}` - Get connector details
- **GET** `/api/connections/` - List user connections
- **POST** `/api/connections/` - Create new connection
- **PUT** `/api/connections/{id}` - Update connection
- **DELETE** `/api/connections/{id}` - Delete connection
- **POST** `/api/connections/{id}/test` - Test connection
- **GET** `/api/oauth/{connector}/authorize` - Initiate OAuth
- **POST** `/api/oauth/{connector}/callback` - Complete OAuth
- **DELETE** `/api/oauth/{connector}/revoke/{id}` - Revoke OAuth

### Error Handling

The frontend handles various API errors:

- **Network errors** - Connection issues
- **Authentication errors** - Invalid/expired tokens
- **Validation errors** - Invalid request data
- **OAuth errors** - OAuth flow failures

## Development Guidelines

### Adding New Components

1. **Create components** in `src/components/`
2. **Use TypeScript** for type safety
3. **Follow naming conventions** (PascalCase for components)
4. **Include proper documentation** with JSDoc comments
5. **Use PUBLIC_INTERFACE** comments for public functions

### API Integration

1. **Use the typed API client** from `src/lib/api-client.ts`
2. **Handle errors gracefully** with user-friendly messages
3. **Show loading states** for async operations
4. **Validate data** before sending to backend

### Styling Guidelines

1. **Use Tailwind CSS** utility classes
2. **Follow the theme colors** defined in the style guide
3. **Ensure responsive design** for mobile compatibility
4. **Use consistent spacing** and typography

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **OAuth Callback Errors**: Verify redirect URI matches in OAuth app configuration
3. **API Connection Errors**: Check that backend is running and accessible
4. **Build Errors**: Ensure all environment variables are properly set

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will provide more detailed error messages and logging.
