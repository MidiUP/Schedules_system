import { Validator } from '../../presentation/utils/validator'
import * as yup from 'yup'
import { AvailabilityCompanyController } from '../../presentation/controllers/availability-company'
import { AvailabilityCompanyRepository } from '../../repository/availability-company'

export const makeAvailabilityCompanyController = (): AvailabilityCompanyController => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const availabilityCompanyRepository = new AvailabilityCompanyRepository()
  const validatorParams = new Validator({
    id_company: yup.number().integer().required(),
    day_of_operation: yup.string().required(),
    opening_time: yup.string().required(),
    closing_time: yup.string().required()
  })
  const availabilityCompanyController = new AvailabilityCompanyController(validatorParams, availabilityCompanyRepository)
  return availabilityCompanyController
}
