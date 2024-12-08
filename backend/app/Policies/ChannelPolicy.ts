import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from "App/Models/User";
import Channel from "App/Models/Channel";

export default class ChannelPolicy extends BasePolicy {
  public async isChannelAdmin(user: User, channel: Channel) {
    return channel.createdBy === user.id;
  }
}
