<template>
  <div id="app">
    <!-- دکمه Toggle لاگ -->
    <button @click="toggleLogging" class="log-button">
      {{ loggingState.isLoggingActive ? 'توقف لاگ' : 'شروع لاگ' }}
    </button>

    <!-- صفحه نمایش لاگ‌ها -->
    <LogViewer />

    <!-- مسیرهای صفحات -->
    <router-view />
  </div>
</template>

<script>
import { loggingState } from './loggingState.js';
import axios from 'axios';
import LogViewer from './components/LogViewer.vue'; // کامپوننت نمایش لاگ‌ها

export default {
  name: 'App',
  components: { LogViewer }, // ثبت کامپوننت
  data() {
    return {
      loggingState: loggingState,
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
      // ضبط رویدادهای مورد نظر
      document.addEventListener('click', this.logEvent, { passive: true });
      document.addEventListener('input', this.logEvent, { passive: true });
      document.addEventListener('submit', this.logEvent, { passive: true });
      document.addEventListener('keydown', this.logEvent, { passive: true });
    },
    stopLogging() {
      // حذف رویدادها
      document.removeEventListener('click', this.logEvent);
      document.removeEventListener('input', this.logEvent);
      document.removeEventListener('submit', this.logEvent);
      document.removeEventListener('keydown', this.logEvent);

      // ارسال لاگ‌ها به بک‌اند
      this.sendLogsToBackend();
    },
    logEvent(event) {
      const logEntry = {
        type: event.type, // نوع رویداد
        element: {
          id: event.target.id, // شناسه المنت
          tagName: event.target.tagName, // تگ المنت
          value: event.target.value || event.target.textContent, // مقدار المنت
          classList: [...event.target.classList] // کلاس‌های CSS
        },
        position: {
          x: event.clientX, // موقعیت X ماوس
          y: event.clientY // موقعیت Y ماوس
        },
        url: window.location.href, // آدرس صفحه فعلی
        timestamp: new Date().toISOString() // زمان دقیق
      };
      this.loggingState.logs.push(logEntry); // اضافه کردن لاگ به آرایه
    },
    async sendLogsToBackend() {
  if (this.loggingState.logs.length === 0) return;

  // خواندن user ID از localStorage
  const userId = localStorage.getItem('userId') || 'guest';

  try {
    await axios.post('/api/save-logs', {
      userId: userId, // اضافه کردن user ID به داده‌ها
      logs: this.loggingState.logs // لاگ‌ها
    }, {
      headers: { 'Content-Type': 'application/json' } // اضافه کردن سربرگ
    });

    this.loggingState.logs = []; // پاک کردن لاگ‌ها پس از ارسال
    alert('لاگ‌ها با موفقیت ارسال شدند!');
  } catch (error) {
    console.error('خطا در ارسال لاگ‌ها:', error);
  }
}
  },
  beforeUnmount() {
    if (this.loggingState.isLoggingActive) {
      this.stopLogging(); // حذف رویدادها قبل از خروج
    }
  }
};
</script>

<style>
.log-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000000;
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