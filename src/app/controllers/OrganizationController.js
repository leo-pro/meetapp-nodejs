import Meetup from '../models/Meetup';
import File from '../models/File';

class OrganizationController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      attributes: [
        'id',
        'title',
        'description',
        'location',
        'date',
        'banner_id',
      ],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['url'],
        },
      ],
    });

    return res.json(meetups);
  }
}

export default new OrganizationController();
