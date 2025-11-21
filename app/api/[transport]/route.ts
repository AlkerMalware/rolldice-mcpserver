// app/api/[transport]/route.ts
import { createMcpHandler } from "mcp-handler";
import { rollDice, rollDiceTool } from "@/lib/dice";
import { verifyGoogleToken } from "@/lib/auth";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import arcjet from "@/lib/arcjet";
import { NextResponse } from "next/server";

// Type definitions for better type safety
interface ToolExtra {
  requestInfo?: {
    headers?: {
      authorization?: string;
    };
  };
}

// Store auth context for current request
// eslint-disable-next-line prefer-const
let currentAuthInfo: AuthInfo | null | undefined = null;

const mcpHandler = createMcpHandler(
  (server) => {
    server.tool(
      rollDiceTool.name,
      rollDiceTool.description,
      rollDiceTool.schema,
      async ({ sides }, extra?: ToolExtra) => {
        // Extract auth info from the request headers if currentAuthInfo is not available
        let authInfo: AuthInfo | null | undefined = currentAuthInfo;

        if (!authInfo) {
          const authHeader = extra?.requestInfo?.headers?.authorization || "";
          const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
          
          try {
            // Create a mock request object for verifyGoogleToken
            const mockRequest = {
              headers: new Map([["authorization", authHeader]]),
              url: "http://localhost:3000/api/mcp",
              method: "POST",
            };
            authInfo =
              (await verifyGoogleToken(
                mockRequest as unknown as Request,
                token,
              )) || null;
          } catch (error) {
            console.log("Auth extraction failed:", error);
          }
        }

        // Check authentication
        if (!authInfo) {
          throw new Error("Authentication required");
        }

        // Use the shared dice rolling logic
        const result = rollDice(sides);
        return {
          content: [result],
        };
      }
    );
  },
  {
    // Optional server options
  },
  {
    // No Redis config - disable Redis requirement
    basePath: "/api", // this needs to match where the [transport] is located.
    maxDuration: 60,
    verboseLogs: true,
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function protectedHandler(req: Request, context: any) {
  const decision = await arcjet.protect(req, { requested: 1 });
  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too Many Requests", reason: decision.reason },
      { status: 429 }
    );
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - mcpHandler expects 1 argument but Next.js passes 2
  return mcpHandler(req, context);
}

export { protectedHandler as GET, protectedHandler as POST };