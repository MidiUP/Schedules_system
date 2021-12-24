import { HttpRequest, HttpResponse } from '../protocols/http'
import { ValidatorParams } from '../interfaces/validator'
import { serverError, badRequest } from '../controllers/helpers/http-helper'

export class CompanyController {
  private readonly validator: ValidatorParams

  constructor (validator: ValidatorParams) {
    this.validator = validator
  }

  async getCompany (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      return {
        statusCode: 200,
        body: { ok: true }
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
      return {
        statusCode: 200,
        body: { ok: true }
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }
}
