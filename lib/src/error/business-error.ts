import { BaseError } from "./base-error";

export class BusinessError extends Error implements BaseError {
  error?: Error;
  errorMessage: string;

  constructor(message: string, error?: Error) {

    // setup
    super(message);
    this.name = 'BusinessError';
    this.message = message; // this isn't visible publicly for some reason (in json)
    this.errorMessage = message;
    this.error = error;

    // 
    //   do stuff with errors (type checking)

  }
}
