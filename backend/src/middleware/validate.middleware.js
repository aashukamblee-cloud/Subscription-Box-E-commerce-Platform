import { errorResponse } from '../utils/apiResponse.js';

export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      const errors = error.details.reduce((acc, current) => {
        acc[current.path[0]] = current.message;
        return acc;
      }, {});
      
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    
    next();
  };
};
