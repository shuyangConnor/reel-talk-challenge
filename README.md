# <font color="#0969da">reel-talk-challenge</font>

A scalable backend application for a movie and TV-show enthusiast application, featuring Firebase authentication, Firestore database, and movie retrieval from an external API.

**Backend**: [Express with Node.js](https://github.com/expressjs/express)

**Database**: [Firestore](https://cloud.google.com/firestore)

**Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)

## Installation

This is a [Node.js](https://nodejs.org/en/) application available through the [npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install
```

## Features

- **Authentication:**
  Implement user registration and login using Firebase Authentication.
  Enable users to reset their passwords through a password reset email.

- **Database Setup:**
  Set up Firebase Firestore as the database to store movies, likes, and comments.

- **Retrieve Movies:**
  Develop an endpoint to retrieve a list of 100 movies using The Movie Database API.

## Documentaion

You can find API documentation on this website [API documentation](https://documenter.getpostman.com/view/24341881/2s9YRFT9Zd).

To start a Firebase project, you can checkout [Firebase](https://firebase.google.com).

## Usage

To **start**, use the command under the code directory:

```console
$ npm start
```

This command will run the server on **localhost, port 3000**.
</br>

To try different functionalities, you can test the APIs using testing platforms like [Postman](https://www.postman.com/).
</br>

For simplify your testing purposes, I uploaded my own Firebase API keys and Movie Database Api key in [config.env](https://github.com/shuyangConnor/reel-talk-challenge/blob/master/config.env) and [serviceAccountKey.json](https://github.com/shuyangConnor/reel-talk-challenge/blob/master/serviceAccountKey.json).

Please keep in mind that to visualize data, you need to create your own Firebase project and put your own project keys in [config.env](https://github.com/shuyangConnor/reel-talk-challenge/blob/master/config.env) and [serviceAccountKey.json](https://github.com/shuyangConnor/reel-talk-challenge/blob/master/serviceAccountKey.json).

## Database Design Decions

### Firebase Schema

#### Collection: movies

| Field Name  | Data Type |
| ----------- | --------- |
| overview    | String    |
| popularity  | Number    |
| poster_path | String    |
| title       | String    |

#### Subcollection: comments

| Field Name | Data Type |
| ---------- | --------- |
| commentId  | String    |
| likes      | Number    |
| text       | String    |
| timestamp  | Timestamp |
| user_ref   | String    |

#### Collection: users

| Field Name  | Data Type |
| ----------- | --------- |
| phoneNumber | String    |
| email       | String    |
| userName    | String    |

#### Subcollection: likes

| Field Name  | Data Type |
| ----------- | --------- |
| comment_ref | String    |
| Timestamp   | Timestamp |
| likeId      | String    |

There are two collections (**movies** and **users**) and two subcollections (**comments** and **likes**) in the Firestore database. **Comments** is a subcollection of **movies**, and **likes** is a subcollection of **users**. I decided to use subcollection instead of arrays to store **comments** and **likes** to improve database efficiency and scalability. Working with Firebase, we should try to apply the concept of **large collections and small documents** in order to optimize Firebase's performance, according to the Firebase documentation.

I used subcollections instead of creating new collections for **comments** and **likes** for many reasons:

- **Hierarchical Organization:** Subcollections are a way to create a hierarchical structure within the database. By nesting comments and likes under the corresponding movies and users documents, I created a natural, nested structure that is easy to understand.

- **Efficient Queries:** In my design, comments will most likely be accessed when a movieId is given(eg. Only in the the movie description page, the comments people made to that movie will be displayed), and likes will most likely be accessed when a userId is given(eg. A user can see the comments that he/she liked in his/her own user page). It is very uncommon for other users to see who liked a specific comment. If we have two seperate collections for likes and comments, there will be many unnecessary works for Firebase to do when a query is made. This design choice aligns with Firestore's capabilities and the way Firestore is optimized for querying data.

- **Simplified Queries:** When I use subcollections, it simplifies the queries, since I can directly query for comments or likes associated with a specific movie or user without needing complex filtering or querying across different top-level collections. This can make my code more efficient and easier to maintain.

For the fields, there are two things noticeable:

- **commentId** and **likeId** are specifically stored in a field, because subcollection in Firebase can't be directly search by their ids (collectionGroup API), so I need to manually added their id as a field.
- I created **timestamp** for likes and comments, since the time that a user liked or commented are very likely to be useful.

### API Design Decisions

In my implementation, **I assume the frontend is not using Firebase, but only the backend**. This is because in the requirements, it says to implement both the user login and user sign up on the backend. However, if the frontend is also using Firebase, then user login and user sign up can be easily done on the frontend. Therefore, I made this assumption.

Given that assumption, I decided to use **cookie** to maintain the user state. When a user is logged in, he can't access. When a user signed up or logged in, there will a **idToken**, I set it as a cookie and sent it to the frontend. Therefore, the idToken will be sent to the server each time the user made another request (as long as its under the same domain).

Also, for the "Create Comment" and "Create Like" route, I used a protect middleware to make sure the user is signed in before they can hit that route. This ensures only logined users can make a comment and like a comment.

#### Difficulities

- For the **Firebase Admin SDK** that runs in the backend, it is impossible to login a user (there is no API for that). In fact, user login can only be done using the Firebase Client SDK that runs in the frontend browser. I found a work around by using the [Firebase REST API](https://firebase.google.com/docs/reference/rest/auth?hl=zh-cn#section-sign-in-email-password).

- For the **Movie Database API** to retrieve a list of movies, the maximum movies each API call can get is only **20**, but my goal is to get **100**. My work around is to simultaneously call the API **5** times to retrieve the movies at the fastest speed, and use Promise.all to wait for all of them to complete.

- It is worth noticing that only using Firebase on the backend will make many things much more complicated than using it on both the frontend and the backend. For example, the user login process will be much easier to be done with the frontend, and the Firebase Client SDK can maintain the user logged in state automatically, so we may not need to use the cookie. But just for the requirements of this project and to showcase my backend development skills, I implemented it solely on the backend.

## Contribution

Contributions, issues and feature requests are welcome!

Feel free to check the [issues](https://github.com/shuyangConnor/reel-talk-challenge/issues) page.
