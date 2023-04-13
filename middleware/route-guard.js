'use strict';

module.exports = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    const error = new Error('AUTHENTICATION_REQUIRED');
    error.status = 401;
    next(error);
  }
};
