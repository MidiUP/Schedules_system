import { HttpRequest, HttpResponse } from '../protocols/http'
import { ValidatorParams } from '../interfaces/validator'
import { serverError, badRequest, notFound } from './helpers/http-helper'
import { Repository } from '../interfaces/repository'

export class ProductController {
  private readonly validator: ValidatorParams
  private readonly productRepository: Repository

  constructor (validator: ValidatorParams, productRepository: Repository) {
    this.validator = validator
    this.productRepository = productRepository
  }

  async getProducts (): Promise<HttpResponse> {
    try {
      const result = await this.productRepository.get()
      return {
        statusCode: 200,
        body: result
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async getProductById (req: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.productRepository.getById(req.header.params.id)
      if (!result) {
        return notFound()
      }
      return {
        statusCode: 200,
        body: result
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async createProduct (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      const newCompany = await this.productRepository.create(req.body)
      if (!newCompany) {
        return {
          statusCode: 404,
          body: { err: 'id_company not exists' }
        }
      }
      return {
        statusCode: 200,
        body: newCompany
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async putProduct (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      const result = await this.productRepository.put(req.header.params.id, req.body)
      if (!result) {
        return notFound()
      }
      return {
        statusCode: 200,
        body: result
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async deleteProduct (req: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.productRepository.delete(req.header.params.id)
      if (!result) {
        return notFound()
      }
      return {
        statusCode: 200,
        body: result
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }
}
