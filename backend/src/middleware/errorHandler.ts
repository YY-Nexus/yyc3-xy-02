import { Request, Response, NextFunction } from 'express';
import { Logger } from '@/config/logger';
import { AppError, ValidationError, DuplicateKeyError, CastError, JWTError, ErrorHandlerError } from '@/types';

const logger = Logger.getInstance();

const handleAppError = (err: AppError, res: Response): void => {
  logger.errorDetail(err, err.name || 'Application Error');

  res.status(err.statusCode).json({
    success: false,
    error: err.name,
    message: err.message,
    ...(err.code && { code: err.code }),
    ...(err.details && { details: err.details }),
    meta: {
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || 'unknown',
    },
  });
};

const handleValidationError = (err: ValidationError, res: Response): void => {
  const errors = Object.values(err.errors).map((error) => ({
    field: error.path,
    message: error.message,
  }));

  logger.error('Validation Error:', { errors });

  res.status(400).json({
    success: false,
    error: 'Validation Error',
    message: 'Invalid input data',
    details: errors,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || 'unknown',
    },
  });
};

const handleDuplicateKeyError = (err: DuplicateKeyError, res: Response): void => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  logger.error('Duplicate Key Error:', { field, value });

  res.status(409).json({
    success: false,
    error: 'Duplicate Entry',
    message: `${field} '${value}' already exists`,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || 'unknown',
    },
  });
};

const handleCastError = (err: CastError, res: Response): void => {
  logger.error('Cast Error:', { path: err.path, value: err.value });

  res.status(400).json({
    success: false,
    error: 'Invalid Data',
    message: `Invalid ${err.path}: ${err.value}`,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || 'unknown',
    },
  });
};

const handleJWTError = (err: JWTError, res: Response): void => {
  logger.error('JWT Error:', { message: err.message });

  const message = err.name === 'JsonWebTokenError' ? 'Invalid token' : 'Token expired';
  const statusCode = err.name === 'JsonWebTokenError' ? 401 : 401;

  res.status(statusCode).json({
    success: false,
    error: 'Authentication Error',
    message,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || 'unknown',
    },
  });
};

const sendErrorDev = (err: ErrorHandlerError, res: Response): void => {
  logger.error('Development Error:', {
    message: err.message,
    stack: err.stack,
    status: 'statusCode' in err ? err.statusCode : undefined,
  });

  res.status(('statusCode' in err ? err.statusCode : 500) || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message,
    stack: err.stack,
    ...(process.env.NODE_ENV === 'development' && { err }),
    meta: {
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || 'unknown',
    },
  });
};

const sendErrorProd = (err: ErrorHandlerError, res: Response): void => {
  if ('isOperational' in err && err.isOperational) {
    res.status('statusCode' in err ? err.statusCode : 500).json({
      success: false,
      error: err.name,
      message: err.message,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId || 'unknown',
      },
    });
  } else {
    logger.error('Programming Error:', {
      message: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Something went wrong',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId || 'unknown',
      },
    });
  }
};

export const errorHandler = (
  err: ErrorHandlerError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.locals.requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  if ('statusCode' in err) {
    err.statusCode = err.statusCode || 500;
  }
  if ('status' in err) {
    err.status = err.status || 'error';
  }

  logger.error(`Error ${'statusCode' in err ? err.statusCode : 500}: ${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query,
    stack: err.stack,
  });

  if (err.name === 'ValidationError') {
    return handleValidationError(err, res);
  }

  if ('code' in err && err.code === 11000) {
    return handleDuplicateKeyError(err, res);
  }

  if (err.name === 'CastError') {
    return handleCastError(err, res);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return handleJWTError(err, res);
  }

  if (err.name === 'AppError') {
    return handleAppError(err, res);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new Error(`Can't find ${req.originalUrl} on this server!`) as ErrorHandlerError;
  error.statusCode = 404;
  error.status = 'fail';
  error.isOperational = true;

  next(error);
};

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export class CustomError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public code?: string;
  public details?: Record<string, unknown>;

  constructor(message: string, statusCode: number, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (
  message: string,
  statusCode: number = 500,
  details?: Record<string, unknown>
): CustomError => {
  return new CustomError(message, statusCode, details);
};

export const createValidationError = (details: Record<string, unknown>): CustomError => {
  return createError('Validation failed', 400, details);
};

export const createUnauthorizedError = (message: string = 'Unauthorized'): CustomError => {
  return createError(message, 401);
};

export const createForbiddenError = (message: string = 'Forbidden'): CustomError => {
  return createError(message, 403);
};

export const createNotFoundError = (resource: string = 'Resource'): CustomError => {
  return createError(`${resource} not found`, 404);
};

export const createConflictError = (message: string = 'Conflict'): CustomError => {
  return createError(message, 409);
};

export const createPayloadTooLargeError = (message: string = 'Payload too large'): CustomError => {
  return createError(message, 413);
};

export const createTooManyRequestsError = (message: string = 'Too many requests'): CustomError => {
  return createError(message, 429);
};

export const createInternalServerError = (message: string = 'Internal server error'): CustomError => {
  return createError(message, 500);
};

export default errorHandler;
