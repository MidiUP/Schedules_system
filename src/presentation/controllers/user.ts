import { HttpRequest, HttpResponse } from '../protocols/http'
import { ValidatorParams } from '../interfaces/validator'
import { serverError, badRequest, notFound } from './helpers/http-helper'
import { Repository } from '../interfaces/repository'
import { Encrypt } from '../interfaces/encrypt'

export class UserController {
  private readonly validator: ValidatorParams
  private readonly userRepository: Repository
  private readonly bcrypt: Encrypt

  constructor (validator: ValidatorParams, userRepository: Repository, bcrypt: Encrypt) {
    this.validator = validator
    this.userRepository = userRepository
    this.bcrypt = bcrypt
  }

  async getUsers (): Promise<HttpResponse> {
    try {
      const result = await this.userRepository.get()
      return {
        statusCode: 200,
        body: result
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async getUserById (req: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.userRepository.getById(req.header.params.id)
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

  async createUser (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      const user = Object.assign({}, req.body, { password: await this.bcrypt.encrypt(req.body.password) })
      const newUser = await this.userRepository.create(user)
      if (!newUser) {
        return {
          statusCode: 404,
          body: { err: 'id_company not exists' }
        }
      }
      return {
        statusCode: 200,
        body: newUser
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async putUser (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      const result = await this.userRepository.put(req.header.params.id, req.body)
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

  async deleteUser (req: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.userRepository.delete(req.header.params.id)
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
