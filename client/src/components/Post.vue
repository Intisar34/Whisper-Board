<template>
    <div class="postPage">
        <div class="logoContainer">
            <h1 class="logo"> WhisperBoard</h1>
        </div>

        <div class="postContainer">
            <div class="userContainer">
                <BAvatar size="4em" src="/userIcon.png" rounded="sm" class="align-self-start"/>
                <h2 class="username">{{ store.user.username }}</h2>
                <time class="postDate">12h-ago</time>
            </div>

            <button class="closeButton" @click="$router.push('/home/posts')">
                <img src="/closeButton.svg">
            </button>

            <div class="translationContainer">
                <button class="translationButton" @click="translatePost">
                  {{ translatedPost ? 'Show original' : 'Translate' }}
                </button>
            </div>

            <h2 class="postTitle"> I’m Done With Math 😤</h2>

          <article class="postContent">
              {{ translatedPost || postBody }}
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

                <button class="pillButton" type="button">
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
      commentDetail: '',
      comments: [],
      postID: '69336c54248334432b7ea31a',
      translatedPost: '',
      postBody: 'I swear, I’m actually losing my mind I just failed my math exam like FAILED failed — and now I have to drag myself through this'
    }
  },

  mounted() {
    this.getComment()
  },

  methods: {
    async createComment() {
      try {
        if (!this.commentDetail.trim()) return
        const response = await Api.post(`/users/${store.user.username}/comments`, {
          body: this.commentDetail,
          postID: '69336c54248334432b7ea31a'
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
        const response = await Api.get(`/posts/${this.postID}/comments`)

        this.comments = response.data.comments.map(comment => ({
          body: comment.body,
          postID: comment.postID,
          date: comment.createdAt
        }))
      } catch (err) {
        console.error(err)
      }
    },
    async translatePost() {
      try {
        if (this.translatedPost) {
          this.translatedPost = ''
          return
        }

        this.translatedPost = await sendTranslation(this.postBody, 'sv')
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
    }
  }
}
</script>

<style src="../styles/post.css">

</style>
