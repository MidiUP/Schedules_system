/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeAvailabilityCompanyController } from '../factories/availability-company'

export default (router: Router): void => {
  router.get('/availabilityCompany', async (req, res) => {
    const controller = makeAvailabilityCompanyController()
    const response = await controller.getAvailabilityCompanies()
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.get('/availabilityCompany/:id', async (req, res) => {
    const controller = makeAvailabilityCompanyController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.getAvailabilityCompanyById(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.post('/availabilityCompany', async (req, res) => {
    const controller = makeAvailabilityCompanyController()
    const request = {
      header: req.headers,
      body: req.body
    }
    const response = await controller.createAvailabilityCompany(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.put('/availabilityCompany/:id', async (req, res) => {
    const controller = makeAvailabilityCompanyController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.putAvailabilityCompany(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.delete('/availabilityCompany/:id', async (req, res) => {
    const controller = makeAvailabilityCompanyController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.deleteAvailabilityCompany(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })
}
