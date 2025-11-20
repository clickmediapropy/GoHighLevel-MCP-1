import { describe, it, expect, beforeEach } from '@jest/globals';
import { PaymentsTools } from '../../src/tools/payments-tools.js';

describe('PaymentsTools', () => {
  let mockClient: any;
  let paymentsTools: PaymentsTools;

  beforeEach(() => {
    mockClient = {
      listOrders: jest.fn().mockResolvedValue({ data: [] }),
      createCoupon: jest.fn().mockResolvedValue({ data: { id: 'coupon_123' } }),
    };

    paymentsTools = new PaymentsTools(mockClient);
  });

  it('delegates list_orders to the API client', async () => {
    const args = { altId: 'loc_123', altType: 'location' };
    await paymentsTools.handleToolCall('list_orders', args);

    expect(mockClient.listOrders).toHaveBeenCalledWith(args);
  });

  it('delegates create_coupon to the API client', async () => {
    const args = { code: 'SAVE10', discountType: 'percentage', discount: 10 };
    await paymentsTools.handleToolCall('create_coupon', args as any);

    expect(mockClient.createCoupon).toHaveBeenCalledWith(args);
  });

  it('throws an error for unknown tools', async () => {
    await expect(paymentsTools.handleToolCall('unknown_tool', {})).rejects.toThrow('Unknown tool: unknown_tool');
  });
});
