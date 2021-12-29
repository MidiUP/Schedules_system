import { Repository } from '../presentation/interfaces/repository'
import { CompanyViewModel } from '../domain/usecases/company-view-model'
import { sequelize } from '../data/sequelize'
import { Company } from '../domain/models/company.model'
import { AvailabilityCompany } from '../domain/models/availability-company.model'

export class CompanyRepository implements Repository {
  private readonly repository = sequelize.getRepository(Company)
  async create (ViewModel: CompanyViewModel): Promise<any> {
    const result = await this.repository.create(ViewModel)
    return result
  }

  async get (): Promise<any> {
    const result = await this.repository.findAll({ where: { is_deleted: false }, include: [AvailabilityCompany] })
    return result
  }

  async getById (id: number): Promise<any> {
    const result = await this.repository.findOne({ where: { id, is_deleted: false } })
    if (result) {
      return result
    }
    return null
  }

  async put (id: number, company: CompanyViewModel): Promise<any> {
    const result = await this.repository.findOne({ where: { id, is_deleted: false } })
    if (result) {
      await result.update(company)
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
