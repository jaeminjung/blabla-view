<template>
  <v-container>
    <v-layout class="flex align-center justify-center">
      <!-- center justify-center -->
      <v-flex xs12 sm10>
        <v-card>
          <v-card-title class="indigo lighten-5 title">
            Sign up
          </v-card-title>

          <div v-if="signingUp" class="pt-2">
            <img src="../../assets/loading.gif" alt=""/>
          </div>

          <v-card-text class="pa-2">
            <v-container>
              
              <form @submit.prevent="onSignup" v-if="!signingUp">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name='username'
                      label='Username'
                      id='username'
                      v-model='user.username'
                      :rules="usernameRules"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name='email'
                      label='Mail'
                      id='email'
                      v-model='user.email'
                      type='email'
                      :rules="emailRules"
                      required></v-text-field>
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
                      :rules="passwordRules"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name='cofirmPassword'
                      label='ConfirmPassword'
                      id='confirmPassword'
                      v-model='user.confirmPassword'
                      type='password'
                      :rules="confirmPasswordRules"
                      ></v-text-field>
                      <!-- :rules='[comparePasswords]' -->
                  </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                      <v-btn class="right ma-0" type="submit">Sign up</v-btn>
                    </v-flex> 
                  </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

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

  </v-container>
</template>

<script>
import Joi from 'joi'

// const SIGNUP_URL = 'http://localhost:5000/auth/signup'
const SIGNUP_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/auth/signup' : 'http://13.125.21.48:5000/auth/signup'

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(20).required(),
    password: Joi.string().trim().min(6).required(),
    confirmPassword: Joi.string().trim().min(6).required(),
    email: Joi.string().email({ minDomainAtoms: 2 })
})
export default {
  
  name: 'User',
  data () {
    return {
      usernameRules: [
        v => !!v || 'Username is required',
        v => v.length <= 10 || 'Username must be less than 10 characters',
        v => v.length >= 2 || 'Username must be longer than 1 characters',
        v => /(^[a-zA-Z0-9_]+$)/.test(v) || 'Username must be valid'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Username must be longer than 5 characters'
      ],
      confirmPasswordRules: [
        v => !!v || 'Password is required',
        v => v == this.user.password || 'Password do not matched'
      ],
      signingUp:false,
      errorMessage: '',
      alert: false,
      user: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
    }
  },
  methods: {
    onSignup() {
      this.errorMessage = ''
      if(this.validUser()){
        const body = {
          username: this.user.username,
          email: this.user.email,
          password: this.user.password
        }
        this.signingUp = true
        fetch(SIGNUP_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json'
          }
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
            this.signingUp = false
            this.$router.push('/profile')
          }, 800)
        }).catch(error => {
          setTimeout(()=>{
            this.signingUp = false
            this.alert = true
            this.errorMessage = error.message
          }, 800)          
          // console.log(error)
        })
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword){
        this.errorMessage = 'Passwords do not match.'
        this.alert = true
        return false
      }
      const result = Joi.validate(this.user, schema)
      if (result.error === null) {
        return true
      }
      if (result.error.message.includes('username')){
        this.errorMessage = 'Username is invalid'
      } else if (result.error.message.includes('email')){
        this.errorMessage = 'Email is invalid'
      } else {
        this.errorMessage = 'Password is invalid'
      }
      console.log("signup", result.error.message)
      this.alert = true
      return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
