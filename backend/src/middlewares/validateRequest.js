const validateRequest = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    const issues = error?.issues || error?.errors || [];
    const errorMessages = issues.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));

    return res.status(400).json({
      message: 'Error de validacion de datos',
      errors: errorMessages.length ? errorMessages : [{ field: 'request', message: 'Datos invalidos' }]
    });
  }
};

module.exports = validateRequest;
