<template>
  <div class="landing-page">
    <!-- Toolbar -->
    <nav class="toolbar">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- Left Side: Main Menu -->
        <ul class="toolbar-menu">
          <li>
            <router-link to="/users" class="btn toolbar-link">
              <i class="fas fa-users me-1"></i> لیست کاربران
            </router-link>
          </li>
          <li>
            <router-link to="/" class="toolbar-link">
              <i class="fas fa-home me-1"></i> صفحه اصلی
            </router-link>
          </li>
        </ul>

        <!-- Right Side: Logout Button -->
        <button @click="logout" class="btn btn-outline-light">
          <i class="fas fa-sign-out-alt me-1"></i> خروج
        </button>
      </div>
    </nav>

    <!-- Header Section -->
    <header class="header text-center">
      <h1>به لیست کاربران خوش آمدید</h1>
      <!-- <p>لیست کاربران با اطلاعات به‌روز و نمایش زیبا</p> -->
    </header>

    <!-- Back to Login Button -->
    <!-- <div class="back-to-login">
      <router-link to="/login" class="btn btn-outline-light">
        <i class="fas fa-arrow-left"></i> خروج
      </router-link>
    </div> -->

    <!-- Users Section -->
    <section class="users-section">
      <div class="container">
        <h2 class="text-center mb-4">لیست کاربران</h2>

        <!-- Loading State -->
        <div v-if="loading" class="text-center mt-4 loading-container">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">بارگذاری...</span>
          </div>
          <p class="mt-3">در حال بارگذاری اطلاعات...</p>
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
            :data-index="index"
          >
            <div class="card user-card shadow" @click="viewUserDetails(user)">
              <div class="card-body">
                <h5 class="card-title text-center">{{ user.username }}</h5>
                <p class="card-text text-center">
                  <i class="fas fa-user me-2"></i>کاربر سیستم
                </p>
                <button class="btn btn-primary w-100 mt-3">
                  <i class="fas fa-eye me-2"></i>مشاهده جزئیات
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination-container text-center mt-4" v-if="!loading && !error">
          <button
            class="btn btn-secondary mx-1"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="mx-2">صفحه {{ currentPage }} از {{ totalPages }}</span>
          <button
            class="btn btn-secondary mx-1"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            <i class="fas fa-chevron-right"></i>
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
    viewUserDetails(user) {
      // هدایت به صفحه جزئیات کاربر
      this.$router.push({ name: "UserDetails", params: { id: user.id }, state: { user } });
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
    logout() {
      // پاک کردن وضعیت لاگین و توکن‌ها
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // هدایت به صفحه لاگین
      this.$router.push("/login");
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

.landing-page {
  background-image: url('../assets/image/login-image/background.jpg'); /* عکس پشت‌زمینه */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* جعل ساکت در هنگام اسکرول */
  background-repeat: no-repeat;
  min-height: 100vh; /* اطمینان از پوشش کل صفحه */
  display: flex;
  flex-direction: column;
}

/* Toolbar */
.toolbar {
  background: linear-gradient(135deg, rgb(9, 207, 75), rgb(69, 221, 208));
  padding: 0.8rem 0;
  position: relative;
  z-index: 1000;
}

.toolbar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.toolbar-menu li {
  margin-right: 1.5rem;
}

.toolbar-link {
  background-color: #067ae7;
  border-radius: .4rem;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.toolbar-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  color: #ffffff;
  background-color: #333;
}

.toolbar-link i {
  margin-right: 0.3rem;
}

.header {
  background: linear-gradient(135deg, rgb(24, 144, 255), rgb(63, 81, 181));
  color: white;
  padding: 1.5rem 0; /* کاهش Padding برای کوتاه‌تر شدن Header */
  text-shadow: 0px 2px 1px rgba(0, 0, 0, 0.4);
}

.header h1 {
  font-size: 2rem; /* کاهش اندازه فونت عنوان */
  margin-bottom: 0.5rem;
}

.header p {
  font-size: 1rem; /* کاهش اندازه فونت زیرعنوان */
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
  flex: 1; /* این مقدار باعث می‌شود محتوای اصلی فضای خالی را پر کند */
  padding: 2rem 0;
}

.card.user-card {
  position: relative; /* الزامی برای z-index */
  z-index: 2; /* بالاتر از سایر عناصر */
  background-color: rgba(255, 255, 255, 0.9); /* شفافیت برای ترکیب با عکس پشت‌زمینه */
  border-radius: 10px;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.card.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card.user-card .card-title {
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  color: #333;
}

.card.user-card .card-text {
  font-size: 0.9rem;
  color: #555;
  text-align: center;
}

.card.user-card button {
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.card.user-card button:hover {
  background-color: #0d6efd;
}

/* Pagination */
.pagination-container {
  font-family: 'Vazirmatn', sans-serif;
}

.pagination-container button {
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease;
}

.pagination-container button:hover {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

/* Footer Section */
.footer {
  border-top: 1px solid #ddd;
  background-color: white;
  padding: 1rem 0;
  text-align: center;
}

/* Loading Animation */
.loading-container {
  animation: pulse 1.5s infinite;
}

.mx-2{
  background-color: #ddd;
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Fade In Animation for Cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
