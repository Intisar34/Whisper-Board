<template>
    <div class="page">
        <div class="forumInfo">
            <h1 class="forumPageName">{{ forumDetail.name }}</h1>
            <p class="forumDescription">{{ forumDetail.description }}</p>
        </div>

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
      }
    }
  },

  async created() {
    await this.fetchForum()
  },

  methods: {
    async fetchForum() {
      try {
        const forumId = this.$route.params.forumId
        const response = await Api.get(`/forums/${forumId}`)
        const forumDetails = response.data.forum
        this.forumDetail.name = forumDetails.name
        this.forumDetail.description = forumDetails.description
      } catch (err) {
        console.error(err)
      }
    }
  }

}
</script>

<style src="../styles/forumPage.css">
    </style>
