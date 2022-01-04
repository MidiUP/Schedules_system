import * as Jwt from 'jsonwebtoken'
import { LoginViewModel } from '../../domain/usecases/login-view-model'
import { JwtInterface } from '../interfaces/jwt'
import { jwtConfig } from '../../config/jwt'
import { UserRepository } from '../../repository/user'
import { Encrypt } from '../interfaces/encrypt'

export class JwtClass implements JwtInterface {
  private readonly repository: UserRepository
  private readonly encrypt: Encrypt

  constructor (repository: UserRepository, encrypt: Encrypt) {
    this.repository = repository
    this.encrypt = encrypt
  }

  async authenticate (login: LoginViewModel): Promise<string> {
    const user = await this.repository.findByPhone(login.phone)
    if (!user) {
      return null
    }
    if (await this.encrypt.compare(user.password, login.password)) {
      return Jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })
    }
    return null
  }
}
