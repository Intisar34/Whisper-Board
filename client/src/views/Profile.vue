<template>
  <div class="backgroundPage">
    <div class="profileBanner">

      <div class="profileHeader">
        <div class="headerContent">
              <BAvatar size="4em" src="/userIcon.png" />
            <div class="profileInfo">
                <h1 class="profileName">Username</h1>
                <h2 class="profileRole">Student</h2>
            </div>
        </div>
        <BButton @click="toggleModel = !toggleModel" class="editButton"> Edit Profile </BButton>
            <BModal v-model="toggleModel" size="xl"  content-class="tallModal" title-class="title" title="User Details">
                <BForm @submit.prevent="saveProfile" class="formBox">

                 <BFormGroup id="input-group-1" label="Username" label-for="input-1">
                    <BFormInput id="input-1" v-model="form.username" />
                 </BFormGroup>

                 <BFormGroup id="input-group-2" label="University" label-for="input-2">
                    <BFormInput id="input-2" v-model="form.university" />
                 </BFormGroup>

                 <BFormGroup id="input-group-3" label="Email Address" label-for="input-3">
                    <BFormInput id="input-3" v-model="form.email" />
                 </BFormGroup>

                 <BFormGroup id="input-group-4" label="Password" label-for="input-4">
                    <BFormInput id="input-4" v-model="form.password" />
                 </BFormGroup>

                 <BFormGroup id="input-group-5" label="Role" label-for="input-5">
                    <BFormInput id="input-5" v-model="form.role" />
                 </BFormGroup>
                </BForm>
             <div class="buttonContainer">
                <BButton class="deleteButton">Delete</BButton>
             </div>
            </BModal>
      </div>
      <div class="profileFooter">
        <BNav tabs fill>
            <BNavItem to="/home/posts">Home</BNavItem>
            <BNavItem @click="setTab('posts')">Posts</BNavItem>
            <BNavItem @click="setTab('comments')">Comments</BNavItem>
            <BNavItem @click="setTab('forums')">Forums</BNavItem>
        </BNav>
      </div>
    </div>
    <div class="timelineContainer">
     <BContainer>
       <BRow>
        <BCol cols="12" class="py-4">
          <div class="timelineLine">
            <div class="timelineItem" v-for="(item, i) in timeline" :key="i">
              <div class="timelineDot"></div>

              <div class="timelineContent">
                <BCard class="postCard">
                  <h5>{{ item.title}}</h5>
                  <p>{{ item.body }}</p>
                  <small class="text-secondary">{{ item.date }}</small>
                </BCard>
              </div>
            </div>
          </div>
        </BCol>
      </BRow>
     </BContainer>
    </div>
  </div>
</template>

<script >
import { Api } from '@/Api'
import { getUser } from '@/cache.js'

export default {
  name: 'Profile',

  data() {
    return {
      toggleModel: false,
      posts: [],
      forums: [],
      comments: [],
      timeline: [],

      activeTab: 'posts',

      form: {
        username: 'username',
        password: 'passoword',
        email: 'email',
        role: 'student'
      },

      user: getUser()
    }
  },

  methods: {

    // Fetch all posts the user has
    async fetchPostUser() {
      try {
        const response = await Api.get(`/users/${this.user.username}/posts`)
        this.posts = response.data

        if (!this.posts || this.posts.length === 0) {
          console.log('Currently user has no posts created')
        }

        this.timeline = this.posts.map(post => ({
          title: post.title,
          body: post.body,
          date: post.createdAt
        }))
      } catch (err) {
        console.error('Failed fetching user posts:', err)
      }
    },

    // Fetch all comments the user has
    async fetchCommentsUser() {
      try {
        const response = await Api.get(`/users/${this.user.username}/comments`)
        this.comments = response.data

        if (!this.comments || this.comments.length === 0) {
          console.log('Currently user has no comments')
        }

        this.timeline = this.comments.map(comment => ({
          body: comment.body
        }
        ))
      } catch (err) {
        console.error('Failed fetching user comments:', err)
      }
    },

    // Fetch all forums the user has
    async fetchForumsUser() {
      try {
        const response = await Api.get(`/users/${this.user.username}/forums`)
        this.forums = response.data

        if (!this.forums || this.forums.length === 0) {
          console.log('Currently user has no forums')
        }

        this.timeline = this.forums.map(forum => ({
          name: forum.name,
          description: forum.description
        }))
      } catch (err) {
        console.error('Failed fetching users forums: ', err)
      }
    },

    saveProfile() {
      console.log('Saved Changes:', this.form)
      this.toggleModel = false
    },

    setTab(tab) {
      this.activeTab = tab
      if (tab === 'posts') {
        this.fetchPostUser()
      } else if (tab === 'comments') {
        this.fetchCommentsUser()
      } else if (tab === 'forums') {
        this.fetchForumsUser()
      }
    }
  }
}
</script>

<style src="../styles/profile.css"></style>
