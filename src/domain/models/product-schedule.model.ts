import { Model, Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Company } from './company.model'
import Product from './product.model'
import Schedule from './schedule.model'

@Table({ tableName: 'product_schedule', timestamps: false })
export class ProductShcedule extends Model {
  @Column
  @ForeignKey(() => Company)
  id_company: number

  @Column
  @ForeignKey(() => Schedule)
  id_schedule: number

  @Column
  @ForeignKey(() => Product)
  id_product: number

  @Column
  quantity_product: number

  @Column
  is_deleted: boolean

  @BelongsTo(() => Product, 'id_product')
  product: Product
}
export default ProductShcedule
