import { HttpResponse } from '../../protocols/http'
import { ServerError } from '../../errors/server-error'
import { InvalidParamsError } from '../../errors/invalid-params-error'

export const badRequest = (): HttpResponse => {
  return ({
    statusCode: 400,
    body: new InvalidParamsError()
  })
}

export const serverError = (): HttpResponse => {
  return ({
    statusCode: 500,
    body: new ServerError()
  })
}