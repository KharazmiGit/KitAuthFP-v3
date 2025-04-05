// src/loggingState.js
import { ref } from 'vue';

export const loggingState = {
  isLoggingActive: ref(false), // وضعیت شروع/توقف لاگ
  logs: ref([]) // ذخیره لاگها
};