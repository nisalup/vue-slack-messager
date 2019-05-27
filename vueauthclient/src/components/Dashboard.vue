<template>  
    <div>    
        <h2>My Account</h2>    
        <div id="myaccount" class="container">
            <form class="card card-primary">
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            First Name:
                            <input type="text" ref="first_name" :value="user.firstName" :disabled="!isEditing"
                                   :class="{view: !isEditing}" class="form-control">
                          </div>
                          <div class="form-group">
                            Last Name:
                            <input type="text" ref="last_name" :value="user.lastName" :disabled="!isEditing"
                                   :class="{view: !isEditing}" class="form-control">  
                         </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            Telephone:
                            <input type="text" ref="first_name" :value="user.telephone" :disabled="!isEditing"
                                   :class="{view: !isEditing}" class="form-control">
                          </div>
                          <div class="form-group">
                            Email:
                            <input type="text" ref="last_name" :value="user.email" :disabled="!isEditing"
                                   :class="{view: !isEditing}" class="form-control">  
                         </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3"></div>
                    <div class="col-3">
                        <div >
                          <button v-on:click="isEditing = !isEditing" v-if="!isEditing" class="btn btn-success">
                            Edit
                          </button>
                          <button v-on:click="save" v-else-if="isEditing" class="btn btn-warning">
                            Save
                          </button>
                      </div>
                    </div>
                    <div class="col-3">
                        <button v-if="isEditing" @click="isEditing = false" class="btn btn-info">Cancel</button>
                        <!-- <span v-if="!isEditing" >Click to Edit</span> -->
                    </div>
                    <div class="col-3"></div>
                </div>
            </form>  
        </div> 
    </div>
</template>  
<script>  
    import axios from "axios"    
    import router from "../router"    
    export default {    
        name: "Login",    
        data() {    
            return {    
                user: {
                    id: 1,
                    firstName: "",
                    lastName: "",
                    telephone: "",
                    email: "",
                    password: ""
                },
                isEditing: false,
                }    
        },   
        mounted() {    
            this.getUserData()    
        },
        methods: {    
            getUserData: function() {    
                let self = this    
                axios.get("/api/user")    
                    .then((response) => {    
                        console.log(response)    
                        self.$set(this, "user", response.data.user)    
                    })    
                    .catch((errors) => {    
                        console.log(errors)    
                        router.push("/")    
                    })    
            },
            save() {
              this.user.firstName = this.$refs['first_name'].value;
              this.user.lastName = this.$refs['last_name'].value;
              this.isEditing = !this.isEditing;
            }    
        }   
    }
</script>
<style scoped>
    .view {
        border-color: transparent;
        background-color: initial;
        color: initial
    }
    .card {
        padding:5px;
    }
    .form-group {
        background-color: aliceblue;
        border: 2px;
        border-radius: 5px;
    }
    #myaccount {
        width:50%;
    }
</style>
