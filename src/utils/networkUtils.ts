export interface NetworkStatus {
  online: boolean;
  effectiveType?: string;
  saveData?: boolean;
}

export const checkNetworkStatus = (): NetworkStatus => {
  const nav = navigator as any;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    saveData: connection?.saveData
  };
};

export const logNetworkDiagnostics = (): void => {
  const status = checkNetworkStatus();
  console.log('🌐 Network Status:', status.online ? 'Online' : 'Offline');
  if (status.effectiveType) {
    console.log('⚡ Connection Type:', status.effectiveType);
  }
};
