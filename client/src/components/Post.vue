<template>
    <div class="postPage">
        <div class="logoContainer">
            <h1 class="logo"> WhisperBoard</h1>
        </div>

        <div class="postContainer">
            <div class="userContainer">
                <BAvatar size="4em" src="/userIcon.png" rounded="sm" class="align-self-start"/>
                <h2 class="username">Username</h2>
                <time class="postDate">12h-ago</time>
            </div>

            <button class="closeButton">
                <img src="/closeButton.svg">
            </button>

            <div class="translationContainer">
                <button class="translationButton">
                   Translate
                </button>
            </div>

            <h2 class="postTitle"> I’m Done With Math 😤</h2>

            <p class="postContent">
                I swear, I’m actually losing my mind.
                I just failed my math exam
                — like FAILED failed — and now I have to drag myself through this
                whole nightmare again.
                I’m dropping out and becoming a carrot farmer.
            </p>

            <div class="activityBox">
                <img src="/likeIcon.png"/>
                <img src="/dislikeIcon.png"/>
                <img src="/commentIcon.png"/>
            </div>

            <div class="commentInput">
                <BFormTextarea class="commentText" v-model="commentText" rows="1" auto-grow placeholder="comment..."/>
                <button class="sendButton">
                   <img src="/sendIcon.svg"/>
                </button>
            </div>

        </div>
    </div>
</template>

<script>

export default {
  name: 'Post'
}
</script>

<style src="../styles/post.css">

</style>
