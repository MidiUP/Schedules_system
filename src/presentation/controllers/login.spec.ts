import { LoginViewModel } from '../../domain/usecases/login-view-model'
import { JwtInterface } from '../interfaces/jwt'
import { ValidatorParams } from '../interfaces/validator'
import { LoginController } from './login'

const makeValidatorParams = (): ValidatorParams => {
  class ValidatorParamsStub implements ValidatorParams {
    async validate (viewModel: any): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new ValidatorParamsStub()
}

const makeJwt = (): JwtInterface => {
  class JwtStub implements JwtInterface {
    async authenticate (login: LoginViewModel): Promise<string> {
      return new Promise(resolve => resolve('token'))
    }
  }
  return new JwtStub()
}

interface sutTypes{
  sut: LoginController
  validatorParamsStub: ValidatorParams
  jwtStub: JwtInterface
}

const makeSut = (): sutTypes => {
  const validatorParamsStub = makeValidatorParams()
  const jwtStub = makeJwt()
  const sut = new LoginController(validatorParamsStub, jwtStub)
  return {
    sut,
    validatorParamsStub,
    jwtStub
  }
}

describe('tests of LoginController', () => {
  test('return statusCode 400 if validatorParams return false', async () => {
    const { sut, validatorParamsStub } = makeSut()
    jest.spyOn(validatorParamsStub, 'validate').mockReturnValueOnce(new Promise((resolve, reject) => resolve(false)))
    const request = {
      header: {},
      body: {
        phone: 'valid_phone',
        password: 'valid_password'
      }
    }
    const response = await sut.login(request)
    expect(response.statusCode).toBe(400)
  })

  test('return statusCode 401 if login unauthorized', async () => {
    const { sut, jwtStub } = makeSut()
    jest.spyOn(jwtStub, 'authenticate').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const request = {
      header: {},
      body: {
        phone: 'invalid_phone',
        password: 'invalid_password'
      }
    }
    const response = await sut.login(request)
    expect(response.statusCode).toBe(401)
  })

  test('return statusCode 200 if login success', async () => {
    const { sut } = makeSut()
    const request = {
      header: {},
      body: {
        phone: 'valid_phone',
        password: 'valid_password'
      }
    }
    const response = await sut.login(request)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual('token')
  })

  test('return statusCode 500 if jwt throw error', async () => {
    const { sut, jwtStub } = makeSut()
    jest.spyOn(jwtStub, 'authenticate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const request = {
      header: {},
      body: {
        phone: 'valid_phone',
        password: 'valid_password'
      }
    }
    const response = await sut.login(request)
    expect(response.statusCode).toBe(500)
  })

  test('return statusCode 200 if validatorParams return true', async () => {
    const { sut } = makeSut()
    const request = {
      header: {},
      body: {
        phone: 'valid_phone',
        password: 'valid_password'
      }
    }
    const response = await sut.login(request)
    expect(response.statusCode).toBe(200)
  })

  test('shold validatorParams is received params corrects', async () => {
    const { sut, validatorParamsStub } = makeSut()
    const spyValidate = jest.spyOn(validatorParamsStub, 'validate')
    const request = {
      header: {},
      body: {
        phone: 'valid_phone',
        password: 'valid_password'
      }
    }
    await sut.login(request)
    expect(spyValidate).toHaveBeenCalledWith({
      phone: 'valid_phone',
      password: 'valid_password'
    })
  })
})
