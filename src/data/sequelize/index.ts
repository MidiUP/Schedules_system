import { Sequelize } from 'sequelize-typescript'

export const sequelize = new Sequelize({
  database: 'schedules_api',
  dialect: 'mysql',
  username: 'root',
  password: 'Delivery@2120',
  storage: ':memory:',
  // eslint-disable-next-line node/no-path-concat
  models: [__dirname + '/**/*.model.ts']
})
