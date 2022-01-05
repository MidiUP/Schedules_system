import { ProductScheduleViewModel } from './product-schedule-view-model'

export interface ScheduleViewModel {
  id_company: number
  id_user: number
  date: string
  start_time: string
  end_time: string
  products: ProductScheduleViewModel[]
}
