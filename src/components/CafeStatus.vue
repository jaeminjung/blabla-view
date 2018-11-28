<template>

    <v-progress-circular
        :rotate="-90"
        :size="90"
        :width="10"
        :value="value"
        :color="statusColor"
        >
        <div class="font-weight-black">{{ status }}</div>
        
    </v-progress-circular>

</template>

<script>
    export default {
        props: ['cafeStatusNum'],
        name: 'cafeStatus',
        mounted () {
            this.statusUpdate(),
            this.interval = setInterval(() => {
            if (this.value > this.cafeStatusNum) {
                // this.value = 0
                clearInterval(this.interval)    
            }
            this.value += 2
            }, 50)
        },
        beforeDestroy () {
            clearInterval(this.interval)
        },
        data () {
            return {
            dialog: false,
            status: '',
            statusColor: '',
            value: 0,
            interval: {},
            }
        },
        methods:{
            statusUpdate: function() {                
                if (this.cafeStatusNum <= 20) {
                    this.status = 'very free'
                    this.statusColor = "deep-purple"
                }
                else if (this.cafeStatusNum <= 40) {
                    this.status = 'free'
                    this.statusColor = "light-blue"
                }
                else if (this.cafeStatusNum <= 60) {
                    this.status = 'normal'
                    this.statusColor = 'green'
                }
                else if (this.cafeStatusNum <= 80) {
                    this.status = 'busy'
                    this.statusColor = "deep-orange"
                }
                else {
                    this.status = 'very busy ' + this.cafeStatusNum + '%'
                    this.statusColor = "red"
                }
            }
        },
    }
</script>

<style scoped>

</style>


