import { HttpRequest, HttpResponse } from '../protocols/http'
import { ValidatorParams } from '../interfaces/validator'
import { serverError, badRequest, notFound } from './helpers/http-helper'
import { Repository } from '../interfaces/repository'

export class AvailabilityCompanyController {
  private readonly validator: ValidatorParams
  private readonly availabilityCompanyRepository: Repository

  constructor (validator: ValidatorParams, availabilityCompanyRepository: Repository) {
    this.validator = validator
    this.availabilityCompanyRepository = availabilityCompanyRepository
  }

  async getAvailabilityCompanies (): Promise<HttpResponse> {
    try {
      const result = await this.availabilityCompanyRepository.get()
      return {
        statusCode: 200,
        body: result
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async getAvailabilityCompanyById (req: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.availabilityCompanyRepository.getById(req.header.params.id)
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

  async createAvailabilityCompany (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      const newCompany = await this.availabilityCompanyRepository.create(req.body)
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

  async putAvailabilityCompany (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      const result = await this.availabilityCompanyRepository.put(req.header.params.id, req.body)
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

  async deleteAvailabilityCompany (req: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.availabilityCompanyRepository.delete(req.header.params.id)
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
