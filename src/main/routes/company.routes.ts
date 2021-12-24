import { Router } from 'express'
import { makeCompanyController } from '../../main/factories/company'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/company', async (req, res) => {
    const controller = makeCompanyController()
    const request = req.body
    const response = await controller.getCompanies(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/company', async (req, res) => {
    const controller = makeCompanyController()
    const request = {
      header: req.headers,
      body: req.body
    }
    const response = await controller.createCompany(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })
}
