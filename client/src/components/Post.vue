<template>
    <div class="postPage">
        <div class="logoContainer">
            <h1 class="logo"> WhisperBoard</h1>
        </div>

        <div class="postContainer">
            <div class="userContainer">
                <BAvatar size="4em" src="/userIcon.png" rounded="sm" class="align-self-start"/>
                <h2 class="username">{{ post?.userID?.username }}</h2>
                <span class="text-muted small">&ndash; {{ formatDate(post) }}</span>
            </div>

            <button class="closeButton" @click="$router.push('/home/posts')">
                <img src="/closeButton.svg">
            </button>

            <div class="translationContainer">
                <button class="translationButton" @click="translatePost">
                  {{ translatedPost ? 'Show original' : 'Translate' }}
                </button>
            </div>

            <h2 class="postTitle">{{ post?.title }}</h2>

            <article class="postContent">
            {{ translatedPost || post?.body }}
            </article>

           <div class="commentActions">
                <button class="pillButton" type="button">
                    <img src="/likeIcon.png" alt="Likes" class="pillIcon me-1"/>
                    <span class="tinyText">5</span>
                </button>

                <button class="pillButton" type="button">
                    <img src="/dislikeIcon.png" alt="Dislikes" class="pillIcon me-1"/>
                    <span class="tinyText">2</span>
                </button>

                <button class="pillButton" type="button">
                    <img src="/commentIcon.png" alt="Dislikes" class="pillIcon me-1"/>
                    <span class="tinyText">4</span>
                </button>
            </div>

            <div class="commentInput" ref="commentInput">
                <BFormTextarea class="commentText" v-model="commentDetail" rows="1" auto-grow placeholder="comment..."/>
                <button class="sendButton" type="submit" @click="createComment">
                   <img src="/sendIcon.svg"/>
                </button>
            </div>

        </div>
        <div class="commentContainer" v-for="comment in comments" :key="comment._id">
           <div class="userContainer">
                <BAvatar size="1.5em" src="/userIcon.png" rounded="sm" class="align-self-start"/>
                <h2 class="username">{{ comment.userID?.username }}</h2>
                <time class="commentDate">{{ formatDate(comment) }}</time>
            </div>

            <p class="commentContent">{{  comment.translated  || comment.body}}</p>

            <div class="commentActions">
                <button class="pillButton" type="button">
                    <img src="/likeIcon.png" alt="Likes" class="pillIcon me-1"/>
                    <span class="tinyText">2</span>
                </button>

                <button class="pillButton" type="button">
                    <img src="/dislikeIcon.png" alt="Dislikes" class="pillIcon me-1"/>
                    <span class="tinyText">2</span>
                </button>

                <button class="pillButton" type="button" @click="startReply(comment)">
                    reply
                </button>
            </div>
            <div class="translationContainer">
                <button class="translationButton" @click="translateComment(comment)">
                  {{ comment.translated ? 'Show original' : 'Translate' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { Api } from '@/Api'
import { store } from '@/store.js'
import { sendTranslation } from '@/translation.js'

export default {
  name: 'Post',

  data() {
    return {
      store,
      post: null,
      commentDetail: '',
      comments: [],
      translatedPost: '',
      reply: null,
      replyTo: ''
    }
  },

  computed: {
    postId() {
      return this.$route.params.id
    }
  },

  mounted() {
    this.getComment()
    this.fetchPost()
  },

  methods: {
    async createComment() {
      try {
        if (!this.commentDetail.trim()) return

        await Api.post(`/users/${store.user.username}/comments`, {
          body: this.commentDetail,
          postID: this.postId,
          parentComment: this.reply?._id || null
        })

        this.commentDetail = ''
        this.reply = null
        this.replyTo = ''

        await this.getComment()
      } catch (err) {
        console.error(err)
      }
    },

    async getComment() {
      try {
        const response = await Api.get(`/posts/${this.postId}/comments`)

        this.comments = response.data.comments
        console.log(response.data.comments)
      } catch (err) {
        console.error(err)
      }
    },

    async fetchPost() {
      try {
        const response = await Api.get(`/posts/${this.postId}`)
        this.post = response.data.specificPost
      } catch (err) {
        console.error('Failed to load post', err)
      }
    },

    formatDate(item) {
      if (!item) return ''

      const raw = item.postDate || item.createdAt || item.date
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

    async translatePost() {
      try {
        if (this.translatedPost) {
          this.translatedPost = ''
          return
        }

        this.translatedPost = await sendTranslation(this.post.body, 'sv')
      } catch (err) {
        console.error('Post translation failed:', err)
      }
    },

    async translateComment(comment) {
      try {
        if (comment.translated) {
          comment.translated = null
          return
        }
        comment.translated = await sendTranslation(comment.body, 'sv')
      } catch (err) {
        console.error('Comment translation failed:', err)
      }
    },

    startReply(comment) {
      this.reply = comment
      this.replyTo = comment.userID.username

      // Prefill textarea with username
      this.commentDetail = `@${comment.userID.username} `

      // Scroll up to the comment input
      this.$nextTick(() => {
        const reply = this.$refs.commentInput
        if (reply) {
          reply.scrollIntoView({ behavior: 'smooth', block: 'center' })
          reply.querySelector('textarea').focus()
        }
      })
    }
  }
}

</script>

<style src="../styles/post.css">

</style>
