<template>
  <div class="landing-page">
    <!-- Header Section -->
    <header class="header text-center">
      <h1>به لیست کاربران خوش آمدید</h1>
    </header>

    <!-- Back to Login Button -->
    <div class="back-to-login">
      <router-link to="/login" class="btn btn-outline-light">
        <i class="fas fa-arrow-left"></i> خروج
      </router-link>
    </div>

    <!-- Users Section -->
    <section class="users-section">
      <div class="container">
        <h2 class="text-center mb-4">لیست کاربران</h2>

        <!-- Loading State -->
        <div v-if="loading" class="text-center mt-4">
          <div class="spinner-border" role="status">
            <span class="sr-only">بارگذاری...</span>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="alert alert-danger text-center mt-4" role="alert">
          {{ error }}
        </div>

        <!-- Users List -->
        <div class="row" v-if="!loading && !error">
          <div
            class="col-md-4 col-sm-6 mb-4"
            v-for="(user, index) in paginatedUsers"
            :key="user.id"
          >
            <div class="card user-card shadow">
              <div class="card-body">
                <h5 class="card-title">
                  {{ index + 1 }}. {{ user.username }}
                </h5>
                <p class="card-text">
                  <i class="fas fa-envelope me-2"></i>
                  <strong>ایمیل:</strong> {{ user.email }}
                </p>
                <p class="card-text">
                  <i class="fas fa-lock me-2"></i>
                  <strong>رمز عبور:</strong>
                  <span v-if="showPassword">{{ user.password }}</span>
                  <span v-else>●●●●●●</span>
                  <button
                    class="btn btn-sm btn-outline-secondary ms-2"
                    @click="togglePasswordVisibility"
                  >
                    <i v-if="showPassword" class="fas fa-eye-slash"></i>
                    <i v-else class="fas fa-eye"></i>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination-container text-center mt-4" v-if="!loading && !error">
          <button
            class="btn btn-primary mx-1"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            قبلی
          </button>
          <span class="mx-2">صفحه {{ currentPage }} از {{ totalPages }}</span>
          <button
            class="btn btn-primary mx-1"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            بعدی
          </button>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="footer text-center py-3 bg-light">
      <p class="mb-0 text-muted">© 2023 تمامی حقوق محفوظ است.</p>
    </footer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [], // لیست کاربران
      loading: true, // وضعیت بارگذاری
      error: null, // مدیریت خطاهای API
      showPassword: false, // نمایش/مخفی کردن رمز عبور
      currentPage: 1, // صفحه فعلی
      pageSize: 6, // تعداد کاربران در هر صفحه
    };
  },
  computed: {
    // محاسبه کاربران برای صفحه فعلی
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.users.slice(start, end);
    },
    // محاسبه تعداد کل صفحات
    totalPages() {
      return Math.ceil(this.users.length / this.pageSize);
    },
  },
  methods: {
    async fetchUsers() {
      try {
        // دریافت داده‌ها از API
        const response = await axios.get("http://127.0.0.1:8000/account/users/");
        this.users = response.data; // ذخیره داده‌ها
        this.loading = false; // پایان بارگذاری
      } catch (err) {
        this.error = "خطا در دریافت اطلاعات کاربران!";
        console.error("Error fetching users:", err);
        this.loading = false; // پایان بارگذاری در صورت خطا
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
  created() {
    // فراخوانی متد fetchUsers هنگام ایجاد مولفه
    this.fetchUsers();
  },
};
</script>

<style scoped>
/* General Styles */
body {
  font-family: 'Vazirmatn', sans-serif;
  margin: 0;
  background-color: #f8f9fa;
}

/* Header Section */
.header {
  background: linear-gradient(135deg, rgb(24, 144, 255), rgb(63, 81, 181));
  color: white;
  padding: 3rem 0;
  text-shadow: 0px 2px 1px rgba(0, 0, 0, 0.4);
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.header p {
  font-size: 1.2rem;
}

.back-to-login {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
}

.back-to-login .btn {
  display: flex;
  align-items: center;
}

.back-to-login i {
  margin-right: 0.3rem;
}

/* Users Section */
.users-section {
  padding: 2rem 0;
}

.card.user-card {
  background-color: white;
  border-radius: 10px;
  border: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
}

.card.user-card .card-title {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
}

.card.user-card .card-text {
  font-size: 0.9rem;
  color: #555;
  margin: 0.5rem 0;
  text-align: center;
}

.card.user-card i {
  color: #0d6efd;
}

/* Pagination */
.pagination-container {
  font-family: 'Vazirmatn', sans-serif;
}

.pagination-container button {
  padding: 0.5rem 1rem;
}

/* Footer Section */
.footer {
  border-top: 1px solid #ddd;
}
</style>