import { useCallback } from 'react';

export function useNotification() {
  const showNotification = useCallback((message, type = 'info') => {
    const el = document.createElement("div");
    let statusClass, icon;
    
    switch (type) {
      case "success": 
        statusClass = "status-success"; 
        icon = "✅"; 
        break;
      case "warning": 
        statusClass = "bg-yellow-100 text-yellow-800 border-yellow-300"; 
        icon = "⚠️"; 
        break;
      case "error": 
        statusClass = "status-error"; 
        icon = "❌"; 
        break;
      default:
        statusClass = "bg-blue-100 text-blue-800 border-blue-300";
        icon = "ℹ️";
    }

    el.className = `fixed top-4 right-4 px-6 py-4 rounded-xl shadow-2xl z-50 font-semibold backdrop-blur-sm border animate-fade-in-right ${statusClass}`;
    el.innerHTML = `
      <div class="flex items-center">
        <span class="mr-3 text-lg">${icon}</span>
        <span>${message}</span>
        <button class="ml-4 text-lg opacity-70 hover:opacity-100 transition-opacity" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(el);
    
    const delay = type === "error" || type === "warning" ? 6000 : 4000;
    
    setTimeout(() => {
      if (el.parentNode) {
        el.style.opacity = "0";
        el.style.transform = "translateX(100%)";
        setTimeout(() => { if (el.parentNode) el.remove(); }, 300);
      }
    }, delay);
  }, []);

  return { showNotification };
}
