/**
 * Custom field management tools for Clio MCP Server
 */

export const customFieldTools = [
  {
    name: 'update_custom_field',
    description: 'Update a custom field value for a matter or contact',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        custom_field_value_id: {
          type: 'number',
          description: 'ID of the custom field value to update',
        },
        value: {
          type: 'string',
          description: 'New value for the custom field',
        },
      },
      required: ['custom_field_value_id', 'value'],
    },
  },
  {
    name: 'create_custom_field_value',
    description: 'Create a new custom field value for a matter or contact',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        custom_field_id: {
          type: 'number',
          description: 'ID of the custom field definition',
        },
        parent_id: {
          type: 'number',
          description: 'ID of the parent (matter or contact)',
        },
        parent_type: {
          type: 'string',
          description: 'Type of parent (Matter or Contact)',
          enum: ['Matter', 'Contact'],
        },
        value: {
          type: 'string',
          description: 'Value for the custom field',
        },
      },
      required: ['custom_field_id', 'parent_id', 'parent_type', 'value'],
    },
  },
  {
    name: 'get_matter_with_custom_fields',
    description: 'Get a matter with all its custom field values',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        matter_id: {
          type: 'number',
          description: 'Matter ID',
        },
      },
      required: ['matter_id'],
    },
  },
  {
    name: 'bulk_update_custom_fields',
    description: 'Update multiple custom fields for a matter at once',
    inputSchema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Clio API access token (optional if configured)',
        },
        matter_id: {
          type: 'number',
          description: 'Matter ID',
        },
        updates: {
          type: 'array',
          description: 'Array of field updates',
          items: {
            type: 'object',
            properties: {
              field_name: {
                type: 'string',
                description: 'Name of the custom field',
              },
              value: {
                type: 'string',
                description: 'New value',
              },
            },
            required: ['field_name', 'value'],
          },
        },
      },
      required: ['matter_id', 'updates'],
    },
  },
];

// Handler for custom field tools
export async function handleCustomFieldTool(name, args, config, makeClioRequest) {
  const accessToken = args.access_token || config.accessToken;

  switch (name) {
    case 'update_custom_field': {
      const updateData = {
        data: {
          value: args.value,
        },
      };
      
      return await makeClioRequest(
        `/custom_field_values/${args.custom_field_value_id}`,
        'PATCH',
        updateData,
        accessToken,
        config
      );
    }

    case 'create_custom_field_value': {
      const createData = {
        data: {
          custom_field: { id: args.custom_field_id },
          parent: { id: args.parent_id, type: args.parent_type },
          value: args.value,
        },
      };
      
      return await makeClioRequest(
        '/custom_field_values',
        'POST',
        createData,
        accessToken,
        config
      );
    }

    case 'get_matter_with_custom_fields': {
      return await makeClioRequest(
        `/matters/${args.matter_id}?fields=id,display_number,description,client{name},custom_field_values{id,field_name,value,custom_field{id,field_type}}`,
        'GET',
        null,
        accessToken,
        config
      );
    }

    case 'bulk_update_custom_fields': {
      // First get the matter with custom fields
      const matter = await makeClioRequest(
        `/matters/${args.matter_id}?fields=custom_field_values{id,field_name,value}`,
        'GET',
        null,
        accessToken,
        config
      );

      const results = [];
      
      // Process each update
      for (const update of args.updates) {
        const customFieldValue = matter.data.custom_field_values.find(
          cfv => cfv.field_name === update.field_name
        );
        
        if (customFieldValue) {
          // Update existing value
          try {
            const result = await makeClioRequest(
              `/custom_field_values/${customFieldValue.id}`,
              'PATCH',
              { data: { value: update.value } },
              accessToken,
              config
            );
            results.push({
              field_name: update.field_name,
              status: 'updated',
              value: result.data.value,
            });
          } catch (error) {
            results.push({
              field_name: update.field_name,
              status: 'error',
              error: error.message,
            });
          }
        } else {
          // Need to create - first get the custom field definition
          const customFields = await makeClioRequest(
            `/custom_fields?parent_type=Matter&fields=id,name`,
            'GET',
            null,
            accessToken,
            config
          );
          
          const fieldDef = customFields.data.find(cf => cf.name === update.field_name);
          
          if (fieldDef) {
            try {
              const result = await makeClioRequest(
                '/custom_field_values',
                'POST',
                {
                  data: {
                    custom_field: { id: fieldDef.id },
                    parent: { id: args.matter_id, type: 'Matter' },
                    value: update.value,
                  },
                },
                accessToken,
                config
              );
              results.push({
                field_name: update.field_name,
                status: 'created',
                value: result.data.value,
              });
            } catch (error) {
              results.push({
                field_name: update.field_name,
                status: 'error',
                error: error.message,
              });
            }
          } else {
            results.push({
              field_name: update.field_name,
              status: 'error',
              error: 'Custom field not found',
            });
          }
        }
      }
      
      return { results };
    }

    default:
      throw new Error(`Unknown custom field tool: ${name}`);
  }
}