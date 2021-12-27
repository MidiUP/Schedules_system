/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeCompanyController } from '../../main/factories/company'

export default (router: Router): void => {
  router.get('/company', async (req, res) => {
    const controller = makeCompanyController()
    const response = await controller.getCompanies()
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.get('/company/:id', async (req, res) => {
    const controller = makeCompanyController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.getCompanyById(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

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

  router.delete('/company/:id', async (req, res) => {
    const controller = makeCompanyController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.deleteCompany(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })
}
