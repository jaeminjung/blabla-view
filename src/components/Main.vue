<template>
  <div>
    <!-- cafeStatus 0~100 까지로 받아서 함 -->
    <!-- <div v-for="cafe in cafeData" :key="cafe.title">
      <div v-if="cafe.clicked">
        <CafeCard :cafeName="cafe.place_name" :cafeId="cafe.id" class="pa-1" :cafeStatus="89"></CafeCard>
      </div>
    </div> -->

    <div v-if="clicked">
      <CafeCard 
        :key="clickedCafe.id" 
        :cafeName="clickedCafe.place_name" 
        :cafeId="clickedCafe.id" 
        class="pa-1" 
        :myLocation="myLocation"
        :cafeData="cafeData"
        :cafeStatus="cafeStatus"
        :createdDate="createdDate"
        :imgUrl="imgUrl"
        :cafeStatusId="cafeStatusId">
      </CafeCard>
    </div>

    <div class="container pa-1">
      <div id="map" style="height:350px;"></div>

      <!-- 경고창 띄우기 -->
      <div>
        <v-alert
          class="pa-2 font-weight-regular subheading"
          v-model="alert"
          dismissible
          type="warning"
          transition="scale-transition"
        >
          you need to type something
        </v-alert>
      </div>

      <!-- 검색창 -->
      <!-- <v-icon>my_location</v-icon> -->
      <v-text-field class="text-md-center pa-1"
        prepend-icon="my_location"
        @click:prepend="getLocation(myLocation)"
        v-model="keyword"      
        placeholder="장소로 검색해주세요"
        required
        append-icon="search"
        @click:append="keywordSearch2"
        @keyup.enter="keywordSearch2"
      ></v-text-field>
      
    </div>

    <!-- <div v-for="cafe in cafeData" :key="cafe.id">
      {{cafe.place_name}}
      {{cafe.id}}
        <CafeCard :cafeName="cafe.place_name" :cafeId="cafe.id" :cafeStatus="''" class="pa-1"></CafeCard>
    </div> -->
  </div>
</template>

<script>
import CafeCard from './CafeCard'
const API_URL = 'http://localhost:5000/'

export default {
  name: 'Main',
  components: {
    CafeCard
  },
  mounted() {
    daum.maps.disableHD();
    this.mapContainer = document.getElementById('map')
    // console.log(this.mapContainer, "adsa")
    this.getLocation(this.myLocation)
    // this.ps = new daum.maps.services.Places();
  },
  data () {
    return {
      alert: false,
      keyword: '',
      myLocation : {
        lat: 0,
        lng: 0
      },
      map_rect: {
        leftCoord: {},
        rightCoord: {}
      },
      mapOption: {},
      cafeData: [],
      markers: [],
      map: {},
      ps: {},
      mapContainer: {},
      myMapCafes_API_URL: 'http://localhost:5000/post/myMapCafes',
      clickedCafe : {},
      clicked : false,
      cafeStatus: 0,
      imgUrl: '',
      cratedDate: '',
      cafeStatusId: '',
    }
  },
  methods: {
    getLocation: function (myLocation) {
      const _this = this
      if (navigator.geolocation) { // GPS를 지원하면
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude
            let lng = position.coords.longitude
            myLocation.lat = position.coords.latitude
            myLocation.lng = position.coords.longitude
            _this.drawMap(lat, lng) // 위치따온걸로 맵그리기
        }, function(error) {
            console.error(error);
        }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
        })} else {
        alert('GPS를 지원하지 않습니다');
        }
      console.log('getLoaction function', myLocation)
    },
    drawMap: function (lat, lng) {
      this.mapOption = { 
          center: new daum.maps.LatLng(lat, lng), // 지도의 중심좌표
          level: 4// 지도의 확대 레벨
      };
      this.map = new daum.maps.Map(this.mapContainer, this.mapOption); // 지도를 생성합니다
      this.map.setCopyrightPosition(daum.maps.CopyrightPosition.BOTTOMRIGHT, true);
      
      this.addMapChangedEvent() // 맵의 drag이벤트 or zoomchanged 끝났을때 이벤트리스너 등록 동작

      var bounds = this.map.getBounds();
      var swLatlng = bounds.getSouthWest();
      var neLatlng = bounds.getNorthEast();
      let leftLng = swLatlng.ib
      let leftLat = swLatlng.jb
      let rightLng = neLatlng.ib
      let rightLat = neLatlng.jb
      this.map_rect.leftCoord = {leftLng, leftLat}
      this.map_rect.rightCoord = {rightLng, rightLat}
      console.log('drawMap', this.myLocation)

      this.putMarkerOnMyL()
      this.getCafesMyMap()
    },
    addMapChangedEvent: function () {
        const _this = this
        daum.maps.event.addListener(this.map, 'dragend', function() {
          var bounds = this.getBounds(); // this 는 map
          var swLatlng = bounds.getSouthWest();
          var neLatlng = bounds.getNorthEast();
          let leftLng = swLatlng.ib
          let leftLat = swLatlng.jb
          let rightLng = neLatlng.ib
          let rightLat = neLatlng.jb
          _this.map_rect.leftCoord = {leftLng, leftLat}
          _this.map_rect.rightCoord = {rightLng, rightLat}
          console.log('dragend listener', _this.map_rect)   
          _this.getCafesMyMap()
        });
        daum.maps.event.addListener(this.map, 'zoom_changed', function() {  
          var level = this.getLevel() //this 는 map
          _this.mapOption.level = level// level updated          
          var bounds = this.getBounds();
          var swLatlng = bounds.getSouthWest();
          var neLatlng = bounds.getNorthEast();
          let leftLng = swLatlng.ib
          let leftLat = swLatlng.jb
          let rightLng = neLatlng.ib
          let rightLat = neLatlng.jb
          _this.map_rect.leftCoord = {leftLng, leftLat}
          _this.map_rect.rightCoord = {rightLng, rightLat} 
          console.log('zoom_changed Listener', _this.map_rect)
          _this.getCafesMyMap()
        });
    },
    putMarkerOnMyL: function () {
      
      this.map.setCenter(new daum.maps.LatLng(this.myLocation.lat, this.myLocation.lng))
      
      var markerPosition  = new daum.maps.LatLng(this.myLocation.lat, this.myLocation.lng); 
      var marker = new daum.maps.Marker({
          position: markerPosition
      });
      marker.setMap(this.map);
      console.log('putMarkerOnMyL', this.myLocation)
    },
    getCafesMyMap: function () {
      console.log("getCafesMyMap function")
      this.cafeData = []
      fetch(this.myMapCafes_API_URL, {
          method: 'POST',
          body: JSON.stringify(this.map_rect),
          headers: { 'content-type':'application/json' }
      })
      .then(response => response.json())
      .then(datas => {
          datas.forEach(data=>{

            // console.log(data)
              this.cafeData.push({
                  place_name: data.place_name,
                  lng: data.x,
                  lat: data.y,
                  id : data.id,
                  clicked: false
              })
          })
          console.log('cafedata', this.cafeData)
          this.putMarkers_byMyMap()
      })
    },
    putMarkers_byMyMap: function () {
      console.log('putMarkers_byMyMap')
      this.clearMarkers()
      var positions = []
      for (let i =0; i < this.cafeData.length; i++) {
          positions.push({
              title: this.cafeData[i].place_name,
              latlng: new daum.maps.LatLng(this.cafeData[i].lat, this.cafeData[i].lng)
          })
      }
      // 마커 이미지의 이미지 주소입니다
      var imageSrc = "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
      
      for (var i = 0; i < positions.length; i ++) {
      
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new daum.maps.Size(24, 35); 
        
        // 마커 이미지를 생성합니다    
        var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize); 
        
        //정보를 줘서 마커생성하고 이미지 전달해주는 함수, 그리고 클릭리스너도 해줌
        this.addOverlay(positions[i], markerImage)
      }
      // console.log('putMarkers_byMap end, marker',this.markers)
    },
    clearMarkers: function () {
      this.markers.forEach(marker => {
        marker.setMap(null)
      })
      this.markers = []
    },
    addOverlay: function (position, markerImage) {
      var marker = new daum.maps.Marker({
        map: this.map, // 마커를 표시할 지도
        position: position.latlng, // 마커를 표시할 위치
        title : position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image : markerImage // 마커 이미지 
      });   
      const _this = this
      daum.maps.event.addListener(marker, 'click', function() {
          console.log('its clicked')
          console.log(marker.getPosition())
          _this.clickSelect(marker.getPosition())
      });
      this.markers.push(marker)
    },
    clickSelect: function (latlng) {
      let smallest = 10
      let idx = 0
      this.clicked = false
      
      for(var i = 0; i < this.cafeData.length; i++){
          let diff = Math.abs(Number(this.cafeData[i].lat) - Number(latlng.jb)) + Math.abs(Number(this.cafeData[i].lng) - Number(latlng.ib))
          // console.log(cafeData[i].place_name, cafeData[i].lat, cafeData[i].lng)
          // console.log('latlng', latlng.jb, latlng.ib)
          // console.log(diff)
          if (smallest > diff){
              smallest = diff
              idx = i
          }
          // this.cafeData[i].clicked = false
      }
      console.log(this.cafeData[idx].place_name)
      console.log(this.cafeData[idx].id)
      // this.cafeData[idx].clicked = true
      this.clickedCafe.place_name = this.cafeData[idx].place_name
      this.clickedCafe.id = this.cafeData[idx].id
      
      this.getCafeStatus(this.clickedCafe.place_name, this.clickedCafe.id, idx)
    },
    getCafeStatus(place_name, id, idx) {
      const cafeInfo = {
        place_name: place_name,
        id: id
      }
      fetch(`${API_URL}status/getStatus`, {
        method:'POST',
        body: JSON.stringify(cafeInfo),
        headers: {
          'content-type': 'application/json'
        }
      }).then(res => res.json())
        .then(cafeInfo => {
          console.log(cafeInfo)
          if(cafeInfo.length > 0){
            this.cafeStatus = cafeInfo[cafeInfo.length-1].cafeStatus
            this.imgUrl = cafeInfo[cafeInfo.length-1].imgUrl
            this.createdDate = cafeInfo[cafeInfo.length-1].createdDate
            this.cafeStatusId = cafeInfo[cafeInfo.length-1].id
          }
          else{
            this.cafeStatus = -1
            this.imgUrl = ''
            this.createdDate = ''
          }
          this.clicked = true
          console.log(this.clickedCafe)
        })
    },
    // keywordSearch() {
    //   if (this.keyword == '') {
    //     this.alert = true
    //     return
    //   }
    //   console.log('keywordSearch', this.keyword)
    //   const ps = new daum.maps.services.Places();
    //   // 키워드로 장소를 검색합니다
    //   ps.keywordSearch(this.keyword, placesSearchCB); 
    //   const _this = this
    //   // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    //   function placesSearchCB (data, status, pagination) {
    //       if (status === daum.maps.services.Status.OK) {
    //           // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    //           // LatLngBounds 객체에 좌표를 추가합니다
    //           var bounds = new daum.maps.LatLngBounds();
    //           for (var i=0; i<data.length; i++) {
    //               bounds.extend(new daum.maps.LatLng(data[i].y, data[i].x));
    //           }       
    //           // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    //           _this.map.setBounds(bounds); //바운드가 바뀌면서 맵리스너로 바로 검색됌!
    //       }
    //   }
    //   this.keyword = ''
    // },
    keywordSearch2(){
      if (this.keyword === ''){
        this.alert = true
        return
      }

      console.log()
      console.log('keywordSearch', this.keyword)
      fetch(`${API_URL}post/keyword`, {
        method:'post',
        body: JSON.stringify({keyword:this.keyword}),
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(respond => respond.json())
        .then(respond => {
          if (respond.documents){
            this.map.setCenter(new daum.maps.LatLng(respond.documents[0].y, respond.documents[0].x));
            this.map.setLevel(4)
            var bound = this.map.getBounds()
            this.map.setBounds(bound)   
            this.keyword = ''
          }
        })
    }
  }
}


</script>

<style scoped>
  
</style>
