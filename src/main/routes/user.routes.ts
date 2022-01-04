/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeUserController } from '../factories/user'

export default (router: Router): void => {
  router.get('/user', async (req, res) => {
    const controller = makeUserController()
    const response = await controller.getUsers()
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.get('/user/:id', async (req, res) => {
    const controller = makeUserController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.getUserById(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.post('/user', async (req, res) => {
    const controller = makeUserController()
    const request = {
      header: req.headers,
      body: req.body
    }
    const response = await controller.createUser(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.put('/user/:id', async (req, res) => {
    const controller = makeUserController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.putUser(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.delete('/user/:id', async (req, res) => {
    const controller = makeUserController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.deleteUser(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })
}
