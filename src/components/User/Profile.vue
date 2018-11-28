<template>
  <div>
    <div v-if="loading">
      <img src="../../assets/loading.gif" alt=""/>
    </div>

  <div v-else>
    <div xs12 sm10 class="container">
      <v-card class="mb-1">
        <v-card-title>
          <v-card-text style="text-align:left">
            
                <span class="headline">
                  <v-icon medium color="green">person</v-icon>{{user.username}}
                </span><br>
              
                <span>
                  <v-icon small color="blue" class="ml-1 mr-1">email</v-icon> <span class="ml-1">{{email}}</span>
                </span><br>

                <span>
                  <v-icon small color="red" class="ml-1 mr-1">star</v-icon><span class="ml-1">{{points}}</span>
                </span>
  
          </v-card-text>
        </v-card-title>
      </v-card>

      <v-expansion-panel class="mt-1 mb-1">
          <v-expansion-panel-content :hide-actions="true" style="background-color:#F0ECEB">
            <div slot="header" style="text-align:left" class="title font-weight-regular">
              Thumbs
              <span class="caption">
                [{{thumbs.length}}]
              </span>
            </div>
            <v-card>
              
                <div v-if="thumbs.length > 0">
                  <div v-for="thumb in thumbs" :key="thumb.createdDate">
                    <v-card-text class="mt-1 mb-1">
                      <span v-if="thumb.reason">
                        <v-icon small color="red">thumb_down</v-icon>
                      </span>
                      <span v-else>
                        <v-icon small color="blue">thumb_up</v-icon>
                      </span>
                      <span>
                        {{thumb.place_name}}
                      </span>    
                      <span v-if="thumb.reason" class="ml-2">
                         {{thumb.reason}}
                      </span>
                      <span class="right caption font-weight-light pt-1"> 
                        {{calTime(thumb.createdDate)}}
                      </span>
                    </v-card-text>
                  </div>
                </div>

                <div v-else>
                  <v-card-text>
                    you dont have thumbs
                  </v-card-text>
                </div>
              
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!--  -->
      
        <v-expansion-panel class="mt-1 mb-1">
          <v-expansion-panel-content :hide-actions="true" style="background-color:#F0ECEB">
            <div slot="header" style="text-align:left" class="title font-weight-regular">
              CafeSatus
              <span class="caption">
                [{{cafeStatus.length}}]
              </span>
            </div>
            <v-card>
              
                <div v-if="cafeStatus.length > 0">
                  <div v-for="cafeStat in cafeStatus" :key="cafeStat.id">
                    <v-card-text class="mt-1">
                      <span>
                      {{cafeStat.place_name}} ...

                      <v-avatar v-bind:color=getColor(cafeStat.cafeStatus) size="25" v>
                        <span class="white--text">{{cafeStat.cafeStatus}}</span>
                      </v-avatar>
                      
                      </span>    
                      <span class="right caption font-weight-light pt-1"> 
                        {{calTime(cafeStat.createdDate)}}
                      </span>
                    </v-card-text>
                  </div>
                </div>
                <div v-else>
                  <v-card-text>
                    you dont have cafeStatus
                  </v-card-text>
                </div> 
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="mt-1 mb-1">
          <v-expansion-panel-content :hide-actions="true" style="background-color:#F0ECEB">
            <div slot="header" style="text-align:left" class="title font-weight-regular">
              Comments
              <span class="caption">
                [{{comments.length}}]
              </span>
            </div>
            <v-card>
              
                <div v-if="comments.length > 0">
                  <div v-for="comment in comments" :key="comment._id">
                    <v-card-text class="mt-1 pt-2 pb-2">
                      <span>
                        {{comment.context}}
                      </span>    
                      <span class="right caption font-weight-light pt-1"> 
                        {{calTime(comment.createdDate)}}
                      </span>
                    </v-card-text>
                  </div>
                </div>
                <div v-else>
                  <v-card-text>
                    you dont have comments
                  </v-card-text>
                </div> 
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
    
     
      <v-card>
        <v-card-title style="background-color:#F0ECEB">
          <div style="text-align:left" class="title font-weight-regular">
            Posts
            <span class="caption">
                [{{posts.length}}]
              </span>
          </div>
        </v-card-title>
      </v-card>

      <div v-if="posts.length > 0">
        <v-expansion-panel>
          <v-expansion-panel-content :hide-actions="true"
            v-for="post in posts" :key="post.id"
          >
            <div slot="header">
              {{post.title}}
              <span class="caption">
                [{{post.comments.length}}]
              </span>

              <div class="right caption font-weight-light pt-1"> 
                {{calTime(post.createdDate)}}
              </div> 
            </div>

            <v-card>
              <v-card-text>
                {{post.context}}

                <div class="right">
                  <v-icon color="red" @click="deletePost(post.id)">delete</v-icon>
                </div>
              </v-card-text>
              
              <div v-for="comment in post.comments" :key="comment.createdDate" class="">
                <v-card-text class="grey lighten-4 ma-1">
                  <span>{{comment.username}} :</span>
                  <span>{{comment.context}}</span>
                  <span class="right caption font-weight-light pt-1">{{calTime(comment.createdDate)}}</span>
                </v-card-text>
              </div>

            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>

    </div>
  </div>

  </div>
</template>

<script>
const API_URL = 'http://localhost:5000/'

export default {
  
  name: 'User',
  data () {
    return {
      loading:true,
      user: {},
      posts : [],
      email : '',
      points: 0,
      comments: [],
      datenow : '',
      allData : [],
      cafeStatus: [],
      thumbUps: [],
      thumbDowns: [],
      thumbs: [],
    }
  },
  mounted() {
    fetch(API_URL, {
      headers: {
        authorization : `Bearer ${localStorage.token}`
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result.user)
        if (result.user){
          this.user = result.user
          // this.getPosts()
          // this.getComments()
          // this.useGraph()
          this.useGraph()
        } else {
          this.logout()
        }
      }),
    this.getTime()
    
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    getTime() {
      this.datenow = Date.now()
    },
    calTime(olddate){
      let diff = parseInt((this.datenow - olddate)/1000)
      if (diff < 60 ){
        return diff + ' sec ago'
      } else if (diff < 3600){
        return parseInt(diff / 60) + ' min ago'
      } else if (diff < 3600 * 24){
        return parseInt(diff/3600) + ' hour ago'
      } else if ( diff < 3600 * 24 * 10) {
        return parseInt(diff / (3600 * 24)) + ' day ago'
      } else {
        let date = Date(olddate).split(' ')
        return `${date[1]} ${date[2]}/${date[3]}`
      }
    },
    edit(postId) {
      console.log('eidt clicked')
      console.log('postId', postId)
    },
    deletePost(postId) {
      console.log('delete clicked')
      fetch(`${API_URL}board/deletePost`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({postId: postId})
      }).then( result=>{
        console.log(result)
        this.useGraph()
      })
    },
    useGraph() {
      fetch(`${API_URL}board/user`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({username: this.user.username})
      })
        .then(r=>r.json())
        .then(data => {
          console.log(data.data)
          this.allData = []   
          this.email = data.data.user.email
          this.points = data.data.user.point
          this.comments = data.data.user.comments.reverse()
          this.posts = data.data.user.suggestPosts.reverse()
          this.cafeStatus = data.data.user.cafeStatus.reverse()
          this.thumbUps = data.data.user.thumbUps.reverse()
          this.thumbDowns = data.data.user.thumbDowns.reverse()
          this.makeThumbs()
          this.loading =false
        });
    },

    makeThumbs () {
      var cond =true
      var totalCount = this.thumbUps.length + this.thumbDowns.length
      var upIdx = 0
      var downIdx = 0
      while(totalCount > 0) {
        if (upIdx >= this.thumbUps.length){
          this.thumbs.push(this.thumbDowns[downIdx])
          downIdx += 1
          totalCount -= 1
          continue
        }
        if (downIdx >= this.thumbDowns.length){
          this.thumbs.push(this.thumbUps[upIdx])
          upIdx += 1
          totalCount -= 1
          continue
        }
        var thumbUp = this.thumbUps[upIdx]
        var thumbDown = this.thumbDowns[downIdx]

        if (thumbUp.createdDate > thumbDown.createdDate) {
          upIdx += 1
          this.thumbs.push(thumbUp)
        } else {
          downIdx += 1
          this.thumbs.push(thumbDown)
        }
        totalCount -= 1
      }
    },
    getColor(score){
      console.log(score)
      if (score <= 20) {
        return "deep-purple"
      }
      else if (score <= 40) {
        return "light-blue"
      }
      else if (score <= 60) {
        return "green" 
      } 
      else if (score<= 80) {
        return "deep-orange"
      } 
      else {
        return 'red'
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
