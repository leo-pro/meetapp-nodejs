import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const { title, description, location, date, file } = req.body;

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      file,
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
