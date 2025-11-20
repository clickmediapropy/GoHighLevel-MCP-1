# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GoHighLevel MCP (Model Context Protocol) Server that provides comprehensive API integration with GoHighLevel CRM. The server exposes 269+ tools across 19 categories for contact management, messaging, opportunities, calendar, payments, invoices, and more.

## Common Development Commands

### Build and Development
```bash
npm run build          # TypeScript compilation to dist/
npm run dev            # Development server with hot reload (nodemon + ts-node)
npm start              # Production HTTP server (dist/http-server.js)
npm run start:stdio    # CLI MCP server for Claude Desktop (dist/server.js)
npm run start:http     # HTTP MCP server for web apps
```

### Testing
```bash
npm test               # Run Jest test suite
npm run test:watch     # Watch mode testing
npm run test:coverage  # Generate coverage reports
npm run lint           # TypeScript type checking (tsc --noEmit)
```

## Architecture Overview

### Core Components

**MCP Server Implementation:**
- `src/server.ts` - Main CLI MCP server for Claude Desktop integration
- `src/http-server.ts` - HTTP MCP server for web applications with Express.js and CORS

**API Client:**
- `src/clients/ghl-api-client.ts` - Central GoHighLevel API client with axios
- Implements exact OpenAPI specifications (v2021-07-28 for Contacts, v2021-04-15 for Conversations)
- Handles authentication, rate limiting, and error recovery

**Tool Organization:**
Tools are modularized by functionality in `src/tools/`:
- `contact-tools.ts` - Contact management (31 tools)
- `conversation-tools.ts` - Messaging and conversations (20 tools)
- `opportunity-tools.ts` - Sales pipeline management (10 tools)
- `calendar-tools.ts` - Appointments and scheduling (14 tools)
- `blog-tools.ts` - Blog content management (7 tools)
- `email-tools.ts` - Email marketing (5 tools)
- `location-tools.ts` - Location and sub-account management (24 tools)
- `social-media-tools.ts` - Social media posting (17 tools)
- `payments-tools.ts` - Payment processing (20 tools)
- `invoices-tools.ts` - Invoicing and billing (39 tools)
- Additional specialized tools for media, custom objects, workflows, surveys, and e-commerce

**Type Definitions:**
- `src/types/ghl-types.ts` - Comprehensive TypeScript definitions for all GoHighLevel API endpoints

### Environment Configuration

Required environment variables:
```bash
GHL_API_KEY=your_private_integrations_api_key  # Must be Private Integrations API key, not regular API key
GHL_BASE_URL=https://services.leadconnectorhq.com
GHL_LOCATION_ID=your_location_id_here
NODE_ENV=production
```

### Testing Infrastructure

- Jest configuration with TypeScript support in `jest.config.js`
- Test files in `tests/` directory with `*.test.ts` pattern
- Coverage threshold: 70% for branches, functions, lines, and statements
- Mock implementations in `tests/mocks/`
- Test categories: unit tests for clients and tools

### TypeScript Configuration

- Target: ES2022 with NodeNext module resolution
- Strict mode enabled with isolated modules
- Output directory: `./dist`
- Excludes tests from compilation but includes type checking

### Deployment Options

- **Vercel** (recommended): Zero-config with `vercel.json` configuration
- **Railway**: Simple deployment with `railway.json` and `Procfile`
- **Docker**: Container support with `Dockerfile`
- **Local**: Direct Node.js execution

### Development Patterns

**Error Handling:**
- Comprehensive error recovery in API client
- MCP error responses with proper error codes
- Type-safe error handling throughout

**Tool Implementation:**
- Each tool category is a class with methods corresponding to API endpoints
- Consistent parameter validation and response formatting
- Integration with GHLApiClient for actual API calls

**MCP Integration:**
- Server handles both STDIO transport (Claude Desktop) and HTTP transport (web apps)
- Tool registration and discovery through MCP protocol
- Proper request/response schemas with validation

## Important Notes

- **API Authentication**: This project requires GoHighLevel Private Integrations API keys, not regular API keys
- **Rate Limiting**: GoHighLevel API has rate limits - implement proper backoff strategies
- **Scope Requirements**: Private Integration must have appropriate scopes enabled for tools to function
- **Security**: Never commit API keys - use environment variables only