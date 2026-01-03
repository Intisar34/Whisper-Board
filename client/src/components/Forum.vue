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
        <div class="forumHeader d-flex align-items-start justify-content-between">
            <div class="forumHeaderLeft">
                <img src="/forumIcon.png" alt="Forum" class="forumLogo">
                <h1 class="forumName">{{ translatedForum ? translatedForum.name : forumDetail?.name }}</h1>
            </div>

            <!-- Search section -->
        <div class="d-flex align-items-center gap-3">
          <div class="search d-flex align-items-center px-3 forumSearch me-5">
            <img src="/searchIcon.png" alt="Search" class="searchIconForum"/>
            <input type="text" class="form-control border-0 bg-transparent shadow-none ms-2" placeholder="Search posts.." v-model="search"/>
          </div>
        </div>

          <button class="closeButton" @click="$router.push('/home/posts')">
                <img src="/closeButton.svg">
          </button>
        </div>

         <!-- Forum Description -->
        <div class="divider"></div>

        <article class="forumDescription">{{ translatedForum ? translatedForum.description : forumDetail?.description }}</article>

        <button class="pillButton translateAction ms-auto" @click="translateForum">
            <span class="tinyText fw-bold">
              {{ isTranslatingForum ? 'translating...' : (forumTranslationError ? 'Failed translation' : (translatedForum ? 'Show Original' : 'Translate Forum')) }}
            </span>
        </button>

        <!-- Line to separate forum description and post -->
        <div class="divider"></div>

         <!-- Sorting -->
        <div class="d-flex align-items-center mb-3 px-1">
            <span class="small me-1 text-muted">Sort by :</span>
            <div class="customSelectWrapper">
              <select v-model="sortBy" @change="onSortChange" class="customSelect fw-bold small">
                <option value="popular">Popular</option>
                <option value="newest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <div class="small text-muted ms-auto" v-if="!loading">
              {{ filteredPosts.length }} posts
            </div>
          </div>

          <BAlert :model-value="true" variant="light" v-if="!loadingPosts && posts.length === 0">
            <h4 class="alert-heading">{{ alertTitle}}</h4>
            <p>{{ alertBody }} <BLink :to="'/home/forums'" class="me-2">{{ translatedAlert ? 'här': 'here' }}</BLink></p>
            <button class="pillButton translateAction ms-auto" @click="translateAlert">
              <span class="tinyText fw-bold">
                {{ isTranslatingAlert ? 'translating...' : (alertTranslationError ? 'Failed translation' : (translatedAlert ? 'Show Original' : 'Translate')) }}
              </span>
            </button>
          </BAlert>

          <!-- Post section -->
        <BCard class="postCard d-flex flex-row align-items-start border-0 p-2 mb-4" v-for="item in filteredPosts" :key="item._id" @click="openPost(item._id)">
             <div class="d-flex w-100">
              <div class="postUserIcon me-3 flex-shrink-0">
               <img src="/postIcon.png" alt="Post" class="userIcon"/>
              </div>

              <div class="flex-grow-1 text-start">
               <div class="d-flex align-items-baseline lh-1 mb-1">
                <span class="text-muted small">&ndash; {{ formatDate(item) }}</span>
               </div>

               <div class="text-muted tinyText mb-2">
                 {{ item.userID?.username || "Unknown user" }}
               </div>

               <h2 class="postTitle">
                 {{ capitalise(item.translated?.title || item.title) }}
               </h2>
               <p class="postBody">
                 {{ item.translated?.body || item.body }}
               </p>
               <footer class="d-flex align-items-center gap-2 mt-3">
                <!-- Like Buttion -->
                <button class="pillButton d-flex align-items-center" type="button" @click.stop="likePost(item._id)">
                  <img src="/likeIcon.png" alt="Likes" class="pillIcon me-1"/>
                  {{ item.likes ? item.likes.length : 0 }}
                </button>

                <!-- Dislike Button -->
                <button class="pillButton d-flex align-items-center" type="button" @click.stop="dislikePost(item._id)">
                  <img src="/dislikeIcon.png" alt="Dislikes" class="pillIcon me-1"/>
                  {{ item.dislikes ? item.dislikes.length : 0 }}
                </button>

                <!-- Comment Button -->
                <button class="pillButton d-flex align-items-center" type="button" disabled>
                  <img src="/commentIcon.png" alt="Comments" class="pillIcon me-1"/>
                  {{ item.commentsCount ?? 0 }}
                </button>
                <!-- Translation Button -->
                <button class="pillButton translateAction ms-auto" @click.stop="translatePost(item)">
                  <span class="tinyText fw-bold">
                    {{ item.isTranslating ? 'translating...' : (item.translationError ? 'Failed translation' : (item.translated ? 'Show Original' : 'Translate Post')) }}
                  </span>
                </button>
               </footer>
              </div>
             </div>
         </BCard>
        </div>
    </div>
</template>

<script>
import { Api } from '@/Api'
import { store } from '@/store'
import { sendTranslation } from '@/translation.js'

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
      loadingPosts: true,
      search: '',
      sortBy: 'popular',
      loading: false,
      translatedForum: null,
      translatedAlert: null,
      isTranslatingForum: false,
      forumTranslationError: false,
      isTranslatingAlert: false,
      alertTranslationError: false
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
    },
    alertTitle() {
      return this.translatedAlert?.title || 'OH!'
    },
    alertBody() {
      return this.translatedAlert?.body || 'Looks like there are no posts yet. Click here to join the forum and create a post!'
    }
  },

  async created() {
    await Promise.all([
      this.fetchForum(),
      this.fetchPostsForum()
    ])
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
      this.loadingPosts = true
      try {
        const params = {}

        // sort query param
        if (this.sortBy === 'popular' || this.sortBy === 'newest') {
          params.sort = '-postDate'
        } else if (this.sortBy === 'oldest') {
          params.sort = 'postDate'
        }

        const response = await Api.get(`/forums/${this.forumId}/posts`, { params })
        this.posts = Array.isArray(response.data) ? response.data.map(post => ({ ...post, isTranslating: false, translationError: false })) : []
      } catch (err) {
        console.error(err)
      } finally {
        this.loadingPosts = false
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

    async likePost(postId) {
      if (!store.user) {
        alert('You must be logged in to like a post.')
        return
      }
      try {
        const response = await Api.patch(`/posts/${postId}/like`, {
          userID: store.user._id
        })
        const updatedPost = response.data
        const index = this.posts.findIndex(p => p._id === postId)
        if (index !== -1) {
          this.posts[index] = {
            ...this.posts[index],
            likes: updatedPost.likes,
            dislikes: updatedPost.dislikes
          }
        }
      } catch (err) {
        console.error(err)
        alert('Failed to like post')
      }
    },

    async dislikePost(postId) {
      if (!store.user) {
        alert('You must be logged in to dislike a post.')
        return
      }
      try {
        const response = await Api.patch(`/posts/${postId}/dislike`, {
          userID: store.user._id
        })
        const updatedPost = response.data
        const index = this.posts.findIndex(p => p._id === postId)
        if (index !== -1) {
          this.posts[index] = {
            ...this.posts[index],
            likes: updatedPost.likes,
            dislikes: updatedPost.dislikes
          }
        }
      } catch (err) {
        console.error(err)
        alert('Failed to dislike post')
      }
    },

    async translatePost(post) {
      try {
        if (post.translated) {
          post.translated = null
          return
        }

        post.isTranslating = true
        post.translationError = false

        const cachedBody = store.getTranslation(post.body, 'sv')
        const cachedTitle = store.getTranslation(post.title, 'sv')
        if (cachedBody && cachedTitle) {
          post.translated = {
            title: cachedTitle || post.title,
            body: cachedBody || post.body
          }
          post.isTranslating = false
          return
        }

        const [translatedTitle, translatedBody] = await Promise.all([
          sendTranslation(post.title, 'sv'),
          sendTranslation(post.body, 'sv')
        ])

        store.addTranslation(post.title, translatedTitle, 'sv')
        store.addTranslation(post.body, translatedBody, 'sv')

        post.translated = {
          title: translatedTitle,
          body: translatedBody
        }
        post.isTranslating = false
      } catch (err) {
        console.error('Post translation failed:', err)
        post.isTranslating = false
        post.translationError = true
      }
    },

    async translateForum() {
      try {
        if (this.translatedForum) {
          this.translatedForum = null
          return
        }

        this.isTranslatingForum = true
        this.forumTranslationError = false

        const cachedTitle = store.getTranslation(this.forumDetail.name, 'sv')
        const cachedBody = store.getTranslation(this.forumDetail.description, 'sv')

        if (cachedTitle && cachedBody) {
          this.translatedForum = {
            name: cachedTitle,
            description: cachedBody
          }
          this.isTranslatingForum = false
          return
        }

        const [translatedTitle, translatedBody] = await Promise.all([
          sendTranslation(this.forumDetail.name, 'sv'),
          sendTranslation(this.forumDetail.description, 'sv')
        ])

        store.addTranslation(this.forumDetail.name, translatedTitle, 'sv')
        store.addTranslation(this.forumDetail.description, translatedBody, 'sv')

        this.translatedForum = {
          name: translatedTitle,
          description: translatedBody
        }
        this.isTranslatingForum = false
      } catch (err) {
        console.error('Post translation failed:', err)
        this.isTranslatingForum = false
        this.forumTranslationError = true
      }
    },

    async translateAlert() {
      try {
        if (this.translatedAlert) {
          this.translatedAlert = null
          return
        }

        this.isTranslatingAlert = true
        this.alertTranslationError = false

        const alertTitle = 'OH!'
        const alertBody = 'Looks like there are no posts yet. Click here to join the forum and create a post!'

        const cachedTitle = store.getTranslation(alertTitle, 'sv')
        const cachedBody = store.getTranslation(alertBody, 'sv')

        if (cachedTitle && cachedBody) {
          this.translatedAlert = {
            title: cachedTitle,
            body: cachedBody
          }
          this.isTranslatingAlert = false
          return
        }

        const [translatedTitle, translatedBody] = await Promise.all([
          sendTranslation(alertTitle, 'sv'),
          sendTranslation(alertBody, 'sv')
        ])

        store.addTranslation(alertTitle, translatedTitle, 'sv')
        store.addTranslation(alertBody, translatedBody, 'sv')

        this.translatedAlert = {
          title: translatedTitle,
          body: translatedBody
        }
        this.isTranslatingAlert = false
      } catch (err) {
        console.error('Post translation failed:', err)
        this.isTranslatingAlert = false
        this.alertTranslationError = true
      }
    },

    goToHome() {
      this.$router.push('/home/posts')
    },

    capitalise(value) {
      if (!value) return ''
      return value.charAt(0).toUpperCase() + value.slice(1)
    },

    openPost(postID) {
      this.$router.push(`/posts/${postID}`)
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
