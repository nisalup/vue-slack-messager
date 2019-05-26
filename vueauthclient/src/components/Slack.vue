<template>  
    <div>    
        <div id="myaccount" class="container">
            <form>
                <div class="row">
                    <div v-if="isSlackedIn && slackUserData.name" class="col-12"><h4>Connected to Slack as {{ slackUserData.name }}</h4></div>
                    <div v-else class="col-12 failure"><h4>Connection failed</h4></div>
                    <div v-if="!slackUserData.name" class="col-12">
                        <a href="https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=648015137095.639839856641"><img alt="'Sign in with Slack'" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcset="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" /></a>
                    </div>
                </div>
                <div class="row" v-if="isSlackedIn && slackUserData.name">
                    <div class="col-6">
                        <div>
                          <b-card
                            :title="slackUserData.name"
                            :img-src="slackUserData.image_512"
                            img-alt="Image"
                            img-top
                            tag="article"
                            style="max-width: 20rem;"
                            class="mb-2"
                          >
                            <b-card-text>
                              {{ slackUserData.email }}
                            </b-card-text>
                          </b-card>
                        </div>
                    </div>
                    <div class="col-6" v-if="accessToken">
                        Please select a channel: <br>
                        <b-form-select v-model="selectedChannel" :options="slackChannelList"></b-form-select>

                    </div>
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
                isEditing: false,
                isSlackedIn:false,
                slackUserData: {},
                accessToken: false,
                slackChannelList: [],
                selectedChannel: null
                }    
        },   
        mounted() {    
            this.getSlackUserData() 
            this.getChannelList()
        },
        methods: {
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
                if (code) {
                    axios.get('/api/slacklogin?code=' + code)
                    .then((response) => {   
                        if (response.data.user !== {}) {
                            self.$set(this, "isSlackedIn", true)
                            self.$set(this, "slackUserData", response.data.user)
                            self.$set(this, "accessToken", response.data.accessToken)
                            this.getChannelList(self, response.data.accessToken)
                        } 
                    })    
                    .catch((errors) => {    
                        console.log(errors)    
                        // router.push("/")    
                    })
                }    
            },
            getChannelList: function () {
                self = this
                axios.get('/api/channelList')
                    .then((response) => { 
                        if (response.data.channels) {
                            let channels = [{
                                value: null,
                                text: 'Select a Channel'
                            }]
                            for (const channel of response.data.channels) {
                                let item = {
                                    value: channel.name,
                                    text: '# ' + channel.name
                                }
                                channels.push(item)
                            }
                            self.$set(this, "slackChannelList", channels) 
                        }  
                    })    
                    .catch((errors) => {    
                        console.log(errors)    
                        // Srouter.push("/")    
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
    .failure {
        color: red;
    }
</style>
