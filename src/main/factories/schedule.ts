import { Validator } from '../../presentation/utils/validator'
import * as yup from 'yup'
import { ScheduleController } from '../../presentation/controllers/schedule'
import { ScheduleRepository } from '../../repository/schedule'

export const makeScheduleController = (): ScheduleController => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const scheduleRepository = new ScheduleRepository()
  const validatorParams = new Validator({
    id_company: yup.number().integer().required(),
    id_user: yup.number().integer().required(),
    date_start: yup.date().required(),
    products: yup.array().of(yup.object().shape({
      id_product: yup.number().integer().required(),
      quantity_product: yup.number().integer().required()
    })).required()
  })
  const scheduleController = new ScheduleController(validatorParams, scheduleRepository)
  return scheduleController
}
