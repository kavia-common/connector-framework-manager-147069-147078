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

New in this step:
- Dashboard listing connectors at `/`
- Connections management at `/connections` (create/update/delete/test)
- Connector plugin screen at `/connectors/[key]`
- OAuth initiation via buttons and callback handling at `/oauth/callback`
- Typed API client and centralized config utilities
- Ocean Professional theme styling with accessible components

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

- **Config Utility**: `src/lib/config.ts` - Manages environment variables and API endpoints
- **API Client**: `src/lib/api-client.ts` - Typed API client for backend communication

### App Pages

- `/` - Dashboard listing connectors with quick actions
- `/connections` - List, create, update, delete, and test connections (with OAuth)
- `/connectors/[key]` - Plugin screen placeholder with sample data
- `/oauth/callback` - Completes OAuth by calling backend callback and shows status

### Components

- `ConnectorCard` - Themed card for connector list items
- `ConnectionForm` - Create/update connection config with JSON or schema-driven fields
- `StatusBadge` - Accessible badge for connection status
- `OAuthButton` - Initiates OAuth and redirects to provider
- `PluginScreen` - Wrapper for plugin-specific UI

### API Integration

The frontend communicates with the backend through typed REST calls. See `src/lib/api-client.ts` for the full interface.

### OAuth Flow

1. Initiate with `apiClient.initiateOAuth(connectorKey, connectionId?)`
2. Redirect to provider and back to `/oauth/callback`
3. Callback page posts to backend to complete token exchange
4. User is redirected to `/connections`

Dry run / Simulation for local testing:
- Call `GET {BACKEND_BASE_URL}/api/oauth/{connector}/authorize` to receive `{ authorization_url, state }`.
- Simulate provider return by calling `POST {BACKEND_BASE_URL}/api/oauth/{connector}/callback` with `{ code: \"dev-code\", state }`.
- Verify the Connections page reflects an active status if a `connection_id` was used and tokens were stored.

Environment placeholders:
- NEXT_PUBLIC_BACKEND_BASE_URL, NEXT_PUBLIC_FRONTEND_BASE_URL
- Optional: NEXT_PUBLIC_* client IDs/secrets for connectors (if needed for UI-only scenarios)

Dry run / Simulation for local testing:
- Call `GET {BACKEND_BASE_URL}/api/oauth/{connector}/authorize` to receive `{ authorization_url, state }`.
- Simulate provider return by calling `POST {BACKEND_BASE_URL}/api/oauth/{connector}/callback` with `{ code: \"dev-code\", state }`.
- Verify the Connections page reflects an active status if a `connection_id` was used and tokens were stored.

Environment placeholders:
- NEXT_PUBLIC_BACKEND_BASE_URL, NEXT_PUBLIC_FRONTEND_BASE_URL
- Optional: NEXT_PUBLIC_* client IDs/secrets for connectors (if needed for UI-only scenarios)

### Styling and Theme

- **Tailwind CSS** with Ocean Professional theme (blue and amber accents)
- Modern, accessible components with focus rings and proper roles

## Deployment

- Set env vars in hosting platform
- Build and deploy: `npm run build && npm run start`
- Update OAuth redirect URIs to match deployed frontend URL

## Troubleshooting

- CORS, OAuth, or network errors typically arise from misconfigured URLs or missing env vars. Ensure both BACKEND and FRONTEND URLs are correct and routable.
