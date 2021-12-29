/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeProductController } from '../factories/product'

export default (router: Router): void => {
  router.get('/product', async (req, res) => {
    const controller = makeProductController()
    const response = await controller.getProducts()
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.get('/product/:id', async (req, res) => {
    const controller = makeProductController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.getProductById(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.post('/product', async (req, res) => {
    const controller = makeProductController()
    const request = {
      header: req.headers,
      body: req.body
    }
    const response = await controller.createProduct(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.put('/product/:id', async (req, res) => {
    const controller = makeProductController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.putProduct(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })

  router.delete('/product/:id', async (req, res) => {
    const controller = makeProductController()
    const request = {
      header: req,
      body: req.body
    }
    const response = await controller.deleteProduct(request)
    res.statusCode = response.statusCode
    return res.json(response.body)
  })
}
