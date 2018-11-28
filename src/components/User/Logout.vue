<template>
  
</template>

<script>

export default {
  mounted() {
    localStorage.removeItem('token')
    this.$router.push('/')
  },
  name: 'Logout',
  data () {
    return {
      msg: 'i'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
