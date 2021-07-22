<template>
  <div id="app">
    <span class="text">ABCDEFG</span>
    <router-view/>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$store.dispatch('setTest', 0).then(() => {
        console.log(this.$store.state.book.test)
      })
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  })
</script>


<style lang="scss" scoped>
  @import './assets/styles/global.scss';
  .text {
    font-family: 'Days One';
    font-size: pr(20);
    color: orange;
  }
</style>
