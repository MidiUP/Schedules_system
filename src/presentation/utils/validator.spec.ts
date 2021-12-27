import { Validator } from './validator'
import * as yup from 'yup'

const makeSut = (): Validator => {
  const sut = new Validator({
    name: yup.string().required(),
    email: yup.string().required(),
    age: yup.number().positive().integer().required()
  })
  return sut
}

describe('tests of validator from yup', () => {
  test('test from valid data', async () => {
    const sut = makeSut()
    const result = await sut.validate({
      name: 'valid_name',
      email: 'valid_mail@mail.com',
      age: 22
    })
    expect(result).toBe(true)
  })

  test('test from invalid data', async () => {
    const sut = makeSut()
    const result = await sut.validate({
      name: 'invalid_name',
      email: 'invalid_mail',
      age: 'invalid_age'
    })
    expect(result).toBe(false)
  })

  test('test if the parameters are being called correctly', async () => {
    const sut = makeSut()
    const validateSpy = jest.spyOn(sut, 'validate')
    await sut.validate({
      name: 'valid_name',
      email: 'valid_mail',
      age: 'valid_age'
    })
    expect(validateSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_mail',
      age: 'valid_age'
    })
  })
})
