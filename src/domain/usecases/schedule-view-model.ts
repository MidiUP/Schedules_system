import { ProductScheduleViewModel } from './product-schedule-view-model'

export interface ScheduleViewModel {
  id_company: number
  id_user: number
  date_start: string
  date_end: string
  products: ProductScheduleViewModel[]
}
