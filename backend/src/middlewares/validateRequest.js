const validateRequest = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    const errorMessages = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    return res.status(400).json({
      message: 'Error de validación de datos',
      errors: errorMessages
    });
  }
};

module.exports = validateRequest;
