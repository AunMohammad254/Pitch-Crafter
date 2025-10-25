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

  // Get network quality assessment
  getNetworkQuality() {
    const { effectiveType, rtt, downlink } = this.connectionType;
    
    if (effectiveType === '4g' && rtt < 100 && downlink > 10) {
      return 'excellent';
    } else if (effectiveType === '4g' || (rtt < 200 && downlink > 5)) {
      return 'good';
    } else if (effectiveType === '3g' || (rtt < 500 && downlink > 1)) {
      return 'fair';
    } else {
      return 'poor';
    }
  }

  // Log network diagnostics
  logNetworkDiagnostics() {
    console.group('🔍 Network Diagnostics');
    console.log('Online Status:', this.isOnline);
    console.log('Connection Type:', this.connectionType);
    console.log('Network Quality:', this.getNetworkQuality());
    console.log('User Agent:', navigator.userAgent);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
}

// CORS and API request utilities
export class APIRequestHelper {
  static async testCORS(url) {
    try {
      console.log(`🔍 Testing CORS for: ${url}`);
      
      const response = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });

      console.log('✅ CORS test response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      });

      return response.ok;
    } catch (error) {
      console.error('❌ CORS test failed:', error);
      return false;
    }
  }

  static async testAPIEndpoint(url, apiKey) {
    try {
      console.log(`🔍 Testing API endpoint: ${url}`);
      
      const testPayload = {
        contents: [{ parts: [{ text: "test" }] }]
      };

      const response = await fetch(`${url}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testPayload)
      });

      const responseData = await response.text();
      
      console.log('🔍 API endpoint test result:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responsePreview: responseData.substring(0, 200) + '...'
      });

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        response: responseData
      };
    } catch (error) {
      console.error('❌ API endpoint test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

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
      } catch (e) {
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
export const getNetworkQuality = () => networkMonitor.getNetworkQuality();
export const logNetworkDiagnostics = () => networkMonitor.logNetworkDiagnostics();