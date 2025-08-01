/**
 * Document automation tools for Clio MCP Server
 * Integrates with Clio Draft for document templates and automation
 */

export const documentAutomationTools = [
  {
    name: 'list_document_templates',
    description: 'List available document templates',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        category: {
          type: 'string',
          description: 'Filter templates by category',
        },
        limit: {
          type: 'number',
          description: 'Number of templates to retrieve (default: 20)',
          default: 20,
        },
      },
    },
  },
  {
    name: 'create_document_from_template',
    description: 'Create a new document from a template with auto-populated data',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        template_id: {
          type: 'number',
          description: 'Document template ID',
        },
        matter_id: {
          type: 'number',
          description: 'Matter ID to pull data from',
        },
        contact_id: {
          type: 'number',
          description: 'Contact ID to pull data from (optional)',
        },
        name: {
          type: 'string',
          description: 'Name for the generated document',
        },
        folder_id: {
          type: 'number',
          description: 'Folder ID to store the document (optional)',
        },
        merge_fields: {
          type: 'object',
          description: 'Additional fields to merge into the document',
        },
      },
      required: ['template_id', 'matter_id', 'name'],
    },
  },
  {
    name: 'get_document_content',
    description: 'Get the content of a document',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        document_id: {
          type: 'number',
          description: 'Document ID',
        },
        format: {
          type: 'string',
          description: 'Format to retrieve (pdf, docx, html)',
          enum: ['pdf', 'docx', 'html'],
          default: 'pdf',
        },
      },
      required: ['document_id'],
    },
  },
  {
    name: 'upload_document_template',
    description: 'Upload a new document template',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        name: {
          type: 'string',
          description: 'Template name',
        },
        category: {
          type: 'string',
          description: 'Template category',
        },
        content: {
          type: 'string',
          description: 'Template content (base64 encoded)',
        },
        content_type: {
          type: 'string',
          description: 'Content type (application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document)',
          enum: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        },
        merge_fields: {
          type: 'array',
          description: 'List of merge field names in the template',
          items: {
            type: 'string',
          },
        },
      },
      required: ['name', 'content', 'content_type'],
    },
  },
  {
    name: 'batch_create_documents',
    description: 'Create multiple documents from templates in batch',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        documents: {
          type: 'array',
          description: 'Array of documents to create',
          items: {
            type: 'object',
            properties: {
              template_id: {
                type: 'number',
                description: 'Template ID',
              },
              matter_id: {
                type: 'number',
                description: 'Matter ID',
              },
              name: {
                type: 'string',
                description: 'Document name',
              },
              merge_fields: {
                type: 'object',
                description: 'Fields to merge',
              },
            },
            required: ['template_id', 'matter_id', 'name'],
          },
        },
      },
      required: ['documents'],
    },
  },
  {
    name: 'send_document_for_signature',
    description: 'Send a document for eSignature',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        document_id: {
          type: 'number',
          description: 'Document ID to send for signature',
        },
        signers: {
          type: 'array',
          description: 'List of signers',
          items: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'Signer email',
              },
              name: {
                type: 'string',
                description: 'Signer name',
              },
              role: {
                type: 'string',
                description: 'Signer role',
              },
            },
            required: ['email', 'name'],
          },
        },
        message: {
          type: 'string',
          description: 'Message to include with signature request',
        },
        due_date: {
          type: 'string',
          description: 'Due date for signatures (YYYY-MM-DD)',
        },
      },
      required: ['document_id', 'signers'],
    },
  },
  {
    name: 'get_signature_status',
    description: 'Check the status of a signature request',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        signature_request_id: {
          type: 'number',
          description: 'Signature request ID',
        },
      },
      required: ['signature_request_id'],
    },
  },
  {
    name: 'get_court_forms',
    description: 'Get available court forms for a jurisdiction',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        jurisdiction: {
          type: 'string',
          description: 'Jurisdiction code (e.g., "NY", "CA")',
        },
        court_type: {
          type: 'string',
          description: 'Type of court (federal, state, immigration)',
          enum: ['federal', 'state', 'immigration'],
        },
        form_category: {
          type: 'string',
          description: 'Category of forms to retrieve',
        },
        search: {
          type: 'string',
          description: 'Search term for form names',
        },
      },
      required: ['jurisdiction'],
    },
  },
  {
    name: 'fill_court_form',
    description: 'Fill a court form with matter and contact data',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        form_id: {
          type: 'number',
          description: 'Court form ID',
        },
        matter_id: {
          type: 'number',
          description: 'Matter ID to pull data from',
        },
        contact_id: {
          type: 'number',
          description: 'Primary contact ID',
        },
        additional_data: {
          type: 'object',
          description: 'Additional data to fill in the form',
        },
        save_to_matter: {
          type: 'boolean',
          description: 'Save completed form to matter documents',
          default: true,
        },
      },
      required: ['form_id', 'matter_id'],
    },
  },
];

// Handler for document automation tools
export async function handleDocumentAutomationTool(name, args, config, makeClioRequest) {
  const accessToken = args.access_token || config.accessToken;

  switch (name) {
    case 'list_document_templates': {
      let endpoint = `/document_templates?limit=${args.limit || 20}`;
      if (args.category) {
        endpoint += `&category=${encodeURIComponent(args.category)}`;
      }
      return await makeClioRequest(endpoint, 'GET', null, accessToken, config);
    }

    case 'create_document_from_template': {
      // First, get matter and contact data
      const [matterData, contactData] = await Promise.all([
        makeClioRequest(`/matters/${args.matter_id}?fields=id,display_number,description,client{name,first_name,last_name,email,phone_numbers,addresses},custom_field_values{field_name,value}`, 'GET', null, accessToken, config),
        args.contact_id ? makeClioRequest(`/contacts/${args.contact_id}?fields=id,name,first_name,last_name,email_addresses,phone_numbers,addresses`, 'GET', null, accessToken, config) : Promise.resolve(null),
      ]);

      // Merge all data
      const mergeData = {
        matter: matterData.data,
        contact: contactData?.data,
        custom: args.merge_fields || {},
      };

      // Create document from template
      const documentData = {
        data: {
          document_template: { id: args.template_id },
          matter: { id: args.matter_id },
          name: args.name,
          merge_data: mergeData,
        },
      };

      if (args.folder_id) {
        documentData.data.folder = { id: args.folder_id };
      }

      return await makeClioRequest('/documents', 'POST', documentData, accessToken, config);
    }

    case 'get_document_content': {
      const format = args.format || 'pdf';
      return await makeClioRequest(`/documents/${args.document_id}/download?format=${format}`, 'GET', null, accessToken, config);
    }

    case 'upload_document_template': {
      const templateData = {
        data: {
          name: args.name,
          content: args.content,
          content_type: args.content_type,
          category: args.category || 'Custom',
          merge_fields: args.merge_fields || [],
        },
      };

      return await makeClioRequest('/document_templates', 'POST', templateData, accessToken, config);
    }

    case 'batch_create_documents': {
      const results = [];
      
      for (const doc of args.documents) {
        try {
          const result = await handleDocumentAutomationTool(
            'create_document_from_template',
            {
              template_id: doc.template_id,
              matter_id: doc.matter_id,
              name: doc.name,
              merge_fields: doc.merge_fields,
              access_token: accessToken,
            },
            config,
            makeClioRequest
          );
          
          results.push({
            status: 'success',
            document: result.data,
            name: doc.name,
          });
        } catch (error) {
          results.push({
            status: 'error',
            error: error.message,
            name: doc.name,
          });
        }
      }
      
      return { results };
    }

    case 'send_document_for_signature': {
      const signatureData = {
        data: {
          document: { id: args.document_id },
          signers: args.signers,
          message: args.message || 'Please sign this document.',
          due_date: args.due_date,
        },
      };

      return await makeClioRequest('/signature_requests', 'POST', signatureData, accessToken, config);
    }

    case 'get_signature_status': {
      return await makeClioRequest(`/signature_requests/${args.signature_request_id}`, 'GET', null, accessToken, config);
    }

    case 'get_court_forms': {
      let endpoint = `/court_forms?jurisdiction=${args.jurisdiction}`;
      if (args.court_type) {
        endpoint += `&court_type=${args.court_type}`;
      }
      if (args.form_category) {
        endpoint += `&category=${encodeURIComponent(args.form_category)}`;
      }
      if (args.search) {
        endpoint += `&search=${encodeURIComponent(args.search)}`;
      }

      return await makeClioRequest(endpoint, 'GET', null, accessToken, config);
    }

    case 'fill_court_form': {
      // Get matter and contact data
      const matterData = await makeClioRequest(
        `/matters/${args.matter_id}?fields=id,display_number,description,client{name,first_name,last_name,email,phone_numbers,addresses},custom_field_values{field_name,value}`,
        'GET',
        null,
        accessToken,
        config
      );

      const formData = {
        data: {
          court_form: { id: args.form_id },
          matter: { id: args.matter_id },
          contact: args.contact_id ? { id: args.contact_id } : null,
          field_mappings: {
            ...matterData.data,
            ...args.additional_data,
          },
          save_to_matter: args.save_to_matter !== false,
        },
      };

      return await makeClioRequest('/court_form_submissions', 'POST', formData, accessToken, config);
    }

    default:
      throw new Error(`Unknown document automation tool: ${name}`);
  }
}