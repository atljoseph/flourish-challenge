
/**
 * The basic interface used to describe errors. Used primarily for typechecking in the API Error Handler.
 */
export interface BaseError {
  name: string;
  // errors: Error[];
  errorMessage: string;
}
