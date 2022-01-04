import { Validator } from '../../presentation/utils/validator'
import * as yup from 'yup'
import { UserRepository } from '../../repository/user'
import { Bcrypt } from '../../presentation/utils/bcrypt'
import { LoginController } from '../../presentation/controllers/login'
import { JwtClass } from '../../presentation/utils/jwt'

export const makeLoginController = (): LoginController => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const userRepository = new UserRepository()
  const bcrypt = new Bcrypt(12)
  const jwt = new JwtClass(userRepository, bcrypt)
  const validatorParams = new Validator({
    phone: yup.string().required(),
    password: yup.string().required()
  })
  const loginController = new LoginController(validatorParams, jwt)
  return loginController
}
