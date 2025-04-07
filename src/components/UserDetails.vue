<template>
  <div class="user-details">
    <!-- Back Button -->
    <div class="back-button mb-4">
      <router-link to="/users" class="btn btn-primary">
        <i class="fas fa-arrow-left"></i> بازگشت
      </router-link>
    </div>

    <!-- User Details -->
    <div class="container">
      <h2 class="text-center mb-4">جزئیات کاربر</h2>

      <div v-if="loading" class="text-center mt-4">
        <div class="spinner-border" role="status">
          <span class="sr-only">بارگذاری...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger text-center mt-4" role="alert">
        {{ error }}
      </div>

      <div v-else class="card shadow">
        <div class="card-body">
          <h5 class="card-title text-center">{{ user.username }}</h5>
          <p class="card-text">
            <strong>ایمیل:</strong> {{ user.email }}
          </p>
          <p class="card-text">
            <strong>رمز عبور:</strong> {{ user.password }}
          </p>
          <p class="card-text">
            <strong>کد پرسنلی:</strong> {{ user.personnelCode }}
          </p>
          <!-- Add more fields here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {}, // اطلاعات کاربر
      loading: true, // وضعیت بارگذاری
      error: null, // مدیریت خطاهای API
    };
  },
  created() {
    // دریافت اطلاعات کاربر از state یا API
    if (this.$route.state && this.$route.state.user) {
      this.user = this.$route.state.user; // اگر اطلاعات از state ارسال شده باشد
      this.loading = false;
    } else {
      const userId = this.$route.params.id;
      this.fetchUserDetails(userId); // دریافت اطلاعات کاربر از API
    }
  },
  methods: {
    async fetchUserDetails(userId) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/account/users/${userId}/`);
        this.user = response.data;
        this.loading = false;
      } catch (error) {
        this.error = "خطا در دریافت اطلاعات کاربر!";
        console.error("Error fetching user details:", error);
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* General Styles */
.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.back-button .btn {
  display: flex;
  align-items: center;
}

.back-button i {
  margin-right: 0.3rem;
}

.card {
  background-color: white;
  border-radius: 10px;
  border: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.card-text {
  font-size: 1rem;
  color: #555;
  margin: 0.5rem 0;
}
</style>