function jwtForwarding(req, res, next) {
  const authorization = req.headers.authorization;

  if (authorization) {
    req.headers['x-forwarded-authorization'] = authorization;
  }

  next();
}

module.exports = jwtForwarding;
