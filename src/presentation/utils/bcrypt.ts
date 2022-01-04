import { Encrypt } from '../interfaces/encrypt'
import * as bcrypt from 'bcrypt'

export class Bcrypt implements Encrypt {
  private readonly salts: number
  constructor (salts: number) {
    this.salts = salts
  }

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salts)
  }

  async compare (passwordDB: string, passwordReq): Promise<boolean> {
    return await bcrypt.compareSync(passwordReq, passwordDB)
  }
}
