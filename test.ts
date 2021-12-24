import { sequelize } from './src/data/sequelize'
import { Company } from './src/domain/models/company.model'

try {
  sequelize.addModels([Company])
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  const repository = sequelize.getRepository(Company)
  const teste = async (): Promise<void> => { (await repository.create({ name: 'empresa 01', phone: '869999999', employees: 2, logo: '.img', address: 'address' })) }
  // const companies = async (): Promise<company[]> => await company.findAll()
  // const companyAdd = async (): Promise<Company> => await Company.create({ name: 'empresa 01', phone: '869999999', employees: 2, logo: '.img' })
  console.log(teste())
} catch (err) {
  console.log(err)
  console.log('uhhhhhhhh huuuuuuuuuuu knjnjnjnjnjnjnjnjnjnj jknnnnnnnn')
}
