# Backend and Frontend Template

Latest version: https://git.chalmers.se/courses/dit342/group-00-web

This template refers to itself as `group-00-web`. In your project, use your group number in place of `00`.

## Project Structure

| File        | Purpose           | What you do?  |
| ------------- | ------------- | ----- |
| `server/` | Backend server code | All your server code |
| [server/README.md](server/README.md) | Everything about the server | **READ ME** carefully! |
| `client/` | Frontend client code | All your client code |
| [client/README.md](client/README.md) | Everything about the client | **READ ME** carefully! |
| [docs/LOCAL_DEPLOYMENT.md](docs/LOCAL_DEPLOYMENT.md) | Local production deployment | Deploy your app local in production mode |

## Requirements

The version numbers in brackets indicate the tested versions but feel free to use more recent versions.
You can also use alternative tools if you know how to configure them (e.g., Firefox instead of Chrome).

* [Git](https://git-scm.com/) (v2) => [installation instructions](https://www.atlassian.com/git/tutorials/install-git)
  * [Add your Git username and set your email](https://docs.github.com/en/get-started/git-basics/setting-your-username-in-git)
    * `git config --global user.name "YOUR_USERNAME"` => check `git config --global user.name`
    * `git config --global user.email "email@example.com"` => check `git config --global user.email`
  * > **Windows users**: We recommend to use the [Git Bash](https://www.atlassian.com/git/tutorials/git-bash) shell from your Git installation or the Bash shell from the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to run all shell commands for this project.
* [Chalmers GitLab](https://git.chalmers.se/) => Login with your **Chalmers CID** choosing "Sign in with" **Chalmers Login**. (contact [support@chalmers.se](mailto:support@chalmers.se) if you don't have one)
  * DIT342 course group: https://git.chalmers.se/courses/dit342
  * [Setup SSH key with Gitlab](https://docs.gitlab.com/user/ssh/#generate-an-ssh-key-pair)
    * Create an SSH key pair `ssh-keygen -t ed25519 -C "email@example.com"` (skip if you already have one)
    * Add your public SSH key to your Gitlab profile under https://git.chalmers.se/-/user_settings/ssh_keys
    * Make sure the email you use to commit is registered under https://git.chalmers.se/-/profile/emails
  * Checkout the [Backend-Frontend](https://git.chalmers.se/courses/dit342/group-00-web) template `git clone git@git.chalmers.se:courses/dit342/group-00-web.git`
* [Server Requirements](./server/README.md#Requirements)
* [Client Requirements](./client/README.md#Requirements)

## Getting started

```bash
# Clone repository
git clone git@git.chalmers.se:courses/dit342/group-00-web.git

# Change into the directory
cd group-00-web

# Setup backend
cd server && npm install
npm run dev

# Setup frontend
cd client && npm install
npm run serve
```

> Check out the detailed instructions for [backend](./server/README.md) and [frontend](./client/README.md).

## Visual Studio Code (VSCode)

Open the `server` and `client` in separate VSCode workspaces or open the combined [backend-frontend.code-workspace](./backend-frontend.code-workspace). Otherwise, workspace-specific settings don't work properly.

## System Definition (MS0)

### Purpose

The Study Life Forum is a platform that allows verified students, alumni, and faculty to discuss university related topics anonymously. Users can create and participate in forums, make posts, and comment, all while maintaining their anonymity but retaining verified status. The system aims to foster open communication, knowledge sharing, and networking within the academic community. It unifies discussions about courses, careers, and general topics.

### Pages

* Home: Displays a list of accessible forums, both public and private. Users can browse forums, see featured posts, and navigate to specific forums or their profile.
* Forum: Shows all posts within a selected forum. Users can read posts, create new posts, and navigate to individual post pages to view comments.
* Profile: Allows users to manage their account settings, update their password, view their own posts and comments.

### Advanced Feature Proposal

We are proposing two advanced features, we would implement the one approved by the examiner.

## Summary of Advanced Feature 1:
We propose advanced search and filtering of posts as one of our advanced features. The goal is to give users a powerful search page where they can quickly find relevant discussions based on text, forum, tags and time period.

## Brief description of the necessary backend and frontend enhancements to achieve this functionality:
* We need more complex backend query logic that combines multiple filters in a single endpoint (search text, chosen forum, selected tags, date range, sort order).
* We need to use MongoDB text search to keep these combined queries efficient when the data grows.
* We have to design and implement a dedicated endpoint.
* On the frontend we must build a rich search page with multiple controls (text input, dropdowns, checkboxes) and connect them to the API.
* We also need to handle pagination, sorting options (newest/top/most commented) and update the UI based on the user’s chosen filters.


## Summary of Advanced Feature 2:
We propose integrating automatic language translation into the forum. This allows a user to translate a comment in their preferred language(Swedish or English). This makes international students be able to join discussions more comfortably.

## Brief description of the necessary backend achieve this functionality:
* We need to integrate an external API such as google translate API
* We must design a system that avoids leaking sensitive information. Only the content being translated can be sent to the external API.  No user identity, internal IDs, or metadata.
* We must introduce backend logic that dynamically transforms user-generated content, such as Posts and Comments, into a translated version depending on the user’s preferred language.
* We integrate a logic where the post or comment body is fetched and sent through the API for translation and presented in the frontend without actually saving it in the database.
* We must handle errors when the external API is unreachable, slow or returns unexpected results. This requires both frontend and backend-level fallback systems so the user still receives the original text.

## Brief description of the necessary frontend enhancements to achieve this functionality:
* Each post has a ‘show translation’, toggle.
* Each comment has a ‘show translation’, toggle.
* The toggle will change state to ‘translating…’ when clicked.
* If the text is translated, a ‘show original’ toggle is shown to get the original text back.
* If the text fails to translate, a ‘failed translation’ toggle is shown and the original text stays.
* The frontend caches the translated text in local memory, so already translated posts or comments do not send new API requests.
* The user can choose their preferred language in profile settings, so the frontend automatically requests translation of the predefined language.
* The users are already anonymous, so if they put sensitive data in comments there's nothing we could do about it, it's their freedom of choice. For example: if someone puts their personummer in comments, there is nothing from our end to control it, the core of our platform is anonymity from the beginning.

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/ER_Diagram.drawio.png) 
## Teaser (MS3)

![Teaser](./images/teaser.png)
