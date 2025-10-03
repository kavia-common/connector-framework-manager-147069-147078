import React from "react";

// PUBLIC_INTERFACE
export const PluginScreen: React.FC<{
  title: string;
  description?: string;
  children?: React.ReactNode;
}> = ({ title, description, children }) => {
  /** Generic plugin area wrapper with heading and content card */
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </header>
      <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4">
        {children ?? (
          <div className="text-sm text-gray-500">
            No plugin implementation yet. Showing sample data placeholder.
            <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-3">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {`{
  "sample": true,
  "message": "This is where the ${title} plugin UI will render."
}`}
              </pre>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
