import { BaseError } from "./base-error";

/**
 * Validation Errors are thrown when a validation is violated. These cause the API to return a 400.
 */
export class ValidationError extends Error implements BaseError {
  error?: Error;
  errorMessage: string;

  constructor(message: string, error?: Error) {

    // setup
    super(message);
    this.name = 'ValidationError';
    this.message = message; // this isn't visible publicly for some reason (in json)
    this.errorMessage = message;
    this.error = error;

    // 
    //   do stuff with errors (type checking)

  }
}
