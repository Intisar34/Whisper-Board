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
                <div class="commentInput">
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

    <div class="commentContainer" v-for="(comment, index) in comments" :key="index">
           <div class="userContainer">
                <div class="commentUserIcon">
                  <img src="/userIcon.png" alt="User"/>
                </div>
                <span class="username ms-2">{{ comment.username || 'Username not found' }}</span>
                <span class="text-muted mx-2">–</span>
                <span class="postDate">{{ formatDate({ createdAt: comment.date }) }}</span>
            </div>

            <p class="commentContent">{{  comment.translated  || comment.body}}</p>

            <div class="commentFooter">
                <div class="commentActions">
                    <button class="pillButton" type="button">
                        <img src="/likeIcon.png" alt="Likes" class="pillIcon me-1"/>
                        <span class="tinyText">0</span>
                    </button>

                    <button class="pillButton" type="button">
                        <img src="/dislikeIcon.png" alt="Dislikes" class="pillIcon me-1"/>
                        <span class="tinyText">0</span>
                    </button>

                    <button class="pillButton" type="button">
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
      translatedPost: null
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
        const response = await Api.post(`/users/${store.user.username}/comments`, {
          body: this.commentDetail,
          postID: this.postId
        })

        this.comments.push({
          body: response.data.comment.body,
          postID: response.data.comment.postID,
          date: response.data.comment.createdAt
        })

        if (this.post) {
            this.post.commentsCount = (this.post.commentsCount || 0) + 1;
        }

        this.commentDetail = ''
      } catch (err) {
        console.error(err)
      }
    },

    async getComment() {
      try {
        const response = await Api.get(`/posts/${this.postId}/comments`)

        this.comments = response.data.comments.map(comment => ({
          body: comment.body,
          postID: comment.postID,
          date: comment.createdAt,
          username: comment.userID?.username || 'Username not found'
        }))
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
        });
        
        const updatedPost = response.data;

        if (this.post?.userID && typeof this.post.userID === 'object') {
           updatedPost.userID = this.post.userID;
        }
        this.post = updatedPost;
      } catch (err) {
        console.error(err);
        alert('Failed to like post');
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
        });
        
        const updatedPost = response.data;

        if (this.post?.userID && typeof this.post.userID === 'object') {
           updatedPost.userID = this.post.userID;
        }
        this.post = updatedPost;
      } catch (err) {
        console.error(err);
        alert('Failed to dislike post');
      }
    },

    formatDate(post) {
      if (!post) return ''

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
    }
  }
}
</script>

<style>
@import '../styles/home.css';
@import '../styles/post.css';
</style>
