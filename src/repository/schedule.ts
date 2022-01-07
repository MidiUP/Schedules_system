/* eslint-disable @typescript-eslint/no-misused-promises */
import { Repository } from '../presentation/interfaces/repository'
import { sequelize } from '../data/sequelize'
import Company from '../domain/models/company.model'
import Schedule from '../domain/models/schedule.model'
import { ScheduleViewModel } from '../domain/usecases/schedule-view-model'
import ProductShcedule from '../domain/models/product-schedule.model'
import User from '../domain/models/user.model'
import Product from '../domain/models/product.model'
import { addMinutes } from './utils/date'

export class ScheduleRepository implements Repository {
  private readonly repository = sequelize.getRepository(Schedule)
  private readonly repositoryCompany = sequelize.getRepository(Company)
  private readonly repositoryUser = sequelize.getRepository(User)
  private readonly repositoryProductSchedule = sequelize.getRepository(ProductShcedule)
  private readonly repositoryProduct = sequelize.getRepository(Product)

  async create (viewModel: ScheduleViewModel): Promise<any> {
    const company = await this.repositoryCompany.findOne({ where: { id: viewModel.id_company, is_deleted: false } })
    const user = await this.repositoryUser.findOne({ where: { id: viewModel.id_company, is_deleted: false } })
    if (company && user) {
      for (const product of viewModel.products) {
        const existsProduct = await this.repositoryProduct.findOne({ where: { id: product.id_product, is_deleted: false } })
        if (!existsProduct) {
          return null
        }
      }
      const result = await this.repository.create(Object.assign({}, viewModel, { date_end: await addMinutes(viewModel.date_start, viewModel.products) }))
      for (const product of viewModel.products) {
        const newProductSchedule = Object.assign({}, product, { id_schedule: result.id, id_company: viewModel.id_company })
        await this.repositoryProductSchedule.create(newProductSchedule)
      }
      return result
    }
    return null
  }

  async get (): Promise<any> {
    const result = await this.repository.findAll({ where: { is_deleted: false }, include: [{ model: ProductShcedule, include: [{ model: Product, attributes: ['name', 'description', 'image', 'price', 'service_duration'] }], attributes: ['quantity_product'] }] })
    return result
  }

  async getById (id: number): Promise<any> {
    const result = await this.repository.findOne({ where: { id, is_deleted: false }, include: [{ model: ProductShcedule, include: [{ model: Product, attributes: ['name', 'description', 'image', 'price', 'service_duration'] }], attributes: ['quantity_product'] }] })
    if (result) {
      return result
    }
    return null
  }

  // OLHAR PUT COM CALMA
  async put (id: number, schedule: ScheduleViewModel): Promise<any> {
    const result = await this.repository.findOne({ where: { id, is_deleted: false } })
    if (result) {
      await result.update(schedule)
      return await result.save()
    }
    return null
  }

  async delete (id: number): Promise<any> {
    const result = await this.repository.findOne({ where: { id, is_deleted: false } })
    if (result) {
      result.is_deleted = true
      await result.update(result)
      return await result.save()
    }
    return null
  }
}
