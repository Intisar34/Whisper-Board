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

    <div class="forumInfo">
        <h1 class="forumPageName">{{ forumDetail.name }}</h1>
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1"  fill="none" class="line">
            <path d="M0 0.5H1077.5" stroke="black"/>
        </svg>
        <article class="forumDescription">{{ forumDetail.description }}</article>
        </div>

        <BAlert :model-value="true" variant="info" v-if="!loading && posts.length === 0">
           <h4 class="alert-heading">OH!</h4>
           <p>No posts to see here yet. Create a post!</p>
        </BAlert>

        <BCard class="postBox" v-for="(item, i) in posts" :key="i">
            <div class="userMeta">
                <BAvatar size="2.5em" src="/userIcon.png" rounded="sm" class="align-self-start"/>
                <span class="fw-bold text-muted small">{{ currentUser() ? currentUser().username : 'Not logged in' }}</span>
            </div>

            <div class="postMeta">
                <h1 class="postBoxTitle"> {{ item.title }}</h1>
                <p class="postBoxBody"> {{ item.body }}</p>
            </div>
            <div class="rightColumn">
                <span class="text-muted small">&ndash; {{ formatDate(item) }}</span>
                <button class="translateButton">Translate</button>
            </div>
        </BCard>
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
      loading: true
    }
  },

  async created() {
    await this.fetchForum()
    await this.fetchPostsForum()
  },

  methods: {
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
        const response = await Api.get(`/forums/${this.forumId}/posts`)
        this.posts = response.data
        console.log(response.data)
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
