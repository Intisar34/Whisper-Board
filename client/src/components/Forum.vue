<template>
    <div class="page">
        <div class="forumInfo">
            <h1 class="forumPageName">{{ forumDetail.name }}</h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="1"  fill="none" class="line">
                <path d="M0 0.5H1077.5" stroke="black"/>
            </svg>
            <p class="forumDescription">{{ forumDetail.description }}</p>
        </div>

        <BAlert :model-value="true" variant="info" v-if="!loading && posts.length === 0">
           <h4 class="alert-heading">OH!</h4>
           <p>No posts to see here yet. Create a post!</p>
        </BAlert>

        <BCard class="postCard" v-for="(item, i) in posts" :key="i">
            <h1 class="postTitle"> {{ item.title }}</h1>
            <p class="postBody"> {{ item.body }}</p>
            <span class="text-muted small">&ndash; {{ formatDate(item) }}</span>
        </BCard>
    </div>
</template>

<script>
import { Api } from '@/Api'

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
    }
  }
}
</script>

<style src="../styles/forumPage.css">
</style>
