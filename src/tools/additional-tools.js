/**
 * Additional Clio API tools based on v4 documentation
 */

export const additionalTools = [
  {
    name: 'get_bills',
    description: 'Get list of bills from Clio',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        status: {
          type: 'string',
          description: 'Filter by bill status (draft, pending, paid)',
          enum: ['draft', 'pending', 'paid'],
        },
        limit: {
          type: 'number',
          description: 'Number of bills to retrieve (default: 10)',
          default: 10,
        },
      },
    },
  },
  {
    name: 'get_timeline_events',
    description: 'Get timeline events for a matter',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        matter_id: {
          type: 'number',
          description: 'Matter ID to get timeline events for',
        },
        limit: {
          type: 'number',
          description: 'Number of events to retrieve (default: 20)',
          default: 20,
        },
      },
      required: ['matter_id'],
    },
  },
  {
    name: 'get_custom_fields',
    description: 'Get custom field definitions',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        parent_type: {
          type: 'string',
          description: 'Parent type for custom fields (matter, contact, etc.)',
          enum: ['matter', 'contact', 'company'],
        },
      },
    },
  },
  {
    name: 'create_webhook',
    description: 'Create a webhook subscription',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        url: {
          type: 'string',
          description: 'Webhook endpoint URL',
        },
        events: {
          type: 'array',
          description: 'Events to subscribe to',
          items: {
            type: 'string',
            enum: ['matter.created', 'matter.updated', 'contact.created', 'contact.updated', 'task.created', 'task.completed'],
          },
        },
        secret: {
          type: 'string',
          description: 'Webhook secret for verification',
        },
      },
      required: ['url', 'events'],
    },
  },
  {
    name: 'get_webhooks',
    description: 'Get list of webhook subscriptions',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
      },
    },
  },
  {
    name: 'get_users',
    description: 'Get list of users in the firm',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        enabled: {
          type: 'boolean',
          description: 'Filter by enabled status',
        },
        limit: {
          type: 'number',
          description: 'Number of users to retrieve (default: 10)',
          default: 10,
        },
      },
    },
  },
  {
    name: 'get_current_user',
    description: 'Get information about the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
      },
    },
  },
  {
    name: 'get_trust_accounts',
    description: 'Get trust account information',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        limit: {
          type: 'number',
          description: 'Number of accounts to retrieve (default: 10)',
          default: 10,
        },
      },
    },
  },
  {
    name: 'get_allocations',
    description: 'Get billing allocations',
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
          description: 'Number of allocations to retrieve (default: 10)',
          default: 10,
        },
      },
    },
  },
  {
    name: 'search',
    description: 'Search across multiple Clio resources',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        query: {
          type: 'string',
          description: 'Search query',
        },
        resources: {
          type: 'array',
          description: 'Resources to search in',
          items: {
            type: 'string',
            enum: ['matters', 'contacts', 'documents', 'tasks'],
          },
          default: ['matters', 'contacts'],
        },
        limit: {
          type: 'number',
          description: 'Number of results per resource (default: 5)',
          default: 5,
        },
      },
      required: ['query'],
    },
  },
];

// Handler implementations for additional tools
export async function handleAdditionalTool(name, args, config, makeClioRequest) {
  const accessToken = args.access_token || config.accessToken;

  switch (name) {
    case 'get_bills': {
      let endpoint = `/bills?limit=${args.limit || 10}`;
      if (args.status) {
        endpoint += `&status=${args.status}`;
      }
      return await makeClioRequest(endpoint, 'GET', null, accessToken, config);
    }

    case 'get_timeline_events': {
      return await makeClioRequest(
        `/timeline_events?matter_id=${args.matter_id}&limit=${args.limit || 20}`,
        'GET',
        null,
        accessToken,
        config
      );
    }

    case 'get_custom_fields': {
      let endpoint = '/custom_fields';
      if (args.parent_type) {
        endpoint += `?parent_type=${args.parent_type}`;
      }
      return await makeClioRequest(endpoint, 'GET', null, accessToken, config);
    }

    case 'create_webhook': {
      const webhookData = {
        data: {
          url: args.url,
          events: args.events,
        },
      };
      if (args.secret) {
        webhookData.data.secret = args.secret;
      }
      return await makeClioRequest('/webhooks', 'POST', webhookData, accessToken, config);
    }

    case 'get_webhooks': {
      return await makeClioRequest('/webhooks', 'GET', null, accessToken, config);
    }

    case 'get_users': {
      let endpoint = `/users?limit=${args.limit || 10}`;
      if (args.enabled !== undefined) {
        endpoint += `&enabled=${args.enabled}`;
      }
      return await makeClioRequest(endpoint, 'GET', null, accessToken, config);
    }

    case 'get_current_user': {
      return await makeClioRequest('/users/who_am_i', 'GET', null, accessToken, config);
    }

    case 'get_trust_accounts': {
      return await makeClioRequest(
        `/trust_accounts?limit=${args.limit || 10}`,
        'GET',
        null,
        accessToken,
        config
      );
    }

    case 'get_allocations': {
      let endpoint = `/allocations?limit=${args.limit || 10}`;
      if (args.matter_id) {
        endpoint += `&matter_id=${args.matter_id}`;
      }
      return await makeClioRequest(endpoint, 'GET', null, accessToken, config);
    }

    case 'search': {
      const results = {};
      const resources = args.resources || ['matters', 'contacts'];
      
      for (const resource of resources) {
        try {
          const response = await makeClioRequest(
            `/${resource}?query=${encodeURIComponent(args.query)}&limit=${args.limit || 5}`,
            'GET',
            null,
            accessToken,
            config
          );
          results[resource] = response.data || [];
        } catch (error) {
          results[resource] = { error: error.message };
        }
      }
      
      return results;
    }

    default:
      throw new Error(`Unknown additional tool: ${name}`);
  }
}