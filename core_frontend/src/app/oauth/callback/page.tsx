'use client';

/**
 * OAuth callback page that handles OAuth redirects from third-party services.
 * Processes the authorization code and completes the OAuth flow.
 */

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

function OAuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing OAuth callback...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle OAuth error responses
        if (error) {
          setStatus('error');
          setMessage(errorDescription || `OAuth error: ${error}`);
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          setStatus('error');
          setMessage('Missing required OAuth parameters (code or state)');
          return;
        }

        // Extract connector key from state parameter
        // The state should contain the connector key and possibly other data
        const stateData = JSON.parse(atob(state));
        const connectorKey = stateData.connector_key;
        const connectionId = stateData.connection_id;

        if (!connectorKey) {
          setStatus('error');
          setMessage('Invalid OAuth state parameter');
          return;
        }

        // Call backend to complete OAuth flow
        const response = await apiClient.handleOAuthCallback(
          connectorKey,
          code,
          state,
          connectionId
        );

        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'OAuth connection successful!');
          
          // Redirect to connections page after a short delay
          setTimeout(() => {
            router.push('/connections');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(response.message || 'OAuth connection failed');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    processCallback();
  }, [searchParams, router]);

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        );
      case 'success':
        return (
          <div className="rounded-full h-8 w-8 bg-green-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="rounded-full h-8 w-8 bg-red-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500/10 to-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            OAuth Authentication
          </h1>
          
          <p className={`text-lg ${getStatusColor()} mb-6`}>
            {message}
          </p>
          
          {status === 'success' && (
            <p className="text-sm text-gray-500">
              Redirecting to connections page...
            </p>
          )}
          
          {status === 'error' && (
            <button
              onClick={() => router.push('/connections')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Back to Connections
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

// PUBLIC_INTERFACE
export default function OAuthCallbackPage() {
  /**
   * OAuth callback page component with Suspense boundary for useSearchParams.
   * 
   * @returns JSX element for OAuth callback handling
   */
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-blue-500/10 to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </main>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}
