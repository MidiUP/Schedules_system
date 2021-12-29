import { Model, Table, Column, HasMany } from 'sequelize-typescript'
import AvailabilityCompany from './availability-company.model'

@Table({ tableName: 'company', timestamps: false })
export class Company extends Model {
  @Column
  public name: string

  @Column
  phone: string

  @Column
  address: string

  @Column
  employees: number

  @Column
  logo: string

  @Column
  is_deleted: boolean

  @HasMany(() => AvailabilityCompany)
  dates_of_operation: AvailabilityCompany[]
}
export default Company
