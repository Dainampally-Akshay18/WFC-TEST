// Simple toast notification system
class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = [];
  }

  init() {
    if (typeof window === 'undefined') return;
    
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info') {
    this.init();
    
    const toast = document.createElement('div');
    toast.style.cssText = `
      padding: 16px 20px;
      border-radius: 12px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      font-family: Inter, sans-serif;
      font-size: 14px;
      font-weight: 500;
    `;

    const colors = {
      success: {
        bg: 'rgba(46, 158, 91, 0.9)',
        border: 'rgba(46, 158, 91, 1)',
        text: '#ffffff',
      },
      error: {
        bg: 'rgba(220, 38, 38, 0.9)',
        border: 'rgba(220, 38, 38, 1)',
        text: '#ffffff',
      },
      warning: {
        bg: 'rgba(245, 158, 11, 0.9)',
        border: 'rgba(245, 158, 11, 1)',
        text: '#ffffff',
      },
      info: {
        bg: 'rgba(37, 99, 235, 0.9)',
        border: 'rgba(37, 99, 235, 1)',
        text: '#ffffff',
      },
    };

    const color = colors[type] || colors.info;
    toast.style.background = color.bg;
    toast.style.border = `1px solid ${color.border}`;
    toast.style.color = color.text;
    toast.textContent = message;

    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 300);
    }, 4000);
  }

  success(message) {
    this.show(message, 'success');
  }

  error(message) {
    this.show(message, 'error');
  }

  warning(message) {
    this.show(message, 'warning');
  }

  info(message) {
    this.show(message, 'info');
  }

  loading(message) {
    this.show(message, 'info');
  }
}

// Add animations to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export const toast = new ToastManager();
