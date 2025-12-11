<template>
  <div class="whisperboardPage">
    
        <!--Top bar section for logo, searchbar and user profile-->
    <header class="topBar d-flex align-items-center px-4 py-2">
        <!-- Logo section -->
        <div class="me-3">
          <img
            src="/WhisperBoardLogo.png"
            alt="WhisperBoard"
            class="img-fluid"
          />
        </div>

        <!-- Search section -->
        <div class="flex-grow-1 mx-md-5 mx-2">
          <div class="search d-flex align-items-center px-3">
            <img
              src="/searchIcon.png"
              alt="Search"
              class="searchIcon"
            />
            <input
              type="text"
              class="form-control border-0 bg-transparent shadow-none ms-2"
              placeholder="Search forum ..."
              v-model="search"
            />
          </div>
        </div>

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
        <div class="userIconBox d-flex align-items-center cursor-pointer">
          <div class="userIconOutline">
            <img
              src="/userIcon.png"
              alt="User avatar"
              class="userIcon"
            />
          </div>
          <span class="ms-2 fw-bold text-dark small">HUsd68VG</span>
        </div>
    </header>

    <b-container fluid class="px-4 mt-4">
      <b-row>
        <!-- Side Bar Section for Post and Forum Button-->
        <b-col cols="12" md="3" lg="2" class="mb-4">
            <nav class="sidebar pt-2">
              <!-- Post button -->
              <button
                type="button"
                class="w-100 text-start d-flex align-items-center mb-2 sidebarItem"
                :class="{ active: activeSidebar === 'post' }"
                @click="goToPost"
              >
                <div class="sidebarIconBox me-3">
                  <img
                    src="/postIcon.png"
                    alt="Post"
                    class="sidebarIcon"
                  />
                </div>
                <span class="fw-bold">Post</span>
              </button>

              <!-- Forum button -->
              <button
                type="button"
                class="w-100 text-start d-flex align-items-center sidebarItem"
                :class="{ active: activeSidebar === 'forum' }"
                @click="activeSidebar = 'forum'"
              >
                <div class="sidebarIconBox me-3">
                  <img
                    src="/forumIcon.png"
                    alt="Forum"
                    class="sidebarIcon"
                  />
                </div>
                <span class="fw-bold">Forum</span>
              </button>
          </nav>
        </b-col>

        <!-- Main Content Section -->
        <b-col cols="12" md="9" lg="10">
          <h2 class="mb-4">Forums</h2>
          <!-- Content will go here -->
          <p>Forum content loading...</p>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>


<script>

export default {
  name: 'HomeForum',
  data () {
    return {
      search: '',
      activeSidebar: 'forum'
    }
  },
  methods: {
    goToPost() {
        this.$router.push('/home/posts')
    }
  }
}
</script>

<style src="../styles/homeForum.css"></style>
