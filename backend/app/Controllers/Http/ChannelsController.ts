import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export default class ChannelsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      const channels = await user?.related('channels').query()
      return response.ok(channels)
    } catch (error) {
      return response.badRequest({error: error.message})
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.user
      const { name, isPrivate } = request.body()
      const channel = await user?.related('channels').create({ name, isPrivate })
      return response.created(channel)
    } catch (error) {
      return response.badRequest({error: error.message})
    }
  }
}
