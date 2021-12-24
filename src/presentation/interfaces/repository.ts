export interface Repository {
  create (ViewModel: any): Promise<any>
  get (): Promise<any>
}
