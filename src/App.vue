<template>
  <div id="app">
     <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      height="60%"
      width="200"
    >
      <v-list >
        <v-list-tile 
          v-for="item in menuItems" 
          :key="item.title" 
          router :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="#F5ECE4" fixed app>
      <v-toolbar-side-icon style="color:#B98FA0" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      
      <v-toolbar-title class="headline font-weight-regular">
        <router-link to="/" tag="span" style="cursor: pointer; color:#915373;">
          FindSeat
        </router-link> 
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">
          
          <v-icon style="color:#B98FA0" class="mr-1">{{item.icon}}</v-icon> 
          <div style="color:#B98FA0">{{item.title}}</div>
          
        </v-btn>
      </v-toolbar-items>

      <!-- <v-toolbar-items class="hidden-md-and-up">
        <router-link to="/" tag="span" style="cursor: pointer;">
          <v-icon  medium center style="color:#B98FA0" class="ma-1 pa-2">my_location</v-icon>
        </router-link> 
        
      </v-toolbar-items> -->

    </v-toolbar>



    <!-- main content -->
    <v-content>
      <v-container fluid class="pt-1 pl-1 pr-1 pb-5">
        <!-- fill-height  -->
        <v-layout>
          <!-- justify-center
          align-center -->
          <v-flex text-xs-center>
          
            <main>
              <router-view/>
            </main>      

          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <!-- 여기다가 광고 -->
    <v-footer class="pr-3" fixed>
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
     </v-footer> 
  </v-app>
    
    
  </div>
</template>

<script>



export default {
  name: 'App',
  mounted() {
    // if(localStorage.token) {
    //   this.menuItems = this.menuItems1
    // } else {
    //   this.menuItems = this.menuItems2
    // }
  },
  methods: {
    
  },
  data() {
    return {
       drawer: null,
       
       menuItems: [
        //  { icon: 'home', title: ' Home', link: '/'},
         { icon: 'person', title: 'Profile', link: '/profile'}, 
         { icon: 'question_answer', title: 'Suggestions', link: '/ask'},
         { icon: 'info', title: 'Info', link: '/notice'}, 
         { icon: 'face', title: 'Sign up', link: '/signup'},
         { icon: 'lock_open', title: 'Log in', link: '/login'},        
         { icon: 'exit_to_app', title: 'logout', link: '/logout'},         
       ]
    }
  }
}
</script>

<style>


</style>
