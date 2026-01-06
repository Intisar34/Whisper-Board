<template>
  <div class="whisperboardPage">
  <!--Top bar section for logo, searchbar and user profile-->
       <header class="topBar d-flex align-items-center px-4 py-2">
        <!-- Logo section -->
        <div class="me-3" @click="goToPost" style="cursor: pointer;">
          <img
            src="/WhisperBoardLogo.png"
            alt="WhisperBoard"
            class="img-fluid"
          />
        </div>

        <!-- Search section -->
        <div class="flex-grow-1 mx-md-5 mx-2">
          <div class="search d-flex align-items-center px-3">
            <img
              src="/searchIcon.png"
              alt="Search"
              class="searchIcon"
            />
            <input
              type="text"
              class="form-control border-0 bg-transparent shadow-none ms-2"
              placeholder="Search forum ..."
              v-model="search"
            />
          </div>
        </div>

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

    <b-container fluid class="px-4 mt-4">
      <b-row>
        <!-- Side Bar Section for Post and Forum Button-->
        <b-col cols="12" md="3" lg="2" class="mb-4">
            <nav class="sidebar pt-2">
              <!-- Post button -->
              <button
                type="button"
                class="w-100 text-start d-flex align-items-center mb-2 sidebarItem"
                :class="{ active: activeSidebar === 'post' }"
                @click="goToPost"
              >
                <div class="sidebarIconBox me-3">
                  <img
                    src="/postIcon.png"
                    alt="Post"
                    class="sidebarIcon"
                  />
                </div>
                <span class="fw-bold">Post</span>
              </button>

              <!-- Forum button -->
              <button
                type="button"
                class="w-100 text-start d-flex align-items-center sidebarItem"
                :class="{ active: activeSidebar === 'forum' }"
                @click="activeSidebar = 'forum'"
              >
                <div class="sidebarIconBox me-3">
                  <img
                    src="/forumIcon.png"
                    alt="Forum"
                    class="sidebarIcon"
                  />
                </div>
                <span class="fw-bold">Forum</span>
              </button>
          </nav>
        </b-col>

        <!-- Main Content Section -->
        <b-col cols="12" md="9" lg="10">

          <!--Forum creation section-->
          <section
            class="createForum mb-3 d-flex align-items-center w-100"
            @click="showCreateForum = true"
            style="cursor: pointer;"
          >
            <img
              src="/plusIcon.png"
              alt="Create forum"
              class="plusIcon me-3"
            />
            <input
              type="text"
              class="createInput flex-grow-1"
              placeholder="Start a forum ..."
              readonly
              style="cursor: pointer;"
            />
          </section>

          <CreateForum v-if="showCreateForum" @close="showCreateForum = false"/>

          <!--Filtering section-->
          <div class="d-flex align-items-center mb-3 px-1">
            <span class="small me-1 text-muted">Filter by:</span>
            <div class="customSelectWrapper">
              <select
                v-model="filterBy"
                @change="onFilterChange"
                class="customSelect fw-bold small"
              >
                <option value="all">All</option>
                <option value="courses">Courses</option>
                <option value="school">School</option>
                <option value="teachers">Teachers</option>
                <option value="hackathons">Hackathons</option>
                <option value="events">Events</option>
                <option value="socializing">Socializing</option>
              </select>
            </div>
             <div class="small text-muted ms-auto" v-if="!loading">
              {{ filteredForums.length }} forums
            </div>
          </div>

          <div v-if="loading" class="text-center">
            Loading...
          </div>

          <div v-else-if="error" class="text-danger">
             {{ error }}
          </div>

          <div v-else>
          <article
            v-for="forum in filteredForums"
            :key="forum._id"
            class="forumCard mb-3 p-3 d-flex align-items-start forumClickable"
          >
            <!-- forum icon -->
            <div class="forumIconBox me-3 flex-shrink-0">
              <img
                src="/forumIcon.png"
                alt="Forum icon"
                class="userIcon"
              />
            </div>
            <div class="flex-grow-1 text-start" @click="openForum(forum._id)">
              <div class="d-flex align-items-baseline lh-1 mb-2">
                <h2 class="forumTitle m-0 me-1">
                  {{ capitalise(forum.name) }}
                </h2>
                <span class="text-muted small">&ndash; {{ formatDate(forum.createdAt) }}</span>
              </div>

              <p class="forumBody mb-0">
                {{ forum.description }}
              </p>
            </div>

            <!-- Join and Leave Button for forum-->
            <div class="ms-3 align-self-center">

              <button
                v-if="!isJoined(forum)"
                class="btn btn-sm btn-primary"
                @click.stop="joinForum(forum._id)"
              >
                Join
              </button>
              <button
                v-else
                class="btn btn-sm btn-outline-danger"
                @click.stop="leaveForum(forum._id)"
              >
                Leave
              </button>

            </div>
          </article>
          </div>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
import { Api } from '@/Api'
import CreateForum from './Createforum.vue'
import { store } from '../store'

export default {
  name: 'HomeForum',
  components: {
    CreateForum
  },
  data() {
    return {
      search: '',
      activeSidebar: 'forum',
      forums: [],
      loading: false,
      error: null,
      showCreateForum: false,
      filterBy: 'all',
      forum: {
        name: '',
        description: ''
      }
    }
  },
  computed: {
    filteredForums() {
      const term = this.search.trim().toLowerCase()
      if (!term) return this.forums

      return this.forums.filter(forum =>
        (forum.name && forum.name.toLowerCase().includes(term)) ||
        (forum.description && forum.description.toLowerCase().includes(term))
      )
    },

    currentUser() {
      return store.user
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      try {
        await this.fetchForums()
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    goToPost() {
      this.$router.push('/home/posts')
    },

    async onFilterChange() {
      this.loading = true
      try {
        await this.fetchForums()
      } finally {
        this.loading = false
      }
    },

    async fetchForums() {
      try {
        this.error = null
        const params = {}

        if (this.filterBy !== 'all') {
          params.category = this.filterBy
        }

        const response = await Api.get('/forums', { params })
        this.forums = response.data?.forums || []
      } catch (err) {
        console.error(err)
        this.error = 'Failed to load forums.'
      }
    },

    openForum(forumID) {
      this.$router.push(`/forums/${forumID}`)
    },

    capitalise(value) {
      if (!value) return ''
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    isJoined(forum) {
      if (!this.currentUser || !forum.members) return false
      return forum.members.includes(this.currentUser._id)
    },

    async joinForum(forumId) {
      if (!this.currentUser) {
        alert('Please log in to join forums.')
        return
      }
      try {
        const response = await Api.patch(`/forums/${forumId}/join`, {
          userID: this.currentUser._id
        })

        // Update local store
        const updatedForum = response.data.forum
        const index = this.forums.findIndex(f => f._id === forumId)
        if (index !== -1) {
          this.forums.splice(index, 1, updatedForum)
        }
      } catch (err) {
        console.error(err)
        alert('Failed to join forum')
      }
    },

    async leaveForum(forumId) {
      if (!this.currentUser) {
        alert('Please log in to leave forums.')
        return
      }
      try {
        const response = await Api.patch(`/forums/${forumId}/leave`, {
          userID: this.currentUser._id
        })

        // Update local store
        const updatedForum = response.data.forum
        const index = this.forums.findIndex(f => f._id === forumId)
        if (index !== -1) {
          this.forums.splice(index, 1, updatedForum)
        }
      } catch (err) {
        console.error(err)
        alert('Failed to leave forum')
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

<style src="../styles/homeForum.css"></style>
