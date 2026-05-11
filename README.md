
## System Definition:

### Purpose

WhisperBoard is a platform that allows students, alumni, and faculty to discuss university related topics anonymously. Users can create and participate in forums, make posts, and comment, all while maintaining their anonymity. The system aims to foster open communication, knowledge sharing, and networking within the academic community. It unifies discussions about courses, careers, and general topics.

### Pages

* Home: Displays a list of accessible forums and posts. Users can browse forums,Join forums, see featured posts, and navigate to specific forums or their profile.
* Forum: Shows all posts within a selected forum. Users can read posts, create new posts, and navigate to individual post pages to view comments.
* User Profile: Allows users to manage their account settings, update their password, view their own posts and comments.

## Requirements Frontend:

* Node.js (>=v22) => installation instructions for Linux
* Visual Studio Code (VSCode) as IDE
* Vetur plugin for Vue tooling
* ESLint plugin for linting Vue, JS, and HTML code
* Vue.js devtools browser plugin for debugging

## Requirements Backend:

* Node.js (>=v22) Installation instructions for Linux, use installers for macOS and Windows (don't forget to restart your Bash shell)
* MongoDB (>=6) must be running locally on port 27017
* Postman (>=v8) for API testing

## Getting started

```bash
# Setup backend
cd server && npm install
npm run dev

# Setup frontend
cd client && npm install
npm run serve
```
### Advanced Feature: 
We integrated a language translation feature for forum posts and comments, allowing users to toggle content between the original language and their preferred language. The specific comment or post will be translated only on request and no other module will be affected with the translation. To ensure this qualifies as an advanced feature, we will implement a robust client side caching strategy to optimize performance, reduce latency, and minimize external API costs.

#### Backend Enhancements

* The backend will act as a secure proxy to an external Translation API (Google Translate).
* To prevent data leaks, the backend will strip all request metadata (User IDs, IP addresses, Session Tokens) before forwarding the request. Only the raw text body is sent to the external provider.
* The translated text is returned directly to the frontend and is not permanently stored in our database to reduce storage overhead.
* The user preferred language will be remembered as well and can be updated later on.
* We will implement logic to handle external API timeouts or failures, returning specific error codes to the frontend to trigger fallback UI states.

#### Frontend Enhancements

* We will implement a Memoization pattern using the browser’s localStorage (served over HTTPS to ensure availability).
* We will use a Key-Value Map structure where the Key is the unique.
* Before requesting a translation, the system performs a lookup if the key exists, it renders instantly from the cache. If not, it fetches from the backend and    saves the result.
* The "Show Translation" toggle will function as a component level state machine rather than a static button. It will manage three distinct states: translating…, show original, and failed translation(reverting to the original text).
* While the backend protects system metadata, users retain the freedom to post anonymously. Therefore, if a user explicitly types personal sensitive information into the comment body, it will be translated as is.

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/ER_Diagram.drawio.png) 
