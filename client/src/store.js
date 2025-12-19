import { reactive } from 'vue'

export const store = reactive({
    user: null,

    initialize() { // Initializing the store from local storage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser)
            } catch (e) {
                console.error('Failed to parse user from localStorage', e)
                localStorage.removeItem('user')
            }
        }
    },

    setUser(userData) { // set the user and save to local storage
        this.user = userData
        localStorage.setItem('user', JSON.stringify(userData))
    },

    
    clearUser() { // clear the user and remove from the local storage
        this.user = null
        localStorage.removeItem('user')
    }
})
