<template>
  <div class="homepage" @click.self="$emit('close')">
    <div class="newforumBox">
      <button class="closeButton" @click="$emit('close')">×</button>

      <div class="mainContent  flex-grow-1">

        <div class="title">
        <h2>Create Forum</h2>
      </div>

        <div class="forumGroup">
          <label>Forum Name</label>
          <input v-model="name" type="text" class="input" placeholder="My Forum" />
        </div>

        <div class="forumGroup">
          <label>Description</label>
          <textarea
            v-model="description"
            class="textarea"
            placeholder="What is this forum about?"
          ></textarea>
        </div>

        <div class="forumGroup mb-3">
        <label for="forumCategory" class="form-label">Category</label>
        <select v-model="category" id="forumCategory" class="form-select">
          <option value="" disabled>Select a category</option>
          <option value="courses">Courses</option>
          <option value="teachers">Teachers</option>
          <option value="internship">Internships</option>
          <option value="hackathon">Hackathon</option>
          <option value="events">Events</option>
          <option value="socializing">Socializing</option>
        </select>
        </div>
        <p v-if="error" class="errorText">{{ error }}</p>

        <div class="button">
          <button class="createButton" @click="createForum"> Create Forum </button>
        </div>
    </div>

    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import { store } from '../store'

export default {
  name: 'CreateForum',
  data() {
    return {
      name: '',
      description: '',
      category: null,
      error: null
    }
  },

  computed: {
    currentUser() {
      return store.user
    }
  },

  methods: {
    async createForum() {
      const user = store.user

      if (!this.name.trim()) {
        this.error = 'Forum name is required.'
        return
      }

      if (!this.category) {
        this.error = 'Please select a category.'
        return
      }

      this.loading = true
      this.error = null

      try {
        if (!user || !user._id) {
          this.error = 'You must be logged in to create a forum.'
          this.loading = false
          return
        }

        await Api.post('/forums', {
          name: this.name,
          description: this.description,
          category: this.category,
          userID: user._id
        })

        this.$emit('close')
      } catch (err) {
        this.error =
          err.response?.data?.error || 'Failed to create forum.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style src="../styles/createForum.css"></style>
