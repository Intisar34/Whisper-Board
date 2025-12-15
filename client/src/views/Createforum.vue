<template>
  <div class="homepage">
    <div class="newforumBox">

      <div class="title">
        <h2>Create Forum</h2>
        <button class="closeButton" @click="$emit('close')">×</button>
      </div>

      <div class="mainContent">
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
        <p v-if="error" class="errorText">{{ error }}</p>
      </div>

      <div class="button">
        <button class="createBtn" @click="createForum"> Create Forum </button>
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
      category: '',
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

<style src="../styles/create-forum.css"></style>
