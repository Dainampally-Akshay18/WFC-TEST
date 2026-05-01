export const sermonController = {
  async createSermon(req, res, next) {
    // TODO: Implement create sermon logic
    res.status(201).json({ message: 'Sermon created' });
  },

  async getSermon(req, res, next) {
    // TODO: Implement get sermon logic
    res.status(200).json({ message: 'Sermon details' });
  },

  async getAllSermons(req, res, next) {
    // TODO: Implement get all sermons logic
    res.status(200).json({ message: 'All sermons' });
  },

  async updateSermon(req, res, next) {
    // TODO: Implement update sermon logic
    res.status(200).json({ message: 'Sermon updated' });
  },

  async deleteSermon(req, res, next) {
    // TODO: Implement delete sermon logic
    res.status(200).json({ message: 'Sermon deleted' });
  },
};

export default sermonController;
