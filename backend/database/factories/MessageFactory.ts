import Message from 'App/Models/Message'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Message, ({ faker }) => {
  return {
    content: faker.lorem.sentence(),
    createdBy: faker.helpers.arrayElement([1, 2]),
    channelId: 1,
  }
}).build()
