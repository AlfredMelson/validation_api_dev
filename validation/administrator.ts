import { body } from 'express-validator'

class AdministratorValidator {
  checkAuthAdministrator() {
    return [
      // Username requirements: must start with a lowercase or uppercase letter followed by 3 to 23 characters that may letters, numbers, underscores, or hyphens
      body('adminUsername').notEmpty().withMessage('Username value should not be empty'),
      // Password requirements: must start with a lowercase or uppercase letter followed by 3 to 23 characters that may letters, numbers, underscores, or hyphens
      body('adminPassword').notEmpty().withMessage('Password value should not be empty')
    ]
  }
  // TODO: Validate the request cookie
  // checkAdminRefreshToken() {
  //   return [
  //     // Check that there are no cookies or (optionally chaining) for a jwt property and send status 204 if true: 'no content to send for this request'
  //     cookies().notEmpty().withMessage('No content to send for this request.')
  //   ]
  // }
  //
}

export default new AdministratorValidator()
