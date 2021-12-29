import { Model, Table, Column, ForeignKey } from 'sequelize-typescript'
import { Company } from './company.model'

@Table({ tableName: 'availability_company', timestamps: false })
export class AvailabilityCompany extends Model {
  @Column
  @ForeignKey(() => Company)
  id_company: number

  @Column
  day_of_operation: string

  @Column
  opening_time: string

  @Column
  closing_time: string

  @Column
  is_deleted: boolean
}
export default AvailabilityCompany
