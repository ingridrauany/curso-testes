import { buildError, buildOrders, buildUser } from 'test/builders';
import { StatusCodes } from 'http-status-codes';
import { Order } from '@/database/models/order.model';
import { logger } from '@/utils';
import { listOrders, saveOrder } from './orders.service';

jest.mock('@/database/models/order.model');
jest.mock('@/utils/logger');
JSON.parse = jest.fn();

describe('Service > Orders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return a list of orders', async () => {
    const user = buildUser();
    const where = {
      userid: user.id,
    };
    const orders = buildOrders().map(order => {
      order.products = JSON.stringify(order.products);
      return order;
    });

    jest.spyOn(Order, 'findAll').mockResolvedValueOnce(orders);

    const returnedOrders = await listOrders(user.id);

    expect(returnedOrders).toEqual(orders);
    expect(Order.findAll).toHaveBeenCalledTimes(1);
    expect(Order.findAll).toHaveBeenCalledWith({ where });
    expect(JSON.parse).toHaveBeenCalledTimes(3);
  });

  it('Should reject with an error when Order.findAll() fails', async () => {
    const user = buildUser();
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to retrieve orders for user: ${user.id}`,
    );

    jest.spyOn(Order, 'findAll').mockRejectedValueOnce(error);

    expect(listOrders(user.id)).rejects.toEqual(error);
  });

  it('Should reject with an error when saveorder is executed without any data', async () => {
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to save order`,
    );

    jest.spyOn(Order, 'findAll').mockRejectedValueOnce(error);

    expect(saveOrder()).rejects.toEqual(error);
  });

  it('Should save and return order', () => {
    const user = buildUser();
    const data = {
      userid: user.id,
      products: buildOrders(),
    };
    const order = {
      ...data,
      id: 1,
    };

    jest.spyOn(Order, 'create').mockResolvedValueOnce(order);

    expect(saveOrder(data)).resolves.toEqual(order);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(`New order saved`, { data });
  });
});
