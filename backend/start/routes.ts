/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
}).middleware('auth')

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.post('/changestatus', 'AuthController.changestatus')

Route.group(() => {
  Route.post('/logout', 'AuthController.logout')
}).middleware('auth')

Route.group(() => {
  Route.get('/channels', 'ChannelsController.index').middleware('auth')
  Route.get('/channels/:id/users', 'ChannelsController.listChannelUsers').middleware('auth')
  Route.post('/channels', 'ChannelsController.store').middleware('auth')
  Route.post('/channels/:id/invite', 'ChannelsController.inviteUser').middleware('auth')
  Route.post('/channels/:id/revoke', 'ChannelsController.revokeUser').middleware('auth')
  Route.post('/channels/find-or-create', 'ChannelsController.findOrCreate').middleware('auth');
  Route.delete('/channels/:id', 'ChannelsController.destroy').middleware('auth')
  Route.delete('/channels/:id/remove-user', 'ChannelsController.removeUser').middleware('auth')
}).prefix('api')

Route.get('/api/current-user', 'AuthController.currentUser').middleware('auth')

