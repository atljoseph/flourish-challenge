import { BaseError } from "./base-error";

export class DatabaseError extends Error implements BaseError {
  error?: Error;
  errorMessage: string;

  constructor(message: string, error?: Error) {

    // setup
    super(message);
    this.name = 'DatabaseError';
    this.message = message; // this isn't visible publicly for some reason (in json)
    this.errorMessage = `${message} - ${JSON.stringify(error)}`;
    this.error = error;

    // 
    //   do stuff with errors (type checking)

  }
}
