import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext';
import Database from "@ioc:Adonis/Lucid/Database";

export default class UserStatusController {
  public async changeStatus({ socket, auth }: WsContextContract, status: string) {
    const userId = auth.user!.id;

    await Database.from('users').where('id', userId).update({ status });

    socket.nsp.emit('userStatusUpdate', { userId, status });
  }
}
