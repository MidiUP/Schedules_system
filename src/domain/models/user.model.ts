import { Model, Table, Column, ForeignKey } from 'sequelize-typescript'
import { Company } from './company.model'

@Table({ tableName: 'user', timestamps: false })
export class User extends Model {
  @Column
  @ForeignKey(() => Company)
  id_company: number

  @Column
  name: string

  @Column
  phone: string

  @Column
  password: string

  @Column
  cpf: string

  @Column
  email: string

  @Column
  is_deleted: boolean
}
export default User
