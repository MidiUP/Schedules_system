export class Unauthorized extends Error {
  constructor () {
    super('não autorizado')
  }
}
