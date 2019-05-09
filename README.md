# Visual Research Capstone Project

## Firebase setup
Create a Firebase project by going to the [Firebase Console](https://console.firebase.google.com/) and clicking ```add project```

### Setup Authenticaton
Click on ```Authentication``` and then under ```Sign-in method``` tab enable Google as a Sign-in provider.

### Obtain Config File

Click on ```Project Overview``` and then under your Project Name click the ```+ Add app``` button to create your application. Once the application is created click on ```1 app``` and then the settings icon. Under the area of ```Firebase SDK snippet``` select the ```Config``` radio button and copy the Config json object.

## Project setup
In your cloned project file under ```src/main.js``` set the ```config``` variable to the json object obtained from the Firebase Console.

### Install dependencies
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```
