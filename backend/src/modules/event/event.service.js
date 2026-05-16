import Event from './event.model.js';
import User from '../auth/auth.model.js';
import { notificationHelper } from '../../services/notification.helper.js';
import { auditHelper } from '../../services/audit.helper.js';

/**
 * ============================================
 * EVENT SERVICE - ALL BUSINESS LOGIC
 * ============================================
 * 
 * Handles:
 * - Creating events with visibility/branch rules
 * - Updating events with permission checks
 * - Deleting events
 * - Fetching events with role-based filtering
 * - Notifications on event creation
 * - Audit logging
 */

export const eventService = {
  /**
   * 📝 CREATE EVENT
   * USER: only BRANCH events for their own branch
   * LEADER: BRANCH + GLOBAL events
   * MASTER_ADMIN: any event
   */
  async createEvent(eventData, userId, userRole, userBranch) {
    try {
      console.log('📍 Step 1: Starting createEvent');
      console.log('📍 Params:', { userId, userRole, userBranch, visibility: eventData.visibility, branch: eventData.branch });
      
      // ✅ Validate visibility + branch rules
      if (userRole === 'USER' && eventData.visibility === 'GLOBAL') {
        throw new Error('Users cannot create global events');
      }

      if (userRole === 'USER' && eventData.branch !== userBranch) {
        throw new Error('Users can only create events for their own branch');
      }

      // ✅ Enforce: GLOBAL events have branch = null
      if (eventData.visibility === 'GLOBAL') {
        eventData.branch = null;
      }

      // ✅ For BRANCH events, ensure branch is specified
      if (eventData.visibility === 'BRANCH' && !eventData.branch) {
        throw new Error('Branch event must specify a branch');
      }

      console.log('📍 Step 2: Validation passed');

      // ✅ Create event
      const event = new Event({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        visibility: eventData.visibility,
        branch: eventData.branch || null,
        createdBy: userId,
        createdByRole: userRole,
        createdByBranch: userBranch,
      });

      console.log('📍 Step 3: Event object created:', {
        title: event.title,
        visibility: event.visibility,
        branch: event.branch,
      });

      await event.save();

      console.log('📍 Step 4: Event saved to database, ID:', event._id);

      // ✅ Send notifications
      let notifyCount = 0;
      try {
        console.log('📍 Step 5: Starting notifications, visibility:', event.visibility);
        
        if (event.visibility === 'GLOBAL') {
          console.log('📍 Step 5a: Notifying all approved users');
          console.log('📍 notificationHelper:', typeof notificationHelper);
          console.log('📍 notificationHelper.notifyAllApprovedUsers:', typeof notificationHelper.notifyAllApprovedUsers);
          
          notifyCount = await notificationHelper.notifyAllApprovedUsers(
            'New Global Event Created',
            `New event: ${event.title} on ${event.date.toLocaleDateString()}`,
            'EVENT',
            event._id
          );
          console.log('📍 Step 5a complete: notifyCount =', notifyCount);
        } else {
          console.log('📍 Step 5b: Notifying branch users');
          console.log('📍 User model:', typeof User);
          
          const approvedUsers = await User.find({
            status: 'APPROVED',
            $or: [
              { branch: event.branch },
              { role: { $in: ['LEADER', 'MASTER_ADMIN'] } },
            ],
          }).select('_id');

          console.log('📍 Step 5c: Found approved users:', approvedUsers.length);

          if (approvedUsers.length > 0) {
            const userIds = approvedUsers.map(u => u._id);
            console.log('📍 Step 5d: Creating notifications for userIds:', userIds.length);
            
            notifyCount = await notificationHelper.createNotificationsForUsers(
              userIds,
              'New Event in Your Branch',
              `New event: ${event.title}`,
              'EVENT',
              event._id
            );
            console.log('📍 Step 5e: Notifications created:', notifyCount);
          }
        }
        console.log('📍 Step 6: Notifications completed');
      } catch (notifError) {
        console.error('❌ Notification error:', notifError.message);
        console.error('❌ Notification error stack:', notifError.stack);
      }

      console.log('📍 Step 7: Starting audit logging');
      console.log('📍 auditHelper:', typeof auditHelper);
      console.log('📍 auditHelper.logAction:', typeof auditHelper.logAction);

      // ✅ Log audit trail
      try {
        await auditHelper.logAction({
          action: 'CREATE_EVENT',
          performedBy: userId,
          performerRole: userRole,
          targetId: event._id,
          targetType: 'EVENT',
          metadata: {
            title: event.title,
            visibility: event.visibility,
            branch: event.branch,
          },
        });
        console.log('📍 Step 8: Audit logging completed');
      } catch (auditError) {
        console.error('❌ Audit log error:', auditError.message);
        console.error('❌ Audit log error stack:', auditError.stack);
      }

      console.log('📍 Step 9: Event creation successful');

      return {
        _id: event._id,
        title: event.title,
        visibility: event.visibility,
        branch: event.branch,
        date: event.date,
        notifications_sent: notifyCount,
        message: 'Event created successfully',
      };
    } catch (error) {
      console.error('❌ Error in createEvent:', error.message);
      console.error('❌ Error stack:', error.stack);
      throw new Error(`Event creation failed: ${error.message}`);
    }
  },

  /**
   * 📝 UPDATE EVENT
   * USER: only own events in their branch
   * LEADER: own branch events
   * MASTER_ADMIN: any event
   */
  async updateEvent(eventId, updateData, userId, userRole, userBranch) {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // ✅ Permission check
      if (userRole === 'USER' && event.createdBy.toString() !== userId) {
        throw new Error('Users can only update their own events');
      }

      if (userRole === 'LEADER' && event.branch !== userBranch) {
        throw new Error('Leaders can only update events in their branch');
      }

      // ✅ Prevent users from changing visibility to GLOBAL
      if (userRole === 'USER' && updateData.visibility === 'GLOBAL') {
        throw new Error('Users cannot create global events');
      }

      // ✅ Update fields
      if (updateData.title) event.title = updateData.title;
      if (updateData.description) event.description = updateData.description;
      if (updateData.date) event.date = updateData.date;
      if (updateData.time) event.time = updateData.time;
      if (updateData.location) event.location = updateData.location;

      if (updateData.visibility) {
        event.visibility = updateData.visibility;
        if (event.visibility === 'GLOBAL') {
          event.branch = null;
        }
      }

      if (updateData.branch && event.visibility === 'BRANCH') {
        event.branch = updateData.branch;
      }

      await event.save();

      // ✅ Log audit trail
      await auditHelper.logAction({
        action: 'UPDATE_EVENT',
        performedBy: userId,
        performerRole: userRole,
        targetId: event._id,
        targetType: 'EVENT',
        metadata: { title: event.title },
      });

      return {
        _id: event._id,
        title: event.title,
        message: 'Event updated successfully',
      };
    } catch (error) {
      throw new Error(`Event update failed: ${error.message}`);
    }
  },

  /**
   * ❌ DELETE EVENT
   * USER: only own events
   * LEADER: own branch events
   * MASTER_ADMIN: any event
   */
  async deleteEvent(eventId, userId, userRole, userBranch) {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // ✅ Permission check
      if (userRole === 'USER' && event.createdBy.toString() !== userId) {
        throw new Error('Users can only delete their own events');
      }

      if (userRole === 'LEADER' && event.branch !== userBranch) {
        throw new Error('Leaders can only delete events in their branch');
      }

      await Event.findByIdAndDelete(eventId);

      // ✅ Log audit trail
      await auditHelper.logAction({
        action: 'DELETE_EVENT',
        performedBy: userId,
        performerRole: userRole,
        targetId: eventId,
        targetType: 'EVENT',
        metadata: { title: event.title },
      });

      return {
        _id: event._id,
        message: 'Event deleted successfully',
      };
    } catch (error) {
      throw new Error(`Event deletion failed: ${error.message}`);
    }
  },

  /**
   * 📖 GET ALL EVENTS
   * USER: GLOBAL + own branch events
   * LEADER: GLOBAL + own branch events
   * MASTER_ADMIN: all events
   */
  async getEvents(userRole, userBranch) {
    try {
      let query = {};

      if (userRole === 'USER' || userRole === 'LEADER') {
        // ✅ Users and Leaders see GLOBAL + own branch events
        query = {
          $or: [
            { visibility: 'GLOBAL' },
            { branch: userBranch },
          ],
        };
      }
      // ✅ MASTER_ADMIN sees all events (query is empty)

      const events = await Event.find(query)
        .sort({ date: 1 }) // Upcoming first
        .lean();

      return events;
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  },

  /**
   * 📖 GET SINGLE EVENT
   * Must respect visibility + branch permissions
   */
  async getEventById(eventId, userRole, userBranch) {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // ✅ Permission check
      if (userRole === 'USER' && event.visibility === 'BRANCH' && event.branch !== userBranch) {
        throw new Error('Access denied to this event');
      }

      if (userRole === 'LEADER' && event.visibility === 'BRANCH' && event.branch !== userBranch) {
        throw new Error('Access denied to this event');
      }

      return event;
    } catch (error) {
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  },
};

export default eventService;
