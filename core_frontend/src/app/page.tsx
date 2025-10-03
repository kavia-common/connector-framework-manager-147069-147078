import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ConnectorCard } from "@/components/ConnectorCard";

export default async function Home() {
  const connectors = await apiClient.getConnectors().catch(() => []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500/10 to-gray-50">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Connectors</h1>
            <p className="text-sm text-gray-600">
              Browse available connectors and open their plugin screens.
            </p>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              className="text-sm text-blue-700 hover:text-blue-800 underline underline-offset-2"
              href="/connections"
            >
              Manage Connections
            </Link>
          </nav>
        </header>

        {connectors.length === 0 ? (
          <div className="rounded-xl bg-white ring-1 ring-gray-200 p-6 text-gray-600">
            No connectors available. Ensure backend is running and reachable.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectors.map((c) => (
              <ConnectorCard key={c.key} connector={c}>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/connectors/${encodeURIComponent(c.key)}`}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Open Plugin
                  </Link>
                  <Link
                    href="/connections"
                    className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Manage Connections
                  </Link>
                </div>
              </ConnectorCard>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
