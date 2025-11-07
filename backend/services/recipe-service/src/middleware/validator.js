/**
 * Middleware de validation Zod pour query, params, body
 */

export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation échouée',
        details: error.errors
      });
    }
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation échouée',
        details: error.errors
      });
    }
  };
};

export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation échouée',
        details: error.errors
      });
    }
  };
};
