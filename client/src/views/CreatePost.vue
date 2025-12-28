<template>
  <div class="homepage" @click.self="$emit('close')">
    <div class="newforumBox">
      <button class="closeButton" @click="$emit('close')">×</button>

      <div class="mainContent flex-grow-1">

        <div class="title">
          <h2>Create Post</h2>
        </div>

        <div class="forumGroup">
          <label>Title</label>
          <input v-model="title" type="text" class="input" placeholder="An interesting title" />
        </div>

        <div class="forumGroup">
          <label>Body</label>
          <textarea
            v-model="body"
            class="textarea"
            placeholder="What's on your mind?"
            rows="5"
          ></textarea>
        </div>

        <div class="forumGroup mb-3">
          <label for="postForum" class="form-label">Post to Forum</label>
          <select v-model="selectedForumID" id="postForum" class="form-select">
            <option value="" disabled>Select a forum</option>
            <option v-for="forum in joinedForums" :key="forum._id" :value="forum._id">
              {{ forum.name }}
            </option>
          </select>
          <div v-if="!forumsLoading && joinedForums.length === 0" class="text-muted small mt-1">
            You haven't joined any forums yet.
          </div>
        </div>

        <p v-if="error" class="errorText">{{ error }}</p>

        <div class="button">
          <button class="createButton" @click="createPost" :disabled="loading">
            {{ loading ? 'Posting...' : 'Create Post' }}
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import { store } from '../store'

export default {
  name: 'CreatePost',
  data() {
    return {
      title: '',
      body: '',
      selectedForumID: '',
      forums: [],
      loading: false,
      forumsLoading: true, 
      error: null
    }
  },
  computed: {
    currentUser() {
      return store.user
    },
    joinedForums() {
      if (!this.currentUser) return []
      return this.forums.filter(forum => 
        forum.members && forum.members.includes(this.currentUser._id)
      )
    }
  },
  mounted() {
    this.fetchForums()
  },
  methods: {
    async fetchForums() {
      this.forumsLoading = true
      try {
        const response = await Api.get('/forums')
        this.forums = response.data?.forums || []
      } catch (err) {
        console.error(err)
        this.error = 'Failed to load forums.'
      } finally {
        this.forumsLoading = false
      }
    },

    async createPost() {
      if (!this.currentUser) {
        this.error = 'You must be logged in to post.'
        return
      }

      if (!this.title.trim() || !this.body.trim()) {
        this.error = 'Title and body are required.'
        return
      }

      if (!this.selectedForumID) {
        this.error = 'Please select a forum to post to.'
        return
      }

      this.loading = true
      this.error = null

      try {

        await Api.post('/posts', {
          title: this.title,
          body: this.body,
          userID: this.currentUser._id,
          forumID: this.selectedForumID
        })

        this.$emit('post-created')
        this.$emit('close')

      } catch (err) {
        console.error(err)
        this.error = err.response?.data?.error || 'Failed to create post.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style src="../styles/createPost.css"></style>
