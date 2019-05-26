<template>
  <div id="app">
      <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
          <b-navbar-brand href="#">vue-slack-messager</b-navbar-brand>
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-item :to="{ name: 'Dashboard'}" >My Account</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
              <b-nav-item href="#">Login</b-nav-item>
              <b-nav-item :to="{ name: 'Login'}" >Logout</b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
      <router-view/>
    </div>
</template>

<script>
import axios from "axios"
import router from "./router"
export default {
  name: 'App',
  methods: {
    logout: function (e) {  
      axios
        .get("/api/logout")
        .then(() => {
          router.push("/")
        })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
