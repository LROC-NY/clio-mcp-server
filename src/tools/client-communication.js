/**
 * Client communication tools for Clio MCP Server
 * Enhanced contact management and Clio Grow integration
 */

export const clientCommunicationTools = [
  // Enhanced Contact Management
  {
    name: 'get_contact_emails',
    description: 'Get all email addresses for a contact',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        contact_id: {
          type: 'number',
          description: 'Contact ID',
        },
      },
      required: ['contact_id'],
    },
  },
  {
    name: 'get_contact_phones',
    description: 'Get all phone numbers for a contact',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        contact_id: {
          type: 'number',
          description: 'Contact ID',
        },
      },
      required: ['contact_id'],
    },
  },
  {
    name: 'add_contact_email',
    description: 'Add a new email address to a contact',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        contact_id: {
          type: 'number',
          description: 'Contact ID',
        },
        address: {
          type: 'string',
          description: 'Email address',
        },
        name: {
          type: 'string',
          description: 'Label for this email (e.g., "Work", "Personal")',
          default: 'Work',
        },
        default_email: {
          type: 'boolean',
          description: 'Set as default email',
          default: false,
        },
      },
      required: ['contact_id', 'address'],
    },
  },
  {
    name: 'add_contact_phone',
    description: 'Add a new phone number to a contact',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        contact_id: {
          type: 'number',
          description: 'Contact ID',
        },
        number: {
          type: 'string',
          description: 'Phone number',
        },
        name: {
          type: 'string',
          description: 'Label for this phone (e.g., "Mobile", "Office")',
          default: 'Mobile',
        },
        default_number: {
          type: 'boolean',
          description: 'Set as default phone',
          default: false,
        },
      },
      required: ['contact_id', 'number'],
    },
  },
  {
    name: 'get_contact_communications',
    description: 'Get communication history for a contact',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        contact_id: {
          type: 'number',
          description: 'Contact ID',
        },
        type: {
          type: 'string',
          description: 'Filter by communication type',
          enum: ['email', 'phone', 'meeting', 'letter', 'all'],
          default: 'all',
        },
        limit: {
          type: 'number',
          description: 'Number of communications to retrieve',
          default: 20,
        },
      },
      required: ['contact_id'],
    },
  },
  {
    name: 'log_communication',
    description: 'Log a communication with a contact',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        contact_id: {
          type: 'number',
          description: 'Contact ID',
        },
        matter_id: {
          type: 'number',
          description: 'Matter ID (optional)',
        },
        type: {
          type: 'string',
          description: 'Communication type',
          enum: ['email', 'phone_call', 'meeting', 'letter'],
        },
        subject: {
          type: 'string',
          description: 'Subject/summary of communication',
        },
        body: {
          type: 'string',
          description: 'Details of the communication',
        },
        date: {
          type: 'string',
          description: 'Date of communication (YYYY-MM-DD)',
        },
        duration: {
          type: 'number',
          description: 'Duration in minutes (for calls/meetings)',
        },
      },
      required: ['contact_id', 'type', 'subject'],
    },
  },
  // Clio Grow Lead Management
  {
    name: 'submit_lead',
    description: 'Submit a new lead to Clio Grow lead inbox',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        first_name: {
          type: 'string',
          description: 'Lead first name',
        },
        last_name: {
          type: 'string',
          description: 'Lead last name',
        },
        email: {
          type: 'string',
          description: 'Lead email address',
        },
        phone: {
          type: 'string',
          description: 'Lead phone number',
        },
        practice_area: {
          type: 'string',
          description: 'Legal practice area',
        },
        referral_source: {
          type: 'string',
          description: 'How the lead found the firm',
        },
        message: {
          type: 'string',
          description: 'Lead message or inquiry',
        },
        urgency: {
          type: 'string',
          description: 'Urgency level',
          enum: ['low', 'medium', 'high', 'urgent'],
          default: 'medium',
        },
        custom_fields: {
          type: 'object',
          description: 'Additional custom lead data',
        },
      },
      required: ['first_name', 'last_name', 'email'],
    },
  },
  {
    name: 'get_leads',
    description: 'Get leads from Clio Grow',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        status: {
          type: 'string',
          description: 'Filter by lead status',
          enum: ['new', 'contacted', 'qualified', 'converted', 'rejected'],
        },
        assigned_to: {
          type: 'number',
          description: 'Filter by assigned user ID',
        },
        practice_area: {
          type: 'string',
          description: 'Filter by practice area',
        },
        date_from: {
          type: 'string',
          description: 'Filter leads from date (YYYY-MM-DD)',
        },
        date_to: {
          type: 'string',
          description: 'Filter leads to date (YYYY-MM-DD)',
        },
        limit: {
          type: 'number',
          description: 'Number of leads to retrieve',
          default: 20,
        },
      },
    },
  },
  {
    name: 'update_lead_status',
    description: 'Update the status of a lead',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        lead_id: {
          type: 'number',
          description: 'Lead ID',
        },
        status: {
          type: 'string',
          description: 'New status',
          enum: ['new', 'contacted', 'qualified', 'converted', 'rejected'],
        },
        notes: {
          type: 'string',
          description: 'Notes about the status change',
        },
        assigned_to: {
          type: 'number',
          description: 'User ID to assign lead to',
        },
      },
      required: ['lead_id', 'status'],
    },
  },
  {
    name: 'convert_lead_to_matter',
    description: 'Convert a qualified lead to a matter and contact',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        lead_id: {
          type: 'number',
          description: 'Lead ID to convert',
        },
        matter_description: {
          type: 'string',
          description: 'Description for the new matter',
        },
        practice_area_id: {
          type: 'number',
          description: 'Practice area ID for the matter',
        },
        responsible_attorney_id: {
          type: 'number',
          description: 'Attorney user ID',
        },
        billing_rate: {
          type: 'number',
          description: 'Billing rate for the matter',
        },
        create_retainer: {
          type: 'boolean',
          description: 'Create retainer agreement',
          default: false,
        },
      },
      required: ['lead_id', 'matter_description'],
    },
  },
  {
    name: 'get_lead_analytics',
    description: 'Get lead conversion analytics',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        date_from: {
          type: 'string',
          description: 'Start date for analytics (YYYY-MM-DD)',
        },
        date_to: {
          type: 'string',
          description: 'End date for analytics (YYYY-MM-DD)',
        },
        group_by: {
          type: 'string',
          description: 'Group analytics by',
          enum: ['source', 'practice_area', 'assigned_user', 'status'],
          default: 'source',
        },
      },
      required: ['date_from', 'date_to'],
    },
  },
];

// Handler for client communication tools
export async function handleClientCommunicationTool(name, args, config, makeClioRequest) {
  const accessToken = args.access_token || config.accessToken;

  switch (name) {
    // Contact Email/Phone Management
    case 'get_contact_emails': {
      return await makeClioRequest(
        `/contacts/${args.contact_id}/email_addresses`,
        'GET',
        null,
        accessToken,
        config
      );
    }

    case 'get_contact_phones': {
      return await makeClioRequest(
        `/contacts/${args.contact_id}/phone_numbers`,
        'GET',
        null,
        accessToken,
        config
      );
    }

    case 'add_contact_email': {
      const emailData = {
        data: {
          address: args.address,
          name: args.name || 'Work',
          default_email: args.default_email || false,
        },
      };
      
      return await makeClioRequest(
        `/contacts/${args.contact_id}/email_addresses`,
        'POST',
        emailData,
        accessToken,
        config
      );
    }

    case 'add_contact_phone': {
      const phoneData = {
        data: {
          number: args.number,
          name: args.name || 'Mobile',
          default_number: args.default_number || false,
        },
      };
      
      return await makeClioRequest(
        `/contacts/${args.contact_id}/phone_numbers`,
        'POST',
        phoneData,
        accessToken,
        config
      );
    }

    case 'get_contact_communications': {
      let endpoint = `/communications?contact_id=${args.contact_id}&limit=${args.limit || 20}`;
      if (args.type && args.type !== 'all') {
        endpoint += `&type=${args.type}`;
      }
      
      return await makeClioRequest(endpoint, 'GET', null, accessToken, config);
    }

    case 'log_communication': {
      const commData = {
        data: {
          contact: { id: args.contact_id },
          type: args.type,
          subject: args.subject,
          body: args.body,
          date: args.date || new Date().toISOString().split('T')[0],
        },
      };
      
      if (args.matter_id) {
        commData.data.matter = { id: args.matter_id };
      }
      
      if (args.duration) {
        commData.data.duration = args.duration;
      }
      
      return await makeClioRequest('/communications', 'POST', commData, accessToken, config);
    }

    // Clio Grow Lead Management
    case 'submit_lead': {
      // Clio Grow uses a different endpoint structure
      const leadData = {
        data: {
          first_name: args.first_name,
          last_name: args.last_name,
          email: args.email,
          phone: args.phone,
          practice_area: args.practice_area,
          referral_source: args.referral_source,
          message: args.message,
          urgency: args.urgency || 'medium',
          custom_fields: args.custom_fields || {},
          submitted_at: new Date().toISOString(),
        },
      };
      
      // Note: This endpoint might be on grow.clio.com subdomain
      const growConfig = { ...config };
      if (config.region === 'US') {
        growConfig.apiBase = 'https://grow.clio.com/api/v1';
      } else if (config.region === 'EU') {
        growConfig.apiBase = 'https://eu.grow.clio.com/api/v1';
      }
      
      return await makeClioRequest('/leads', 'POST', leadData, accessToken, growConfig);
    }

    case 'get_leads': {
      let endpoint = `/leads?limit=${args.limit || 20}`;
      
      if (args.status) endpoint += `&status=${args.status}`;
      if (args.assigned_to) endpoint += `&assigned_to=${args.assigned_to}`;
      if (args.practice_area) endpoint += `&practice_area=${encodeURIComponent(args.practice_area)}`;
      if (args.date_from) endpoint += `&date_from=${args.date_from}`;
      if (args.date_to) endpoint += `&date_to=${args.date_to}`;
      
      const growConfig = { ...config };
      if (config.region === 'US') {
        growConfig.apiBase = 'https://grow.clio.com/api/v1';
      } else if (config.region === 'EU') {
        growConfig.apiBase = 'https://eu.grow.clio.com/api/v1';
      }
      
      return await makeClioRequest(endpoint, 'GET', null, accessToken, growConfig);
    }

    case 'update_lead_status': {
      const updateData = {
        data: {
          status: args.status,
          notes: args.notes,
          updated_at: new Date().toISOString(),
        },
      };
      
      if (args.assigned_to) {
        updateData.data.assigned_to = { id: args.assigned_to };
      }
      
      const growConfig = { ...config };
      if (config.region === 'US') {
        growConfig.apiBase = 'https://grow.clio.com/api/v1';
      } else if (config.region === 'EU') {
        growConfig.apiBase = 'https://eu.grow.clio.com/api/v1';
      }
      
      return await makeClioRequest(
        `/leads/${args.lead_id}`,
        'PATCH',
        updateData,
        accessToken,
        growConfig
      );
    }

    case 'convert_lead_to_matter': {
      // First get the lead data
      const growConfig = { ...config };
      if (config.region === 'US') {
        growConfig.apiBase = 'https://grow.clio.com/api/v1';
      } else if (config.region === 'EU') {
        growConfig.apiBase = 'https://eu.grow.clio.com/api/v1';
      }
      
      const leadData = await makeClioRequest(
        `/leads/${args.lead_id}`,
        'GET',
        null,
        accessToken,
        growConfig
      );
      
      // Create contact from lead
      const contactData = {
        data: {
          type: 'Person',
          first_name: leadData.data.first_name,
          last_name: leadData.data.last_name,
          email_addresses: [{
            address: leadData.data.email,
            name: 'Primary',
            default_email: true,
          }],
          phone_numbers: leadData.data.phone ? [{
            number: leadData.data.phone,
            name: 'Primary',
            default_number: true,
          }] : [],
        },
      };
      
      const contact = await makeClioRequest('/contacts', 'POST', contactData, accessToken, config);
      
      // Create matter
      const matterData = {
        data: {
          description: args.matter_description,
          client: { id: contact.data.id },
          practice_area: args.practice_area_id ? { id: args.practice_area_id } : null,
          responsible_attorney: args.responsible_attorney_id ? { id: args.responsible_attorney_id } : null,
          billing_method: args.billing_rate ? 'hourly' : 'flat_fee',
          hourly_rate: args.billing_rate,
          status: 'open',
        },
      };
      
      const matter = await makeClioRequest('/matters', 'POST', matterData, accessToken, config);
      
      // Update lead status to converted
      await handleClientCommunicationTool(
        'update_lead_status',
        {
          lead_id: args.lead_id,
          status: 'converted',
          notes: `Converted to matter ${matter.data.display_number}`,
          access_token: accessToken,
        },
        config,
        makeClioRequest
      );
      
      return {
        contact: contact.data,
        matter: matter.data,
        lead_converted: true,
      };
    }

    case 'get_lead_analytics': {
      const growConfig = { ...config };
      if (config.region === 'US') {
        growConfig.apiBase = 'https://grow.clio.com/api/v1';
      } else if (config.region === 'EU') {
        growConfig.apiBase = 'https://eu.grow.clio.com/api/v1';
      }
      
      return await makeClioRequest(
        `/leads/analytics?date_from=${args.date_from}&date_to=${args.date_to}&group_by=${args.group_by || 'source'}`,
        'GET',
        null,
        accessToken,
        growConfig
      );
    }

    default:
      throw new Error(`Unknown client communication tool: ${name}`);
  }
}