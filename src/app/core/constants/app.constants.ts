// app.constants.ts
export class AppConstants {
  // Application Info
  static readonly APP_NAME = 'Worklytics';
  static readonly APP_VERSION = '1.0.0';
  static readonly APP_DESCRIPTION = 'A modern web application';
  static readonly COMPANY_NAME = 'Your Company';
  static readonly COPYRIGHT_YEAR = new Date().getFullYear();
  
  
  // UI/UX Constants
  static readonly TOAST_DURATION = 5000;
  static readonly DEBOUNCE_TIME = 300;
  static readonly PAGE_SIZE = 10;
  static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  
  // Feature Flags
  static readonly FEATURES = {
    DARK_MODE: true,
    MULTI_LANGUAGE: false,
    ANALYTICS: true,
    NOTIFICATIONS: true
  };
  
  // Local Storage Keys
  static readonly STORAGE_KEYS = {
    AUTH_TOKEN: 'worklytic_token',
    USER_DATA: 'user_data',
    THEME: 'app_theme',
    LANGUAGE: 'app_language'
  };
  
}