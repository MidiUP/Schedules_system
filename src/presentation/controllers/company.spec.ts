import { CompanyController } from './company'
import { ValidatorParams } from '../interfaces/validator'
import { InvalidParamsError } from '../errors/invalid-params-error'
import { Repository } from '../interfaces/repository'
import { CompanyViewModel } from '../../domain/usecases/company-view-model'
import { ServerError } from '../errors/server-error'

const makeValidatorParams = (): ValidatorParams => {
  class ValidatorParamsStub implements ValidatorParams {
    async validate (viewModel: any): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new ValidatorParamsStub()
}

const makeCompanyRepository = (): Repository => {
  class CompanyRepositoryStub implements Repository {
    async create (companyViewModel: CompanyViewModel): Promise<any> {
      return new Promise(resolve => resolve({
        id: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        address: 'valid_addres',
        employees: 0,
        logo: 'valid_logo'
      }))
    }

    async get (): Promise<any> {
      return new Promise(resolve => resolve({}))
    }

    async getById (): Promise<any> {
      return new Promise(resolve => resolve({}))
    }

    async delete (): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new CompanyRepositoryStub()
}

interface SutTypes {
  validator: ValidatorParams
  sut: CompanyController
  CompanyRepositoryStub: Repository
}

const makeSut = (): SutTypes => {
  const validator = makeValidatorParams()
  const CompanyRepositoryStub = makeCompanyRepository()
  const sut = new CompanyController(validator, CompanyRepositoryStub)
  return {
    validator,
    sut,
    CompanyRepositoryStub
  }
}

describe('Company Controller', () => {
  // createCompany

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
    expect(httpResponse.body).toEqual(new InvalidParamsError().message)
  })

  test('return code 500 if throws createCompany', async () => {
    const { sut, CompanyRepositoryStub } = makeSut()
    jest.spyOn(CompanyRepositoryStub, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const HttpRequest = {
      header: null,
      body: {
        name: 'valid_name',
        email: 'valid@mail.com',
        address: 'valid_address',
        employees: 0,
        logo: 'valid_logo'
      }
    }

    const result = await sut.createCompany(HttpRequest)
    expect(result.statusCode).toBe(500)
    expect(result.body).toEqual(new ServerError().message)
  })

  test('create method is being called with the correct parameters', async () => {
    const { sut, CompanyRepositoryStub } = makeSut()
    const companyRepositorySpy = jest.spyOn(CompanyRepositoryStub, 'create')
    const HttpRequest = {
      header: null,
      body: {
        name: 'valid_name',
        email: 'valid@mail.com',
        address: 'valid_address',
        employees: 0,
        logo: 'valid_logo'
      }
    }

    await sut.createCompany(HttpRequest)
    expect(companyRepositorySpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid@mail.com',
      address: 'valid_address',
      employees: 0,
      logo: 'valid_logo'
    })
  })

  test('return code 200 createCompany sucess', async () => {
    const { sut } = makeSut()
    const HttpRequest = {
      header: null,
      body: {
        name: 'valid_name',
        email: 'valid@mail.com',
        address: 'valid_address',
        employees: 0,
        logo: 'valid_logo'
      }
    }

    const result = await sut.createCompany(HttpRequest)
    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      id: 0,
      name: 'valid_name',
      phone: 'valid_phone',
      address: 'valid_addres',
      employees: 0,
      logo: 'valid_logo'
    })
  })

  // getCompanies

  test('return code 200 getCompanies sucess', async () => {
    const { sut } = makeSut()
    const result = await sut.getCompanies()
    expect(result.statusCode).toBe(200)
  })

  test('return code 500 getCompany failed', async () => {
    const { sut, CompanyRepositoryStub } = makeSut()
    jest.spyOn(CompanyRepositoryStub, 'get').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const result = await sut.getCompanies()
    expect(result.statusCode).toBe(500)
  })

  // getCompanyById
  test('return code 200 getCompanyById sucess', async () => {
    const { sut } = makeSut()
    const result = await sut.getCompanies()
    expect(result.statusCode).toBe(200)
  })

  test('return code 500 getById throw', async () => {
    const { sut, CompanyRepositoryStub } = makeSut()
    jest.spyOn(CompanyRepositoryStub, 'getById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: 2,
      body: ''
    }
    const result = await sut.getCompanyById(req)
    expect(result.statusCode).toBe(500)
  })

  // deleteCompany
  test('return code 200 delete throw', async () => {
    const { sut, CompanyRepositoryStub } = makeSut()
    jest.spyOn(CompanyRepositoryStub, 'getById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: 2,
      body: ''
    }
    const result = await sut.getCompanyById(req)
    expect(result.statusCode).toBe(500)
  })
})
