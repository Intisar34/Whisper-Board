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
                  <span class="tinyText fw-bold">
                    {{ isTranslatingPost ? 'translating...' : (postTranslationError ? 'Failed translation' : (translatedPost ? 'Show Original' : 'Translate Post')) }}
                  </span>
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

    <!-- Top-level comments -->
    <div class="commentContainer" v-for="comment in comments" :key="comment._id">
        <div class="commentHeader">
            <div class="userContainer">
                <div class="commentUserIcon">
                    <img src="/userIcon.png" alt="User"/>
                </div>
                <span class="username ms-2">{{ comment.userID?.username || 'Unknown' }}</span>
                <span class="text-muted mx-2">–</span>
                <span class="postDate">{{ formatDate(comment) }}</span>
            </div>
            <div class="commentIconActions" v-if="isCommentOwner(comment)">
                <button 
                    class="editIconBtn" 
                    type="button" 
                    @click="startEdit(comment)"
                >
                    <img src="/Edit.svg" alt="Edit"/>
                </button>
                <button 
                    class="deleteIconBtn" 
                    type="button" 
                    @click="deleteComment(comment)"
                >
                    <img src="/Delete.svg" alt="Delete"/>
                </button>
            </div>
        </div>
        <!-- Comment body or edit mode -->
        <p v-if="editingComment !== comment._id" class="commentContent">{{ comment.translated || comment.body }}</p>
        
        <div v-else class="editInputWrapper">
            <BFormTextarea 
                class="editTextarea" 
                v-model="editText" 
                rows="2" 
                auto-grow 
            />
            <div class="editInputActions">
                <button class="pillButton cancelReply" @click="cancelEdit">Cancel</button>
                <button class="pillButton submitReply" @click="saveEdit(comment)">Save</button>
            </div>
        </div>

        <div class="commentFooter">
            <div class="commentActions">
                <button class="pillButton" type="button" @click="likeComment(comment)">
                    <img src="/likeIcon.png" alt="Likes" class="pillIcon me-1"/>
                    <span class="tinyText">{{ comment.likes?.length || 0 }}</span>
                </button>

                <button class="pillButton" type="button" @click="dislikeComment(comment)">
                    <img src="/dislikeIcon.png" alt="Dislikes" class="pillIcon me-1"/>
                    <span class="tinyText">{{ comment.dislikes?.length || 0 }}</span>
                </button>

                <button class="pillButton" type="button" @click="toggleReplyInput(comment)">
                    Reply
                </button>
            </div>

            <button class="pillButton translateAction" @click="translateComment(comment)">
                <span class="tinyText">
                    {{ comment.isTranslating ? 'translating...' : (comment.translationError ? 'Failed' : (comment.translated ? 'Show Original' : 'Translate')) }}
                </span>
            </button>
        </div>

        <!-- Inline Reply Input -->
        <div v-if="replyingTo === comment._id" class="replyInputWrapper">
            <BFormTextarea 
                class="replyTextarea" 
                v-model="replyText" 
                rows="1" 
                auto-grow 
                :placeholder="'Reply to @' + (comment.userID?.username || 'user') + '...'"
            />
            <div class="replyInputActions">
                <button class="pillButton cancelReply" @click="cancelReply">Cancel</button>
                <button class="pillButton submitReply" @click="submitReply(comment)">Reply</button>
            </div>
        </div>

        <!-- View Replies Toggle -->
        <button 
            v-if="comment.replyCount > 0" 
            class="viewRepliesBtn" 
            @click="toggleReplies(comment)"
        >
            {{ expandedReplies[comment._id] ? '▼ Hide' : '▶ View' }} {{ comment.replyCount }} {{ comment.replyCount === 1 ? 'reply' : 'replies' }}
        </button>

        <!-- Nested Replies -->
        <div v-if="expandedReplies[comment._id] && comment.replies?.length" class="repliesContainer">
            <div class="replyComment" v-for="reply in comment.replies" :key="reply._id">
                <div class="replyHeader">
                    <div class="userContainer">
                        <div class="replyUserIcon">
                            <img src="/userIcon.png" alt="User"/>
                        </div>
                        <span class="username ms-2">{{ reply.userID?.username || 'Unknown' }}</span>
                        <span class="text-muted mx-2">–</span>
                        <span class="postDate">{{ formatDate(reply) }}</span>
                    </div>
                    <div class="commentIconActions" v-if="isCommentOwner(reply)">
                        <button 
                            class="editIconBtn" 
                            type="button" 
                            @click="startEdit(reply)"
                        >
                            <img src="/Edit.svg" alt="Edit"/>
                        </button>
                        <button 
                            class="deleteIconBtn" 
                            type="button" 
                            @click="deleteComment(reply)"
                        >
                            <img src="/Delete.svg" alt="Delete"/>
                        </button>
                    </div>
                </div>
                <!-- Reply body or edit mode -->
                <p v-if="editingComment !== reply._id" class="replyContent">{{ reply.translated || reply.body }}</p>
                
                <div v-else class="editInputWrapper">
                    <BFormTextarea 
                        class="editTextarea" 
                        v-model="editText" 
                        rows="2" 
                        auto-grow 
                    />
                    <div class="editInputActions">
                        <button class="pillButton cancelReply" @click="cancelEdit">Cancel</button>
                        <button class="pillButton submitReply" @click="saveEdit(reply)">Save</button>
                    </div>
                </div>

                <div class="replyFooter">
                    <div class="commentActions">
                        <button class="pillButton" type="button" @click="likeComment(reply)">
                            <img src="/likeIcon.png" alt="Likes" class="pillIcon me-1"/>
                            <span class="tinyText">{{ reply.likes?.length || 0 }}</span>
                        </button>

                        <button class="pillButton" type="button" @click="dislikeComment(reply)">
                            <img src="/dislikeIcon.png" alt="Dislikes" class="pillIcon me-1"/>
                            <span class="tinyText">{{ reply.dislikes?.length || 0 }}</span>
                        </button>
                    </div>

                    <button class="pillButton translateAction" @click="translateComment(reply)">
                        <span class="tinyText">
                            {{ reply.isTranslating ? 'translating...' : (reply.translationError ? 'Failed' : (reply.translated ? 'Show Original' : 'Translate')) }}
                        </span>
                    </button>
                </div>
            </div>
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
      replyingTo: null,
      replyText: '',
      editingComment: null,
      editText: '',
      expandedReplies: {},
      isTranslatingPost: false,
      postTranslationError: false
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
          postID: this.postId
        })

        if (this.post) {
          this.post.commentsCount = (this.post.commentsCount || 0) + 1
        }

        this.commentDetail = ''
        await this.getComment()
      } catch (err) {
        console.error(err)
      }
    },

    async getComment() {
      try {
        const response = await Api.get(`/posts/${this.postId}/comments`)

        this.comments = response.data.comments.map(comment => ({
          ...comment,
          translated: null,
          isTranslating: false,
          translationError: false,
          replies: (comment.replies || []).map(reply => ({
            ...reply,
            translated: null,
            isTranslating: false,
            translationError: false
          }))
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

        this.isTranslatingPost = true
        this.postTranslationError = false

        const targetLang = store.user?.preferredLanguage || 'sv'
        const cachedTitle = store.getTranslation(this.post.title, targetLang)
        const cachedBody = store.getTranslation(this.post.body, targetLang)

        if (cachedTitle && cachedBody) {
          this.translatedPost = {
            title: cachedTitle,
            body: cachedBody
          }
          this.isTranslatingPost = false
          return
        }

        const [translatedTitle, translatedBody] = await Promise.all([
          sendTranslation(this.post.title, targetLang),
          sendTranslation(this.post.body, targetLang)
        ])

        store.addTranslation(this.post.title, translatedTitle, targetLang)
        store.addTranslation(this.post.body, translatedBody, targetLang)

        this.translatedPost = {
          title: translatedTitle,
          body: translatedBody
        }
        this.isTranslatingPost = false
      } catch (err) {
        console.error('Post translation failed:', err)
        this.isTranslatingPost = false
        this.postTranslationError = true
      }
    },

    async translateComment(comment) {
      try {
        if (comment.translated) {
          comment.translated = null
          return
        }

        comment.isTranslating = true
        comment.translationError = false

        const targetLang = store.user?.preferredLanguage || 'sv'
        const cached = store.getTranslation(comment.body, targetLang)
        if (cached) {
          comment.translated = cached
          comment.isTranslating = false
          return
        }

        const translatedText = await sendTranslation(comment.body, targetLang)
        store.addTranslation(comment.body, translatedText, targetLang)
        comment.translated = translatedText
        comment.isTranslating = false
      } catch (err) {
        console.error('Comment translation failed:', err)
        comment.isTranslating = false
        comment.translationError = true
      }
    },

    toggleReplyInput(comment) {
      if (this.replyingTo === comment._id) {
        this.replyingTo = null
        this.replyText = ''
      } else {
        this.replyingTo = comment._id
        this.replyText = ''
      }
    },

    cancelReply() {
      this.replyingTo = null
      this.replyText = ''
    },

    async submitReply(parentComment) {
      try {
        if (!this.replyText.trim()) return
        if (!store.user) {
          alert('You must be logged in to reply.')
          return
        }

        await Api.post(`/users/${store.user.username}/comments`, {
          body: this.replyText,
          postID: this.postId,
          parentComment: parentComment._id
        })

        this.replyText = ''
        this.replyingTo = null
        this.expandedReplies[parentComment._id] = true
        await this.getComment()
      } catch (err) {
        console.error('Failed to submit reply:', err)
        alert('Failed to post reply')
      }
    },

    toggleReplies(comment) {
      this.expandedReplies[comment._id] = !this.expandedReplies[comment._id]
    },

    startEdit(comment) {
      this.editingComment = comment._id
      this.editText = comment.body
    },

    cancelEdit() {
      this.editingComment = null
      this.editText = ''
    },

    async saveEdit(comment) {
      if (!this.editText.trim()) return

      try {
        await Api.put(`/comments/${comment._id}`, {
          body: this.editText
        })

        this.editingComment = null
        this.editText = ''
        await this.getComment()
      } catch (err) {
        console.error('Failed to edit comment:', err)
        alert('Failed to save changes')
      }
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
    },

    isCommentOwner(comment) {
      if (!store.user) return false
      return comment.userID?._id === store.user._id || 
             comment.userID === store.user._id
    },

    async deleteComment(comment) {
      try {
        await Api.delete(`/comments/${comment._id}`)
        
        if (this.post) {
          this.post.commentsCount = Math.max(0, (this.post.commentsCount || 1) - 1)
        }
        
        await this.getComment()
      } catch (err) {
        console.error('Failed to delete comment:', err)
        alert('Failed to delete comment')
      }
    }
  }
}

</script>

<style>
@import '../styles/home.css';
@import '../styles/post.css';
</style>
