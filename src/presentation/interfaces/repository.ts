export interface Repository {
  create (ViewModel: any): Promise<any>
  get (): Promise<any>
  getById (id: number): Promise<any>
  put (id: number, object: Object): Promise<any>
  delete (id: number): Promise<any>
}
