import { Validator } from '../../presentation/utils/validator'
import * as yup from 'yup'
import { ProductController } from '../../presentation/controllers/product'
import { ProductRepository } from '../../repository/product'

export const makeProductController = (): ProductController => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const productRepository = new ProductRepository()
  const validatorParams = new Validator({
    id_company: yup.number().integer().required(),
    name: yup.string().required(),
    description: yup.string().required(),
    price: yup.number().required(),
    service_duration: yup.number().integer().required(),
    image: yup.string().required()
  })
  const productController = new ProductController(validatorParams, productRepository)
  return productController
}
