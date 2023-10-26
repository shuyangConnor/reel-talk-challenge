# <font color="#0969da">reel-talk-challenge</font>

A scalable backend application for a movie and TV-show enthusiast application, featuring Firebase authentication, Firestore database, and movie retrieval from an external API.

**Backend**: [Express with Node.js](https://github.com/expressjs/express)

**Database**: [Firestore](https://cloud.google.com/firestore)

**Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)

### Installation

This is a [Node.js](https://nodejs.org/en/) application available through the [npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install
```

### Features

- **Authentication:**
  Implement user registration and login using Firebase Authentication.
  Enable users to reset their passwords through a password reset email.

- **Database Setup:**
  Set up Firebase Firestore as the database to store movies, likes, and comments.

- **Retrieve Movies:**
  Develop an endpoint to retrieve a list of 100 movies using The Movie Database API.

### Documentaion

You can find API documentation on this website [doc]().

To start a Firebase project, you can checkout [Firebase](https://firebase.google.com).

### Usage

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

### Contribution

Contributions, issues and feature requests are welcome!

Feel free to check the [issues]() page.
