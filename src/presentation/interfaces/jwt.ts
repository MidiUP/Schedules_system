import { LoginViewModel } from '../../domain/usecases/login-view-model'

export interface JwtInterface {
  authenticate(login: LoginViewModel): Promise<string>
}
