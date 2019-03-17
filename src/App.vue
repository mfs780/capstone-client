<template>
  <div id="app" class="content">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  height: 100%;
  width: 100%;
}

textarea:focus, input:focus{
    outline: none;
}

body {
  margin: 0;
}
</style>