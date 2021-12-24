import { CompanyController } from './company'
import { ValidatorParams } from '../interfaces/validator'
import { InvalidParamsError } from '../errors/invalid-params-error'

const makeValidatorParams = (): ValidatorParams => {
  class ValidatorParamsStub implements ValidatorParams {
    async validate (viewModel: any): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new ValidatorParamsStub()
}

interface SutTypes {
  validator: ValidatorParams
  sut: CompanyController
}

const makeSut = (): SutTypes => {
  const validator = makeValidatorParams()
  const sut = new CompanyController(validator)
  return {
    validator,
    sut
  }
}

describe('Company Controller', () => {
  test('return 400 for invalid data', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const HttpRequest = {
      header: null,
      body: {
        name: 'invalid_name',
        email: 'invalid@mail.com',
        address: 'invalid_address'
      }
    }

    const httpResponse = await sut.createCompany(HttpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError())
  })

  test('first test', async () => {
    const { sut } = makeSut()
    const HttpRequest = {
      header: null,
      body: {
        name: 'valid_name',
        email: 'valid@mail.com',
        address: 'valid_address'
      }
    }

    const result = await sut.createCompany(HttpRequest)
    expect(result.statusCode).toBe(200)
  })
})
