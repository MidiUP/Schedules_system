import { JwtInterface } from '../interfaces/jwt'
import { ValidatorParams } from '../interfaces/validator'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest, serverError, unauthorized } from './helpers/http-helper'

export class LoginController {
  private readonly validator: ValidatorParams
  private readonly jwt: JwtInterface
  constructor (validator: ValidatorParams, jwt: JwtInterface) {
    this.validator = validator
    this.jwt = jwt
  }

  async login (req: HttpRequest): Promise<HttpResponse> {
    try {
      if (!(await this.validator.validate(req.body))) {
        return badRequest()
      }
      const token = await this.jwt.authenticate(req.body)
      if (!token) {
        return unauthorized()
      }
      return {
        statusCode: 200,
        body: token
      }
    } catch (err) {
      return serverError()
    }
  }
}
