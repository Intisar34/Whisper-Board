<template>
    <div class="page">
    <!--Top bar section for logo, searchbar and user profile-->
    <header class="topBar d-flex align-items-center px-4 py-2">
        <!-- Logo section -->
        <div class="me-3 logoLink" @click="goToHome()" style="cursor: pointer;">
          <img
            src="/WhisperBoardLogo.png"
            alt="WhisperBoard"
            class="img-fluid topBarLogo"
          />
        </div>

        <!-- Spacer to push items to the right -->
        <div class="flex-grow-1"></div>

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
              <span class="ms-2 fw-bold text-dark small">{{ currentUser() ? currentUser().username : 'Not logged in' }}</span>
            </div>
          </template>
          <BDropdownItem @click="goToHome()">Home</BDropdownItem>
          <BDropdownItem @click="logout()"><span class="text-danger">Sign out</span></BDropdownItem>
        </BDropdown>
    </header>

    <!-- Forum Box -->
     <div class="forumContainer">
        <div class="forumHeader">
            <div class="forumHeaderLeft">
                <img src="/forumIcon.png" alt="Forum" class="forumLogo">
                <h1 class="forumName">{{ forumDetail.name }}</h1>
            </div>

            <!-- Search section -->
        <div class="flex-grow-1 mx-md-5 mx-2">
          <div class="search d-flex align-items-center px-3 searchBar">
            <img
              src="/searchIcon.png"
              alt="Search"
              class="searchIcon"
            />
            <input
              type="text"
              class="form-control border-0 bg-transparent shadow-none ms-2"
              placeholder="Search post/forum ..."
              v-model="search"
            />
          </div>
        </div>

          <button class="closeButton" @click="$router.push('/home/posts')">
                <img src="/closeButton.svg">
          </button>
        </div>

         <!-- Forum Description -->
        <div class="divider"></div>

        <article class="forumDescription">{{ forumDetail.description }}</article>

        <!-- Line to separate forum description and post -->
        <div class="divider"></div>

         <!-- Sorting -->
        <div class="d-flex align-items-center mb-3 px-1">
            <span class="small me-1 text-muted">Sort by :</span>
            <div class="customSelectWrapper">
              <select
                v-model="sortBy"
                @change="onSortChange"
                class="customSelect fw-bold small"
              >
                <option value="popular">Popular</option>
                <option value="newest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <div class="small text-muted ms-auto" v-if="!loading">
              {{ filteredPosts.length }} posts
            </div>
          </div>

          <!-- Post section -->
        <BAlert :model-value="true" variant="info" v-if="!loadingAlert && filteredPosts.length === 0">
           <h4 class="alert-heading">OH!</h4>
           <p>No posts to see here yet. Create a post!</p>
        </BAlert>

        <BCard class="postBox" v-for="(item, i) in filteredPosts" :key="i">
            <div class="userInfo">
                <BAvatar size="2.5em" src="/userIcon.png" rounded="sm" class="align-self-start"/>
                <span class="fw-bold text-muted small">{{ currentUser() ? currentUser().username : 'Not logged in' }}</span>
            </div>

            <div class="postInfo">
                <h1 class="postBoxTitle"> {{ item.title }}</h1>
                <p class="postBoxBody"> {{ item.body }}</p>
            </div>
            <div class="rightColumn">
                <span class="text-muted small">&ndash; {{ formatDate(item) }}</span>
                <button class="translateButton">Translate</button>
            </div>
            </BCard>
            </div>
    </div>
</template>

<script>
import { Api } from '@/Api'
import { store } from '@/store'

export default {
  name: 'Forum',

  data() {
    return {
      forumDetail: {
        name: '',
        description: ''
      },
      posts: [],
      forumId: this.$route.params.forumId,
      loadingAlert: true,
      search: '',
      sortBy: 'popular',
      loading: false
    }
  },

  computed: {
    filteredPosts() {
      const term = this.search.trim().toLowerCase()
      if (!term) return this.posts

      return this.posts.filter(post =>
        (post.title && post.title.toLowerCase().includes(term)) ||
        (post.body && post.body.toLowerCase().includes(term))
      )
    }
  },

  async created() {
    await this.fetchForum()
    await this.fetchPostsForum()
  },

  methods: {
    async onSortChange() {
      this.loading = true
      try {
        await this.fetchPostsForum()
      } finally {
        this.loading = false
      }
    },

    async fetchForum() {
      try {
        const response = await Api.get(`/forums/${this.forumId}`)
        const forumDetails = response.data.forum
        this.forumDetail.name = forumDetails.name
        this.forumDetail.description = forumDetails.description
      } catch (err) {
        console.error(err)
      }
    },

    async fetchPostsForum() {
      try {
        const params = {}

        // sort query param
        if (this.sortBy === 'popular' || this.sortBy === 'newest') {
          params.sort = '-postDate'
        } else if (this.sortBy === 'oldest') {
          params.sort = 'postDate'
        }

        const response = await Api.get(`/forums/${this.forumId}/posts`, { params })
        this.posts = Array.isArray(response.data) ? response.data : []
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    formatDate(post) {
      if (!post.createdAt) return ''
      const date = new Date(post.createdAt)
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    goToHome() {
      this.$router.push('/home/posts')
    },

    logout() {
      store.clearUser()
      this.$router.push('/login')
    },

    currentUser() {
      return store.user
    }
  }
}
</script>

<style src="../styles/forumPage.css">
</style>
