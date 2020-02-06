import { Op } from 'sequelize';
import * as Yup from 'yup';
import { startOfDay, endOfDay, isBefore, parseISO } from 'date-fns';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const where = {};
    const { page = 1 } = req.query;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url'],
            },
          ],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['url'],
        },
      ],
      limit: 10,
      offset: (page - 1) * 20,
      order: ['date'],
    });

    return res.send(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { title, description, location, date, banner_id } = req.body;

    // Validation for Past Dates
    if (isBefore(parseISO(date), new Date())) {
      return res
        .status(400)
        .json({ error: 'You cannot create a meetup with past date.' });
    }

    const user_id = req.userId;

    await Meetup.create({
      title,
      description,
      location,
      date,
      banner_id,
      user_id,
    });

    const { name } = await User.findByPk(user_id);

    return res.json({
      title,
      description,
      location,
      name,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    // Validation Schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized.' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Meetup date invalid.' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't update past meetups." });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const { meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId);

    if (meetup.past) {
      return res.status(400).json({ error: 'You cannot delete past meetups.' });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
