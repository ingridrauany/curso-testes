import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { appError } from './errors';
import { logger } from './logger';

jest.mock('./logger');
jest.mock('http-errors');

describe('Utils > Errors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should execute logger.error', () => {
    appError('Error message');

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith('Error message');
  });

  it('Should execute createError with message and default status code', () => {
    appError('Error message');

    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error message',
    );
  });

  it('Should execute createError with message and provided status code', () => {
    appError('Error message', StatusCodes.UNPROCESSABLE_ENTITY);

    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledWith(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Error message',
    );
  });
});
