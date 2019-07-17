
import { BaseError } from 'lib';

export class BaseResponseDto {
    isSuccess: boolean = false;
    errors: BaseError[] = [];
    statusCode: number;
}
