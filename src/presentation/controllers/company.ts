import { HttpRequest, HttpResponse } from '../protocols/http'
import { ValidatorParams } from '../interfaces/validator'
import { serverError, badRequest, notFound } from '../controllers/helpers/http-helper'
import { Repository } from '../interfaces/repository'

export class CompanyController {
  private readonly validator: ValidatorParams
  private readonly companyRepository: Repository

  constructor (validator: ValidatorParams, companyRepository: Repository) {
    this.validator = validator
    this.companyRepository = companyRepository
  }

  async getCompanies (): Promise<HttpResponse> {
    try {
      const result = await this.companyRepository.get()
      return {
        statusCode: 200,
        body: result
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async getCompanyById (req: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.companyRepository.getById(req.header.params.id)
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

  async createCompany (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      const newCompany = await this.companyRepository.create(req.body)
      return {
        statusCode: 200,
        body: newCompany
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async putCompany (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      const result = await this.companyRepository.put(req.header.params.id, req.body)
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

  async deleteCompany (req: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.companyRepository.delete(req.header.params.id)
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
