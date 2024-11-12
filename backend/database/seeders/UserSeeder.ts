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
    await User.create({
      email: 'filip@filip.com',
      password: 'filipfilip',
      firstName: 'Filip',
      lastName: 'Filip',
      username: 'filipanom413',
    })
    await UserFactory.createMany(10)
  }
}
