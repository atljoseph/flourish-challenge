
export const catchErrors = (asyncFunc) => {
    return function(req, res, next) {
      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      asyncFunc(req, res, next).catch(next);
    };
  }