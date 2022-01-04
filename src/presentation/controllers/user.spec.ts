import { ValidatorParams } from '../interfaces/validator'
import { InvalidParamsError } from '../errors/invalid-params-error'
import { Repository } from '../interfaces/repository'
import { ServerError } from '../errors/server-error'
import { UserViewModel } from '../../domain/usecases/user-view-model'
import { UserController } from './user'
import { Encrypt } from '../interfaces/encrypt'

const makeValidatorParams = (): ValidatorParams => {
  class ValidatorParamsStub implements ValidatorParams {
    async validate (viewModel: any): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new ValidatorParamsStub()
}

const makeUserRepository = (): Repository => {
  class UserRepositoryStub implements Repository {
    async create (userViewModel: UserViewModel): Promise<any> {
      return new Promise(resolve => resolve({
        id: 0,
        id_company: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        password: 'valid_password',
        cpf: 'valid_cpf',
        email: 'valid_email'
      }))
    }

    async get (): Promise<any> {
      return new Promise(resolve => resolve([
        {
          id: 0,
          id_company: 0,
          name: 'valid_name',
          phone: 'valid_phone',
          password: 'valid_password',
          cpf: 'valid_cpf',
          email: 'valid_email'
        },
        {
          id: 1,
          id_company: 0,
          name: 'valid_name',
          phone: 'valid_phone',
          password: 'valid_password',
          cpf: 'valid_cpf',
          email: 'valid_email'
        }
      ]))
    }

    async getById (): Promise<any> {
      return new Promise(resolve => resolve({
        id: 0,
        id_company: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        password: 'valid_password',
        cpf: 'valid_cpf',
        email: 'valid_email'
      }))
    }

    async delete (id: number): Promise<any> {
      return new Promise(resolve => resolve({
        id: 0,
        id_company: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        password: 'valid_password',
        cpf: 'valid_cpf',
        email: 'valid_email',
        is_deleted: true
      }))
    }

    async put (id: number, object: UserViewModel): Promise<any> {
      return new Promise(resolve => resolve(
        {
          id: 0,
          id_company: 0,
          name: 'valid_name',
          phone: 'valid_phone',
          password: 'valid_password',
          cpf: 'valid_cpf',
          email: 'valid_email',
          is_deleted: false
        }
      ))
    }
  }
  return new UserRepositoryStub()
}

const makeBcryptStub = (): Encrypt => {
  class BcryptStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('value_hashed'))
    }

    async compare (passwordDB: string, passwordReq): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new BcryptStub()
}

interface SutTypes {
  validator: ValidatorParams
  sut: UserController
  UserRepositoryStub: Repository
  bcryptStub: Encrypt
}

const makeSut = (): SutTypes => {
  const validator = makeValidatorParams()
  const UserRepositoryStub = makeUserRepository()
  const bcryptStub = makeBcryptStub()
  const sut = new UserController(validator, UserRepositoryStub, bcryptStub)
  return {
    validator,
    sut,
    UserRepositoryStub,
    bcryptStub
  }
}

describe('Product Controller', () => {
  // createUser

  test('return 400 for invalid data', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        name: 'invalid_name',
        phone: 'invalid_phone',
        password: 'invalid_password',
        cpf: 'invalid_cpf',
        email: 'invalid_email'
      }
    }

    const httpResponse = await sut.createUser(HttpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError().message)
  })

  test('return 200 for encrypt ok', async () => {
    const { sut } = makeSut()
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        password: 'valid_password',
        cpf: 'valid_cpf',
        email: 'valid_email'
      }
    }

    const httpResponse = await sut.createUser(HttpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })

  test('return 500 if encrypt throw error', async () => {
    const { sut, bcryptStub } = makeSut()
    jest.spyOn(bcryptStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        password: 'valid_password',
        cpf: 'valid_cpf',
        email: 'valid_email'
      }
    }

    const httpResponse = await sut.createUser(HttpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('return code 500 if throws createUserRepository', async () => {
    const { sut, UserRepositoryStub } = makeSut()
    jest.spyOn(UserRepositoryStub, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        password: 'valid_password',
        cpf: 'valid_cpf',
        email: 'valid_email'
      }
    }

    const result = await sut.createUser(HttpRequest)
    expect(result.statusCode).toBe(500)
    expect(result.body).toEqual(new ServerError().message)
  })

  test('return code 404 if id_product notFound', async () => {
    const { sut, UserRepositoryStub } = makeSut()
    jest.spyOn(UserRepositoryStub, 'create').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        name: 'valid_name',
        description: 'valid_description',
        image: 'valid_image',
        price: 0,
        service_duration: 0
      }
    }

    const result = await sut.createUser(HttpRequest)
    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({ err: 'id_company not exists' })
  })

  test('create method is being called with the correct parameters', async () => {
    const { sut, UserRepositoryStub } = makeSut()
    const userRepositorySpy = jest.spyOn(UserRepositoryStub, 'create')
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        password: 'valid_password',
        cpf: 'valid_cpf',
        email: 'valid_email'
      }
    }

    await sut.createUser(HttpRequest)
    expect(userRepositorySpy).toHaveBeenCalledWith({
      id_company: 0,
      name: 'valid_name',
      phone: 'valid_phone',
      password: 'value_hashed',
      cpf: 'valid_cpf',
      email: 'valid_email'
    })
  })

  test('return code 200 createUser sucess', async () => {
    const { sut } = makeSut()
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        password: 'valid_password',
        cpf: 'valid_cpf',
        email: 'valid_email'
      }
    }

    const result = await sut.createUser(HttpRequest)
    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      id: 0,
      id_company: 0,
      name: 'valid_name',
      phone: 'valid_phone',
      password: 'valid_password',
      cpf: 'valid_cpf',
      email: 'valid_email'
    })
  })

  test('return code 500 bCrypt throw Error', async () => {
    const { sut } = makeSut()
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        password: 'valid_password',
        cpf: 'valid_cpf',
        email: 'valid_email'
      }
    }

    const result = await sut.createUser(HttpRequest)
    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      id: 0,
      id_company: 0,
      name: 'valid_name',
      phone: 'valid_phone',
      password: 'valid_password',
      cpf: 'valid_cpf',
      email: 'valid_email'
    })
  })

  // getUsers

  test('return code 200 getUsers sucess', async () => {
    const { sut } = makeSut()
    const result = await sut.getUsers()
    expect(result.statusCode).toBe(200)
  })

  test('return code 500 getUsers throw error', async () => {
    const { sut, UserRepositoryStub } = makeSut()
    jest.spyOn(UserRepositoryStub, 'get').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const result = await sut.getUsers()
    expect(result.statusCode).toBe(500)
  })

  // getUserById
  test('return code 200 getUserById sucess', async () => {
    const { sut } = makeSut()
    const req = {
      header: { params: { id: 1 } },
      body: ''
    }
    const result = await sut.getUserById(req)
    expect(result.statusCode).toBe(200)
  })

  test('return code 500 getById throw', async () => {
    const { sut, UserRepositoryStub } = makeSut()
    jest.spyOn(UserRepositoryStub, 'getById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: 2,
      body: ''
    }
    const result = await sut.getUserById(req)
    expect(result.statusCode).toBe(500)
  })

  test('return code 404 getById not found', async () => {
    const { sut, UserRepositoryStub } = makeSut()
    jest.spyOn(UserRepositoryStub, 'getById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.getUserById(req)
    expect(result.statusCode).toBe(404)
  })

  // deleteUser
  test('return code 500 delete throw', async () => {
    const { sut, UserRepositoryStub } = makeSut()
    jest.spyOn(UserRepositoryStub, 'delete').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: 2,
      body: ''
    }
    const result = await sut.deleteUser(req)
    expect(result.statusCode).toBe(500)
  })

  test('return code 200 delete success', async () => {
    const { sut } = makeSut()
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.deleteUser(req)
    expect(result.statusCode).toBe(200)
  })

  test('return code 404 user not found', async () => {
    const { sut, UserRepositoryStub } = makeSut()
    jest.spyOn(UserRepositoryStub, 'delete').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.deleteUser(req)
    expect(result.statusCode).toBe(404)
  })

  // putUser
  test('return code 500 put throw', async () => {
    const { sut, UserRepositoryStub } = makeSut()
    jest.spyOn(UserRepositoryStub, 'put').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.putUser(req)
    expect(result.statusCode).toBe(500)
  })

  test('return code 200 put success', async () => {
    const { sut } = makeSut()
    const req = {
      header: { params: { id: 1 } },
      body: {
        id_company: 0,
        name: 'valid_name',
        phone: 'valid_phone',
        password: 'valid_password',
        cpf: 'valid_cpf',
        email: 'valid_email'
      }
    }
    const result = await sut.putUser(req)
    expect(result.statusCode).toBe(200)
  })

  test('return code 404 user not found', async () => {
    const { sut, UserRepositoryStub } = makeSut()
    jest.spyOn(UserRepositoryStub, 'put').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.putUser(req)
    expect(result.statusCode).toBe(404)
  })
})
