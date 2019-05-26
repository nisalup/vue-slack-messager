<template>  
    <div>    
        <div id="myaccount" class="container">
            <form>
                <div class="row">
                    <div class="col-12"><h4>Connected to Slack as</h4></div>
                    <div class="col-12">
                        <a href="https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=648015137095.639839856641"><img alt="'Sign in with Slack'" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcset="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" /></a>
                    </div>
                </div>
                <div class="row">
                    
                </div>
                <div class="row">
                   
                </div>
            </form>  
        </div> 
    </div>
</template>  
<script>  
    import axios from "axios"    
    import router from "../router"    
    export default {    
        name: "Slack",    
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
                isSlackedIn:false,
                accessToken: '',
                slackChannelList: [],
                slackUserData: {}
                }    
        },   
        mounted() {    
            this.getUserData()
            this.getSlackUserData()    
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
                        // router.push("/")    
                    })    
            },
            save() {
              this.user.firstName = this.$refs['first_name'].value;
              this.user.lastName = this.$refs['last_name'].value;
              this.isEditing = !this.isEditing;
            },
            getSlackUserData: function () {
                let self = this
                let code = false
                try {
                    code = window.location.href.split('/').slice(-2)[0].split('?')[1].split('&')[0].split('=')[1]
                    console.log(code)
                }
                catch (error) {
                    console.log('Empty url')
                }
                console.log(code)
                axios.get('/api/slacklogin?code=' + code)
                    .then((response) => {
                    console.log('nisss')    
                        console.log(response.user)    
                        self.$set(this, "slackUserData", response.data.user)    
                    })    
                    .catch((errors) => {    
                        console.log(errors)    
                        // router.push("/")    
                    })    
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
</style>
