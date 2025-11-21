# 🎲 Secure Roll Dice MCP Server

A secure, production-ready Model Context Protocol (MCP) server with OAuth 2.1 authentication and Arcjet protection.

![Security Status](https://img.shields.io/badge/Security-OAuth%202.1-green)
![Protection](https://img.shields.io/badge/Protection-Arcjet-blue)
![Deployment](https://img.shields.io/badge/Deployed-Vercel-black)

## 🔒 Security Features

- **OAuth 2.1 Authentication**: Secure Google Sign-In integration.
- **Arcjet Protection**: Rate limiting (Token Bucket) and bot detection.
- **Secure Headers**: Validated Authorization Bearer tokens required.
- **Audit Logging**: Comprehensive request and security decision logging.

## 📚 Documentation

- **Security Architecture**: [View /mcp-security](https://rolldice-mcpserver.vercel.app/mcp-security)
- **Live Demo**: [https://rolldice-mcpserver.vercel.app](https://rolldice-mcpserver.vercel.app)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/AlkerMalware/rolldice-mcpserver.git
cd rolldice-mcpserver
pnpm install
```

### 2. Environment Setup

Create `.env.local`:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
ARCJET_KEY=your_arcjet_key
```

### 3. Start Development Server

```bash
pnpm dev
```

## 🤖 Authenticated MCP Setup

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "secure-rolldice": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://rolldice-mcpserver.vercel.app/api/mcp"
      ]
    }
  }
}
```

Add this to your Claude Desktop config file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "rolldice": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://localhost:3000/api/mcp"
      ]
    }
  }
}
```

### 3. Restart Claude Desktop
Look for the hammer icon (🔨) in the input box - this indicates MCP tools are available!

### 4. Start Rolling!
Ask Claude natural language questions like:
- "Roll a 6-sided die"
- "Roll a d20 for my D&D character"
- "Can you roll a 100-sided die?"

## 🏗️ How It Works

This application uses **mcp-handler** to provide seamless integration between web applications and AI assistants like Claude Desktop.

### Architecture

```
Claude Desktop → Transport Protocol → /api/[transport] → Shared Dice Logic (/lib/dice.ts)
Web Interface → Server Actions → Shared Dice Logic (/lib/dice.ts)
```

1. **Claude Desktop** connects via various transport protocols (SSE, stdio, etc.)
2. **Transport Layer** handles the MCP protocol communication
3. **MCP Handler** processes tool calls and invokes shared dice logic
4. **Shared Logic** (`/lib/dice.ts`) contains the single source of truth for validation and randomness
5. **Server Actions** (for web) call the same shared dice logic directly

### Key Components

- **`lib/dice.ts`**: Shared dice rolling logic, schema, and tool definitions
- **`app/api/[transport]/route.ts`**: MCP server endpoint using mcp-handler + shared logic
- **`app/actions/mcp-actions.ts`**: Server actions that use the shared dice logic
- **`app/page.tsx`**: Beautiful web interface with setup instructions and testing
- **`components/`**: Reusable shadcn/ui components for the interface

### Web Interface Benefits

The web interface uses **Next.js Server Actions** that import the same shared logic as the MCP server:
- ✅ Same Zod schema validation (`lib/dice.ts`)
- ✅ Identical randomness algorithm (single `rollDice()` function)
- ✅ Consistent output formatting (same result structure)
- ✅ Shared tool definitions (same name, description, schema)
- ✅ True single source of truth architecture
- **MCP Tools**: `roll_dice` tool with Zod validation for parameters

## 🚀 Deployment to Vercel

### Option 1: Deploy Button (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gocallum/rolldice-mcpserver)

### Option 2: Manual Deployment

1. **Connect to Vercel**:
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Update Claude Desktop Config**:
   Replace `http://localhost:3000` with your Vercel URL:
   ```json
   {
     "mcpServers": {
       "rolldice": {
         "command": "npx",
         "args": [
           "-y",
           "mcp-remote",
           "https://your-app.vercel.app/api/mcp"
         ]
       }
     }
   }
   ```

3. **Restart Claude Desktop** to use the deployed version

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) components
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with CSS variables
- **MCP Integration**: [mcp-handler](https://www.npmjs.com/package/mcp-handler) for HTTP-based MCP protocol
- **MCP Bridge**: [mcp-remote](https://www.npmjs.com/package/mcp-remote) for Claude Desktop connectivity
- **Validation**: [Zod](https://zod.dev/) for type-safe parameter validation
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode
- **Icons**: [Lucide React](https://lucide.dev/) for beautiful icons
- **Deployment**: [Vercel](https://vercel.com/) platform

## 🎯 Use Cases

- **🎮 Tabletop Gaming**: Perfect for D&D, Pathfinder, and other RPGs
- **🤔 Decision Making**: Use dice rolls to make random choices
- **📚 Education**: Demonstrate probability and random number generation
- **🎲 Game Development**: Test random mechanics and game balance
- **🎪 Fun & Entertainment**: Add randomness to conversations with Claude

## 🤝 Contributing

Contributions are welcome! This project is open source and MIT licensed.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📚 Learn More

- **[Model Context Protocol](https://modelcontextprotocol.io/)** - Official MCP documentation
- **[mcp-handler](https://www.npmjs.com/package/mcp-handler)** - The HTTP-based MCP handler used in this project
- **[mcp-remote](https://www.npmjs.com/package/mcp-remote)** - Bridge tool for Claude Desktop connectivity
- **[Claude Desktop](https://claude.ai/download)** - Download and setup guide
- **[Next.js Documentation](https://nextjs.org/docs)** - Learn about the framework

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created by **[Callum Bir](https://github.com/gocallum)**

⭐ If you find this project useful, please consider giving it a star on GitHub!

---

*Built with ❤️ using Next.js, shadcn/ui, and the Model Context Protocol*
