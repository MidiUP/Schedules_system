import { Model, Table, Column, ForeignKey } from 'sequelize-typescript'
import { Company } from './company.model'

@Table({ tableName: 'product', timestamps: false })
export class Product extends Model {
  @Column
  @ForeignKey(() => Company)
  id_company: number

  @Column
  name: string

  @Column
  description: string

  @Column
  image: string

  @Column
  price: number

  @Column
  service_duration: number

  @Column
  is_deleted: boolean
}
export default Product
