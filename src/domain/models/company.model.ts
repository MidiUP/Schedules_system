import { Model, Table, Column } from 'sequelize-typescript'

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

  // @Column
  // @AllowNull(false)
  // is_deleted: boolean
}
