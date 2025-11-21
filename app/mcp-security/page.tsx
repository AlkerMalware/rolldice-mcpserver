import React from "react";

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">MCP Security Architecture</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Architecture Overview</h2>
        <p className="mb-4">
          This MCP server is secured using a multi-layered approach combining OAuth 2.1 for authentication
          and Arcjet for traffic protection.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Authentication:</strong> Google OAuth 2.1 (via <code>google-auth-library</code>)</li>
          <li><strong>Authorization:</strong> Bearer Token validation on every MCP request</li>
          <li><strong>Protection:</strong> Arcjet Token Bucket Rate Limiting (20 req/min)</li>
          <li><strong>Infrastructure:</strong> Vercel Serverless Functions</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Logging & Alerting</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Logging Strategy</h3>
          <p className="mb-2">
            All authentication attempts and failures are logged to Vercel Runtime Logs.
            Structured logging includes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Auth Token Verification Status</li>
            <li>Arcjet Decision Results (Allow/Deny)</li>
            <li>MCP Tool Execution Errors</li>
          </ul>

          <h3 className="font-bold mb-2">Alerting</h3>
          <p>
            Alerts are configured via Vercel and Arcjet dashboards for:
          </p>
          <ul className="list-disc pl-6">
            <li>High rate of 401 Unauthorized responses</li>
            <li>Arcjet Rate Limit triggers (429 Too Many Requests)</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Arcjet Configuration</h2>
        <pre className="bg-black text-white p-4 rounded overflow-x-auto">
{`// lib/arcjet.ts
tokenBucket({
  mode: "LIVE",
  refillRate: 20,
  interval: 60,
  capacity: 20,
})`}
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Incident Response Runbook</h2>
        <div className="border border-red-200 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4">
            Scenario: Token Compromise
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-bold">1. Identification</h4>
              <p>Abnormal usage pattern detected from a specific IP or user ID via Arcjet logs.</p>
            </div>
            
            <div>
              <h4 className="font-bold">2. Containment</h4>
              <ul className="list-disc pl-6">
                <li>Rotate <code>GOOGLE_CLIENT_SECRET</code> in Vercel Environment Variables immediately.</li>
                <li>This invalidates all active sessions relying on the secret for exchange.</li>
                <li>Add IP address to Arcjet Deny List.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold">3. Eradication</h4>
              <p>Review logs to identify accessed resources. Revoke specific user sessions if using session management.</p>
            </div>

            <div>
              <h4 className="font-bold">4. Recovery</h4>
              <p>Redeploy server to ensure clean state. Monitor traffic for 24 hours.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
