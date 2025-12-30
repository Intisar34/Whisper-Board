<template>
  <header class="topBar d-flex align-items-center px-4 py-2">
    <!-- Logo section -->
    <div class="me-3" @click="goToHome" style="cursor: pointer;">
      <img
        src="/WhisperBoardLogo.png"
        alt="WhisperBoard"
        class="img-fluid"
      />
    </div>

    <!-- Search section -->
    <div v-if="showSearch" class="flex-grow-1 mx-md-5 mx-2">
      <div class="search d-flex align-items-center px-3">
        <img
          src="/searchIcon.png"
          alt="Search"
          class="searchIcon"
        />
        <input
          type="text"
          class="form-control border-0 bg-transparent shadow-none ms-2"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>
    </div>
    <!-- Spacer, as search bar is hidden -->
    <div v-else class="flex-grow-1"></div>

    <!-- Notification section -->
    <button
      class="bellIcon me-4"
      type="button"
      aria-label="Notifications"
    >
      <img
        src="/Bellicon.png"
        alt="Notifications"
        class="bellIcon"
      />
    </button>

    <!-- User section -->
    <BDropdown variant="link" toggle-class="text-decoration-none p-0" no-caret>
      <template #button-content>
        <div class="userIconBox d-flex align-items-center cursor-pointer">
          <div class="userIconOutline">
            <img
              src="/userIcon.png"
              alt="User avatar"
              class="userIcon"
            />
          </div>
          <span class="ms-2 fw-bold text-dark small">{{ currentUser ? currentUser.username : 'Not logged in' }}</span>
        </div>
      </template>
      <BDropdownItem @click="goToProfile">Profile</BDropdownItem>
      <BDropdownItem @click="logout"><span class="text-danger">Sign out</span></BDropdownItem>
    </BDropdown>
  </header>
</template>

<script>
import { store } from '@/store'

export default {
  name: 'TopBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Search...'
    },
    showSearch: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue'],
  computed: {
    currentUser() {
      return store.user
    }
  },
  methods: {
    goToHome() {
      if (this.$route.path === '/home/posts') {
        this.$router.go(0)
      } else {
        this.$router.push('/home/posts')
      }
    },
    goToProfile() {
      this.$router.push('/profile')
    },
    logout() {
      store.clearUser()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
</style>
