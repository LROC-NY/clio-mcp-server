# Clio MCP Server

A cross-platform Model Context Protocol (MCP) server for integrating Clio legal practice management with AI assistants like Claude.

## Features

- 🌍 **Multi-platform support**: Works with Claude Code, Claude Desktop, mobile (Termux), and standalone
- 🔐 **Secure authentication**: OAuth 2.0 flow with token management
- 🌎 **Multi-region support**: US, EU, and CA Clio instances
- 📊 **Complete API coverage**: Matters, contacts, tasks, documents, calendar, and more
- 🔄 **Auto token refresh**: Keeps your session active
- 🛠️ **Easy setup**: Interactive setup wizard and multiple configuration options

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/LROC-NY/clio-mcp-server.git
cd clio-mcp-server

# Install dependencies
npm install

# Run setup wizard (optional)
npm run setup
```

### Configuration

The server supports multiple configuration methods:

1. **Environment Variables** (`.env` file):
```env
CLIO_CLIENT_ID=your_client_id
CLIO_CLIENT_SECRET=your_client_secret
CLIO_ACCESS_TOKEN=your_access_token
CLIO_REGION=US
```

2. **Configuration File** (`clio-config.json`):
```json
{
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret",
  "accessToken": "your_access_token",
  "region": "US"
}
```

3. **Command Line Arguments**:
```bash
node src/index.js --client-id YOUR_ID --access-token YOUR_TOKEN
```

## Platform-Specific Setup

### Claude Code

1. Add to your Claude Code configuration:

```bash
claude mcp add-json clio '{
  "type": "stdio",
  "command": "node",
  "args": ["/path/to/clio-mcp-server/src/index.js"],
  "env": {
    "CLIO_CLIENT_ID": "your_client_id",
    "CLIO_CLIENT_SECRET": "your_client_secret"
  }
}'
```

2. Restart Claude Code to load the server

### Claude Desktop

1. Edit your Claude Desktop MCP configuration
2. Add the Clio server configuration
3. Restart Claude Desktop

### Mobile (Termux)

1. Install Node.js in Termux:
```bash
pkg install nodejs
```

2. Clone and setup:
```bash
git clone https://github.com/LROC-NY/clio-mcp-server.git
cd clio-mcp-server
npm install
npm run setup
```

3. Configure Claude Code in Termux as shown above

## OAuth Setup

### Getting Your Clio API Credentials

1. Log in to your Clio account
2. Go to Settings → Developer Applications
3. Create a new application or use existing
4. Copy your Client ID and Client Secret

### Obtaining an Access Token

1. Use the `get_auth_url` tool to get the authorization URL
2. Visit the URL and authorize the application
3. Copy the authorization code from the redirect
4. Use the `exchange_code` tool to get your access token

## Available Tools

### Core Resources
- `get_matters` - Retrieve legal matters
- `get_contacts` - Retrieve contacts
- `get_tasks` - Retrieve tasks
- `create_task` - Create new tasks
- `get_activities` - Retrieve time entries
- `get_calendar_entries` - Retrieve calendar events
- `get_documents` - Retrieve documents

### Financial & Billing
- `get_bills` - Retrieve bills with status filtering
- `get_trust_accounts` - Get trust account information
- `get_allocations` - Get billing allocations

### Advanced Features
- `get_timeline_events` - Get timeline events for matters
- `get_custom_fields` - Get custom field definitions
- `search` - Search across multiple resources

### User & Account
- `get_users` - Get list of firm users
- `get_current_user` - Get authenticated user info

### Webhooks
- `create_webhook` - Create webhook subscriptions
- `get_webhooks` - List webhook subscriptions

### Authentication
- `get_auth_url` - Generate OAuth authorization URL
- `exchange_code` - Exchange auth code for access token

## Examples

### Get Recent Matters
```javascript
// In Claude
const matters = await mcp.clio.get_matters({ limit: 5 });
```

### Create a Task
```javascript
// In Claude
const task = await mcp.clio.create_task({
  name: "Review contract",
  priority: "high",
  due_date: "2025-08-15"
});
```

## Security

- Never commit your credentials to version control
- Use environment variables or secure config files
- Tokens expire after 30 days - use refresh tokens to renew
- Consider using encrypted storage for production

## Troubleshooting

### "No access token" error
- Ensure you've set `CLIO_ACCESS_TOKEN` or completed OAuth flow
- Check your configuration file paths

### Connection errors
- Verify your Clio region (US/EU/CA)
- Check network connectivity and proxy settings
- Ensure your API credentials are correct

### Platform detection issues
- Set `CLAUDE_CODE=1` for Claude Code environments
- Check platform-specific environment variables

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/LROC-NY/clio-mcp-server/issues)
- Clio API Docs: [developers.clio.com](https://developers.clio.com)
- MCP Docs: [modelcontextprotocol.org](https://modelcontextprotocol.org)