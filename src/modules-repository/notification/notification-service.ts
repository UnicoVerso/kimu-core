/**
 * Notification Service for KIMU-Core
 * 
 * Provides toast notifications, alerts, and user feedback system.
 * Supports different notification types, durations, and positions.
 * 
 * @module NotificationService
 * @version 1.0.0
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface NotificationOptions {
  type?: NotificationType;
  duration?: number; // in milliseconds, 0 = no auto-dismiss
  position?: NotificationPosition;
  dismissible?: boolean;
  icon?: string;
  onClick?: () => void;
  onClose?: () => void;
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
  position: NotificationPosition;
  dismissible: boolean;
  icon?: string;
  timestamp: number;
  element?: HTMLElement;
  timeoutId?: number;
  onClick?: () => void;
  onClose?: () => void;
}

/**
 * NotificationService - Toast notifications and alerts
 * 
 * @example
 * ```typescript
 * import { notificationService } from './modules/notification/notification-service';
 * 
 * // Show success notification
 * notificationService.success('Operation completed!');
 * 
 * // Show error with custom duration
 * notificationService.error('Something went wrong!', { duration: 5000 });
 * 
 * // Show info with custom position
 * notificationService.info('New message received', { position: 'bottom-right' });
 * ```
 */
export class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private container?: HTMLElement;
  private defaultDuration: number = 3000;
  private defaultPosition: NotificationPosition = 'top-right';
  private maxNotifications: number = 5;
  private debugMode: boolean = false;

  constructor() {
    this.initContainer();
  }

  /**
   * Enable or disable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Set default notification duration
   */
  setDefaultDuration(duration: number): void {
    this.defaultDuration = duration;
  }

  /**
   * Set default notification position
   */
  setDefaultPosition(position: NotificationPosition): void {
    this.defaultPosition = position;
  }

  /**
   * Set maximum number of visible notifications
   */
  setMaxNotifications(max: number): void {
    this.maxNotifications = max;
  }

  /**
   * Show a success notification
   */
  success(message: string, options?: NotificationOptions): string {
    return this.show(message, { ...options, type: 'success' });
  }

  /**
   * Show an error notification
   */
  error(message: string, options?: NotificationOptions): string {
    return this.show(message, { ...options, type: 'error' });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, options?: NotificationOptions): string {
    return this.show(message, { ...options, type: 'warning' });
  }

  /**
   * Show an info notification
   */
  info(message: string, options?: NotificationOptions): string {
    return this.show(message, { ...options, type: 'info' });
  }

  /**
   * Show a notification with custom options
   */
  show(message: string, options: NotificationOptions = {}): string {
    const id = this.generateId();
    
    const notification: Notification = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration !== undefined ? options.duration : this.defaultDuration,
      position: options.position || this.defaultPosition,
      dismissible: options.dismissible !== undefined ? options.dismissible : true,
      icon: options.icon || this.getDefaultIcon(options.type || 'info'),
      timestamp: Date.now(),
      onClick: options.onClick,
      onClose: options.onClose
    };

    if (this.debugMode) {
      console.log('[Notification] Show:', notification);
    }

    // Remove oldest notification if max limit reached
    if (this.notifications.size >= this.maxNotifications) {
      const oldestId = Array.from(this.notifications.keys())[0];
      this.dismiss(oldestId);
    }

    this.notifications.set(id, notification);
    this.renderNotification(notification);

    // Auto-dismiss if duration > 0
    if (notification.duration > 0) {
      notification.timeoutId = window.setTimeout(() => {
        this.dismiss(id);
      }, notification.duration);
    }

    return id;
  }

  /**
   * Dismiss a specific notification
   */
  dismiss(id: string): void {
    const notification = this.notifications.get(id);
    if (!notification) return;

    if (this.debugMode) {
      console.log('[Notification] Dismiss:', id);
    }

    // Clear timeout
    if (notification.timeoutId) {
      clearTimeout(notification.timeoutId);
    }

    // Remove element with animation
    if (notification.element) {
      notification.element.classList.add('kimu-notification-exit');
      setTimeout(() => {
        notification.element?.remove();
      }, 300);
    }

    // Call onClose callback
    if (notification.onClose) {
      notification.onClose();
    }

    this.notifications.delete(id);
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    const ids = Array.from(this.notifications.keys());
    ids.forEach(id => this.dismiss(id));
  }

  /**
   * Get all active notifications
   */
  getAll(): Notification[] {
    return Array.from(this.notifications.values());
  }

  /**
   * Get notification count
   */
  getCount(): number {
    return this.notifications.size;
  }

  // Private methods

  private initContainer(): void {
    if (typeof document === 'undefined') return;

    this.container = document.createElement('div');
    this.container.id = 'kimu-notification-container';
    this.injectStyles();
    document.body.appendChild(this.container);
  }

  private renderNotification(notification: Notification): void {
    if (!this.container) return;

    const element = document.createElement('div');
    element.className = `kimu-notification kimu-notification-${notification.type} kimu-notification-${notification.position}`;
    element.setAttribute('data-id', notification.id);

    const content = `
      <div class="kimu-notification-content">
        ${notification.icon ? `<span class="kimu-notification-icon">${notification.icon}</span>` : ''}
        <span class="kimu-notification-message">${this.escapeHtml(notification.message)}</span>
      </div>
      ${notification.dismissible ? '<button class="kimu-notification-close" aria-label="Close">×</button>' : ''}
    `;

    element.innerHTML = content;

    // Add click handlers
    if (notification.onClick) {
      element.addEventListener('click', (e) => {
        if (!(e.target as HTMLElement).classList.contains('kimu-notification-close')) {
          notification.onClick!();
        }
      });
    }

    if (notification.dismissible) {
      const closeBtn = element.querySelector('.kimu-notification-close');
      closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dismiss(notification.id);
      });
    }

    notification.element = element;
    this.container.appendChild(element);

    // Trigger animation
    setTimeout(() => element.classList.add('kimu-notification-enter'), 10);
  }

  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultIcon(type: NotificationType): string {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type];
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private injectStyles(): void {
    if (typeof document === 'undefined') return;
    if (document.getElementById('kimu-notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'kimu-notification-styles';
    style.textContent = `
      #kimu-notification-container {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
      }

      .kimu-notification {
        position: fixed;
        min-width: 280px;
        max-width: 400px;
        padding: 16px 20px;
        margin: 12px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        pointer-events: auto;
        cursor: default;
      }

      .kimu-notification-enter {
        opacity: 1;
        transform: translateY(0);
      }

      .kimu-notification-exit {
        opacity: 0;
        transform: translateY(-20px);
      }

      .kimu-notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }

      .kimu-notification-icon {
        font-size: 20px;
        line-height: 1;
      }

      .kimu-notification-message {
        color: #333;
        font-size: 14px;
        line-height: 1.5;
      }

      .kimu-notification-close {
        background: none;
        border: none;
        font-size: 24px;
        line-height: 1;
        color: #999;
        cursor: pointer;
        padding: 0;
        margin-left: 12px;
        transition: color 0.2s;
      }

      .kimu-notification-close:hover {
        color: #333;
      }

      /* Types */
      .kimu-notification-success {
        background: #f0fdf4;
        border-left: 4px solid #22c55e;
      }

      .kimu-notification-error {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
      }

      .kimu-notification-warning {
        background: #fffbeb;
        border-left: 4px solid #f59e0b;
      }

      .kimu-notification-info {
        background: #eff6ff;
        border-left: 4px solid #3b82f6;
      }

      /* Positions */
      .kimu-notification-top-right {
        top: 0;
        right: 0;
      }

      .kimu-notification-top-left {
        top: 0;
        left: 0;
      }

      .kimu-notification-bottom-right {
        bottom: 0;
        right: 0;
      }

      .kimu-notification-bottom-left {
        bottom: 0;
        left: 0;
      }

      .kimu-notification-top-center {
        top: 0;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
      }

      .kimu-notification-top-center.kimu-notification-enter {
        transform: translateX(-50%) translateY(0);
      }

      .kimu-notification-bottom-center {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
      }

      .kimu-notification-bottom-center.kimu-notification-enter {
        transform: translateX(-50%) translateY(0);
      }
    `;

    document.head.appendChild(style);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
