import {
  buildError,
  buildNext,
  buildOrder,
  buildOrders,
  buildReq,
  buildRes,
} from 'test/builders';
import * as validator from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { index, validate, create } from './orders.controller';
import { validationResponse } from './utils';

jest.mock('express-validator');
jest.mock('@/database/service');
jest.mock('./utils');

describe('Controllers > Orders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return status 200 with a list of orders', async () => {
    const req = buildReq();
    const res = buildRes();
    const next = buildNext();
    const orders = buildOrders();

    jest.spyOn(req.service, 'listOrders').mockResolvedValueOnce(orders);

    await index(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ orders });
    expect(req.service.listOrders).toHaveBeenCalledTimes(1);
    expect(req.service.listOrders).toHaveBeenCalledWith(req.user.id);
  });

  it('Should forward an error when service.listorder fails', async () => {
    const req = buildReq();
    const res = buildRes();
    const next = buildNext();
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Some message here!',
    );

    jest.spyOn(req.service, 'listOrders').mockRejectedValueOnce(error);

    await index(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should build a list of errors', () => {
    const method = 'create';
    const existsFn = jest
      .fn()
      .mockReturnValueOnce('Please provide a list of products');

    jest.spyOn(validator, 'body').mockReturnValueOnce({
      exists: existsFn,
    });

    const errors = validate(method);

    expect(errors).toHaveLength(1);
    expect(errors).toEqual(['Please provide a list of products']);
    expect(validator.body).toHaveBeenCalledWith(
      'products',
      'Please provide a list of products',
    );
  });

  it('Should thrown an error when a unknown methid is provided', () => {
    expect(() => {
      validate('some uknown method');
    }).toThrow('Please provide a valid method name');
  });

  it('Should return status 200 and the created order id', async () => {
    const products = buildOrder();
    const req = buildReq({
      body: {
        products,
      },
    });
    const res = buildRes();
    const next = buildNext();
    const isEmpty = jest.fn().mockReturnValueOnce(true);

    jest.spyOn(validator, 'validationResult').mockReturnValueOnce({
      isEmpty,
    });

    jest.spyOn(req.service, 'saveOrder').mockReturnValueOnce({
      id: 123456,
    });

    await create(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ order: { id: 123456 } });

    expect(req.service.saveOrder).toHaveBeenCalledTimes(1);
    expect(req.service.saveOrder).toHaveBeenCalledWith({
      userid: req.user.id,
      products: JSON.stringify(products),
    });

    expect(isEmpty).toHaveBeenCalledTimes(1);
  });

  it('Should forward an error when service.saveOrder fails', async () => {
    const products = buildOrder();
    const req = buildReq({
      body: {
        products,
      },
    });
    const res = buildRes();
    const next = buildNext();
    const isEmpty = jest.fn().mockReturnValueOnce(true);
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Some error here',
    );

    jest.spyOn(validator, 'validationResult').mockReturnValueOnce({
      isEmpty,
    });

    jest.spyOn(req.service, 'saveOrder').mockRejectedValueOnce(error);

    await create(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should return validation response when error bag is not empty', async () => {
    const req = buildReq();
    const res = buildRes();
    const next = buildNext();
    const errorBag = {
      isEmpty: jest.fn().mockReturnValueOnce(false),
      array: jest.fn().mockReturnValueOnce(['error1', 'error2']),
    };

    jest.spyOn(validator, 'validationResult').mockReturnValueOnce(errorBag);

    await create(req, res, next);

    expect(validationResponse).toHaveBeenCalledTimes(1);
    expect(validationResponse).toHaveBeenCalledWith(res, errorBag);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
