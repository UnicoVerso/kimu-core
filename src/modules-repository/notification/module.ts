/**
 * Notification Module for KIMU-Core
 * 
 * Provides toast notifications and alerts.
 * 
 * @module NotificationModule
 */

import { KimuModule } from '../../core/kimu-module';
import { notificationService } from './notification-service';

/**
 * NotificationModule - Module class for notification system integration
 */
export default class NotificationModule extends KimuModule {
  constructor(name = 'notification', version = '1.0.0', options?: any) {
    super(name, version, options);
  }

  /**
   * Get the notification service instance
   */
  getService() {
    return notificationService;
  }
}

// Re-export for convenience
export { notificationService } from './notification-service';
export { NotificationService } from './notification-service';
