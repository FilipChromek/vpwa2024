import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    email: schema.string({}, [
      rules.email(),
      rules.unique({
        table: 'users',
        column: 'email',
      }),
    ]),
    password: schema.string({}, [
      rules.minLength(8)
    ]),
    firstName: schema.string({}, [
      rules.trim()
    ]),
    lastName: schema.string({}, [
      rules.trim()
    ]),
    username: schema.string({}, [
      rules.trim(),
      rules.unique({
        table: 'users',
        column: 'username',
      })
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'email.required': 'Email is required',
    'email.email': 'Enter a valid email address',
    'email.unique': 'This email is already registered',

    'password.required': 'Password is required',
    'password.minLength': 'Password should be at least 6 characters long',
    'password_confirmation.confirmed': 'Passwords do not match',

    'firstName.required': 'First name is required for registration',

    'lastName.required': 'Last name is required for registration',

    'username.required': 'Username is required for registration',
    'username.unique': 'This username is already taken',
  }
}
