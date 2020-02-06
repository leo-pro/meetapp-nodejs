import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../lib/Mail';

class NewSubscription {
  get key() {
    return 'NewSubscription';
  }

  async handle({ data }) {
    const { subscriber } = data;

    console.log('A fila executou!');

    await Mail.sendMail({
      to: `${subscriber.name} <${subscriber.email}>`,
      subject: 'Nova inscrição',
      template: 'newsubscription',
      context: {
        date: format(parseISO(subscriber.date), "dd 'de' MMMM', às ' H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new NewSubscription();
