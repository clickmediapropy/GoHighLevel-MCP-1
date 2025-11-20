import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GHLApiClient } from '../clients/ghl-api-client.js';
import { 
  MCPGetKnowledgeBaseParams,
  MCPDeleteKnowledgeBaseParams,
  MCPUpdateKnowledgeBaseParams,
  MCPListKnowledgeBasesParams,
  MCPCreateKnowledgeBaseParams,
  // FAQ Management Parameters
  MCPListKnowledgeBaseFAQsParams,
  MCPCreateKnowledgeBaseFAQParams,
  MCPUpdateKnowledgeBaseFAQParams,
  MCPDeleteKnowledgeBaseFAQParams
} from '../types/ghl-types.js';

export class KnowledgeBaseTools {
  constructor(private apiClient: GHLApiClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'ghl_get_knowledge_base',
        description: 'Get knowledge base by ID with full details including metadata with content counts (FAQs, URLs, rich text, files, web searches, tables).',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'The unique ID of the knowledge base to retrieve'
            }
          },
          required: ['knowledgeBaseId'],
          additionalProperties: false
        }
      },
      {
        name: 'ghl_delete_knowledge_base',
        description: 'Delete a knowledge base permanently. This action cannot be undone.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'The unique ID of the knowledge base to delete'
            }
          },
          required: ['knowledgeBaseId'],
          additionalProperties: false
        }
      },
      {
        name: 'ghl_update_knowledge_base',
        description: 'Update a knowledge base name and/or description.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'The unique ID of the knowledge base to update'
            },
            name: {
              type: 'string',
              description: 'Updated name for the knowledge base'
            },
            description: {
              type: 'string',
              description: 'Updated description for the knowledge base'
            }
          },
          required: ['knowledgeBaseId'],
          additionalProperties: false
        }
      },
      {
        name: 'ghl_list_knowledge_bases',
        description: 'Get all knowledge bases for a location with pagination support. Returns list with activeCount, hasMore status, and optional search filtering.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'The location ID to get knowledge bases for. If not provided, uses the default location from configuration.'
            },
            query: {
              type: 'string',
              description: 'Search query to filter knowledge bases by name'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of knowledge bases to return (default: 20)'
            },
            lastKnowledgeBaseId: {
              type: 'string',
              description: 'ID of the last knowledge base from the previous page (for pagination)'
            }
          },
          additionalProperties: false
        }
      },
      {
        name: 'ghl_create_knowledge_base',
        description: 'Create a new knowledge base. Maximum 15 knowledge bases per location.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the new knowledge base'
            },
            description: {
              type: 'string',
              description: 'Optional description for the knowledge base'
            },
            locationId: {
              type: 'string',
              description: 'The location ID to create the knowledge base in. If not provided, uses the default location from configuration.'
            }
          },
          required: ['name'],
          additionalProperties: false
        }
      },
      {
        name: 'ghl_list_knowledge_base_faqs',
        description: 'Get all FAQs by knowledge base with pagination support. Retrieves FAQs for a knowledge base with cursor-based pagination.',
        inputSchema: {
          type: 'object',
          properties: {
            knowledgeBaseId: {
              type: 'string',
              description: 'Knowledge base ID as string'
            },
            locationId: {
              type: 'string',
              description: 'Location ID as string. If not provided, uses the default location from configuration.'
            },
            limit: {
              type: 'number',
              description: 'Limit the number of FAQs returned (default: 10)'
            },
            lastFaqId: {
              type: 'string',
              description: 'Last FAQ ID for pagination (cursor-based)'
            }
          },
          required: ['knowledgeBaseId'],
          additionalProperties: false
        }
      },
      {
        name: 'ghl_create_knowledge_base_faq',
        description: 'Create a new FAQ inside knowledge base. Add question and answer pairs to enhance the knowledge base content.',
        inputSchema: {
          type: 'object',
          properties: {
            locationId: {
              type: 'string',
              description: 'Location ID as string. If not provided, uses the default location from configuration.'
            },
            question: {
              type: 'string',
              description: 'FAQ question as a string'
            },
            answer: {
              type: 'string',
              description: 'FAQ answer as a string'
            },
            knowledgeBaseId: {
              type: 'string',
              description: 'Knowledge base ID as string'
            }
          },
          required: ['question', 'answer', 'knowledgeBaseId'],
          additionalProperties: false
        }
      },
      {
        name: 'ghl_update_knowledge_base_faq',
        description: 'Update an existing knowledge base FAQ. Modify the question and/or answer of an existing FAQ.',
        inputSchema: {
          type: 'object',
          properties: {
            faqId: {
              type: 'string',
              description: 'FAQ ID as string'
            },
            question: {
              type: 'string',
              description: 'Updated FAQ question as a string'
            },
            answer: {
              type: 'string',
              description: 'Updated FAQ answer as a string'
            }
          },
          required: ['faqId', 'question', 'answer'],
          additionalProperties: false
        }
      },
      {
        name: 'ghl_delete_knowledge_base_faq',
        description: 'Delete an existing knowledge base FAQ. Permanently remove a question-answer pair from the knowledge base.',
        inputSchema: {
          type: 'object',
          properties: {
            faqId: {
              type: 'string',
              description: 'FAQ ID as string'
            }
          },
          required: ['faqId'],
          additionalProperties: false
        }
      }
    ];
  }

  async executeKnowledgeBaseTool(name: string, params: any): Promise<any> {
    try {
      switch (name) {
        case 'ghl_get_knowledge_base':
          return await this.getKnowledgeBase(params as MCPGetKnowledgeBaseParams);
        
        case 'ghl_delete_knowledge_base':
          return await this.deleteKnowledgeBase(params as MCPDeleteKnowledgeBaseParams);
          
        case 'ghl_update_knowledge_base':
          return await this.updateKnowledgeBase(params as MCPUpdateKnowledgeBaseParams);
          
        case 'ghl_list_knowledge_bases':
          return await this.listKnowledgeBases(params as MCPListKnowledgeBasesParams);
          
        case 'ghl_create_knowledge_base':
          return await this.createKnowledgeBase(params as MCPCreateKnowledgeBaseParams);
        
        case 'ghl_list_knowledge_base_faqs':
          return await this.listKnowledgeBaseFAQs(params as MCPListKnowledgeBaseFAQsParams);
          
        case 'ghl_create_knowledge_base_faq':
          return await this.createKnowledgeBaseFAQ(params as MCPCreateKnowledgeBaseFAQParams);
          
        case 'ghl_update_knowledge_base_faq':
          return await this.updateKnowledgeBaseFAQ(params as MCPUpdateKnowledgeBaseFAQParams);
          
        case 'ghl_delete_knowledge_base_faq':
          return await this.deleteKnowledgeBaseFAQ(params as MCPDeleteKnowledgeBaseFAQParams);
        
        default:
          throw new Error(`Unknown knowledge base tool: ${name}`);
      }
    } catch (error) {
      console.error(`Error executing knowledge base tool ${name}:`, error);
      throw error;
    }
  }

  // ===== KNOWLEDGE BASE MANAGEMENT TOOLS =====

  /**
   * Get knowledge base by ID
   */
  private async getKnowledgeBase(params: MCPGetKnowledgeBaseParams): Promise<any> {
    try {
      const result = await this.apiClient.getKnowledgeBase(params.knowledgeBaseId);

      if (!result.success || !result.data) {
        throw new Error(`Failed to get knowledge base: ${result.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        knowledgeBase: result.data,
        message: `Successfully retrieved knowledge base: ${result.data.name}`,
        metadata: {
          contentCounts: result.data.kbMetadata,
          totalContent: Object.values(result.data.kbMetadata).reduce((a, b) => a + b, 0),
          isDefault: result.data.isDefault || false,
          deleted: result.data.deleted
        }
      };
    } catch (error) {
      console.error('Error getting knowledge base:', error);
      throw new Error(`Failed to get knowledge base: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a knowledge base
   */
  private async deleteKnowledgeBase(params: MCPDeleteKnowledgeBaseParams): Promise<any> {
    try {
      const result = await this.apiClient.deleteKnowledgeBase(params.knowledgeBaseId);

      if (!result.success || !result.data) {
        throw new Error(`Failed to delete knowledge base: ${result.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        message: `Successfully deleted knowledge base with ID: ${params.knowledgeBaseId}`,
        deletedId: params.knowledgeBaseId
      };
    } catch (error) {
      console.error('Error deleting knowledge base:', error);
      throw new Error(`Failed to delete knowledge base: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update a knowledge base
   */
  private async updateKnowledgeBase(params: MCPUpdateKnowledgeBaseParams): Promise<any> {
    try {
      const updateData: any = {};
      if (params.name) updateData.name = params.name;
      if (params.description) updateData.description = params.description;

      if (Object.keys(updateData).length === 0) {
        throw new Error('At least one field (name or description) must be provided for update');
      }

      const result = await this.apiClient.updateKnowledgeBase(params.knowledgeBaseId, updateData);

      if (!result.success || !result.data) {
        throw new Error(`Failed to update knowledge base: ${result.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        message: `Successfully updated knowledge base with ID: ${params.knowledgeBaseId}`,
        updatedFields: updateData,
        knowledgeBaseId: params.knowledgeBaseId
      };
    } catch (error) {
      console.error('Error updating knowledge base:', error);
      throw new Error(`Failed to update knowledge base: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List all knowledge bases for a location (paginated)
   */
  private async listKnowledgeBases(params: MCPListKnowledgeBasesParams): Promise<any> {
    try {
      const result = await this.apiClient.listKnowledgeBases({
        locationId: params.locationId || '',
        query: params.query,
        limit: params.limit,
        lastKnowledgeBaseId: params.lastKnowledgeBaseId
      });

      if (!result.success || !result.data) {
        throw new Error(`Failed to list knowledge bases: ${result.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        knowledgeBases: result.data.knowledgeBases,
        totalCount: result.data.activeCount,
        hasMore: result.data.hasMore,
        lastKnowledgeBaseId: result.data.lastKnowledgeBaseId,
        message: `Successfully retrieved ${result.data.knowledgeBases.length} knowledge bases out of ${result.data.activeCount} total`,
        metadata: {
          currentPage: result.data.knowledgeBases.length,
          totalActive: result.data.activeCount,
          hasMorePages: result.data.hasMore,
          searchQuery: params.query
        }
      };
    } catch (error) {
      console.error('Error listing knowledge bases:', error);
      throw new Error(`Failed to list knowledge bases: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new knowledge base
   */
  private async createKnowledgeBase(params: MCPCreateKnowledgeBaseParams): Promise<any> {
    try {
      const result = await this.apiClient.createKnowledgeBase({
        name: params.name,
        description: params.description,
        locationId: params.locationId || ''
      });

      if (!result.success || !result.data) {
        throw new Error(`Failed to create knowledge base: ${result.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        knowledgeBase: result.data,
        message: `Successfully created knowledge base: ${result.data.name}`,
        metadata: {
          id: result.data.id,
          name: result.data.name,
          locationId: result.data.locationId,
          createdAt: result.data.createdAt,
          hasDescription: !!params.description,
          remainingSlots: 'Unknown (max 15 per location)'
        }
      };
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      
      // Check for common error scenarios
      if (error instanceof Error) {
        if (error.message.includes('limit') || error.message.includes('maximum')) {
          throw new Error('Failed to create knowledge base: Maximum limit of 15 knowledge bases per location has been reached');
        }
      }
      
      throw new Error(`Failed to create knowledge base: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ===== KNOWLEDGE BASE FAQ MANAGEMENT TOOLS =====

  /**
   * List all FAQs by knowledge base with pagination support
   */
  private async listKnowledgeBaseFAQs(params: MCPListKnowledgeBaseFAQsParams): Promise<any> {
    try {
      const result = await this.apiClient.listKnowledgeBaseFAQs({
        knowledgeBaseId: params.knowledgeBaseId,
        locationId: params.locationId || '',
        limit: params.limit,
        lastFaqId: params.lastFaqId
      });

      if (!result.success || !result.data) {
        throw new Error(`Failed to list knowledge base FAQs: ${result.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        faqs: result.data.faqs,
        totalCount: result.data.count,
        lastFaqId: result.data.lastFaqId,
        hasMore: result.data.hasMore,
        message: `Successfully retrieved ${result.data.faqs.length} FAQs out of ${result.data.count} total`,
        metadata: {
          currentPage: result.data.faqs.length,
          totalCount: result.data.count,
          hasMorePages: result.data.hasMore,
          knowledgeBaseId: params.knowledgeBaseId
        }
      };
    } catch (error) {
      console.error('Error listing knowledge base FAQs:', error);
      throw new Error(`Failed to list knowledge base FAQs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new FAQ inside knowledge base
   */
  private async createKnowledgeBaseFAQ(params: MCPCreateKnowledgeBaseFAQParams): Promise<any> {
    try {
      const result = await this.apiClient.createKnowledgeBaseFAQ({
        locationId: params.locationId || '',
        question: params.question,
        answer: params.answer,
        knowledgeBaseId: params.knowledgeBaseId
      });

      if (!result.success || !result.data) {
        throw new Error(`Failed to create knowledge base FAQ: ${result.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        faq: result.data.faq,
        message: `Successfully created FAQ: "${result.data.faq.question}"`,
        metadata: {
          id: result.data.faq.id,
          question: result.data.faq.question,
          knowledgeBaseId: result.data.faq.knowledgeBaseId,
          locationId: result.data.faq.locationId,
          createdAt: result.data.faq.createdAt
        }
      };
    } catch (error) {
      console.error('Error creating knowledge base FAQ:', error);
      throw new Error(`Failed to create knowledge base FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing knowledge base FAQ
   */
  private async updateKnowledgeBaseFAQ(params: MCPUpdateKnowledgeBaseFAQParams): Promise<any> {
    try {
      const result = await this.apiClient.updateKnowledgeBaseFAQ(params.faqId, {
        question: params.question,
        answer: params.answer
      });

      if (!result.success || !result.data) {
        throw new Error(`Failed to update knowledge base FAQ: ${result.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        message: `Successfully updated FAQ with ID: ${params.faqId}`,
        updatedFields: {
          question: params.question,
          answer: params.answer
        },
        faqId: params.faqId
      };
    } catch (error) {
      console.error('Error updating knowledge base FAQ:', error);
      throw new Error(`Failed to update knowledge base FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an existing knowledge base FAQ
   */
  private async deleteKnowledgeBaseFAQ(params: MCPDeleteKnowledgeBaseFAQParams): Promise<any> {
    try {
      const result = await this.apiClient.deleteKnowledgeBaseFAQ(params.faqId);

      if (!result.success || !result.data) {
        throw new Error(`Failed to delete knowledge base FAQ: ${result.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        message: `Successfully deleted FAQ with ID: ${params.faqId}`,
        deletedId: params.faqId
      };
    } catch (error) {
      console.error('Error deleting knowledge base FAQ:', error);
      throw new Error(`Failed to delete knowledge base FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Helper function to check if a tool name belongs to knowledge base tools
export function isKnowledgeBaseTool(toolName: string): boolean {
  const knowledgeBaseToolNames = [
    'ghl_get_knowledge_base',
    'ghl_delete_knowledge_base',
    'ghl_update_knowledge_base',
    'ghl_list_knowledge_bases',
    'ghl_create_knowledge_base',
    'ghl_list_knowledge_base_faqs',
    'ghl_create_knowledge_base_faq',
    'ghl_update_knowledge_base_faq',
    'ghl_delete_knowledge_base_faq'
  ];
  
  return knowledgeBaseToolNames.includes(toolName);
}