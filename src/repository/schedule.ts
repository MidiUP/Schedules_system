/* eslint-disable @typescript-eslint/no-misused-promises */
import { Repository } from '../presentation/interfaces/repository'
import { sequelize } from '../data/sequelize'
import Company from '../domain/models/company.model'
import Schedule from '../domain/models/schedule.model'
import { ScheduleViewModel } from '../domain/usecases/schedule-view-model'
import ProductShcedule from '../domain/models/product-schedule.model'
import User from '../domain/models/user.model'
import Product from '../domain/models/product.model'
import { addMinutes, timeAvailable } from './utils/date'

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
      const schedule = Object.assign({}, viewModel, { date_end: await addMinutes(viewModel) })
      if (!(await timeAvailable(schedule))) {
        return null
      }
      const result = await this.repository.create(schedule)
      for (const product of viewModel.products) {
        const newProductSchedule = Object.assign({}, product, { id_schedule: result.id, id_company: viewModel.id_company })
        await this.repositoryProductSchedule.create(newProductSchedule)
      }
      return result
    }
    return null
  }

  async get (): Promise<any> {
    const result = await this.repository.findAll({ where: { is_deleted: false }, include: [{ model: User, attributes: ['id', 'name', 'phone', 'cpf', 'email'] }, { model: ProductShcedule, where: { is_deleted: false }, include: [{ model: Product, where: { is_deleted: false }, attributes: ['name', 'description', 'image', 'price', 'service_duration'] }], attributes: ['quantity_product'] }] })
    return result
  }

  async getById (id: number): Promise<any> {
    const result = await this.repository.findOne({ where: { id, is_deleted: false }, include: [{ model: User, attributes: ['id', 'name', 'phone', 'cpf', 'email'] }, { model: ProductShcedule, where: { is_deleted: false }, include: [{ model: Product, attributes: ['name', 'description', 'image', 'price', 'service_duration'] }], attributes: ['quantity_product'] }] })
    if (result) {
      return result
    }
    return null
  }

  async put (id: number, schedule: ScheduleViewModel): Promise<any> {
    const result = await this.repository.findOne({ where: { id, is_deleted: false } })
    if (result) {
      if (schedule.products.length > 0) {
        if (!(await timeAvailable(Object.assign({}, schedule, { date_end: await addMinutes(schedule) })))) {
          return null
        }
        const productSchedules = await this.repositoryProductSchedule.findAll({ where: { id_schedule: id, is_deleted: false } })
        // deletar produtos antigos
        for (const productSchedule of productSchedules) {
          await productSchedule.update(Object.assign({}, productSchedule, { is_deleted: true }))
          await productSchedule.save()
        }
        // cadastrar os novos
        for (const product of schedule.products) {
          const newProductSchedule = Object.assign({}, product, { id_schedule: result.id, id_company: schedule.id_company })
          await this.repositoryProductSchedule.create(newProductSchedule)
        }
      } else {
        const productSchedules = await this.repositoryProductSchedule.findAll({ where: { id_schedule: id, is_deleted: false } })
        let newSchedule = Object.assign({}, schedule, { products: productSchedules })
        newSchedule = Object.assign({}, newSchedule, { date_end: await addMinutes(newSchedule) })
        if ((await timeAvailable(Object.assign({}, newSchedule, { date_end: await addMinutes(newSchedule) })))) {
          await result.update(Object.assign({}, newSchedule, { date_end: await addMinutes(newSchedule) }))
          return await result.save()
        } else {
          return null
        }
      }
      await result.update(Object.assign({}, schedule, { date_end: await addMinutes(schedule) }))
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
