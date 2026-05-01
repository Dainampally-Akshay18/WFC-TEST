import SermonModel from './sermon.model.js';
import { extractYoutubeId } from '../../utils/extractYoutubeId.js';

export const sermonService = {
  async createSermon(sermonData, userId) {
    // TODO: Implement business logic
    // - Extract YouTube ID if URL provided
    // - Validate sermon data
    // - Create sermon in DB
  },

  async getSermon(sermonId) {
    // TODO: Implement business logic
    // - Query sermon by ID
    // - Return sermon data
  },

  async getAllSermons(filters = {}) {
    // TODO: Implement business logic
    // - Query sermons with filters
    // - Return paginated results
  },

  async updateSermon(sermonId, updateData, userId) {
    // TODO: Implement business logic
    // - Validate update
    // - Update sermon in DB
  },

  async deleteSermon(sermonId, userId) {
    // TODO: Implement business logic
    // - Delete sermon
  },
};

export default sermonService;
