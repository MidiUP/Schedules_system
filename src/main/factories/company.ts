import { CompanyController } from '../../presentation/controllers/company'
import { CompanyRepository } from '../../repository/company'
import { Validator } from '../../presentation/utils/validator'

export const makeCompanyController = (): CompanyController => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const companyRepository = new CompanyRepository()
  const validatorParams = new Validator()
  const companyController = new CompanyController(validatorParams, companyRepository)
  return companyController
}
