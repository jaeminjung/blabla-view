<template>
  <div>
  <v-container>
    <v-layout class="center justify-center">
      <v-flex xs12 sm10>
        <v-card>
          <v-card-title class="indigo lighten-5 title">
            Login
          </v-card-title>

          <div v-if="loggingIn" class="pt-2">
            <img src="../../assets/loading.gif" alt=""/>
          </div>

          <v-card-text class="pa-2">
            <v-container>
              <form v-if="!loggingIn" @submit.prevent="onLogin">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name='username'
                      label='Username'
                      id='username'
                      v-model='user.username'
                      required>
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name='password'
                      label='Password'
                      id='password'
                      v-model='user.password'
                      type='password'
                      required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-btn small class="right pa-0 ma-0" type="submit">Login</v-btn>
                    <router-link to="/signup">
                      <v-btn small class="right pa-0 ma-0">Sign up</v-btn>
                    </router-link>
                  </v-flex> 
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

  <v-snackbar
      v-model="alert"
      :top=true
      :timeout="5000"
      
    >
      {{ errorMessage }}
      <v-btn
        color="pink"
        flat
        @click="alert = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    
  </div>
</template>

<script>
import Joi from 'joi'

// const LOGIN_URL = 'http://localhost:5000/auth/login'
const LOGIN_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/auth/login' : 'http://13.125.21.48:5000/auth/login'

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(20).required(),
    password: Joi.string().trim().min(6).required(),
})

export default {
  
  name: 'User',
  data () {
    return {
      errorMessage: '',
      user: {
        username: '',
        password: ''
      },
      alert:false,
      try_number: 6,
      loggingIn: false
    }
  },
  methods: {
    onLogin () {
      this.errorMessage = ''
      if(this.validUser()){
        this.loggingIn = true
        const body = {
          username: this.user.username,
          password: this.user.password
        }
        fetch(LOGIN_URL, {
          method:'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(body)
        }).then(response => {
          if(response.ok) {
            return response.json()
          } 
          return response.json().then(error => {
            throw new Error(error.message)
          })
        }).then(result=>{
          localStorage.token = result.token
          setTimeout(()=>{
            this.loggingIn = false
            this.$router.push('/profile')
          }, 800)
        }).catch(error => {
          setTimeout(()=>{
            this.loggingIn = false
            this.errorMessage = error.message
            this.alert = true
          }, 800)          
          // console.log(error)
        })
      }
    },
    validUser() {
      const result = Joi.validate(this.user, schema)
      if (result.error === null) {
        return true
      }
      if (result.error.message.includes('username')){
        this.errorMessage = 'Username is invalid'
      }  else {
        this.errorMessage = 'Password is invalid'
      }
      console.log("login", result.error.message)
      this.alert = true
      return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
