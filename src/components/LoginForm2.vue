import Keycloak from 'keycloak-js';

export default {
    data() {
        return {
            credentials: {
                username: '',
                password: '',
            },
            error: null,
            keycloak: null, // Keycloak instance
        };
    },
    created() {
        // Initialize Keycloak
        this.keycloak = new Keycloak({
            url: 'http://localhost:8080/auth', // URL of your Keycloak server
            realm: 'your-realm-name', // Replace with your realm name
            clientId: 'your-client-id', // Replace with your client ID
        });
    },
    methods: {
        async login() {
            try {
                // Authenticate with Keycloak
                const authenticated = await this.keycloak.init({
                    onLoad: 'login-required',
                    flow: 'standard',
                });

                if (authenticated) {
                    console.log('User authenticated:', this.keycloak.token);

                    // Store tokens in localStorage
                    localStorage.setItem('access_token', this.keycloak.token);
                    localStorage.setItem('refresh_token', this.keycloak.refreshToken);

                    // Redirect to the user list page
                    this.$router.push('/users');
                } else {
                    this.error = 'Authentication failed';
                }
            } catch (error) {
                this.error = 'Login failed';
                console.error('Keycloak login failed:', error);
            }
        },
    },
};






import Keycloak from 'keycloak-js';

export default {
    data() {
        return {
            keycloak: null,
            error: null,
        };
    },
    created() {
        // Initialize Keycloak
        this.keycloak = new Keycloak({
            url: 'http://localhost:8080/auth', // URL of your Keycloak server
            realm: 'your-realm-name', // Replace with your realm name
            clientId: 'your-client-id', // Replace with your client ID
        });
    },
    methods: {
        // Function to set data in sessionStorage with expiration time
        setWithExpiry(key, value, ttl) {
            const now = new Date();
            const item = {
                value: value,
                expiry: now.getTime() + ttl, // Expiration time in milliseconds
            };
            sessionStorage.setItem(key, JSON.stringify(item));
        },

        // Function to get data from sessionStorage and check for expiration
        getWithExpiry(key) {
            const itemStr = sessionStorage.getItem(key);
            if (!itemStr) {
                return null; // Data does not exist
            }

            const item = JSON.parse(itemStr);
            const now = new Date();

            if (now.getTime() > item.expiry) {
                // Data has expired, remove it
                sessionStorage.removeItem(key);
                return null;
            }

            return item.value; // Data is still valid
        },

        async login() {
            try {
                // Authenticate with Keycloak
                const authenticated = await this.keycloak.init({
                    onLoad: 'login-required',
                    flow: 'standard',
                });

                if (authenticated) {
                    console.log('User authenticated:', this.keycloak.token);

                    // Store tokens in sessionStorage with expiration time
                    const tokenTTL = this.keycloak.tokenParsed.exp * 1000 - Date.now(); // Time-to-live in milliseconds
                    this.setWithExpiry('access_token', this.keycloak.token, tokenTTL);
                    this.setWithExpiry('refresh_token', this.keycloak.refreshToken, tokenTTL);

                    // Redirect to the user list page
                    this.$router.push('/users');
                } else {
                    this.error = 'Authentication failed';
                }
            } catch (error) {
                this.error = 'Login failed';
                console.error('Keycloak login failed:', error);
            }
        },

        logout() {
            // Remove tokens from sessionStorage
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');

            // Logout from Keycloak
            this.keycloak.logout();
        },

        isAuthenticated() {
            // Check if the access token is still valid
            const accessToken = this.getWithExpiry('access_token');
            return !!accessToken; // Returns true if token exists and is not expired
        },
    },
};