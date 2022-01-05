/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeScheduleController } from '../factories/schedule'

export default (router: Router): void => {
  router.get('/schedule', async (req, res) => {
    const controller = makeScheduleController()
    const response = await controller.getSchedules()
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.get('/schedule/:id', async (req, res) => {
    const controller = makeScheduleController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.getScheduleById(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.post('/schedule', async (req, res) => {
    const controller = makeScheduleController()
    const request = {
      header: req.headers,
      body: req.body
    }
    const response = await controller.createSchedule(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.put('/schedule/:id', async (req, res) => {
    const controller = makeScheduleController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.putSchedule(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.delete('/schedule/:id', async (req, res) => {
    const controller = makeScheduleController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.deleteSchedule(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })
}
