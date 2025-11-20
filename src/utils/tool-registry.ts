import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Logger } from './logger.js';

export type ToolExecutor = (toolName: string, args: Record<string, unknown>) => Promise<any>;

export interface ToolProvider {
  category: string;
  definitions: Tool[];
  execute: ToolExecutor;
}

interface CategorySummary {
  category: string;
  count: number;
}

export class ToolRegistry {
  private readonly registry = new Map<string, (args: Record<string, unknown>) => Promise<any>>();
  private readonly categories = new Map<string, string>();
  private readonly definitions: Tool[] = [];
  private readonly summary: CategorySummary[] = [];

  constructor(private readonly logger: Logger, providers: ToolProvider[]) {
    providers.forEach((provider) => {
      let registeredCount = 0;

      provider.definitions.forEach((tool) => {
        if (this.registry.has(tool.name)) {
          const existingCategory = this.categories.get(tool.name);
          this.logger.warn('Duplicate tool registration detected; skipping', {
            tool: tool.name,
            existingCategory,
            newCategory: provider.category,
          });
          return;
        }

        this.registry.set(tool.name, (args) => provider.execute(tool.name, args));
        this.categories.set(tool.name, provider.category);
        this.definitions.push(tool);
        registeredCount += 1;
      });

      this.summary.push({ category: provider.category, count: registeredCount });
    });
  }

  getDefinitions(): Tool[] {
    return this.definitions;
  }

  getCategory(toolName: string): string | undefined {
    return this.categories.get(toolName);
  }

  getSummary(): CategorySummary[] {
    return this.summary;
  }

  async invoke(toolName: string, args: Record<string, unknown>): Promise<any> {
    const executor = this.registry.get(toolName);

    if (!executor) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    return executor(args);
  }
}
