export{}
import { body, validationResult } from 'express-validator';

const validateUserRegisterInput = [
    body('phone').isLength({min: 10}).withMessage('Phone must be atleast 10 digit long'),
    
]
export default validateUserRegisterInput