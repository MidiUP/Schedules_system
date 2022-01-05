import { HttpRequest, HttpResponse } from '../protocols/http'
import { ValidatorParams } from '../interfaces/validator'
import { serverError, badRequest, notFound } from './helpers/http-helper'
import { Repository } from '../interfaces/repository'

export class ScheduleController {
  private readonly validator: ValidatorParams
  private readonly scheduleRepository: Repository

  constructor (validator: ValidatorParams, scheduleRepository: Repository) {
    this.validator = validator
    this.scheduleRepository = scheduleRepository
  }

  async getSchedules (): Promise<HttpResponse> {
    try {
      const result = await this.scheduleRepository.get()
      return {
        statusCode: 200,
        body: result
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async getScheduleById (req: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.scheduleRepository.getById(req.header.params.id)
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

  async createSchedule (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      const newSchedule = await this.scheduleRepository.create(req.body)
      if (!newSchedule) {
        return {
          statusCode: 404,
          body: { err: 'id_company or id_client not exists' }
        }
      }
      return {
        statusCode: 200,
        body: newSchedule
      }
    } catch (err) {
      console.error(err)
      return serverError()
    }
  }

  async putSchedule (req: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = await this.validator.validate(req.body)
      if (!isValid) {
        return badRequest()
      }
      const result = await this.scheduleRepository.put(req.header.params.id, req.body)
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

  async deleteSchedule (req: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.scheduleRepository.delete(req.header.params.id)
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
