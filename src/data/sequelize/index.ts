import { Sequelize } from 'sequelize-typescript'
import path from 'path'

export const sequelize = new Sequelize({
  database: 'schedules_api',
  dialect: 'mysql',
  username: 'root',
  password: 'Delivery@2120',
  storage: ':memory:',
  models: [path.resolve(__dirname, '../', '../', 'domain', 'models')]
})
