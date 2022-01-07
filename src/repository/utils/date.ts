/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ProductScheduleViewModel } from '../../domain/usecases/product-schedule-view-model'
import { sequelize } from '../../data/sequelize'
import Product from '../../domain/models/product.model'
import { CompanyRepository } from '../company'
import console from 'console'

const productRepository = sequelize.getRepository(Product)

const formatData = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export const addMinutes = async (date1: string, products: ProductScheduleViewModel[]): Promise<string> => {
  const date = new Date(`${date1}-03:00`)
  let minutes = 0
  for (const product of products) {
    minutes = minutes + (await productRepository.findOne({ where: { id: product.id_product } })).service_duration
  }
  date.setMinutes(date.getMinutes() + minutes)
  return formatData(date)
}

export const timeAvailable = async (date1: string, idCompany: number): Promise<any> => { // receber a própria schedule e checar se da tempo
  const date = new Date(`${date1}-03:00`)
  const day = date.toDateString().split(' ')[0]
  const companyOperation = (await new CompanyRepository().getById(idCompany)).dates_of_operation
  for (const dateCompany of companyOperation) {
    if (day.toLowerCase() === dateCompany.day_of_operation.toString().substr(0, 3).toLowerCase()) {
      const dateStartCompany = new Date(`${date1.substring(0, 10)} ${dateCompany.opening_time}-03:00`)
      const dateEndCompany = new Date(`${date1.substring(0, 10)} ${dateCompany.closing_time}-03:00`)
      if (date >= dateStartCompany && date <= dateEndCompany && date >= new Date()) {
        console.log('valid')
        return true
      }
    }
  }
  console.log('invalid')
  return false
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
timeAvailable('2022-01-09 12:00:00', 1).then((result) => console.log())
