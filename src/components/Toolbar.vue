<template>
  <header class="toolbar">
    <div class="logo">
      <img class="logo-image"
           src="../assets/logo.png"
           width="300px">
      Visual Research
    </div>
    <div class="panel-actions">
      <a class="tutorial btn" href="https://drive.google.com/open?id=1KnKhobPAJh9W-ldKg0SmRCwQy3RdwmBT" target="_blank">
        Tutorial
        <font-awesome-icon class="tut-icon"
                           icon="question-circle" />
      </a>
      <div class="vertical"/>
      <div class="logout-btn btn"
           @click="logout">
        <font-awesome-icon icon="sign-out-alt" />
      </div>
    </div>
  </header>
</template>

<script>
import firebase from "firebase";

export default {
  name: 'Toolbar',
  methods: {
    logout () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>

<style scoped>
.toolbar {
  height: 60px;
  width: 100%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #404040;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}

.logo {
  display: flex;
  flex-direction: row;
  height: 30px;
  align-items: center;
  padding: 0 10px;
  background-color: #404040;
  height: 100%;
  color: #e6e6e6;
  font-weight: 600;
}

.logo-image {
  width: 30px;
  filter: invert(91%) sepia(8%) saturate(2724%) hue-rotate(319deg)
    brightness(97%) contrast(98%);
  margin-right: 5px;
}

.tutorial {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  font-size: 20px;
  outline: none;
  text-decoration: none;
  color: #404040;

}

.tut-icon {
  padding: 0 5px;
}

.panel-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-self: center;
}

.logout-btn {
  font-weight: 900;
  font-size: 25px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}

.vertical {
  border-right: 1px solid #404040;
}

.btn:hover {
  color: black;
}
</style>
