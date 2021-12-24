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
    const result = await this.repository.findAll()
    return result
  }
}
