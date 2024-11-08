import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from "@ioc:Adonis/Core/Hash";

class AuthService {
  public async register(data: { email: string; password: string, firstName: string, lastName: string, nickname: string }, auth: HttpContextContract['auth']) {
    const user = await User.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      nickname: data.nickname,
    })

    const token = await auth.use('api').generate(user)
    return { user, token }
  }

  public async login(data: { email: string; password: string }, auth: HttpContextContract['auth']) {
    const user = await User.findBy('email', data.email)
    if (!user || !(await Hash.verify(user.password, data.password))) {
      throw new Error('Invalid credentials')
    }

    const token = await auth.use('api').generate(user)
    return { user, token }
  }

  public async logout(auth: HttpContextContract['auth']) {
    await auth.use('api').logout()
  }
}

export default new AuthService()
