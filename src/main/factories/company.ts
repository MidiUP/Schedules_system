import { CompanyController } from '../../presentation/controllers/company'
import { CompanyRepository } from '../../repository/company'
import { Validator } from '../../presentation/utils/validator'
import * as yup from 'yup'

export const makeCompanyController = (): CompanyController => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const companyRepository = new CompanyRepository()
  const validatorParams = new Validator({
    name: yup.string().required(),
    phone: yup.string().min(11).max(11).required(),
    address: yup.string().required(),
    employees: yup.number().integer().required(),
    logo: yup.string().required()
  })
  const companyController = new CompanyController(validatorParams, companyRepository)
  return companyController
}
