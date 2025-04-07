<template>
  <div v-if="loggingState.isLoggingActive" class="log-viewer">
    <h3>لاگ‌های ضبط‌شده</h3>
    <table>
      <thead>
        <tr>
          <th>نوع</th>
          <th>عنصر</th>
          <th>جزئیات</th>
          <th>زمان</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(log, index) in loggingState.logs" :key="index">
          <td>{{ log.type }}</td>
          <td>{{ log.element?.id || log.element?.tagName }}</td>
          <td>{{ log.details }}</td>
          <td>{{ log.timestamp }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { loggingState } from '../loggingState.js';

export default {
  data() {
    return {
      loggingState: loggingState
    };
  }
};
</script>

<style>
.log-viewer {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px;
  max-height: 80vh;
  overflow-y: auto;
}

.log-viewer table {
  width: 100%;
  border-collapse: collapse;
}

.log-viewer th,
.log-viewer td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.log-viewer th {
  background-color: #f4f4f4;
}
</style>