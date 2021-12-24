import { HttpRequest, HttpResponse } from '../protocols/http'
import { ValidatorParams } from '../interfaces/validator'
import { serverError, badRequest } from '../controllers/helpers/http-helper'
import { Repository } from '../interfaces/repository'

export class CompanyController {
  private readonly validator: ValidatorParams
  private readonly companyRepository: Repository

  constructor (validator: ValidatorParams, companyRepository: Repository) {
    this.validator = validator
    this.companyRepository = companyRepository
  }

  async getCompanies (req: HttpRequest): Promise<HttpResponse> {
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
}
