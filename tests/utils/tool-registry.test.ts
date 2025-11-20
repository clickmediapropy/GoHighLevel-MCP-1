import { describe, it, expect, beforeEach } from '@jest/globals';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolRegistry, ToolProvider } from '../../src/utils/tool-registry.js';
import { createLogger } from '../../src/utils/logger.js';

describe('ToolRegistry', () => {
  let providers: ToolProvider[];
  let sampleTool: Tool;

  beforeEach(() => {
    sampleTool = {
      name: 'sample_tool',
      description: 'Sample tool for testing',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    };

    providers = [
      {
        category: 'CategoryA',
        definitions: [sampleTool],
        execute: async (_toolName, args) => ({ args }),
      },
      {
        category: 'CategoryB',
        definitions: [
          {
            name: 'other_tool',
            description: 'Other tool',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
          },
        ],
        execute: async () => ({ ok: true }),
      },
    ];
  });

  it('registers tools and exposes definitions', () => {
    const registry = new ToolRegistry(createLogger('ToolRegistryTest'), providers);

    const definitions = registry.getDefinitions();
    expect(definitions).toHaveLength(2);
    expect(definitions.map((tool) => tool.name)).toEqual(expect.arrayContaining(['sample_tool', 'other_tool']));
  });

  it('invokes registered tools', async () => {
    const registry = new ToolRegistry(createLogger('ToolRegistryTest'), providers);

    const result = await registry.invoke('sample_tool', { input: 123 });
    expect(result).toEqual({ args: { input: 123 } });
  });

  it('throws on unknown tool', async () => {
    const registry = new ToolRegistry(createLogger('ToolRegistryTest'), providers);

    await expect(registry.invoke('missing_tool', {})).rejects.toThrow('Unknown tool: missing_tool');
  });

  it('summarizes categories', () => {
    const registry = new ToolRegistry(createLogger('ToolRegistryTest'), providers);

    const summary = registry.getSummary();
    expect(summary).toEqual([
      { category: 'CategoryA', count: 1 },
      { category: 'CategoryB', count: 1 },
    ]);
  });

  it('skips duplicate tool registrations', () => {
    const duplicateProviders: ToolProvider[] = [
      providers[0],
      {
        category: 'CategoryB',
        definitions: [sampleTool],
        execute: async () => ({ duplicate: true }),
      },
    ];

    const registry = new ToolRegistry(createLogger('ToolRegistryTest'), duplicateProviders);
    const definitions = registry.getDefinitions();
    expect(definitions).toHaveLength(1);
  });
});
