import { Repository } from '../presentation/interfaces/repository'
import { sequelize } from '../data/sequelize'
import Company from '../domain/models/company.model'
import User from '../domain/models/user.model'
import { UserViewModel } from '../domain/usecases/user-view-model'

export class UserRepository implements Repository {
  private readonly repository = sequelize.getRepository(User)
  private readonly repositoryCompany = sequelize.getRepository(Company)
  async create (ViewModel: UserViewModel): Promise<any> {
    const company = await this.repositoryCompany.findOne({ where: { id: ViewModel.id_company, is_deleted: false } })
    if (company) {
      const result = await this.repository.create(ViewModel)
      return result
    }
    return null
  }

  async get (): Promise<any> {
    const result = await this.repository.findAll({ where: { is_deleted: false } })
    return result
  }

  async getById (id: number): Promise<any> {
    const result = await this.repository.findOne({ where: { id, is_deleted: false } })
    if (result) {
      return result
    }
    return null
  }

  async put (id: number, user: UserViewModel): Promise<any> {
    const result = await this.repository.findOne({ where: { id, is_deleted: false } })
    if (result) {
      await result.update(user)
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

  async findByPhone (phone: string): Promise<any> {
    const result = await this.repository.findOne({ where: { phone } })
    if (result) {
      return result
    }
    return null
  }
}
