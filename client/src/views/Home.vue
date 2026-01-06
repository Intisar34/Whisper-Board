<template>
  <div class="whisperboardPage">
  <!--Top bar section for logo, searchbar and user profile-->
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
              placeholder="Search post/forum ..."
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
              <!-- Post button in home-->
              <button
                type="button"
                class="w-100 text-start d-flex align-items-center mb-2 sidebarItem"
                :class="{ active: activeSidebar === 'post' }"
                @click="activeSidebar = 'post'"
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
                @click="goToForum"
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
          <!--Post creation section-->
          <section class="createPost mb-3 d-flex align-items-center" @click="showCreatePost = true" style="cursor: pointer;">
            <img
              src="/plusIcon.png"
              alt="Create post"
              class="plusIcon me-3"
            />
            <input
              type="text"
              class="createInput flex-grow-1"
              placeholder="Start a post ..."
              readonly
              style="cursor: pointer;"
            />
          </section>

          <CreatePost v-if="showCreatePost" @close="showCreatePost = false" @post-created="init" />

          <!--Sorting section-->
          <div class="d-flex align-items-center mb-3 px-1">
            <span class="small me-1 text-muted">Sort by :</span>
            <div class="customSelectWrapper">
              <select
                v-model="sortBy"
                @change="onSortChange"
                class="customSelect fw-bold small"
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <div class="small text-muted ms-auto" v-if="!loading">
              {{ filteredPosts.length }} posts
            </div>
          </div>

         <article
            v-for="post in filteredPosts"
            :key="post._id"
            class="postCard mb-3 p-3 d-flex align-items-start"
            @click="goToPost(post._id)"
            style="cursor: pointer;"
          >
            <!-- user icon in post section -->
            <div class="postUserIcon me-3 flex-shrink-0">
              <img
                src="/postIcon.png"
                alt="Post"
                class="userIcon"
              />
            </div>
          
            <div class="flex-grow-1 text-start">
              <div class="d-flex align-items-baseline lh-1 mb-1">
                <span class="fw-bold small text-dark me-1">
                  {{ forumName(post) }}
                </span>
                <span class="text-muted small">&ndash; {{ formatDate(post) }}</span>
              </div>
            
              <div class="text-muted tinyText mb-2">
                {{ usernameLabel(post) }}
              </div>
            
              <h2 class="postTitle">
                {{ capitalise(post.title) }}
              </h2>
            
              <p class="postBody">
                {{ post.body }}
              </p>
            
              <footer class="d-flex align-items-center gap-2 mt-3">
                <!-- Like Buttion -->
                <button
                  class="pillButton d-flex align-items-center"
                  type="button"
                  @click.stop="likePost(post._id)"
                >
                  <img
                    src="/likeIcon.png"
                    alt="Likes"
                    class="pillIcon me-1"
                  />
                  {{ post.likes ? post.likes.length : 0 }}
                </button>
              
                <!-- Dislike Button -->
                <button
                  class="pillButton d-flex align-items-center"
                  type="button"
                  @click.stop="dislikePost(post._id)"
                >
                  <img
                    src="/dislikeIcon.png"
                    alt="Dislikes"
                    class="pillIcon me-1"
                  />
                  {{ post.dislikes ? post.dislikes.length : 0 }}
                </button>
              
                <!-- Comment Button -->
                <button
                  class="pillButton d-flex align-items-center"
                  type="button"
                  @click.stop="goToPost(post._id)"
                >
                  <img
                    src="/commentIcon.png"
                    alt="Comments"
                    class="pillIcon me-1"
                  />
                  {{ post.commentsCount ?? 0 }}
                </button>
              </footer>
            </div>
          </article>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>


<script>
  
import { Api } from '@/Api'
import { store } from '../store'
import CreatePost from './CreatePost.vue'

export default {
  name: 'Home',
  components: {
    CreatePost
  },
  data () {
    return {
      
      posts: [],
      forumsById: {}, 
      usersById: {}, 

      loading: false,
      error: null,
      sortBy: 'popular',
      search: '',
      activeSidebar: 'post',
      showCreatePost: false
    }
  },
  computed: {
    filteredPosts () {
      const term = this.search.trim().toLowerCase()
      if (!term) return this.posts

      return this.posts.filter(post =>
        (post.title && post.title.toLowerCase().includes(term)) ||
        (post.body && post.body.toLowerCase().includes(term))
      )
    },
    currentUser() {
      return store.user
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      this.loading = true
      try {
        // Fetch forums, users and posts in parallel
        await Promise.all([
          this.fetchForums(),
          this.fetchUsers(),
          this.fetchPosts()
        ])
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async onSortChange () {
      this.loading = true
      try {
        await this.fetchPosts()
      } finally {
        this.loading = false
      }
    },

    async fetchPosts () {
      try {
        this.error = null
        const params = {}

        // sort query param
        if (this.sortBy === 'popular') {
          params.sort = 'popular'
        } else if (this.sortBy === 'newest') {
          params.sort = '-postDate'
        } else if (this.sortBy === 'oldest') {
          params.sort = 'postDate'
        }

        // Filter by users joined forums
        if (this.currentUser) {
            params.userId = this.currentUser._id
        }

        const response = await Api.get('/posts', { params })
        this.posts = Array.isArray(response.data) ? response.data : []
      } catch (err) {
        console.error(err)
        this.error =
          err.response?.data?.error ||
          'Could not load posts from the server.'
      }
    },

    async fetchForums () {
      try {
        const response = await Api.get('/forums')
        const forums = response.data?.forums || []
        const map = {}

        forums.forEach(forum => {
          map[forum._id] = forum
        })

        this.forumsById = map
      } catch (err) {
        console.error(err)
      }
    },

    async fetchUsers () {
      try {
        const response = await Api.get('/users')
        const users = response.data?.data || []
        const map = {}

        users.forEach(user => {
          map[user._id] = user
        })

        this.usersById = map
      } catch (err) {
        console.error(err)
      }
    },

    forumName (post) {
      const forum = this.forumsById[post.forumID]
      return forum?.name || 'Forum'
    },

    usernameLabel (post) {
      const user = this.usersById[post.userID]
      return user?.username || 'Anonymous user'
    },

    formatDate (post) {
      const raw = post.postDate || post.createdAt
      if (!raw) return ''

      const date = new Date(raw)
      const today = new Date()

      const t = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
      const d = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )

      const diffMs = t - d
      const oneDay = 24 * 60 * 60 * 1000
      const diffDays = Math.round(diffMs / oneDay)

      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`

      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    capitalise (value) {
      if (!value) return ''
      return value.charAt(0).toUpperCase() + value.slice(1)
    },

    goToForum () {
      this.$router.push('/home/forums')
    },

    goToPost(postId) {
      this.$router.push(`/posts/${postId}`)
    },

    async likePost(postId) {
      if (!store.user) {
        alert('You must be logged in to like a post.')
        return
      }
      try {
        const response = await Api.patch(`/posts/${postId}/like`, {
            userID: store.user._id
        });
        const updatedPost = response.data;
        const index = this.posts.findIndex(p => p._id === postId);
        if (index !== -1) {

          updatedPost.commentsCount = this.posts[index].commentsCount;
          this.posts.splice(index, 1, updatedPost);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to like post');
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
        });
        const updatedPost = response.data;
        const index = this.posts.findIndex(p => p._id === postId);
        if (index !== -1) {

          updatedPost.commentsCount = this.posts[index].commentsCount;
          this.posts.splice(index, 1, updatedPost);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to dislike post');
      }
    },

    goToHome() {
      // If already on home, reload or do nothing 
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

<style src="../styles/home.css"></style>

