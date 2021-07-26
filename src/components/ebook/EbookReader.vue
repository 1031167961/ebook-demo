<template>
 <div class="ebook-reader">
   <div id="read"></div>
 </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Epub from 'epubjs'
global.epub = Epub
export default {
  computed: {
    ...mapGetters(['fileName'])
  },
  methods: {
    initEpub() {
      const url = 'http://10.8.134.55:9000/books/' + this.fileName + '.epub'
      this.book = new Epub(url)
      console.log(this.book)
      this.renditiopns = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default' // 微信兼容性配置
      }).display()
    }
  },
  mounted() {
    // 获取url中的路由并拆分
    const fileName = this.$route.params.fileName.split('|').join('/')
    this.$store.dispatch('setFileName', fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
</style>
