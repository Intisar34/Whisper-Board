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
            <BNavItem active href="#nav-fill">Home</BNavItem>
            <BNavItem href="#nav-fill">Posts</BNavItem>
            <BNavItem href="#nav-fill">Comments</BNavItem>
            <BNavItem href="#nav-fill">Forums</BNavItem>
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
                  <p>{{ item.text }}</p>
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
export default {
  name: 'Profile',

  data() {
    return {
      toggleModel: false,
      timeline: [
        {
          title: 'blah blah bla',
          text: 'yes yes yes',
          date: 'Dec 2025'
        },
        {
          title: 'No NO no',
          text: 'Hello New York',
          date: 'Nov 2025'
        },
        {
          title: 'first post',
          text: 'university experience.',
          date: 'Oct 2025'
        }
      ],
      form: {
        username: 'username',
        password: 'passowrd',
        email: 'emai',
        role: 'student'
      }
    }
  },

  methods: {
    saveProfile() {
      console.log('Saved Changes:', this.form)
      this.toggleModel = false
    }
  }
}
</script>

<style src="../styles/profile.css"></style>
