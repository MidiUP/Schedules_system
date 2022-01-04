/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeLoginController } from '../factories/login'

export default (router: Router): void => {
  router.post('/login', async (req, res) => {
    const controller = makeLoginController()
    const request = {
      header: req.headers,
      body: req.body
    }
    const response = await controller.login(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })
}
