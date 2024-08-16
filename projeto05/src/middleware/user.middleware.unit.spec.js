import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as service from '@/database/service';
import { appError } from '@/utils';
import { get } from './user.middleware';

jest.mock('@/database/service');

describe('Middleware > Users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should forward an error when an email is NOT provided in the headers', () => {
    const req = { headers: {} };
    const next = jest.fn().mockName('next');
    const error = appError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should forward an error when an email is provided in the headers but is invalid', () => {
    const req = { headers: { email: 'ingrid rauany@gmail.com' } };
    const next = jest.fn().mockName('next');
    const error = appError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should return an user object given a valida email is provided', async () => {
    const req = { headers: { email: 'ingrid.rauany@gmail.com' } };
    const next = jest.fn().mockName('next');

    jest.spyOn(service, 'findOrSave').mockResolvedValueOnce([
      {
        id: 1,
        email: 'ingrid.rauany@gmail.com',
      },
    ]);

    await get(req, null, next);

    expect(req.user).toBeDefined();
    expect(req.user).toEqual({
      id: 1,
      email: 'ingrid.rauany@gmail.com',
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('Should forward an error when service.findOrSave fails', async () => {
    const req = { headers: { email: 'ingrid.rauany@gmail.com' } };
    const next = jest.fn().mockName('next');

    jest.spyOn(service, 'findOrSave').mockRejectedValueOnce('Error on save');

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('Error on save');
  });
});
