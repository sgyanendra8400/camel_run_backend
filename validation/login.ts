export{}
import { body } from 'express-validator';

const validateLoginInput = [
    body('email').isEmail().withMessage('Email must be a valid email'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 characters long')
]
module.exports = validateLoginInput