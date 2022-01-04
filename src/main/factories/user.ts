import { Validator } from '../../presentation/utils/validator'
import * as yup from 'yup'
import { UserController } from '../../presentation/controllers/user'
import { UserRepository } from '../../repository/user'
import { Bcrypt } from '../../presentation/utils/bcrypt'

export const makeUserController = (): UserController => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const userRepository = new UserRepository()
  const bcrypt = new Bcrypt(12)
  const validatorParams = new Validator({
    id_company: yup.number().integer().required(),
    name: yup.string().required(),
    phone: yup.string().required(),
    password: yup.string().required(),
    cpf: yup.string().required(),
    email: yup.string().required().email()
  })
  const userController = new UserController(validatorParams, userRepository, bcrypt)
  return userController
}
