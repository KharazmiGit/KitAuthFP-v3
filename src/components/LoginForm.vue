<template>
    <!-- نمایش پیام خطا -->
    <div v-if="error" class="alert alert-danger text-center" role="alert">
        {{ error }}
    </div>

    <div class="row mt-4">
        <div class="col-md-6 mx-auto p-0">
            <div class="card">
                <div class="login-box">
                   <img src="../assets/image/login-image/main.png" alt="logo" class="logo">
                    <!-- سوییچ بین فرم ها -->
                    <div class="login-snip">
                        <input id="tab-1" type="radio" name="tab" class="sign-in" v-model="currentForm" value="login" checked>
                        <label for="tab-1" class="tab">ورود</label>
                        <input id="tab-2" type="radio" name="tab" class="sign-up" v-model="currentForm" value="forgotPassword">
                        <label for="tab-2" class="tab">فراموشی رمز عبور</label>
                        <div class="login-space">
                            <!-- فرم ورود -->
                            <form @submit.prevent="login">
                                <div class="login" :class="{ active: currentForm === 'login' }">
                                    <div class="group">
                                        <input id="login-username" type="text" class="form-control" v-model="credentials.username" placeholder="Enter your username">
                                    </div>
                                    <div class="group">
                                        <input id="login-password" type="password" class="form-control" v-model="credentials.password" placeholder="Enter your password">
                                    </div>
                                    <div class="group">
                                        <input id="check" type="checkbox" class="check" v-model="credentials.rememberMe" checked>
                                        <label for="check"><span class="icon"></span> Keep me Signed in</label>
                                    </div>
                                    <div class="group">
                                        <button type="submit" class="btn-primary" @click="submitLogin">ورود</button>
                                        <div class="hr"></div>
                                        <!-- دکمه‌های سوشال مدیا -->
                                        <div class="social-buttons">
                                            <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook"></i></a>
                                            <a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a>
                                            <a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
                                            <a href="https://linkedin.com" target="_blank"><i class="fab fa-linkedin"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            
                            <div class="foot">
                            </div>
                            <!-- فرم فراموشی رمز -->
                            <div class="reset-form" :class="{ active: currentForm === 'forgotPassword' }">
                                <div class="group">
                                    <input id="forgot-email" type="text" class="form-control" v-model="credentials.email" placeholder="email@example.com">
                                </div>
                                <div class="group">
                                    <button type="submit" class="btn-primary" @click="submitReset">بازنشانی کلمه عبور</button>
                                </div>
                                <div class="hr"></div>
                            </div>
                        </div>
                    </div>
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
            currentForm: "login", // حالت اولیه: فرم ورود
            credentials: {
                username: "",
                password: "",
                rememberMe: true
            },
            forgotEmail: "", // ایمیل وارد شده برای بازیابی رمز عبور
            error: null, // پیام خطا
        };
    },
    methods: {
        // تغییر بین فرم‌ها
        switchForm(form) {
            this.currentForm = form; // تغییر حالت فرم
            this.error = null; // پاک کردن پیام خطا
        },

        // متد ورود
        async login() {
            try {
                const response = await axios.post("http://127.0.0.1:8000/api/token/", this.credentials);
                const { access, refresh } = response.data;

                const userId = response.data.userId; // فرض کنید سرور user ID را در پاسخ ارسال می‌کند
                localStorage.setItem('userId', userId);

                // ذخیره توکن‌ها در localStorage
                localStorage.setItem("access_token", access);
                localStorage.setItem("refresh_token", refresh);

                // تنظیم وضعیت لاگین
                localStorage.setItem("isAuthenticated", "true");

                // هدایت به صفحه لیست کاربران
                this.$router.push("/users");
            } catch (error) {
                this.error = "نام کاربری یا رمز عبور اشتباه است!";
                console.error("Login failed:", error);
            }
        },

        // متد بازیابی رمز عبور
        handleForgotPassword() {
            // منطق بازیابی رمز عبور (مثال: ارسال ایمیل)
            console.log("Forgotten Password Email:", this.forgotEmail);
            alert("ایمیل بازیابی رمز عبور ارسال شد!");
            this.switchForm("login"); // بازگشت به فرم ورود
        },
    },
};
</script>

<style scoped>
/* استایل‌های مربوط به کامپوننت */
.login,
.reset-form {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    transition: transform 0.5s ease-in-out;
}

.login {
    transform: rotateY(0deg);
}

.reset-form {
    transform: rotateY(180deg);
}

.login.active {
    transform: rotateY(0deg);
}

.reset-form.active {
    transform: rotateY(0deg);
}

.login:not(.active) {
    transform: rotateY(-180deg);
}

.reset-form:not(.active) {
    transform: rotateY(180deg);
}

.alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}
</style>