<template>  
    <div class="container login">
        <div class="card">
            <article class="card-body">
            <h4 class="card-title mb-4 mt-1"><b>Sign in</b></h4>
            <form v-on:submit="login">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" name="email" class="form-control" placeholder="Email" type="email">
                </div> <!-- form-group// -->
                <div class="form-group">
                    <label for="password">Password</label>
                    <input class="form-control" placeholder="Password" type="password" id="password" name="password">
                </div> <!-- form-group// --> 
                <div class="form-group"> 
                </div> <!-- form-group// -->  
                <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-block"> Login  </button>
                </div>                                             
            </form>
            </article>
        </div> <!-- card.// -->   
    </div>
</template>

<script>
import axios from "axios"  
import router from "../router"  
export default {    
    name: "Login",    
    methods: {    
        login: (e) => {  
            e.preventDefault()    
            let email = e.target.elements.email.value
            let password = e.target.elements.password.value   
            let login = () => {    
                let data = {    
                    email: email,    
                    password: password    
                }    
                axios.post("/api/login", data)    
                    .then((response) => {    
                        console.log("Logged in")    
                        router.push("/dashboard")    
                    })    
                    .catch((errors) => {    
                        console.log("Cannot log in")    
                    })    
            }    
            login()    
        }    
    }    
}
</script>

<style scoped>
.login {
  width: 25%;
  margin-top:5vh;
}
</style>