import { BaseError } from "./base-error";

export class DatabaseError extends Error implements BaseError {
  error?: Error;
  errorMessage: string;
  sqlMessage: string;

  constructor(message: string, error?: any) {

    // setup
    super(message);
    this.name = 'DatabaseError';
    this.message = message; // this isn't visible publicly for some reason (in json)
    this.errorMessage = `${message}`;
    this.sqlMessage = error && error.sqlMessage ? error.sqlMessage : '<none>';
    this.error = error;

    // 
    //   do stuff with errors (type checking)

  }
}
