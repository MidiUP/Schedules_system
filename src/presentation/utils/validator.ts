import { ValidatorParams } from '../interfaces/validator'
export class Validator implements ValidatorParams {
  async validate (viewModel: any): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}
