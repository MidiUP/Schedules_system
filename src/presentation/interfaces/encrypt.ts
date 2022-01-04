export interface Encrypt {
  encrypt (value: string): Promise<string>
  compare (passwordDB: string, passwordReq): Promise<boolean>
}
