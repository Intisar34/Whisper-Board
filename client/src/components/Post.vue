<template>
    <div class="postPage">
        <div class="logoContainer">
            <h1 class="logo"> WhisperBoard</h1>
        </div>

        <div class="postContainer">
            <div class="userContainer">
                <BAvatar size="4em" src="/userIcon.png" rounded="sm" class="align-self-start"/>
                <h2 class="username">{{ post?.userID?.username }}</h2>
                <time class="postDate">{{ new Date(post?.createdAt).toLocaleString() }}</time>
            </div>

            <button class="closeButton" @click="$router.push('/home/posts')">
                <img src="/closeButton.svg">
            </button>

            <div class="translationContainer">
                <button class="translationButton">
                   Translate
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

            <div class="commentInput">
                <BFormTextarea class="commentText" v-model="commentDetail" rows="1" auto-grow placeholder="comment..."/>
                <button class="sendButton" type="submit" @click="createComment">
                   <img src="/sendIcon.svg"/>
                </button>
            </div>

        </div>
        <div class="commentContainer" v-for="(comment, index) in comments" :key="index">
           <div class="userContainer">
                <BAvatar size="1.5em" src="/userIcon.png" rounded="sm" class="align-self-start"/>
                <h2 class="username">{{ store.user.username }}</h2>
                <time class="postDate">{{ comment.date }}</time>
            </div>

            <p class="commentContent">{{ comment.body }}</p>

            <div class="commentActions">
                <button class="pillButton" type="button">
                    <img src="/likeIcon.png" alt="Likes" class="pillIcon me-1"/>
                    <span class="tinyText">2</span>
                </button>

                <button class="pillButton" type="button">
                    <img src="/dislikeIcon.png" alt="Dislikes" class="pillIcon me-1"/>
                    <span class="tinyText">2</span>
                </button>

                <button class="pillButton" type="button">
                    reply
                </button>
            </div>
            <div class="translationContainer">
                <button class="translationButton">
                   Translate
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { Api } from '@/Api'
import { store } from '@/store.js'

export default {
  name: 'Post',

  data() {
    return {
      store,
      post: null,
      commentDetail: '',
      comments: [],
      translatedPost: ''
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
          username: comment.user?.username
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
    }
  }
}
</script>

<style src="../styles/post.css">

</style>
