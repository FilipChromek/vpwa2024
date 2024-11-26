import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import RegisterValidator from "App/Validators/RegisterValidator";
import LoginValidator from "App/Validators/LoginValidator";
import AuthService from "App/Services/AuthService";

export default class AuthController {
  async register({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(RegisterValidator)

    try {
      const result = await AuthService.register(payload, auth)
      return response.created(result)
    } catch (error) {
      return response.badRequest({error: error.message})
    }
  }

  async login({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(LoginValidator)

    try {
      const result = await AuthService.login(payload, auth)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({error: error.message})
    }
  }

  async logout({ auth, response }: HttpContextContract) {
    await AuthService.logout(auth)
    return response.ok({message: 'Logged out successfully'})
  }

  async currentUser({ auth }: HttpContextContract) {
    return auth.user!.serialize()
  }
  async changeStatus({ request, auth, response }: HttpContextContract) {
    try {
      // Extract status from the request payload
      const { status } = request.only(['status'])

      // Ensure status is provided
      if (!status) {
        return response.badRequest({ message: 'Status is required' })
      }

      // Call AuthService to handle the status change logic
      await AuthService.changeStatus(auth, status)

      // Respond with a success message
      return response.ok({ message: 'Status changed successfully' })
    } catch (error) {
      console.error('Error changing status:', error)
      return response.internalServerError({ message: 'An error occurred while changing status' })
    }
  }

}
