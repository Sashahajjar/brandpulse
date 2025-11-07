/**
 * Validation middleware for Zod schemas
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      // If schema is an object with params, query, body
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      // If schema is a single Zod object, validate body
      if (schema.parse && !schema.params && !schema.query) {
        req.body = schema.parse(req.body);
      }
      next();
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
      }
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
      });
    }
  };
}

