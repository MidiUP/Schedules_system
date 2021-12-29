import { AvailabilityCompanyController } from './availability-company'
import { ValidatorParams } from '../interfaces/validator'
import { InvalidParamsError } from '../errors/invalid-params-error'
import { Repository } from '../interfaces/repository'
import { CompanyViewModel } from '../../domain/usecases/company-view-model'
import { ServerError } from '../errors/server-error'
import { AvailabilityCompanyViewModel } from '../../domain/usecases/availability-company-view-model'

const makeValidatorParams = (): ValidatorParams => {
  class ValidatorParamsStub implements ValidatorParams {
    async validate (viewModel: any): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new ValidatorParamsStub()
}

const makeAvailabilityCompanyRepository = (): Repository => {
  class AvailabilityCompanyRepositoryStub implements Repository {
    async create (availabilityCompanyViewModel: AvailabilityCompanyViewModel): Promise<any> {
      return new Promise(resolve => resolve({
        id_company: 0,
        day_of_operation: 'valid_day_of_operation',
        opening_time: 'valid_opening_time',
        closing_time: 'valid_closing_time'
      }))
    }

    async get (): Promise<any> {
      return new Promise(resolve => resolve([
        {
          id: 0,
          id_company: 0,
          day_of_operation: 'valid_day_of_operation',
          opening_time: 'valid_opening_time',
          closing_time: 'valid_closing_time'
        },
        {
          id: 1,
          id_company: 0,
          day_of_operation: 'valid_day_of_operation',
          opening_time: 'valid_opening_time',
          closing_time: 'valid_closing_time'
        }
      ]))
    }

    async getById (): Promise<any> {
      return new Promise(resolve => resolve({
        id: 0,
        id_company: 0,
        day_of_operation: 'valid_day_of_operation',
        opening_time: 'valid_opening_time',
        closing_time: 'valid_closing_time'
      }))
    }

    async delete (id: number): Promise<any> {
      return new Promise(resolve => resolve({
        id: 0,
        id_company: 0,
        day_of_operation: 'valid_day_of_operation',
        opening_time: 'valid_opening_time',
        closing_time: 'valid_closing_time',
        is_deleted: true
      }))
    }

    async put (id: number, object: CompanyViewModel): Promise<any> {
      return new Promise(resolve => resolve(
        {
          id: 0,
          id_company: 0,
          day_of_operation: 'updated_day_of_operation',
          opening_time: 'updated_opening_time',
          closing_time: 'updated_closing_time',
          is_deleted: true
        }
      ))
    }
  }
  return new AvailabilityCompanyRepositoryStub()
}

interface SutTypes {
  validator: ValidatorParams
  sut: AvailabilityCompanyController
  AvailabilityCompanyRepositoryStub: Repository
}

const makeSut = (): SutTypes => {
  const validator = makeValidatorParams()
  const AvailabilityCompanyRepositoryStub = makeAvailabilityCompanyRepository()
  const sut = new AvailabilityCompanyController(validator, AvailabilityCompanyRepositoryStub)
  return {
    validator,
    sut,
    AvailabilityCompanyRepositoryStub
  }
}

describe('AvailabilityCompany Controller', () => {
  // createAvailabilityCompany

  test('return 400 for invalid data', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        day_of_operation: 'invalid_day_of_operation',
        opening_time: 'invalid_opening_time',
        closing_time: 'invalid_closing_time'
      }
    }

    const httpResponse = await sut.createAvailabilityCompany(HttpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError().message)
  })

  test('return code 500 if throws createAvailabilityCompany', async () => {
    const { sut, AvailabilityCompanyRepositoryStub } = makeSut()
    jest.spyOn(AvailabilityCompanyRepositoryStub, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        day_of_operation: 'valid_day_of_operation',
        opening_time: 'valid_opening_time',
        closing_time: 'valid_closing_time'
      }
    }

    const result = await sut.createAvailabilityCompany(HttpRequest)
    expect(result.statusCode).toBe(500)
    expect(result.body).toEqual(new ServerError().message)
  })

  test('return code 404 if id_company notFound', async () => {
    const { sut, AvailabilityCompanyRepositoryStub } = makeSut()
    jest.spyOn(AvailabilityCompanyRepositoryStub, 'create').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        day_of_operation: 'valid_day_of_operation',
        opening_time: 'valid_opening_time',
        closing_time: 'valid_closing_time'
      }
    }

    const result = await sut.createAvailabilityCompany(HttpRequest)
    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({ err: 'id_company not exists' })
  })

  test('create method is being called with the correct parameters', async () => {
    const { sut, AvailabilityCompanyRepositoryStub } = makeSut()
    const companyAvailabilityRepositorySpy = jest.spyOn(AvailabilityCompanyRepositoryStub, 'create')
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        day_of_operation: 'valid_day_of_operation',
        opening_time: 'valid_opening_time',
        closing_time: 'valid_closing_time'
      }
    }

    await sut.createAvailabilityCompany(HttpRequest)
    expect(companyAvailabilityRepositorySpy).toHaveBeenCalledWith({
      id_company: 0,
      day_of_operation: 'valid_day_of_operation',
      opening_time: 'valid_opening_time',
      closing_time: 'valid_closing_time'
    })
  })

  test('return code 200 createCompany sucess', async () => {
    const { sut } = makeSut()
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        day_of_operation: 'valid_day_of_operation',
        opening_time: 'valid_opening_time',
        closing_time: 'valid_closing_time'
      }
    }

    const result = await sut.createAvailabilityCompany(HttpRequest)
    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      id_company: 0,
      day_of_operation: 'valid_day_of_operation',
      opening_time: 'valid_opening_time',
      closing_time: 'valid_closing_time'
    })
  })

  // getAvailabilityCompanies

  test('return code 200 getAvailabilityCompanies sucess', async () => {
    const { sut } = makeSut()
    const result = await sut.getAvailabilityCompanies()
    expect(result.statusCode).toBe(200)
  })

  test('return code 500 getAvailabilityCompany throw error', async () => {
    const { sut, AvailabilityCompanyRepositoryStub } = makeSut()
    jest.spyOn(AvailabilityCompanyRepositoryStub, 'get').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const result = await sut.getAvailabilityCompanies()
    expect(result.statusCode).toBe(500)
  })

  // getCompanyById
  test('return code 200 getAvailabilityCompanyById sucess', async () => {
    const { sut } = makeSut()
    const req = {
      header: { params: { id: 1 } },
      body: ''
    }
    const result = await sut.getAvailabilityCompanyById(req)
    expect(result.statusCode).toBe(200)
  })

  test('return code 500 getById throw', async () => {
    const { sut, AvailabilityCompanyRepositoryStub } = makeSut()
    jest.spyOn(AvailabilityCompanyRepositoryStub, 'getById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: 2,
      body: ''
    }
    const result = await sut.getAvailabilityCompanyById(req)
    expect(result.statusCode).toBe(500)
  })

  test('return code 404 getById not found', async () => {
    const { sut, AvailabilityCompanyRepositoryStub } = makeSut()
    jest.spyOn(AvailabilityCompanyRepositoryStub, 'getById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.getAvailabilityCompanyById(req)
    expect(result.statusCode).toBe(404)
  })

  // deleteCompany
  test('return code 500 delete throw', async () => {
    const { sut, AvailabilityCompanyRepositoryStub } = makeSut()
    jest.spyOn(AvailabilityCompanyRepositoryStub, 'delete').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: 2,
      body: ''
    }
    const result = await sut.deleteAvailabilityCompany(req)
    expect(result.statusCode).toBe(500)
  })

  test('return code 200 delete success', async () => {
    const { sut } = makeSut()
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.deleteAvailabilityCompany(req)
    expect(result.statusCode).toBe(200)
  })

  test('return code 404 company not found', async () => {
    const { sut, AvailabilityCompanyRepositoryStub } = makeSut()
    jest.spyOn(AvailabilityCompanyRepositoryStub, 'delete').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.deleteAvailabilityCompany(req)
    expect(result.statusCode).toBe(404)
  })

  // putCompany
  test('return code 500 put throw', async () => {
    const { sut, AvailabilityCompanyRepositoryStub } = makeSut()
    jest.spyOn(AvailabilityCompanyRepositoryStub, 'put').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.putAvailabilityCompany(req)
    expect(result.statusCode).toBe(500)
  })

  test('return code 200 put success', async () => {
    const { sut } = makeSut()
    const req = {
      header: { params: { id: 1 } },
      body: {
        day_of_operation: 'valid_day_of_operation',
        opening_time: 'valid_opening_time',
        closing_time: 'valid_closing_time'
      }
    }
    const result = await sut.putAvailabilityCompany(req)
    expect(result.statusCode).toBe(200)
  })

  test('return code 404 company not found', async () => {
    const { sut, AvailabilityCompanyRepositoryStub } = makeSut()
    jest.spyOn(AvailabilityCompanyRepositoryStub, 'put').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.putAvailabilityCompany(req)
    expect(result.statusCode).toBe(404)
  })
})
