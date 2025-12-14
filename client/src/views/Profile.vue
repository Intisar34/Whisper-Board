<template>
  <div class="backgroundPage">
    <div class="profileBanner">

      <div class="profileHeader">
        <div class="headerContent">
              <BAvatar size="4em" src="/userIcon.png" rounded="sm" class="align-self-start"/>
            <div class="profileInfo">
                <h1 class="profileName" >{{ form.username }}</h1>
                <h2 class="profileRole"> {{ form.role }}</h2>
                <h2 class="profileInstitution">{{ form.institution }}</h2>
            </div>
            <div class="emailData">
                <h2 class="profileEmail">{{ form.email }}</h2>
            </div>
        </div>

        <BButton @click="toggleModel = true;" class="editButton"> Edit Profile </BButton>
            <BModal v-model="toggleModel" size="xl"  content-class="tallModal" title-class="title" title="User Details">
                <BForm @submit.prevent="saveProfile" class="formBox">

                  <BFormGroup id="input-group-1" label="Username" label-for="input-1">
                    <BFormInput id="input-1" v-model="form.username" readonly/>
                 </BFormGroup>

                 <BFormGroup id="input-group-2" label="University" label-for="input-2">
                    <BFormInput id="input-2" v-model="form.institution" />
                 </BFormGroup>

                 <BFormGroup id="input-group-3" label="Email Address" label-for="input-3">
                    <BFormInput id="input-3" v-model="form.email" />
                 </BFormGroup>

                 <BFormGroup id="input-group-4" label="Password" label-for="input-4">
                    <BFormInput id="input-4" v-model="form.password" />
                 </BFormGroup>

                 <BFormGroup id="input-group-5" label="Role" label-for="input-5">
                    <BFormSelect id="input-5" v-model="form.role" :options="roleOptions"/>
                 </BFormGroup>

                 <div class="d-flex justify-content-end mt-4">
                  <BButton type="submit" variant="primary"> Save changes</BButton>
                 </div>
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
      form: {
        username: '',
        institution: '',
        email: '',
        role: '',
        password: ''
      },
      roleOptions: [
        { text: 'Student' },
        { text: 'Teacher' },
        { text: 'Alumni' },
        { text: 'TA' }
      ],

      originalForm: {},

      activeTab: 'posts',

      user: getUser()
    }
  },

  mounted() {
    this.fetchUserDetail()
  },

  methods: {

    // Fetch user details
    async fetchUserDetail() {
      try {
        const response = await Api.get(`/users/${this.user.username}`)
        const user = response.data.data
        console.log(user)

        this.form.username = user.username
        this.form.institution = user.institution
        this.form.email = user.email
        this.form.role = user.role
        this.form.password = user.password

        // Save a copy of the form
        this.originalForm = {
          email: user.email,
          institution: user.institution,
          role: user.role
        }
      } catch (err) {
        console.error('Failed fetching user details: ', err)
      }
    },

    // Update user email
    async updateUserEmail() {
      try {
        const request = await Api.patch(`/users/${this.user.username}`, {
          email: this.form.email
        })
        console.log(request.data.data)
        this.fetchUserDetail()
        this.toggleModel = false
      } catch (err) {
        console.error('Failed updating user email: ', err)
      }
    },

    // Update user role
    async updateUserRole() {
      try {
        const request = await Api.patch(`/users/${this.user.username}`, {
          role: this.form.role
        })
        console.log(request.data.data)
        this.fetchUserDetail()
        this.toggleModel = false
      } catch (err) {
        console.error('Failed updating user role: ', err)
      }
    },

    // Update user institution
    async updateUserInstitution() {
      try {
        const request = await Api.patch(`/users/${this.user.username}`, {
          institution: this.form.institution
        })
        console.log(request.data.data)
        this.fetchUserDetail()
        this.toggleModel = false
      } catch (err) {
        console.error('Failed updating user institution: ', err)
      }
    },

    // Update user password
    async updateUserPassword() {
      try {
        const request = await Api.patch(`/users/${this.user.username}`, {
          passowrd: this.form.password
        })
        console.log(request.data.data)
        this.fetchUserDetail()
        this.toggleModel = false
      } catch (err) {
        console.error('Failed updating user password: ', err)
      }
    },

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

    // Save any changes made
    async saveProfile() {
      try {
        const updates = []

        if (this.form.institution !== this.originalForm.institution) {
          updates.push(this.updateUserInstitution())
        }

        if (this.form.email !== this.originalForm.email) {
          updates.push(this.updateUserEmail())
        }

        if (this.form.role !== this.originalForm.role) {
          updates.push(this.updateUserRole())
        }

        if (this.form.password !== this.originalForm.password) {
          updates.push(this.updateUserPassword())
        }

        if (updates.length === 0) {
          console.log('No changes made')
          return
        }

        await Promise.all(updates)

        this.fetchUserDetail()
        this.toggleModel = false
      } catch (err) {
        console.error('Failed Saving the Profile:', err)
      }
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
