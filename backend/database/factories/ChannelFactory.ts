import Channel from 'App/Models/Channel'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'

export default Factory.define(Channel, ({ faker}) => {
  return {
    name: faker.lorem.words(2),
    createdBy: faker.datatype.number({ min: 1, max: 10 }),
    isPrivate: faker.datatype.boolean(),
    lastActivity: DateTime.fromJSDate(faker.date.recent()),
  }
}).build()
