import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PushSubscription from 'App/Models/PushSubscription';

export default class PushSubscriptionController {
  public async getVapidPublicKey({ response }: HttpContextContract) {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      return response.internalServerError({ message: 'VAPID public key not configured.' });
    }

    return response.ok({ key: vapidPublicKey });
  }

  public async subscribe({ request, auth, response }: HttpContextContract) {
    const { endpoint, keys } = request.only(['endpoint', 'keys']);
    const user = auth.user;

    if (!user) {
      return response.unauthorized({ message: 'You must be logged in to subscribe.' });
    }

    try {
      await PushSubscription.updateOrCreate(
        { userId: user.id, endpoint },
        { p256dh: keys.p256dh, auth: keys.auth }
      );

      return response.ok({ message: 'Push subscription saved successfully.' });
    } catch (error) {
      console.error('Error saving push subscription:', error);
      return response.internalServerError({ message: 'Failed to save push subscription.' });
    }
  }

  public async unsubscribe({ request, auth, response }: HttpContextContract) {
    const { endpoint } = request.only(['endpoint']);
    const user = auth.user;

    if (!user) {
      return response.unauthorized({ message: 'You must be logged in to unsubscribe.' });
    }

    try {
      await PushSubscription.query()
        .where('user_id', user.id)
        .andWhere('endpoint', endpoint)
        .delete();

      return response.ok({ message: 'Push subscription removed successfully.' });
    } catch (error) {
      console.error('Error removing push subscription:', error);
      return response.internalServerError({ message: 'Failed to remove push subscription.' });
    }
  }

  public async sendTestNotification({ auth, response }: HttpContextContract) {
    const user = auth.user;

    if (!user) {
      return response.unauthorized({ message: 'You must be logged in to send notifications.' });
    }

    const webpush = require('web-push');
    webpush.setVapidDetails(
      'mailto:adam.kacmar59@gmail.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    try {
      const subscriptions = await PushSubscription.query().where('user_id', user.id);

      for (const sub of subscriptions) {
        const payload = {
          title: 'Test Notification',
          body: 'This is a test notification.',
          url: '/',
        };

        const subscription = {
          endpoint: sub.endpoint,
          p256dh: sub.p256dh,
          auth: sub.auth,
        };

        await webpush.sendNotification(subscription, JSON.stringify(payload));
      }

      return response.ok({ message: 'Test notification sent successfully.' });
    } catch (error) {
      console.error('Error sending test notification:', error);
      return response.internalServerError({ message: 'Failed to send test notification.' });
    }
  }
}
