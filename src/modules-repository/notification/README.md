# Notification Module

## Overview
The Notification module provides a toast notification system for KIMU-Core applications. It supports different notification types (success, error, warning, info), customizable durations, positions, and styling.

## Features
- ✅ **Multiple types** - Success, error, warning, info notifications
- ✅ **Customizable position** - 6 position options (top/bottom + left/center/right)
- ✅ **Auto-dismiss** - Configurable duration or persistent
- ✅ **Dismissible** - Optional close button
- ✅ **Click handlers** - Custom actions on click
- ✅ **Styled** - Beautiful, responsive design out-of-the-box
- ✅ **Max limit** - Prevents notification overflow
- ✅ **Animations** - Smooth enter/exit transitions
- ✅ **Debug mode** - Optional logging for development

## Installation
The Notification module is included in KIMU-Core. No additional installation required.

## Usage

### Basic Examples
```typescript
import { notificationService } from './modules/notification/notification-service';

// Success notification
notificationService.success('Profile updated successfully!');

// Error notification
notificationService.error('Failed to save changes');

// Warning notification
notificationService.warning('Your session will expire in 5 minutes');

// Info notification
notificationService.info('New message received');
```

### Custom Duration
```typescript
// Show for 5 seconds
notificationService.success('Operation completed!', { duration: 5000 });

// Persistent (no auto-dismiss)
notificationService.info('Important message', { duration: 0 });
```

### Custom Position
```typescript
// Bottom right
notificationService.info('Download complete', { 
  position: 'bottom-right' 
});

// Top center
notificationService.warning('Network connection lost', { 
  position: 'top-center' 
});

// Available positions:
// 'top-right', 'top-left', 'top-center'
// 'bottom-right', 'bottom-left', 'bottom-center'
```

### Click Handlers
```typescript
// Execute action on click
notificationService.info('New message from John', {
  onClick: () => {
    console.log('Opening chat...');
    openChat('john');
  }
});

// Callback on close
notificationService.success('Changes saved', {
  onClose: () => {
    console.log('Notification closed');
  }
});
```

### In a Component
```typescript
import { KimuComponent } from '../core/kimu-component';
import { KimuComponentElement } from '../core/kimu-component-element';
import { notificationService } from '../modules/notification/notification-service';

@KimuComponent({
  tag: 'user-form',
  name: 'User Form',
  // ...
})
export class UserFormComponent extends KimuComponentElement {
  
  async saveUser(userData: any) {
    try {
      await this.apiService.post('/users', userData);
      
      // Show success notification
      notificationService.success('User created successfully!', {
        duration: 3000,
        position: 'top-right'
      });
      
      this.resetForm();
    } catch (error) {
      // Show error notification
      notificationService.error('Failed to create user. Please try again.', {
        duration: 5000,
        dismissible: true
      });
    }
  }

  validateForm() {
    if (!this.isValid) {
      notificationService.warning('Please fill all required fields', {
        duration: 4000
      });
      return false;
    }
    return true;
  }

  showInfo() {
    notificationService.info('This form requires authentication', {
      duration: 0, // Persistent
      dismissible: true,
      onClick: () => {
        this.showLoginDialog();
      }
    });
  }
}
```

### Dismiss Notifications
```typescript
// Dismiss specific notification (returns ID)
const id = notificationService.success('Task completed');
notificationService.dismiss(id);

// Dismiss all notifications
notificationService.dismissAll();
```

### Configuration
```typescript
// Set default duration (default: 3000ms)
notificationService.setDefaultDuration(5000);

// Set default position (default: 'top-right')
notificationService.setDefaultPosition('bottom-right');

// Set max visible notifications (default: 5)
notificationService.setMaxNotifications(3);

// Enable debug mode
notificationService.setDebugMode(true);
```

### Custom Icons
```typescript
// Use custom emoji or icon
notificationService.success('Payment received', {
  icon: '💰'
});

notificationService.info('New follower', {
  icon: '👤'
});

notificationService.warning('Battery low', {
  icon: '🔋'
});
```

## API Reference

### `notificationService.success(message, options?)`
Show a success notification.
- **message**: `string` - Notification message
- **options**: `NotificationOptions` (optional)
- **Returns**: `string` - Notification ID

### `notificationService.error(message, options?)`
Show an error notification.
- **message**: `string` - Notification message
- **options**: `NotificationOptions` (optional)
- **Returns**: `string` - Notification ID

### `notificationService.warning(message, options?)`
Show a warning notification.
- **message**: `string` - Notification message
- **options**: `NotificationOptions` (optional)
- **Returns**: `string` - Notification ID

### `notificationService.info(message, options?)`
Show an info notification.
- **message**: `string` - Notification message
- **options**: `NotificationOptions` (optional)
- **Returns**: `string` - Notification ID

### `notificationService.show(message, options?)`
Show a notification with custom options.
- **message**: `string` - Notification message
- **options**: `NotificationOptions` (optional)
- **Returns**: `string` - Notification ID

### `notificationService.dismiss(id)`
Dismiss a specific notification.
- **id**: `string` - Notification ID

### `notificationService.dismissAll()`
Dismiss all active notifications.

### `notificationService.getAll()`
Get all active notifications.
- **Returns**: `Notification[]`

### `notificationService.getCount()`
Get count of active notifications.
- **Returns**: `number`

### Configuration Methods

### `notificationService.setDefaultDuration(duration)`
Set default notification duration.
- **duration**: `number` - Duration in milliseconds

### `notificationService.setDefaultPosition(position)`
Set default notification position.
- **position**: `NotificationPosition`

### `notificationService.setMaxNotifications(max)`
Set maximum visible notifications.
- **max**: `number`

### `notificationService.setDebugMode(enabled)`
Enable or disable debug logging.
- **enabled**: `boolean`

## NotificationOptions Interface
```typescript
interface NotificationOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // milliseconds, 0 = no auto-dismiss
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  dismissible?: boolean; // show close button
  icon?: string; // custom icon (emoji or HTML)
  onClick?: () => void; // click handler
  onClose?: () => void; // close callback
}
```

## Styling

### Default Styles
The module includes built-in styles with smooth animations and responsive design. Notifications are styled based on their type:
- **Success**: Green accent with ✅ icon
- **Error**: Red accent with ❌ icon
- **Warning**: Orange accent with ⚠️ icon
- **Info**: Blue accent with ℹ️ icon

### Custom Styles
You can override default styles using CSS:
```css
/* Custom notification styling */
.kimu-notification {
  border-radius: 12px;
  font-family: 'Your Font', sans-serif;
}

.kimu-notification-success {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.kimu-notification-message {
  font-weight: bold;
}
```

## Best Practices

### 1. Use Appropriate Types
```typescript
// Success for completed actions
notificationService.success('Profile updated');

// Error for failures
notificationService.error('Network error');

// Warning for attention needed
notificationService.warning('Unsaved changes');

// Info for general messages
notificationService.info('New feature available');
```

### 2. Keep Messages Concise
```typescript
// Good
notificationService.success('Changes saved');

// Too verbose
notificationService.success('Your changes have been successfully saved to the database and will be reflected immediately');
```

### 3. Use Appropriate Durations
```typescript
// Quick confirmations (2-3 seconds)
notificationService.success('Copied to clipboard', { duration: 2000 });

// Errors (4-5 seconds)
notificationService.error('Invalid email format', { duration: 4000 });

// Important messages (persistent)
notificationService.warning('Session expiring soon', { 
  duration: 0,
  dismissible: true 
});
```

### 4. Provide Actions When Needed
```typescript
// Actionable notifications
notificationService.info('New message received', {
  onClick: () => {
    openMessages();
  }
});

notificationService.error('Network error', {
  onClick: () => {
    retryConnection();
  }
});
```

## Common Use Cases

### 1. Form Validation
```typescript
function validateAndSave() {
  if (!form.isValid()) {
    notificationService.error('Please fill all required fields');
    return;
  }
  
  saveForm();
  notificationService.success('Form submitted successfully');
}
```

### 2. API Responses
```typescript
async function loadData() {
  try {
    const data = await api.get('/data');
    notificationService.success('Data loaded successfully');
    return data;
  } catch (error) {
    notificationService.error('Failed to load data. Please try again.');
    throw error;
  }
}
```

### 3. Background Tasks
```typescript
function startExport() {
  notificationService.info('Export started...', { duration: 2000 });
  
  exportData().then(() => {
    notificationService.success('Export completed!', {
      onClick: () => downloadFile()
    });
  }).catch(() => {
    notificationService.error('Export failed');
  });
}
```

### 4. User Actions
```typescript
function deleteItem() {
  const id = notificationService.warning('This action cannot be undone', {
    duration: 0,
    dismissible: true
  });
  
  // Show confirmation UI
  showConfirmDialog(() => {
    notificationService.dismiss(id);
    performDelete();
    notificationService.success('Item deleted');
  });
}
```

## Accessibility
- Notifications have proper ARIA labels
- Close buttons include aria-label="Close"
- Animations respect user preferences (prefers-reduced-motion)
- Keyboard accessible (Tab to close button, Enter to dismiss)

## Performance Considerations
- Maximum 5 notifications by default (configurable)
- Automatic cleanup of old notifications
- CSS-based animations for smooth performance
- Minimal DOM manipulation

## Browser Support
- Modern browsers with ES6+ support
- Chrome 60+, Firefox 60+, Safari 12+, Edge 79+

## License
This module is part of KIMU-Core and follows the same license (MPL-2.0).

## Version History
- **1.0.0** - Initial release with toast notifications
