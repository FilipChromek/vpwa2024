import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';
import User from "App/Models/User";

export default class UserStatusController {
  public async changeStatus({ socket, auth }: WsContextContract, status: string) {
    const userId = auth.user!.id;

    if (!userId) {
      return;
    }
    await User.query().where('id', userId).update({ status });

    socket.nsp.emit('userStatusUpdate', { userId, status });
  }
}
