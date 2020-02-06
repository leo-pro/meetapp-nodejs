import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../lib/Mail';

class NewSubscription {
  get key() {
    return 'NewSubscription';
  }

  async handle({ data }) {
    const { meetup, user, url } = data;

    console.log('A fila executou!');

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: `Nova inscrição no Meetup ${meetup.title}`,
      template: 'newsubscription',
      context: {
        userName: user.name,
        meetupTitle: meetup.title,
        meetupDescription: meetup.description,
        meetupBanner: url,
        meetupDate: format(
          parseISO(meetup.date),
          "dd 'de' MMMM', às ' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new NewSubscription();
