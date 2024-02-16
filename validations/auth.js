import { body } from 'express-validator'

export const registerValidator = [
    body('email', 'Неправильний емейл').isEmail(),
    body('password', 'Мінімальний кількість символів для пароля 5').isLength({ min: 5 }),
    body('username', 'Мінімальний кількість символів для username 3!').isLength({ min: 3 }),
]