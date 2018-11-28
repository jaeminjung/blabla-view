<template>
  <div>
    <div>
    
    <v-container xs12 sm10 class="center pa-1">        
      <v-expansion-panel>
        
        <v-expansion-panel-content :hide-actions="true"
          v-for="post in allData" :key="post._id" 
          style="background:#F0ECEB"
        >
        
          <div 
            slot="header" 
            @click="commentValue=''"
            
            >
            <span>
              {{post.title}}
            </span>
            
            <span class="caption">
              [{{post.comments.length}}]
            </span>
            <span class="right caption font-weight-light pt-1">
              {{calTime(post.createdDate)}}
            </span>
          </div>

          
          <v-card class="card-text">
            <v-card-text class="grey lighten-3">
              <div class="left">
                <v-icon small color="blue">person</v-icon>
                {{post.author.username}}
              </div>
            </v-card-text>
            <v-card-text class="grey lighten-3" v-html="renderMarkDown(post.context)">
              <span class="ma-0">
                {{post.context}}    
              </span>
            </v-card-text>
                    
            
              <div v-for="comment in post.comments" :key="comment.id" class="">
                <v-card-text class="grey lighten-4 ma-1">
                  <span>{{comment.author.username}} :</span>
                  <span>{{comment.context}}</span>
                  <span class="right caption font-weight-light pt-1">{{calTime(comment.createdDate)}}</span>
                </v-card-text>
              </div>
            
          </v-card>

          <v-card>
            
          </v-card>
          <v-form v-model="commentValid" @submit.prevent="addComment" @keyup.prevent="addComment">
            <v-text-field 
              @keyup.enter="addComment(post.id)"
              class="mr-3 ml-2 grey lighten-3" 
              append-icon="add_comment" 
              @click:append="addComment(post.id)"
              placeholder="Add comment"
              :rules="commentRules"
              v-model="commentValue">
              
            </v-text-field>
          </v-form>

        </v-expansion-panel-content>
        
      </v-expansion-panel>
      <v-btn fixed fab bottom right small round dark color="green lighten-1 mb-4" @click="addPostBtnShow">
        <v-icon dark class="pr-1">create</v-icon> 
      </v-btn>    
    </v-container>


     <v-dialog
      v-model="addPost"
      >
      <v-card>
        <!-- <v-card-title class="headline">Add Post</v-card-title> -->
          <v-container>
            <v-form v-model="postValid" @submit.prevent="submitPost">
            <v-text-field
              v-model="newPost.title"
              :rules="titleRules"
              :counter="30"
              label="title"
              required
            ></v-text-field>
            <v-textarea
              v-model="newPost.context"
              :rules="contextRules"
              label="context"
              required
            ></v-textarea>
            <v-btn @click="submitPost">submit</v-btn>
          </v-form>
        </v-container>
      </v-card>
      
    </v-dialog>
            <div v-if="loading">
      <img src="../../assets/loading.gif" alt=""/>
    </div>

    </div>
    
  </div>
  
</template>

<script>
import MarkdownIt from 'markdown-it'
import MDemoji from 'markdown-it-emoji'
const md = new MarkdownIt()
md.use(MDemoji)

// const API_URL = 'http://localhost:5000/'
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/' : 'http://13.125.21.48:5000/'



export default {
  name: 'Ask_board',
  mounted() {
    this.useGraph2()
    this.getTime()
    this.scrollEvent()
  },
  data () {
    return {
      loading: true,
      posts : [],
      addPost: false,
      postValid: false,
      newPost: {
        title: '',
        context: '',
      },
      titleRules: [
        v => !!v || 'title is required',
        v => v.length <= 30 || 'title must be less than 30 characters'
      ],
      contextRules: [
        v => !!v || 'title is required',
        v => v.length <= 300 || 'title must be less than 300 characters'
      ],
      commentValid: false,
      commentValue :'',
      commentRules: [
        v => !!v || 'comment is required',
        v => v.length <= 100 || 'comment must be less than 50 characters'
      ],
      allData: [],
      datenow :'',
      fetching : false,
      page: 0,
      postPerPage: 20,
      idEnd : false,
    }
  },
  methods: {
    renderMarkDown(post) {
      return md.render(post)
    },
    submitPost() {
      console.log(this.postValid)
      console.log(this.newPost)
      if (this.postValid){
      fetch(`${API_URL}board/suggestPost`, {
        method: 'POST',
        body: JSON.stringify(this.newPost),
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.token}`
        }
      }).then(res => res.json())
        .then(post => {
          console.log(post)
          if (post.message){
            this.$router.push('/login')  
          } else {
            this.page = 0
            this.allData=[]
            this.useGraph2()
            this.newPost = {
              title:'',
              context: ''
            }
          this.addPost = false
          }
        })
      }
    },
    addPostBtnShow() {
      if (localStorage.token) {
        this.addPost = true
      } else {
        this.$router.push('/login')
      }
    },
    addComment(postId){
      console.log('postId', postId)
      if (!localStorage.token) {
        this.$router.push('/login')
        return
      }
      if (this.commentValid) {
        console.log("clicked", this.commentValue)
        console.log("clicked", postId)
        console.log("clicked", this.commentValid)
        const comment = {
          context: this.commentValue,
          post_id: postId
        }
        
        fetch(`${API_URL}board/comment`, {
          method: 'POST',
          body: JSON.stringify(comment),
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${localStorage.token}`
          }
        }).then(res => res.json())
          .then(comment => {
            console.log(comment)
            if(comment.message){
              this.$router.push('/login')  
            } else {
              for(let i = 0; i < this.allData.length; i++){
                if (this.allData[i].id === comment.post_id){
                  this.getTime()
                  this.allData[i].comments.push(comment.value)
                  break
                }
              }
              this.commentValue = ''
            }
          })
      }
    },
    useGraph() {
      this.loading=true
      this.getTime()
      fetch(`${API_URL}board/all`,{
        method:'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
        .then(r => r.json())
        .then(data => {
          this.allData = []          
          data.data.suggestPosts.forEach(element => {
            this.allData.push(element)
          });
          this.allData.reverse()
          this.loading=false
        });
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
    scrollEvent() {
      const _this = this
      window.addEventListener('scroll', function() {
      // console.log(pageYOffset)
      // console.log(window.screen.height)
      // console.log(document.documentElement.scrollHeight)
      if (pageYOffset + window.screen.height + 250 > document.documentElement.scrollHeight
            && !_this.loading
            && !_this.isEnd) {
        
        _this.useGraph2()
      }
      });
    },
    useGraph2() {
      console.log('fetch start')
      
      this.loading=true
      this.getTime()

      fetch(`${API_URL}board/pagePost`, {
        method:'post',
        headers: {
          'content-type':'application/json',
        },
        body: JSON.stringify({page:this.page, postPerPage:this.postPerPage})
      })
        .then(r=> r.json())
        .then(data => {
          
          var somePosts = data.data.somePosts.reverse()
          somePosts.forEach(element => {
            this.allData.push(element)
          });
          console.log(this.allData)
          
          if (data.isEnd){
            this.isEnd = true
          }
          this.loading = false
          this.page += 1
        })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.card-text img {
  width:100%
}
</style>
