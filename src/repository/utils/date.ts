/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ProductScheduleViewModel } from '../../domain/usecases/product-schedule-view-model'
import { sequelize } from '../../data/sequelize'
import Product from '../../domain/models/product.model'
import { CompanyRepository } from '../company'
import console from 'console'
import { ScheduleViewModel } from '../../domain/usecases/schedule-view-model'

const productRepository = sequelize.getRepository(Product)

const formatData = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const minutesOfProducts = async (products: ProductScheduleViewModel[]): Promise<number> => {
  let minutes = 0
  for (const product of products) {
    minutes = minutes + (await productRepository.findOne({ where: { id: product.id_product } })).service_duration
  }
  return minutes
}

export const addMinutes = async (schedule: ScheduleViewModel): Promise<string> => {
  const date = new Date(`${schedule.date_start}-03:00`)
  const minutes = await minutesOfProducts(schedule.products)
  date.setMinutes(date.getMinutes() + minutes)
  return formatData(date)
}

export const timeAvailable = async (schedule: ScheduleViewModel): Promise<any> => {
  const dateStart = new Date(`${schedule.date_start}-03:00`)
  const dateEnd = new Date(`${schedule.date_end}-03:00`)
  const day = dateStart.toDateString().split(' ')[0]
  const companyOperation = (await new CompanyRepository().getById(schedule.id_company)).dates_of_operation
  for (const dateCompany of companyOperation) {
    if (day.toLowerCase() === dateCompany.day_of_operation.toString().substr(0, 3).toLowerCase()) {
      const dateStartCompany = new Date(`${dateStart.getFullYear()}-${dateStart.getMonth() + 1}-${dateStart.getDate()} ${dateCompany.opening_time}-03:00`)
      const dateEndCompany = new Date(`${dateEnd.getFullYear()}-${dateEnd.getMonth() + 1}-${dateEnd.getDate()} ${dateCompany.closing_time}-03:00`)
      if (dateStart >= dateStartCompany && dateStart >= new Date() && dateEnd <= dateEndCompany) {
        return true
      }
    }
  }
  return false
}

const scheduleTest = {
  id_company: 1,
  id_user: 1,
  date_start: '2022-1-16 16:00:0',
  date_end: null,
  products: [
    {
      id_product: 1,
      quantity_product: 3
    }
    // {
    //   id_product: 3,
    //   quantity_product: 3
    // },
    // {
    //   id_product: 5,
    //   quantity_product: 3
    // }
  ]
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
timeAvailable(scheduleTest).then((result) => console.log())
