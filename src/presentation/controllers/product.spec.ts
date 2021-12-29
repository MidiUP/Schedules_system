import { ValidatorParams } from '../interfaces/validator'
import { InvalidParamsError } from '../errors/invalid-params-error'
import { Repository } from '../interfaces/repository'
import { ServerError } from '../errors/server-error'
import { ProductViewModel } from '../../domain/usecases/product-view-model'
import { ProductController } from './product'

const makeValidatorParams = (): ValidatorParams => {
  class ValidatorParamsStub implements ValidatorParams {
    async validate (viewModel: any): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new ValidatorParamsStub()
}

const makeProductRepository = (): Repository => {
  class ProductRepositoryStub implements Repository {
    async create (productViewModel: ProductViewModel): Promise<any> {
      return new Promise(resolve => resolve({
        id: 0,
        id_company: 0,
        name: 'valid_name',
        description: 'valid_description',
        image: 'valid_image',
        price: 0,
        service_duration: 0
      }))
    }

    async get (): Promise<any> {
      return new Promise(resolve => resolve([
        {
          id: 0,
          id_company: 0,
          name: 'valid_name',
          description: 'valid_description',
          image: 'valid_image',
          price: 0,
          service_duration: 0,
          is_deleted: false
        },
        {
          id: 1,
          name: 'valid_name',
          description: 'valid_description',
          image: 'valid_image',
          price: 0,
          service_duration: 0,
          is_deleted: false
        }
      ]))
    }

    async getById (): Promise<any> {
      return new Promise(resolve => resolve({
        id: 0,
        id_company: 0,
        name: 'valid_name',
        description: 'valid_description',
        image: 'valid_image',
        price: 0,
        service_duration: 0
      }))
    }

    async delete (id: number): Promise<any> {
      return new Promise(resolve => resolve({
        id: 0,
        id_company: 0,
        name: 'valid_name',
        description: 'valid_description',
        image: 'valid_image',
        price: 0,
        service_duration: 0,
        is_deleted: true
      }))
    }

    async put (id: number, object: ProductViewModel): Promise<any> {
      return new Promise(resolve => resolve(
        {
          id: 0,
          id_company: 0,
          name: 'updated_name',
          description: 'updated_description',
          image: 'updated_image',
          price: 0,
          service_duration: 0,
          is_deleted: false
        }
      ))
    }
  }
  return new ProductRepositoryStub()
}

interface SutTypes {
  validator: ValidatorParams
  sut: ProductController
  ProductRepositoryStub: Repository
}

const makeSut = (): SutTypes => {
  const validator = makeValidatorParams()
  const ProductRepositoryStub = makeProductRepository()
  const sut = new ProductController(validator, ProductRepositoryStub)
  return {
    validator,
    sut,
    ProductRepositoryStub
  }
}

describe('Product Controller', () => {
  // createProduct

  test('return 400 for invalid data', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const HttpRequest = {
      header: null,
      body: {
        id_company: 0,
        name: 'invalid_name',
        description: 'invalid_description',
        image: 'invalid_image',
        price: 0,
        service_duration: 0
      }
    }

    const httpResponse = await sut.createProduct(HttpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError().message)
  })

  test('return code 500 if throws createProductRepository', async () => {
    const { sut, ProductRepositoryStub } = makeSut()
    jest.spyOn(ProductRepositoryStub, 'create').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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

    const result = await sut.createProduct(HttpRequest)
    expect(result.statusCode).toBe(500)
    expect(result.body).toEqual(new ServerError().message)
  })

  test('return code 404 if id_product notFound', async () => {
    const { sut, ProductRepositoryStub } = makeSut()
    jest.spyOn(ProductRepositoryStub, 'create').mockReturnValueOnce(new Promise(resolve => resolve(null)))
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

    const result = await sut.createProduct(HttpRequest)
    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({ err: 'id_company not exists' })
  })

  test('create method is being called with the correct parameters', async () => {
    const { sut, ProductRepositoryStub } = makeSut()
    const productRepositorySpy = jest.spyOn(ProductRepositoryStub, 'create')
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

    await sut.createProduct(HttpRequest)
    expect(productRepositorySpy).toHaveBeenCalledWith({
      id_company: 0,
      name: 'valid_name',
      description: 'valid_description',
      image: 'valid_image',
      price: 0,
      service_duration: 0
    })
  })

  test('return code 200 createProduct sucess', async () => {
    const { sut } = makeSut()
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

    const result = await sut.createProduct(HttpRequest)
    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      id: 0,
      id_company: 0,
      name: 'valid_name',
      description: 'valid_description',
      image: 'valid_image',
      price: 0,
      service_duration: 0
    })
  })

  // getProducts

  test('return code 200 getProducts sucess', async () => {
    const { sut } = makeSut()
    const result = await sut.getProducts()
    expect(result.statusCode).toBe(200)
  })

  test('return code 500 getProducts throw error', async () => {
    const { sut, ProductRepositoryStub } = makeSut()
    jest.spyOn(ProductRepositoryStub, 'get').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const result = await sut.getProducts()
    expect(result.statusCode).toBe(500)
  })

  // getProductById
  test('return code 200 getProductById sucess', async () => {
    const { sut } = makeSut()
    const req = {
      header: { params: { id: 1 } },
      body: ''
    }
    const result = await sut.getProductById(req)
    expect(result.statusCode).toBe(200)
  })

  test('return code 500 getById throw', async () => {
    const { sut, ProductRepositoryStub } = makeSut()
    jest.spyOn(ProductRepositoryStub, 'getById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: 2,
      body: ''
    }
    const result = await sut.getProductById(req)
    expect(result.statusCode).toBe(500)
  })

  test('return code 404 getById not found', async () => {
    const { sut, ProductRepositoryStub } = makeSut()
    jest.spyOn(ProductRepositoryStub, 'getById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.getProductById(req)
    expect(result.statusCode).toBe(404)
  })

  // deleteProduct
  test('return code 500 delete throw', async () => {
    const { sut, ProductRepositoryStub } = makeSut()
    jest.spyOn(ProductRepositoryStub, 'delete').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: 2,
      body: ''
    }
    const result = await sut.deleteProduct(req)
    expect(result.statusCode).toBe(500)
  })

  test('return code 200 delete success', async () => {
    const { sut } = makeSut()
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.deleteProduct(req)
    expect(result.statusCode).toBe(200)
  })

  test('return code 404 company not found', async () => {
    const { sut, ProductRepositoryStub } = makeSut()
    jest.spyOn(ProductRepositoryStub, 'delete').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.deleteProduct(req)
    expect(result.statusCode).toBe(404)
  })

  // putProduct
  test('return code 500 put throw', async () => {
    const { sut, ProductRepositoryStub } = makeSut()
    jest.spyOn(ProductRepositoryStub, 'put').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.putProduct(req)
    expect(result.statusCode).toBe(500)
  })

  test('return code 200 put success', async () => {
    const { sut } = makeSut()
    const req = {
      header: { params: { id: 1 } },
      body: {
        id_company: 0,
        name: 'valid_name',
        description: 'valid_description',
        image: 'valid_image',
        price: 0,
        service_duration: 0
      }
    }
    const result = await sut.putProduct(req)
    expect(result.statusCode).toBe(200)
  })

  test('return code 404 company not found', async () => {
    const { sut, ProductRepositoryStub } = makeSut()
    jest.spyOn(ProductRepositoryStub, 'put').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const req = {
      header: { params: { id: 1 } },
      body: {}
    }
    const result = await sut.putProduct(req)
    expect(result.statusCode).toBe(404)
  })
})
