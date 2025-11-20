/**
 * GoHighLevel MCP Server
 * Main entry point for the Model Context Protocol server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';

import { GHLApiClient } from './clients/ghl-api-client.js';
import { ContactTools } from './tools/contact-tools.js';
import { ConversationTools } from './tools/conversation-tools.js';
import { BlogTools } from './tools/blog-tools.js';
import { OpportunityTools } from './tools/opportunity-tools.js';
import { CalendarTools } from './tools/calendar-tools.js';
import { EmailTools } from './tools/email-tools.js';
import { LocationTools } from './tools/location-tools.js';
import { EmailISVTools } from './tools/email-isv-tools.js';
import { MediaTools } from './tools/media-tools.js';
import { ObjectTools } from './tools/object-tools.js';
import { AssociationTools } from './tools/association-tools.js';
import { CustomFieldV2Tools } from './tools/custom-field-v2-tools.js';
import { WorkflowTools } from './tools/workflow-tools.js';
import { SurveyTools } from './tools/survey-tools.js';
import { StoreTools } from './tools/store-tools.js';
import { ProductsTools } from './tools/products-tools.js';
import { PaymentsTools } from './tools/payments-tools.js';
import { InvoicesTools } from './tools/invoices-tools.js';
import { KnowledgeBaseTools } from './tools/knowledge-base-tools.js';
import { createLogger, Logger } from './utils/logger.js';
import { loadGHLConfig } from './utils/config.js';
import { ToolRegistry, ToolProvider } from './utils/tool-registry.js';

dotenv.config();

/**
 * Main MCP Server class
 */
class GHLMCPServer {
  private readonly logger: Logger;
  private readonly server: Server;
  private readonly ghlClient: GHLApiClient;

  private readonly contactTools: ContactTools;
  private readonly conversationTools: ConversationTools;
  private readonly blogTools: BlogTools;
  private readonly opportunityTools: OpportunityTools;
  private readonly calendarTools: CalendarTools;
  private readonly emailTools: EmailTools;
  private readonly locationTools: LocationTools;
  private readonly emailISVTools: EmailISVTools;
  private readonly mediaTools: MediaTools;
  private readonly objectTools: ObjectTools;
  private readonly associationTools: AssociationTools;
  private readonly customFieldV2Tools: CustomFieldV2Tools;
  private readonly workflowTools: WorkflowTools;
  private readonly surveyTools: SurveyTools;
  private readonly storeTools: StoreTools;
  private readonly productsTools: ProductsTools;
  private readonly paymentsTools: PaymentsTools;
  private readonly invoicesTools: InvoicesTools;
  private readonly knowledgeBaseTools: KnowledgeBaseTools;

  private readonly toolProviders: ToolProvider[];
  private readonly toolRegistry: ToolRegistry;

  constructor(logger?: Logger) {
    this.logger = logger ?? createLogger('GHLMCPServer');

    this.server = new Server(
      {
        name: 'ghl-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.ghlClient = this.initializeGHLClient();

    // Initialize tools
    this.contactTools = new ContactTools(this.ghlClient);
    this.conversationTools = new ConversationTools(this.ghlClient);
    this.blogTools = new BlogTools(this.ghlClient);
    this.opportunityTools = new OpportunityTools(this.ghlClient);
    this.calendarTools = new CalendarTools(this.ghlClient);
    this.emailTools = new EmailTools(this.ghlClient);
    this.locationTools = new LocationTools(this.ghlClient);
    this.emailISVTools = new EmailISVTools(this.ghlClient);
    this.mediaTools = new MediaTools(this.ghlClient);
    this.objectTools = new ObjectTools(this.ghlClient);
    this.associationTools = new AssociationTools(this.ghlClient);
    this.customFieldV2Tools = new CustomFieldV2Tools(this.ghlClient);
    this.workflowTools = new WorkflowTools(this.ghlClient);
    this.surveyTools = new SurveyTools(this.ghlClient);
    this.storeTools = new StoreTools(this.ghlClient);
    this.productsTools = new ProductsTools(this.ghlClient);
    this.paymentsTools = new PaymentsTools(this.ghlClient);
    this.invoicesTools = new InvoicesTools(this.ghlClient);
    this.knowledgeBaseTools = new KnowledgeBaseTools(this.ghlClient);

    this.toolProviders = this.buildToolProviders();
    this.toolRegistry = new ToolRegistry(this.logger.child('ToolRegistry'), this.toolProviders);
    this.logToolSummary();

    this.setupHandlers();
  }

  /**
   * Initialize GoHighLevel API client with configuration
   */
  private initializeGHLClient(): GHLApiClient {
    const config = loadGHLConfig({ logger: this.logger.child('Config') });

    this.logger.info('Initializing GoHighLevel API client', {
      baseUrl: config.baseUrl,
      version: config.version,
      locationId: config.locationId,
    });

    return new GHLApiClient(config, this.logger.child('ApiClient'));
  }

  private buildToolProviders(): ToolProvider[] {
    return [
      {
        category: 'Contact Management',
        definitions: this.contactTools.getToolDefinitions(),
        execute: (toolName, args) => this.contactTools.executeTool(toolName, args),
      },
      {
        category: 'Conversations',
        definitions: this.conversationTools.getToolDefinitions(),
        execute: (toolName, args) => this.conversationTools.executeTool(toolName, args),
      },
      {
        category: 'Blogs',
        definitions: this.blogTools.getToolDefinitions(),
        execute: (toolName, args) => this.blogTools.executeTool(toolName, args),
      },
      {
        category: 'Opportunities',
        definitions: this.opportunityTools.getToolDefinitions(),
        execute: (toolName, args) => this.opportunityTools.executeTool(toolName, args),
      },
      {
        category: 'Calendars',
        definitions: this.calendarTools.getToolDefinitions(),
        execute: (toolName, args) => this.calendarTools.executeTool(toolName, args),
      },
      {
        category: 'Email Marketing',
        definitions: this.emailTools.getToolDefinitions(),
        execute: (toolName, args) => this.emailTools.executeTool(toolName, args),
      },
      {
        category: 'Locations',
        definitions: this.locationTools.getToolDefinitions(),
        execute: (toolName, args) => this.locationTools.executeTool(toolName, args),
      },
      {
        category: 'Email Verification',
        definitions: this.emailISVTools.getToolDefinitions(),
        execute: (toolName, args) => this.emailISVTools.executeTool(toolName, args),
      },
      {
        category: 'Media Library',
        definitions: this.mediaTools.getToolDefinitions(),
        execute: (toolName, args) => this.mediaTools.executeTool(toolName, args),
      },
      {
        category: 'Custom Objects',
        definitions: this.objectTools.getToolDefinitions(),
        execute: (toolName, args) => this.objectTools.executeTool(toolName, args),
      },
      {
        category: 'Associations',
        definitions: this.associationTools.getTools(),
        execute: (toolName, args) => this.associationTools.executeAssociationTool(toolName, args),
      },
      {
        category: 'Custom Fields V2',
        definitions: this.customFieldV2Tools.getTools(),
        execute: (toolName, args) => this.customFieldV2Tools.executeCustomFieldV2Tool(toolName, args),
      },
      {
        category: 'Workflows',
        definitions: this.workflowTools.getTools(),
        execute: (toolName, args) => this.workflowTools.executeWorkflowTool(toolName, args),
      },
      {
        category: 'Surveys',
        definitions: this.surveyTools.getTools(),
        execute: (toolName, args) => this.surveyTools.executeSurveyTool(toolName, args),
      },
      {
        category: 'Storefront',
        definitions: this.storeTools.getTools(),
        execute: (toolName, args) => this.storeTools.executeStoreTool(toolName, args),
      },
      {
        category: 'Products',
        definitions: this.productsTools.getTools(),
        execute: (toolName, args) => this.productsTools.executeProductsTool(toolName, args),
      },
      {
        category: 'Payments',
        definitions: this.paymentsTools.getTools(),
        execute: (toolName, args) => this.paymentsTools.handleToolCall(toolName, args),
      },
      {
        category: 'Invoices',
        definitions: this.invoicesTools.getTools(),
        execute: (toolName, args) => this.invoicesTools.handleToolCall(toolName, args),
      },
      {
        category: 'Knowledge Base',
        definitions: this.knowledgeBaseTools.getTools(),
        execute: (toolName, args) => this.knowledgeBaseTools.executeKnowledgeBaseTool(toolName, args),
      },
    ];
  }

  /**
   * Setup MCP request handlers
   */
  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = this.toolRegistry.getDefinitions();
      this.logger.debug('Listing available tools', { count: tools.length });
      return {
        tools,
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      this.logger.debug('Executing tool', {
        tool: name,
        category: this.toolRegistry.getCategory(name) ?? 'unknown',
      });

      try {
        const result = await this.toolRegistry.invoke(name, args ?? {});
        this.logger.debug('Tool executed successfully', { tool: name });

        return {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.startsWith('Unknown tool')) {
          throw new McpError(ErrorCode.InvalidRequest, message);
        }

        this.logger.error('Tool execution failed', {
          tool: name,
          category: this.toolRegistry.getCategory(name) ?? 'unknown',
          error: message,
        });

        const errorCode = message.includes('404') ? ErrorCode.InvalidRequest : ErrorCode.InternalError;
        throw new McpError(errorCode, `Tool execution failed: ${message}`);
      }
    });

    this.logger.debug('Request handlers registered');
  }

  private logToolSummary(): void {
    const definitions = this.toolRegistry.getDefinitions();
    const categories = this.toolRegistry.getSummary();

    this.logger.info('Tool registry initialized', {
      totalTools: definitions.length,
      categories,
    });
  }

  /**
   * Test GHL API connection
   */
  private async testGHLConnection(): Promise<void> {
    try {
      this.logger.info('Testing GoHighLevel API connectivity');
      const result = await this.ghlClient.testConnection();
      this.logger.info('GoHighLevel API connection established', {
        locationId: result.data?.locationId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn('GoHighLevel API connection failed', { error: message });
      throw new Error(`Failed to connect to GHL API: ${message}`);
    }
  }

  /**
   * Initialize and start the MCP server
   */
  async start(): Promise<void> {
    this.logger.info('Starting GoHighLevel MCP Server');

    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      this.logger.info('GoHighLevel MCP Server is ready', {
        toolCount: this.toolRegistry.getDefinitions().length,
      });

      // Test API connection in background without blocking MCP initialization
      this.testGHLConnectionAsync().catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.warn('GoHighLevel API connectivity check failed', { error: message });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to start GoHighLevel MCP Server', { error: message });
      process.exit(1);
    }
  }

  /**
   * Test GHL API connection asynchronously (non-blocking)
   */
  private async testGHLConnectionAsync(): Promise<void> {
    try {
      this.logger.info('Testing GoHighLevel API connectivity');
      await this.testGHLConnection();
      this.logger.info('GoHighLevel API connection verified');
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Handle graceful shutdown
 */
function setupGracefulShutdown(logger: Logger): void {
  const shutdown = (signal: string) => {
    logger.info('Received shutdown signal, exiting', { signal });
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const rootLogger = createLogger('GHLMCPServer');

  try {
    setupGracefulShutdown(rootLogger.child('Shutdown'));

    const server = new GHLMCPServer(rootLogger);
    await server.start();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    rootLogger.error('Fatal error starting GHLMCPServer', { error: message });
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  const rootLogger = createLogger('GHLMCPServer');
  const message = error instanceof Error ? error.message : String(error);
  rootLogger.error('Unhandled error in GHLMCPServer', { error: message });
  process.exit(1);
});
