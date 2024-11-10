import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserFactory from "Database/factories/UserFactory";
import User from "App/Models/User";

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.create({
      email: 'adam@adam.com',
      password: 'adamadam',
      firstName: 'Adam',
      lastName: 'Adam',
      username: 'adamski',
    })
    await UserFactory.createMany(10)
  }
}
