import { Notify } from 'quasar';
import { api } from 'boot/axios';

class PushSubscriptionService {
  private publicKey: string | null = null;

  async fetchVapidKey() {
    const response = await api.get(
      'http://localhost:3333/push/vapid-public-key'
    );
    this.publicKey = response.data.key;
  }

  async subscribe() {
    if (!this.publicKey) {
      await this.fetchVapidKey();
    }

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.publicKey,
    });

    await api.post('http://localhost:3333/push/subscribe', subscription);

    Notify.create({
      message: 'Subscribed to notifications.',
      color: 'positive',
    });
  }

  async unsubscribe() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      await api.post('/push/unsubscribe', { endpoint: subscription.endpoint });
      Notify.create({
        message: 'Unsubscribed from notifications.',
        color: 'negative',
      });
    }
  }
}

export default new PushSubscriptionService();
