import { Model, Table, Column, ForeignKey, HasMany } from 'sequelize-typescript'
import { Company } from './company.model'
import { ProductShcedule } from './product-schedule.model'
import { User } from './user.model'

@Table({ tableName: 'schedule', timestamps: false })
export class Schedule extends Model {
  @Column
  @ForeignKey(() => Company)
  id_company: number

  @Column
  @ForeignKey(() => User)
  id_user: number

  @Column
  date: string

  @Column
  start_time: string

  @Column
  end_time: string

  @Column
  is_deleted: boolean

  @HasMany(() => ProductShcedule)
  products: ProductShcedule[]
}
export default Schedule