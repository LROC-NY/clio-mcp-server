#!/usr/bin/env node
/**
 * Clio MCP Server
 * Cross-platform Model Context Protocol server for Clio legal practice management
 * Supports Claude Code, Claude Desktop, and standalone usage
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { makeClioRequest } from './api.js';
import { detectPlatform } from './platforms/detector.js';
import { additionalTools, handleAdditionalTool } from './tools/additional-tools.js';

// Load configuration based on environment
const config = await loadConfig();
const platform = detectPlatform();

console.error(`Starting Clio MCP Server on ${platform}...`);

// Create MCP server
const server = new Server(
  {
    name: 'clio-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_matters',
      description: 'Get list of matters from Clio',
      inputSchema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            description: 'Clio API access token (optional if configured)',
          },
          limit: {
            type: 'number',
            description: 'Number of matters to retrieve (default: 10)',
            default: 10,
          },
        },
      },
    },
    {
      name: 'get_contacts',
      description: 'Get list of contacts from Clio',
      inputSchema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            description: 'Clio API access token (optional if configured)',
          },
          limit: {
            type: 'number',
            description: 'Number of contacts to retrieve (default: 10)',
            default: 10,
          },
        },
      },
    },
    {
      name: 'get_activities',
      description: 'Get list of activities/time entries from Clio',
      inputSchema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            description: 'Clio API access token (optional if configured)',
          },
          limit: {
            type: 'number',
            description: 'Number of activities to retrieve (default: 10)',
            default: 10,
          },
        },
      },
    },
    {
      name: 'get_tasks',
      description: 'Get list of tasks from Clio',
      inputSchema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            description: 'Clio API access token (optional if configured)',
          },
          limit: {
            type: 'number',
            description: 'Number of tasks to retrieve (default: 10)',
            default: 10,
          },
        },
      },
    },
    {
      name: 'create_task',
      description: 'Create a new task in Clio',
      inputSchema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            description: 'Clio API access token (optional if configured)',
          },
          name: {
            type: 'string',
            description: 'Task name',
          },
          due_date: {
            type: 'string',
            description: 'Due date (YYYY-MM-DD)',
          },
          priority: {
            type: 'string',
            description: 'Priority (low, normal, high)',
            enum: ['low', 'normal', 'high'],
            default: 'normal',
          },
          matter_id: {
            type: 'number',
            description: 'Matter ID to associate with task',
          },
        },
        required: ['name'],
      },
    },
    {
      name: 'get_calendar_entries',
      description: 'Get calendar entries from Clio',
      inputSchema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            description: 'Clio API access token (optional if configured)',
          },
          start_date: {
            type: 'string',
            description: 'Start date (YYYY-MM-DD)',
          },
          end_date: {
            type: 'string',
            description: 'End date (YYYY-MM-DD)',
          },
        },
      },
    },
    {
      name: 'get_documents',
      description: 'Get list of documents from Clio',
      inputSchema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            description: 'Clio API access token (optional if configured)',
          },
          matter_id: {
            type: 'number',
            description: 'Filter by matter ID',
          },
          limit: {
            type: 'number',
            description: 'Number of documents to retrieve (default: 10)',
            default: 10,
          },
        },
      },
    },
    {
      name: 'get_auth_url',
      description: 'Get Clio OAuth authorization URL',
      inputSchema: {
        type: 'object',
        properties: {
          redirect_uri: {
            type: 'string',
            description: 'OAuth redirect URI',
            default: 'http://127.0.0.1:3000/oauth/callback',
          },
        },
      },
    },
    {
      name: 'exchange_code',
      description: 'Exchange authorization code for access token',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Authorization code from OAuth callback',
          },
          redirect_uri: {
            type: 'string',
            description: 'OAuth redirect URI (must match authorization)',
            default: 'http://127.0.0.1:3000/oauth/callback',
          },
        },
        required: ['code'],
      },
    },
    ...additionalTools,
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // Use provided access token or fall back to configured one
  const accessToken = args.access_token || config.accessToken;

  try {
    switch (name) {
      case 'get_matters': {
        const result = await makeClioRequest(
          `/matters?limit=${args.limit || 10}`,
          'GET',
          null,
          accessToken,
          config
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_contacts': {
        const result = await makeClioRequest(
          `/contacts?limit=${args.limit || 10}`,
          'GET',
          null,
          accessToken,
          config
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_activities': {
        const result = await makeClioRequest(
          `/activities?limit=${args.limit || 10}`,
          'GET',
          null,
          accessToken,
          config
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_tasks': {
        const result = await makeClioRequest(
          `/tasks?limit=${args.limit || 10}`,
          'GET',
          null,
          accessToken,
          config
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_task': {
        const taskData = {
          data: {
            name: args.name,
            priority: args.priority || 'normal',
          },
        };
        
        if (args.due_date) {
          taskData.data.due_at = args.due_date;
        }
        
        if (args.matter_id) {
          taskData.data.matter = { id: args.matter_id };
        }
        
        const result = await makeClioRequest(
          '/tasks',
          'POST',
          taskData,
          accessToken,
          config
        );
        return {
          content: [
            {
              type: 'text',
              text: `Task created successfully: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'get_calendar_entries': {
        let endpoint = '/calendar_entries?limit=50';
        if (args.start_date) {
          endpoint += `&start_date=${args.start_date}`;
        }
        if (args.end_date) {
          endpoint += `&end_date=${args.end_date}`;
        }
        
        const result = await makeClioRequest(
          endpoint,
          'GET',
          null,
          accessToken,
          config
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_documents': {
        let endpoint = `/documents?limit=${args.limit || 10}`;
        if (args.matter_id) {
          endpoint += `&matter_id=${args.matter_id}`;
        }
        
        const result = await makeClioRequest(
          endpoint,
          'GET',
          null,
          accessToken,
          config
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_auth_url': {
        const redirectUri = args.redirect_uri || 'http://127.0.0.1:3000/oauth/callback';
        const authUrl = `${config.authBase}/oauth/authorize?` +
          `response_type=code&` +
          `client_id=${config.clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}`;
        
        return {
          content: [
            {
              type: 'text',
              text: `To authorize this app with Clio:\n\n1. Visit this URL:\n${authUrl}\n\n2. Log in and authorize the app\n3. You'll be redirected to get an authorization code\n4. Use the exchange_code tool with that code`,
            },
          ],
        };
      }

      case 'exchange_code': {
        const { exchangeCodeForToken } = await import('./auth.js');
        const result = await exchangeCodeForToken(
          args.code,
          args.redirect_uri || 'http://127.0.0.1:3000/oauth/callback',
          config
        );
        
        return {
          content: [
            {
              type: 'text',
              text: `Access token obtained successfully!\n\nAccess Token: ${result.access_token}\n\nSave this token to use with other Clio tools.\n\nFull response:\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      default:
        // Check if it's an additional tool
        if (additionalTools.find(tool => tool.name === name)) {
          const result = await handleAdditionalTool(name, args, config, makeClioRequest);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Clio MCP Server (${platform}) started successfully`);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});