import User, {UserStatus} from 'App/Models/User'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Hash from "@ioc:Adonis/Core/Hash";

class AuthService {
  public async register(data: { email: string; password: string, firstName: string, lastName: string, username: string }, auth: HttpContextContract['auth']) {
    const user = await User.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      status: UserStatus.OFFLINE,
    })

    const token = await auth.use('api').generate(user)
    return { user, token }
  }

  public async login(data: { email: string; password: string }, auth: HttpContextContract['auth']) {
    const user = await User.findBy('email', data.email)
    if (!user || !(await Hash.verify(user.password, data.password))) {
      throw new Error('Invalid credentials')
    }

    user.status = UserStatus.ONLINE
    await user.save()

    const token = await auth.use('api').generate(user)
    return { user, token }
  }

  public async logout(auth: HttpContextContract['auth']) {
    const user = await auth.user
    if (user){
      user.status = UserStatus.OFFLINE
      await user.save()
    }

    await auth.use('api').logout()
  }
  public async changeStatus(auth: HttpContextContract['auth'], status:string) {
    const user = await auth.user
    if (user){
      if (status=="Online"){
        user.status = UserStatus.ONLINE
      }
      else if( status == "DND"){

        user.status = UserStatus.DND
      }
      else if(status=="Away"){

        user.status = UserStatus.AWAY
      }
      else if(status == "Offline"){

        user.status = UserStatus.OFFLINE

      }
      
      await user.save()
    }

   
  }
}

export default new AuthService()
