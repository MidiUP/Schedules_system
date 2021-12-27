import { Repository } from '../presentation/interfaces/repository'
import { CompanyViewModel } from '../domain/usecases/company-view-model'
import { sequelize } from '../data/sequelize'
import { Company } from '../domain/models/company.model'

sequelize.addModels([Company])

export class CompanyRepository implements Repository {
  private readonly repository = sequelize.getRepository(Company)
  async create (ViewModel: CompanyViewModel): Promise<any> {
    const result = await this.repository.create(ViewModel)
    return result
  }

  async get (): Promise<any> {
    const result = await this.repository.findAll({ where: { is_deleted: false } })
    return result
  }

  async getById (id: number): Promise<any> {
    const result = await this.repository.findByPk(id)
    return result
  }

  async delete (id: number): Promise<any> {
    const result = await this.repository.findByPk(id)
    result.is_deleted = true
    await result.update(result)
    return await result.save()
  }
}
