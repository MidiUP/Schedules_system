import { ValidatorParams } from '../interfaces/validator'
import * as yup from 'yup'

export class Validator implements ValidatorParams {
  private readonly viewModel: any

  constructor (viewModel: any) {
    this.viewModel = viewModel
  }

  async validate (viewModelTest: any): Promise<boolean> {
    const schema = yup.object().shape(this.viewModel)
    if ((await schema.isValid(viewModelTest))) {
      return new Promise(resolve => resolve(true))
    } else {
      return new Promise(resolve => resolve(false))
    }
  }
}
