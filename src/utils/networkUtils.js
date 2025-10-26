// Network utilities for debugging and monitoring
export class NetworkMonitor {
  constructor() {
    this.isOnline = navigator.onLine;
    this.connectionType = this.getConnectionType();
    this.setupEventListeners();
  }

  // Get connection type information
  getConnectionType() {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      return {
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 'unknown',
        rtt: connection?.rtt || 'unknown',
        saveData: connection?.saveData || false
      };
    }
    return { effectiveType: 'unknown', downlink: 'unknown', rtt: 'unknown', saveData: false };
  }

  // Setup network event listeners
  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Network: Back online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('🚫 Network: Gone offline');
    });

    // Monitor connection changes
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      connection?.addEventListener('change', () => {
        this.connectionType = this.getConnectionType();
        console.log('📶 Network: Connection changed', this.connectionType);
      });
    }
  }

  // Check if network is available
  isNetworkAvailable() {
    return this.isOnline;
  }

  // Log network diagnostics
  logNetworkDiagnostics() {
    console.group('🔍 Network Diagnostics');
    console.log('Online Status:', this.isOnline);
    console.log('Connection Type:', this.connectionType);
    console.log('User Agent:', navigator.userAgent);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
}

// API request utilities
export class APIRequestHelper {

  static logRequestDetails(url, options, response = null, error = null) {
    console.group('📡 API Request Details');
    console.log('URL:', url);
    console.log('Method:', options.method || 'GET');
    console.log('Headers:', options.headers || {});
    
    if (options.body) {
      try {
        const bodyPreview = typeof options.body === 'string' 
          ? options.body.substring(0, 200) + '...'
          : JSON.stringify(options.body).substring(0, 200) + '...';
        console.log('Body Preview:', bodyPreview);
      } catch {
        console.log('Body:', '[Unable to preview]');
      }
    }

    if (response) {
      console.log('Response Status:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    }

    if (error) {
      console.error('Request Error:', error);
    }

    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
}

// Initialize network monitor
export const networkMonitor = new NetworkMonitor();

// Export utility functions
export const checkNetworkStatus = () => networkMonitor.isNetworkAvailable();
export const logNetworkDiagnostics = () => networkMonitor.logNetworkDiagnostics();