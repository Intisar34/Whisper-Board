<template>
    <div class="postPage">
        <TopBar :showSearch="false" />

        <div class="backButtonContainer">
            <router-link to="/home/posts" class="backButton">
                ← Back to Home
            </router-link>
        </div>

        <div class="postContainer">
            <div class="userContainer">
                <div class="postPageUserIcon">
                  <img src="/postIcon.png" class="postIconImg" alt="Post"/>
                </div>
                <span class="username ms-2">by {{ post?.userID?.username }}</span>
                <span class="text-muted mx-2">–</span>
                <span class="postDate">{{ formatDate(post) }}</span>
            </div>

            <h2 class="postTitle">{{ translatedPost ? translatedPost.title : post?.title }}</h2>

            <article class="postContent">
            {{ translatedPost ? translatedPost.body : post?.body }}
            </article>

            <div class="postFooter mt-4">
                <div class="commentActions">
                    <button class="pillButton" type="button" @click="likePost">
                        <img src="/likeIcon.png" alt="Likes" class="pillIcon me-1"/>
                        <span class="tinyText">{{ post?.likes?.length || 0 }}</span>
                    </button>

                    <button class="pillButton" type="button" @click="dislikePost">
                        <img src="/dislikeIcon.png" alt="Dislikes" class="pillIcon me-1"/>
                        <span class="tinyText">{{ post?.dislikes?.length || 0 }}</span>
                    </button>

                    <button class="pillButton" type="button">
                        <img src="/commentIcon.png" alt="Comments" class="pillIcon me-1"/>
                        <span class="tinyText">{{ post?.commentsCount || 0 }}</span>
                    </button>
                </div>

                <button class="pillButton translateAction" @click="translatePost">
                  <span class="tinyText fw-bold">{{ translatedPost ? 'Show Original' : 'Translate Post' }}</span>
                </button>
            </div>

            <div class="commentSection">
                <div class="commentInput" ref="commentInput">
                    <BFormTextarea class="commentText" v-model="commentDetail" rows="1" auto-grow placeholder="comment..."/>
                    <button class="sendButton" type="submit" @click="createComment">
                       <img src="/sendIcon.svg"/>
                    </button>
                </div>
            </div>

        </div>

    <div v-if="comments.length > 0" class="commentsHeader">
        <span class="separatorLine"></span>
        <span class="separatorText">Comments</span>
        <span class="separatorLine"></span>
    </div>

    <div class="commentContainer" v-for="comment in comments" :key="comment._id">
           <div class="userContainer">
                <div class="commentUserIcon">
                  <img src="/userIcon.png" alt="User"/>
                </div>
                <span class="username ms-2">{{ comment.userID?.username || 'Username not found' }}</span>
                <span class="text-muted mx-2">–</span>
                <span class="postDate">{{ formatDate(comment) }}</span>
            </div>

            <p class="commentContent">{{  comment.translated  || comment.body}}</p>

            <div class="commentFooter">
                <div class="commentActions">
                    <button class="pillButton" type="button" @click="likeComment(comment)">
                        <img src="/likeIcon.png" alt="Likes" class="pillIcon me-1"/>
                        <span class="tinyText">{{comment?.likes?.length || 0 }} </span>
                    </button>

                    <button class="pillButton" type="button" @click="dislikeComment(comment)">
                        <img src="/dislikeIcon.png" alt="Dislikes" class="pillIcon me-1"/>
                        <span class="tinyText">{{comment?.dislikes?.length || 0 }}</span>
                    </button>

                    <button class="pillButton" type="button" @click="startReply(comment)">
                        reply
                    </button>
                </div>

                <button class="pillButton translateAction" @click="translateComment(comment)">
                  <span class="tinyText">{{ comment.translated ? 'Show Original' : 'Translate' }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { Api } from '@/Api'
import { store } from '@/store.js'
import { sendTranslation } from '@/translation.js'
import TopBar from './TopBar.vue'

export default {
  name: 'Post',
  components: {
    TopBar
  },

  data() {
    return {
      store,
      post: null,
      commentDetail: '',
      comments: [],
      translatedPost: null,
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

        if (this.post) {
          this.post.commentsCount = (this.post.commentsCount || 0) + 1
        }

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

    async likePost() {
      if (!store.user) {
        alert('You must be logged in to like a post.')
        return
      }
      try {
        const response = await Api.patch(`/posts/${this.postId}/like`, {
          userID: store.user._id
        })

        this.post.likes = response.data.likes
        this.post.dislikes = response.data.dislikes
      } catch (err) {
        console.error(err)
        alert('Failed to like post')
      }
    },

    async dislikePost() {
      if (!store.user) {
        alert('You must be logged in to dislike a post.')
        return
      }
      try {
        const response = await Api.patch(`/posts/${this.postId}/dislike`, {
          userID: store.user._id
        })

        this.post.dislikes = response.data.dislikes
        this.post.likes = response.data.likes
      } catch (err) {
        console.error(err)
        alert('Failed to dislike post')
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
          this.translatedPost = null
          return
        }

        const cachedTitle = store.getTranslation(this.post.title, 'sv')
        const cachedBody = store.getTranslation(this.post.body, 'sv')

        if (cachedTitle && cachedBody) {
          this.translatedPost = {
            title: cachedTitle,
            body: cachedBody
          }
          return
        }

        const [translatedTitle, translatedBody] = await Promise.all([
          sendTranslation(this.post.title, 'sv'),
          sendTranslation(this.post.body, 'sv')
        ])

        store.addTranslation(this.post.title, translatedTitle, 'sv')
        store.addTranslation(this.post.body, translatedBody, 'sv')

        this.translatedPost = {
          title: translatedTitle,
          body: translatedBody
        }
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

        const cached = store.getTranslation(comment.body, 'sv')
        if (cached) {
          comment.translated = cached
          return
        }

        const translatedText = await sendTranslation(comment.body, 'sv')
        store.addTranslation(comment.body, translatedText, 'sv')
        comment.translated = translatedText
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
    },

    async likeComment(comment) {
      if (!store.user) {
        alert('You must be logged in to like a comment.')
        return
      }
      try {
        const response = await Api.patch(`/comments/${comment._id}/like`, {
          userID: store.user._id
        })

        comment.likes = response.data.likes
        comment.dislikes = response.data.dislikes
      } catch (err) {
        console.error(err.response?.data || err.message)
        alert('Failed to like comment')
      }
    },

    async dislikeComment(comment) {
      if (!store.user) {
        alert('You must be logged in to dislike a comment.')
        return
      }
      try {
        const response = await Api.patch(`/comments/${comment._id}/dislike`, {
          userID: store.user._id
        })

        comment.dislikes = response.data.dislikes
        comment.likes = response.data.likes
      } catch (err) {
        console.error(err)
        alert('Failed to dislike comment')
      }
    }
  }
}

</script>

<style>
@import '../styles/home.css';
@import '../styles/post.css';
</style>
