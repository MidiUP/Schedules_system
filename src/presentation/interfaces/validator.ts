export interface ValidatorParams {
  validate(viewModel: any): Promise<boolean>
}
