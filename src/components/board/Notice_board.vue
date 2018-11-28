<template>
<div>
    <div>
    
    <v-container xs12 sm10 class="center pa-1">        
      <v-expansion-panel>

        <v-expansion-panel-content :hide-actions="true">
          <div slot="header" >
            <span>
              사용시 유의할 점!
            </span>
            
            <span class="right caption font-weight-light pt-1">
              date
            </span>
          </div>

          <v-card class="card-text">
            <v-card-text class="grey lighten-3">
              <div class="left">
                <v-icon small color="blue">person</v-icon>
                Admin
              </div>
            </v-card-text>
            <v-card-text class="grey lighten-3">
              <span class="ma-0">
                이용해주셔서 감사합니다. <br>
                
                thumbUp시 3포인트를 얻습니다! <br>
                thumbDown시 2포인트 차감됩니다 <br>
                status 올릴시 10포인트를 얻습니다. <br>

                문제가 발생시 suggestions에 문의하시거나 findseatdev@gmail.com로 연락 주시기 바랍니다. <br>
              </span>
            </v-card-text>
            
          </v-card>
        </v-expansion-panel-content>
        
        <v-expansion-panel-content :hide-actions="true"
          v-for="notice in notices" :key="notice._id" 
          style="background:#F0ECEB"
        >
        
          <div slot="header" >
            <span>
              {{notice.title}}
            </span>
            
            
            <span class="right caption font-weight-light pt-1">
              {{calTime(notice.createdDate)}}
            </span>
          </div>

          
          <v-card class="card-text">
            <v-card-text class="grey lighten-3">
              <div class="left">
                <v-icon small color="blue">person</v-icon>
                Admin
              </div>
            </v-card-text>
            <v-card-text class="grey lighten-3" v-html="renderMarkDown(notice.context)">
              <span class="ma-0">
                {{notice.context}}    
              </span>
            </v-card-text>
            
          </v-card>

        </v-expansion-panel-content>
        
      </v-expansion-panel>
  
    </v-container>
    
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
const API_URL = 'http://localhost:5000/'

export default {
  
  name: 'Notice_board',
  mounted(){
    this.useGraph()
  },
  data () {
    return {
      datenow: '',
      loading: true,
      addNotice: false,
      notices: [],
      newNotice: {
        title: '',
        context: ''
      },
      titleRules: [
        v => !!v || 'title is required',
        v => v.length <= 30 || 'title must be less than 30 characters'
      ],
      contextRules: [
        v => !!v || 'title is required',
        v => v.length <= 300 || 'title must be less than 300 characters'
      ],
    }
  },
  methods: {
    renderMarkDown(post) {
      return md.render(post)
    },
    addNoticeBtnShow() {
      this.addNotice = true
    },
    useGraph(){
      console.log('fetch start')
      this.loading = true
      this.getTime()
      fetch(`${API_URL}board/getNotice`, {
        method:'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
        .then(r => r.json())
        .then(data => {
          console.log(data)
          data.data.noticePost.forEach(element => {
            this.notices.push(element)
          })
          this.notices.reverse()
          this.loading = false
        })

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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
