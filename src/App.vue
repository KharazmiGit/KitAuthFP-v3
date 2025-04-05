<template>
  <div id="app">
    <button @click="toggleLogging" class="log-button">
      {{ loggingState.isLoggingActive ? 'توقف لاگ' : 'شروع لاگ' }}
    </button>
    <router-view />
  </div>
</template>

<script>
import { loggingState } from './loggingState.js';
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      loggingState: loggingState,
      observer: null,
      originalFetch: null,
      originalOpen: null,
      originalLog: null
    };
  },
  methods: {
    toggleLogging() {
      this.loggingState.isLoggingActive = !this.loggingState.isLoggingActive;
      if (this.loggingState.isLoggingActive) {
        this.startLogging();
      } else {
        this.stopLogging();
      }
    },
    startLogging() {
      // ۱. ضبط رویدادهای DOM/BOM با passive: true
      const events = ['click', 'input', 'change', 'submit', 'mouseover', 'keydown', 'scroll', 'resize', 'hashchange'];
      events.forEach(event => {
        document.addEventListener(event, this.logEvent, { passive: true });
      });

      // ۲. MutationObserver برای تغییرات پویای DOM
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          this.loggingState.logs.push({
            type: 'DOM_CHANGE',
            mutationType: mutation.type,
            target: mutation.target.id || mutation.target.tagName,
            addedNodes: mutation.addedNodes.length,
            removedNodes: mutation.removedNodes.length,
            timestamp: new Date().toISOString()
          });
        });
      });
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });

      // ۳. ضبط Fetch API
      this.originalFetch = window.fetch;
      window.fetch = (...args) => {
        const startTime = new Date();
        return this.originalFetch.apply(this, args)
          .then(response => {
            this.loggingState.logs.push({
              type: 'FETCH',
              method: args[0].method || 'GET',
              url: args[0].url,
              status: response.status,
              duration: new Date() - startTime,
              timestamp: new Date().toISOString()
            });
            return response;
          });
      };

      // ۴. ضبط XMLHttpRequest
      this.originalOpen = XMLHttpRequest.prototype.open;
      const component = this;
      XMLHttpRequest.prototype.open = function(...args) {
        const xhr = this;
        xhr.addEventListener('load', () => {
          component.loggingState.logs.push({
            type: 'XHR',
            method: args[0],
            url: args[1],
            status: xhr.status,
            timestamp: new Date().toISOString()
          });
        });
        component.originalOpen.apply(xhr, args);
      };

      // ۵. ضبط console.log
      this.originalLog = console.log;
      console.log = (...args) => {
        this.loggingState.logs.push({
          type: 'CONSOLE_LOG',
          message: args.join(' '),
          timestamp: new Date().toISOString()
        });
        this.originalLog.apply(console, args);
      };
    },
    stopLogging() {
      // حذف تمام Event Listeners
      const events = ['click', 'input', 'change', 'submit', 'mouseover', 'keydown', 'scroll', 'resize', 'hashchange'];
      events.forEach(event => {
        document.removeEventListener(event, this.logEvent, { passive: true });
      });

      // متوقف کردن MutationObserver
      if (this.observer) {
        this.observer.disconnect();
      }

      // بازگرداندن به حالت اولیه
      window.fetch = this.originalFetch;
      XMLHttpRequest.prototype.open = this.originalOpen;
      console.log = this.originalLog;

      // ارسال لاگها به بکاند
      this.sendLogsToBackend();
    },
    logEvent(event) {
      // ثبت تمام رویدادها بدون جلوگیری از عملکرد پیشفرض
      const logEntry = {
        type: event.type,
        element: {
          id: event.target.id,
          tagName: event.target.tagName,
          value: event.target.value || event.target.textContent,
          classList: [...event.target.classList]
        },
        position: {
          x: event.clientX,
          y: event.clientY
        },
        url: window.location.href,
        timestamp: new Date().toISOString()
      };
      this.loggingState.logs.push(logEntry);
    },
    async sendLogsToBackend() {
      if (this.loggingState.logs.length === 0) return;
      try {
        await axios.post('/api/save-logs', this.loggingState.logs, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.loggingState.logs = [];
        alert('لاگها با موفقیت ارسال شدند!');
      } catch (error) {
        console.error('خطا در ارسال لاگها:', error);
      }
    }
  },
  beforeUnmount() {
    if (this.loggingState.isLoggingActive) {
      this.stopLogging();
    }
  }
};
</script>

<style>
.log-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.log-button:hover {
  background: #45a049;
}
</style>