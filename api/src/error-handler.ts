
import { DatabaseError, BusinessError, ValidationError, BaseError } from 'lib';
import { BaseResponseDto } from './dto/response/base-response.dto';

export class ApiError extends Error implements BaseError {
  error?: Error;
  errorMessage: string;
  constructor(message: string, error?: Error) {
    super(message);
    this.name = 'ApiError';
    this.message = message; // this isn't visible publicly for some reason (in json)
    this.errorMessage = message;
    this.error = error;
  }
}

export const errorHandler = async (err, req, res, next) => {
    console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
    console.log('ERROR');
    console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
    console.error(err);

    if (res.dto && res.dto instanceof BaseResponseDto) {
        // hide any database errors for now from output over the wire
        err.error = err instanceof DatabaseError ? ['See Console Output'] : err.error;
        res.dto.statusCode = err !instanceof ValidationError ? 500 : 400;
        res.dto.errors.push(err);
        res.status(res.dto.statusCode).send(res.dto);
    }
    else {
        const dto = new BaseResponseDto();
        dto.errors.push(new ApiError('Response dto not defined'));
        dto.statusCode = 500;
        res.status(dto.statusCode).send(dto);
    }
}