<template>
  <div class="backgroundPage">
    <!--Top bar section for logo, searchbar and user profile-->
    <header class="topBar d-flex align-items-center px-4 py-2">
        <!-- Logo section -->
        <div class="me-3 logoLink" @click="goToHome" style="cursor: pointer;">
          <img
            src="/WhisperBoardLogo.png"
            alt="WhisperBoard"
            class="img-fluid topBarLogo"
          />
        </div>

        <!-- Spacer to push items to the right -->
        <div class="flex-grow-1"></div>

        <!-- Notification section -->
        <button
          class="bellIcon me-4"
          type="button"
          aria-label="Notifications"
        >
          <img
            src="/Bellicon.png"
            alt="Notifications"
            class="bellIcon"
          />
        </button>

        <!-- User section -->
        <BDropdown variant="link" toggle-class="text-decoration-none p-0" no-caret>
          <template #button-content>
            <div class="userIconBox d-flex align-items-center cursor-pointer">
              <div class="userIconOutline">
                <img
                  src="/userIcon.png"
                  alt="User avatar"
                  class="userIcon"
                />
              </div>
              <span class="ms-2 fw-bold text-dark small">{{ form.username || 'User' }}</span>
            </div>
          </template>
          <BDropdownItem @click="goToHome">Home</BDropdownItem>
          <BDropdownItem @click="logout"><span class="text-danger">Sign out</span></BDropdownItem>
        </BDropdown>
    </header>

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
            <BModal v-model="toggleModel" size="xl" content-class="tallModal" title-class="title" title="User Details" hide-footer>
               <BAlert v-model="showSuccess" variant="danger" dismissible @dismissed="showError = false">
                  {{ errorMessage }}
               </BAlert>
                <BForm @submit.prevent="saveProfile" class="formBox">

                  <BFormGroup id="input-group-1" label="Username" label-for="input-1">
                    <BFormInput id="input-1" v-model="form.username" readonly disabled style="background-color: #e9ecef; cursor: not-allowed;"/>
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

                 <BFormGroup v-if="form.role === 'other'" id="input-group-6" label="Please specify your role" label-for="input-6">
                    <BFormInput id="input-6" v-model="form.otherRoleName" placeholder="Enter your role..."/>
                 </BFormGroup>

                 <BFormGroup id="input-group-7" label="Preferred Language" label-for="input-7">
                    <BFormSelect id="input-7" v-model="form.preferredLanguage" :options="languageOptions"/>
                 </BFormGroup>

                 <div class="d-flex justify-content-end mt-4">
                  <BButton type="submit" variant="primary"> Save changes</BButton>
                 </div>
                </BForm>

             <div class="buttonContainer">
              <div>
                <h6 class="text-danger fw-bold mb-2">Manage Account</h6>
                <p class="text-muted small mb-3">Once you delete your account, there is no going back.</p>
                <BAlert v-model="showSuccess" variant="success">
                  Account has been successfully deleted. Redirecting...
                </BAlert>
                <BButton class="deleteButton" @click="showDeleteConfirm = true">Delete Account</BButton>
                
                <div v-if="isAdmin">
                  <h6 class="text-danger fw-bold mt-4 mb-2">Admin Zone</h6>
                  <p class="text-muted small mb-3">Deletes all posts ever created.</p>
                  <BButton variant="outline-danger" @click="deleteAllPosts">Delete All Posts</BButton>
                </div>
              </div>
             </div>
            </BModal>

            <!-- Delete Confirmation Modal -->
            <BModal v-model="showDeleteConfirm" title="Delete Account" centered hide-footer>
              <p>Are you sure you want to delete your account?</p>
              <p class="text-muted small">This action cannot be undone. All your data, posts, and comments will be permanently removed.</p>
              <div class="d-flex gap-2 mt-3">
                <BButton variant="secondary" @click="showDeleteConfirm = false">Cancel</BButton>
                <BButton variant="danger" @click="deleteUser">Delete</BButton>
              </div>
            </BModal>
      </div>
      <div class="profileFooter">
        <BNav tabs fill>
            <BNavItem :active="activeTab === 'posts'" @click="setTab('posts')">Posts</BNavItem>
            <BNavItem :active="activeTab === 'comments'" @click="setTab('comments')">Comments</BNavItem>
            <BNavItem :active="activeTab === 'forums'" @click="setTab('forums')">Forums</BNavItem>
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
                <BCard v-if="activeTab === 'posts'" class="postCard d-flex flex-row align-items-start border-0 p-3">
                  <div class="d-flex w-100">
                    <!-- user icon -->
                    <div class="postUserIcon me-3 flex-shrink-0">
                      <img src="/postIcon.png" alt="Post" class="userIcon" />
                    </div>

                    <div class="flex-grow-1 text-start">
                      <div class="d-flex align-items-baseline lh-1 mb-1">
                        <span class="fw-bold small text-dark me-1">
                          {{ forumName(item) }}
                        </span>
                        <span class="text-muted small">&ndash; {{ formatDate(item) }}</span>
                      </div>



                      <h2 class="postTitle">
                        {{ capitalise(item.title) }}
                      </h2>

                      <p class="postBody">
                        {{ item.body }}
                      </p>


                    </div>
                  </div>
                </BCard>
                
                <BCard v-else-if="activeTab === 'comments'" class="postCard d-flex flex-row align-items-start border-0 p-3">
                  <div class="d-flex w-100">
                    <!-- comment icon -->
                    <div class="profileCommentUserIcon me-3 flex-shrink-0">
                      <img src="/commentIcon.png" alt="Comment" class="userIcon" />
                    </div>

                    <div class="flex-grow-1 text-start">
                      <div class="d-flex align-items-baseline lh-1 mb-1">
                        <span class="text-muted small">Commented on &ndash; {{ formatDate(item) }}</span>
                      </div>

                      <h2 class="postTitle">
                        {{ item.postTitle || 'Untitled Post' }}
                      </h2>

                      <p class="postBody">
                        {{ item.body }}
                      </p>
                    </div>
                  </div>
                </BCard>
                
                <BCard v-else class="postCard">
                   <h5>{{ item.title || item.name || 'Forum' }}</h5>
                   <p>{{ item.body || item.description }}</p>
                   <small v-if="item.date" class="text-secondary">{{ item.date }}</small>
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
import { store } from '@/store.js'

export default {
  name: 'Profile',

  data() {
    return {
      showError: false,
      toggleModel: false,
      showDeleteConfirm: false,
      errorMessage: '',
      posts: [],
      forums: [],
      comments: [],
      timeline: [],
      showSuccess: false,
      form: {
        username: '',
        institution: '',
        email: '',
        role: '',
        otherRoleName: '',
        preferredLanguage: '',
        password: '',
        links: []
      },
      roleOptions: [
        { text: 'Student', value: 'Student' },
        { text: 'Teacher', value: 'Teacher' },
        { text: 'Alumni', value: 'Alumni' },
        { text: 'TA', value: 'TA' },
        { text: 'Other', value: 'other' }
      ],
      languageOptions: [
        { text: 'Swedish', value: 'sv' },
        { text: 'English', value: 'en' },
        { text: 'Spanish', value: 'es' },
        { text: 'German', value: 'de' },
        { text: 'French', value: 'fr' },
        { text: 'Norwegian', value: 'no' },
        { text: 'Danish', value: 'da' },
        { text: 'Finnish', value: 'fi' }
      ],

      originalForm: {},

      activeTab: 'posts',
      store
    }
  },



  computed: {
    isAdmin() {
      return this.form.role === 'Admin'
    }
  },

  mounted() {
    this.fetchUserDetail()
  },

  methods: {

    // Fetch user details
    async fetchUserDetail() {
      try {
        const response = await Api.get(`/users/${this.store.user.username}`)
        const user = response.data.data
        console.log(user)

        this.form.username = user.username
        this.form.institution = user.institution
        this.form.email = user.email
        this.form.role = user.role
        this.form.otherRoleName = user.otherRoleName || ''
        this.form.preferredLanguage = user.preferredLanguage || 'sv'
        this.form.password = user.password
        this.form.links = user.links || []

        // Save a copy of the form
        this.originalForm = {
          email: user.email,
          institution: user.institution,
          role: user.role,
          otherRoleName: user.otherRoleName || '',
          preferredLanguage: user.preferredLanguage || 'sv',
          password: user.password
        }
      } catch (err) {
        console.error('Failed fetching user details: ', err)
      }
    },

    // Update user email
    async updateUserEmail() {
      try {
        const request = await Api.patch(`/users/${this.store.user.username}`, {
          email: this.form.email
        })
        console.log(request.data.data)
      } catch (err) {
        this.errorMessage = err.response?.data?.error || 'Something went wrong'
        this.showError = true

        throw err
      }
    },

    // Update user role
    async updateUserRole() {
      try {
        const updateData = {
          role: this.form.role
        }
        // Include otherRoleName if role is 'other'
        if (this.form.role === 'other') {
          updateData.otherRoleName = this.form.otherRoleName
        }
        const request = await Api.patch(`/users/${this.store.user.username}`, updateData)
        console.log(request.data.data)
      } catch (err) {
        this.errorMessage = err.response?.data?.error || 'Something went wrong'
        this.showError = true

        throw err
      }
    },

    // Update user institution
    async updateUserInstitution() {
      try {
        const request = await Api.patch(`/users/${this.store.user.username}`, {
          institution: this.form.institution
        })
        console.log(request.data.data)
      } catch (err) {
        this.errorMessage = err.response?.data?.error || 'Something went wrong'
        this.showError = true

        throw err
      }
    },

    async updateUserPassword() {
      try {
        const request = await Api.patch(`/users/${this.store.user.username}`, {
          password: this.form.password
        })
        console.log(request.data.data)
      } catch (err) {
        this.errorMessage = err.response?.data?.error || 'Something went wrong'
        this.showError = true

        throw err
      }
    },

    // Update user language
    async updateUserLanguage() {
      try {
        const request = await Api.patch(`/users/${this.store.user.username}`, {
          preferredLanguage: this.form.preferredLanguage
        })
        console.log(request.data.data)
        // Update local user store if needed, though fetchUserDetail usually refreshes it
        if (store.user) {
             store.user.preferredLanguage = this.form.preferredLanguage;
        }
      } catch (err) {
        this.errorMessage = err.response?.data?.error || 'Something went wrong'
        this.showError = true

        throw err
      }
    },

    // Fetch all posts the user has
    async fetchPostUser() {
      try {
        const link = this.getLink('posts')
        if (!link) {
          console.error("HATEOAS link for posts not found")
          return
        }
        const response = await Api.get(link)
        this.posts = response.data

        if (!this.posts || this.posts.length === 0) {
          console.log('Currently user has no posts created')
        }

        this.timeline = this.posts.map(post => post)
      } catch (err) {
        console.error('Failed fetching user posts:', err)
      }
    },

    // Fetch all comments the user has
    async fetchCommentsUser() {
      try {
        const link = this.getLink('comments')
        if (!link) {
          console.error("HATEOAS link for comments not found")
          return
        }
        const response = await Api.get(link)
        this.comments = response.data

        if (!this.comments || this.comments.length === 0) {
          console.log('Currently user has no comments')
        }

        this.timeline = this.comments.map(comment => ({
          body: comment.body,
          postTitle: comment.postID?.title || 'Untitled Post',
          createdAt: comment.createdAt
        }
        ))
      } catch (err) {
        console.error('Failed fetching user comments:', err)
      }
    },

    // Fetch all forums the user has
    async fetchForumsUser() {
      try {
        const link = this.getLink('forums')
        if (!link) {
          console.error("HATEOAS link for forums not found")
          return
        }
        const response = await Api.get(link)
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
        this.showError = false
        if (this.form.institution !== this.originalForm.institution) {
          await this.updateUserInstitution()
        }

        if (this.form.email !== this.originalForm.email) {
          await this.updateUserEmail()
        }

        // Check if role or otherRoleName changed
        if (this.form.role !== this.originalForm.role || 
            (this.form.role === 'other' && this.form.otherRoleName !== this.originalForm.otherRoleName)) {
          await this.updateUserRole()
        }

        if (this.form.password !== this.originalForm.password) {
          await this.updateUserPassword()
        }

        if (this.form.preferredLanguage !== this.originalForm.preferredLanguage) {
          await this.updateUserLanguage()
        }

        await this.fetchUserDetail()
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
    },

    async deleteUser() {
      try {
        this.showDeleteConfirm = false
        const response = await Api.delete(`users/${this.store.user.username}`)

        if (response.status === 200 || response.status === 204) {
          this.showSuccess = true
          store.clearUser()
          setTimeout(() => {
            this.$router.push('/login')
          }, 1500)
        }
      } catch (err) {
        console.error('Failed deleting user: ', err)
        this.errorMessage = 'Failed to delete user'
        this.showError = true
      }
    },

    async deleteAllPosts() {
      if (!confirm('Are you sure you want to delete ALL posts in the system? This cannot be undone.')) return
      try {
        await Api.delete('/posts')
        alert('All posts have been deleted.')
        if (this.activeTab === 'posts') {
          this.fetchPostUser()
        }
      } catch (err) {
        console.error(err)
        alert('Failed to delete posts')
      }
    },

    getLink(rel) {
      const link = this.form.links.find(links => links.rel === rel)
      return link ? link.href : null
    },

    goToHome() {
      this.$router.push('/home/posts')
    },

    logout() {
      store.clearUser()
      this.$router.push('/login')
    },

    // Helper methods for Post Card UI
    capitalise(value) {
      if (!value) return ''
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    formatDate(post) {
      if (!post.createdAt) return ''
      const date = new Date(post.createdAt)
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    forumName(post) {
      return (post.forumID && post.forumID.name) ? this.capitalise(post.forumID.name) : 'No Forum Name'
    },
    usernameLabel(post) {
      return (post.user && post.user.username) ? `@${post.user.username}` : '@unknown'
    }
  }
}

</script>

<style src="../styles/profile.css"></style>
