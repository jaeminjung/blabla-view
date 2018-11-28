<template>
  <div class="container mt-0">
    
    <v-card height="100px" v-if="cafeStatus > -1">
      <v-layout row wrap class="justify-center align-center fill-height">

        <v-flex xs3 ma-1>
          <CafeStatus :cafeStatusNum="cafeStatus"/>
        </v-flex>
        
        <v-flex xs3 v-if="imgUrl != ''">
          <v-card flat>
              <v-img
                :src="imgUrl"
                height="95px"
                contain 
                @click="imageEnlarge=!imageEnlarge"
              ></v-img>
          </v-card>
        </v-flex>

        <v-flex> 
          <div class="font-weight-medium pa-1">{{cafeNameView}}</div>
          
          <div mt-1>
            
            <v-btn icon class="pr-1 ma-0" @click="add_form">
              <v-icon color="green">add_circle</v-icon>
            </v-btn>
          
            <v-btn icon class="pr-1 ma-0" @click="thumb_up_btn">
              <v-icon color="blue">thumb_up</v-icon>
            </v-btn>
            <v-btn icon class="pr-1 ma-0" @click="thumb_down_btn">
              <v-icon color="red lighten-2">thumb_down</v-icon>
            </v-btn>
          </div>
          <div class="mt-1">
            {{calTime(createdDate)}}
            </div>
        </v-flex>
      </v-layout>
      </v-card>
      <!-- 이거 고쳐야함 -->
    <v-card v-else >
      <v-layout row wrap class="justify-center align-center fill-height">
        
          <v-flex xs-9>
            <div class="subheading font-weight-medium">
              <v-card-text class="pa-1">
              Please add status for us!
              </v-card-text>
            </div>
            <div class="subheading font-weight-medium">
              <v-card-text class="pa-1">
                <v-icon size="20" color="brown">local_cafe</v-icon>
                {{cafeName}}
              </v-card-text>
            </div>
          </v-flex>

          <v-flex xs-3>
            <v-btn icon class="pr-1 ma-0" @click="add_form">
              <v-icon large color="green">add_circle</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
        
      
    

    <!-- image 크게하는 다이아로그 -->
    <v-dialog
      v-model="imageEnlarge"
      width="500"
    >
      <v-img
        :src="imgUrl"
        @click="imageEnlarge=false"
        contain >
      </v-img>    
    </v-dialog>

    <!-- thumbdown clicked -->
    <v-layout row justify-center>
      <v-dialog v-model="thumb_down_dialog">
        <v-card>
          <v-card-title>
            <div>Why did you thumb down?  
              <v-icon>sentiment_very_dissatisfied</v-icon>
            </div>
          </v-card-title>
          <!-- <v-divider></v-divider> -->
          <v-text-field 
            class="ma-2"
            placeholder="please write the reason"
            v-model="thumb_down_reason">
          </v-text-field>
          <!-- <v-divider></v-divider> -->
          <v-card-actions>
            <v-btn color="blue darken-1" flat @click="thumb_down_close_btn">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="thumb_down_save_btn">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-snackbar
        v-model="snackBar"
        top='top'
        :timeout="timeout"
      >
        {{snackBarMessage}}
        <!-- you are too far away from that cafe -->
        <v-icon color="white" class="ml-1">{{snackBarIcon}}</v-icon>
        <v-spacer></v-spacer>
        <v-btn
          color="pink"
          flat
          @click="snackBar = false"
        >
          Close
        </v-btn>
      </v-snackbar>

    <!-- add form  -->
    <v-layout row justify-center>
      <v-dialog v-model="add_form_open" persistent max-width="600px">
        <v-card>
          <!-- <v-card-title>
            <span class="title">Add status's cafe</span>
          </v-card-title> -->
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <span class="title">
                    <v-icon color="brown">local_cafe</v-icon> 
                    {{this.cafeName}} 
                  </span>
                </v-flex>
                
                <v-flex xs12>
                  <v-subheader class="pl-0 subheading"> How Full? {{howBusy}} </v-subheader>
                  <v-slider
                    v-model="slider"
                    :thumb-color="sliderColor"
                    :color="sliderColor"
                    :thumb-size="20"
                    thumb-label="always"
                    @change="sliderEvent"
                  ></v-slider>
                </v-flex>

                  <!-- show imgage -->
                <v-flex xs-12 >
                  <img :src="imageUrl" class="align-center" height="200px">
                </v-flex>

                <v-flex xs12>
                  <div fluid>
                    <v-btn color="blue-grey" class="white--text" block @click="add_photo_click">
                      
                      upload photo
                      <v-icon right dark>photo_camera</v-icon>
                    </v-btn>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture 
                      style="display: none;" 
                      ref="fileInput"
                      @change="onFilePicked">
                  </div>
                </v-flex>

              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="add_form_close_btn">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="add_form_save_btn">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import CafeStatus from './CafeStatus.vue'
const API_URL = 'http://localhost:5000/'

export default {
  mounted() {
    this.adjustName()
    console.log(this.createdDate)
    console.log(this.cafeStatus)
  },
  components: {
    CafeStatus
  },
  props: ['cafeName', 'cafeId', 'cafeStatus', 'myLocation', 'cafeData', 'imgUrl', 'createdDate', 'cafeStatusId'],
  name: 'CafeCard',
  
  data () {
    return {
      // cafeStatus: this.cafeStatus,
      // createdDate: this.createdDate,
      cafeNameView: '',
      imageEnlarge: false,
      thumb_down_dialog: false,
      thumb_down_reason: '',
      add_form_open: false,
      slider: 15,
      sliderColor:"deep-purple",
      howBusy : 'very free',
      imageUrl: '',
      image: null,
      timeout: 4000,
      snackBar: false,
      snackBarMessage: '',
      snackBarIcon: '',
    }
  },
  methods: {
    adjustImg() {
      if (this.imgUrl=== '') {
      this.imgUrl = require('../assets/images.jpeg')
      }
    },
    adjustName : function (){
      if (this.cafeName.length > 12){
        this.cafeNameView = this.cafeName.slice(0, 10) + '...'
      } else {
        this.cafeNameView = this.cafeName
      }
    },
    thumb_down_close_btn : function (){
      this.thumb_down_reason = ''
      this.thumb_down_dialog = false
    },
    thumb_down_save_btn : function (){
      //do something fetch db and then

      const data = {
          cafeStatusId: this.cafeStatusId,
          reason: this.thumb_down_reason
      }
      fetch(`${API_URL}status/thumbDown`,{
        method:'POST',
        body:JSON.stringify(data),
        headers: {
        'content-type':'application/json',
        authorization: `Bearer ${localStorage.token}`
        }
      }).then(res=>res.json())
        .then(res=>{
          console.log(res)
          if(res.message === 'Un-Authorized'){
            this.$router.push('/login')
          }
          else if(res.message){
            this.snackBarMessage = res.message
            this.snackBarIcon = 'done'
            this.snackBar = true
            this.thumb_down_reason = ''
            this.thumb_down_dialog = false
          }
          else {
            this.snackBarMessage = 'Thank you for thumbDown'
            this.snackBarIcon = 'sentiment_very_dissatisfied'
            this.snackBar = true
            this.thumb_down_reason = ''
            this.thumb_down_dialog = false
          }
        })
    },
    thumb_down_btn() {
      if (!this.checkDistance()){
        this.snackBarMessage = 'you are too far away from cafe'
        this.snackBarIcon = 'sentiment_very_dissatisfied'
        this.snackBar = true
        return
      }
      if (!localStorage.token) {
        this.$router.push('/login')
      } else {
        this.thumb_down_dialog = true
      }
    },
    thumb_up_btn : function () {
      if (!this.checkDistance()){
        this.snackBarMessage = 'you are too far away from cafe'
        this.snackBarIcon = 'sentiment_very_dissatisfied'
        this.snackBar = true
        return
      }
      if (!localStorage.token) {
        this.$router.push('/login')
      } else {
        
        console.log(this.cafeStatusId)
        const data = {
          cafeStatusId: this.cafeStatusId
        }
        //fetch
        fetch(`${API_URL}status/thumbUp`, {
          method:'POST',
          body:JSON.stringify(data),
          headers: {
          'content-type':'application/json',
          authorization: `Bearer ${localStorage.token}`
          }
        }).then(res => res.json())
          .then(res => {
            console.log(res)
            if(res.message === 'Un-Authorized'){
              this.snackBarMessage = res.message
              this.snackBarIcon = 'pan_tool'
              this.snackBar = true
              this.$router.push('/login')
            }
            else if(res.message){
              this.snackBarMessage = res.message
              this.snackBarIcon = 'done'
              this.snackBar = true
              console.log('you already thumbup')
            }
            else {
              this.snackBarMessage = 'thank you for thumbUp'
              this.snackBarIcon = 'sentiment_very_satisfied'
              this.snackBar = true
            }
          })        
      }
    },
    add_form_close_btn : function (){
      this.add_form_open = false
    },
    add_form_save_btn : function (){
      const statusData = {
        username : '',
        cafeId : this.cafeId,
        cafeStatus : this.slider,
        imgUrl : this.imageUrl,
        place_name: this.cafeName
      }
      //valid 
      
      //sending to db
      console.log(statusData)
      fetch(`${API_URL}status/addStatus`, {
        method: 'POST',
        body: JSON.stringify(statusData),
        headers: {
          'content-type':'application/json',
          authorization: `Bearer ${localStorage.token}`
        }
      }).then(res=> res.json())
        .then(res => {
          console.log('res', res)
          
          if(res.message){
            this.snackBarMessage = res.message
            this.snackBarIcon = 'sentiment_very_dissatisfied'
            this.snackBar = true
          } else {
            //update 해주기 모르겠음...
            // this.cafeStatus = res.cafeStatus
            // this.createdDate = res.createdDate
            this.snackBarMessage = 'Thank you for add status'
            this.snackBarIcon = 'sentiment_very_satisfied'
            this.snackBar = true
          }
        })

      this.add_form_open = false
    },
    sliderEvent : function (){
      if (this.slider <= 20) {
        this.sliderColor = "deep-purple"
        this.howBusy = "very free"
      }
      else if (this.slider <= 40) {
        this.sliderColor = "light-blue"
        this.howBusy = "free"
      }
      else if (this.slider <= 60) {
        this.sliderColor = "green" 
        this.howBusy = "normal"
      } 
      else if (this.slider <= 80) {
        this.sliderColor = "deep-orange"
        this.howBusy = "busy"
      } 
      else {
        this.sliderColor = "red"
        this.howBusy = "very busy"
      }
    },
    add_photo_click : function (){
      // document.getElementById('img_upload').click()
      this.$refs.fileInput.click()
    },
    onFilePicked(event){
      const files = event.target.files
      let filename = files[0].type
      
      if (!filename.includes("image")){
        return alert('please upload a valid image!')
      }
      const fileReader = new FileReader()
      fileReader.readAsDataURL(files[0])

      fileReader.addEventListener('load', (e)=>{
        const image = new Image()
        image.src = e.target.result
        
        image.onload = imageEvent => {
          this.resize_image(image)
        }

      })
      
      this.image = files[0]
      console.log(this.image)
    },
    resize_image(image){
      let canvas = document.createElement("canvas"),
      max_size = 500,
      // 최대 기준을 1280으로 잡음.
      width = image.width,
      height = image.height;

      if (width > height) {
        // 가로가 길 경우
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
        } else {
          // 세로가 길 경우
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        this.imageUrl = dataUrl
    },
    add_form : function () {
      //거리확인
      if (this.checkDistance()) {
        this.add_form_open = true
      } else {
        this.snackBarMessage = 'you are too far away from cafe'
        this.snackBarIcon = 'sentiment_very_dissatisfied'
        this.snackBar = true
      }   
    },
    checkDistance(){
      var idx = 0
      for(let i = 0; i < this.cafeData.length; i++){
        if (this.cafeData[i].id === this.cafeId){
          console.log(this.cafeData[i])
          idx = i
          break
        }
      }
      var cafeLocation = {lat:Number(this.cafeData[idx].lat), lng:Number(this.cafeData[idx].lng)}
      return this.calDistance(this.myLocation, cafeLocation)
      
    },
    calDistance(person, cafe){
      let lat1 = person.lat
      let lng1 = person.lng
      let lat2 = cafe.lat
      let lng2 = cafe.lng
      
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lng2-lng1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c * 1000; // Distance in m
      
      if (d < 100) { // 몇 m 내에있는지 조정
        return true
      } else { return false }
      
    },
    deg2rad(deg) {
      return deg * (Math.PI/180)
    },
    calTime(createdDate){
      let diff = parseInt((Date.now() - createdDate)/1000)
      if (diff < 60 ){
        return diff + ' sec ago'
      } else if (diff < 3600){
        return parseInt(diff / 60) + ' min ago'
      } else if (diff < 3600 * 24){
        return parseInt(diff/3600) + ' hour ago'
      } else if ( diff < 3600 * 24 * 10) {
        return parseInt(diff / (3600 * 24)) + ' day ago'
      } else {
        let date = Date(createdDate).split(' ')
        return `${date[1]} ${date[2]}/${date[3]}`
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
