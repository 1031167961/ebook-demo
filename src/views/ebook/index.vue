<template>
 <div class="ebook" ref="ebook">
   <ebook-header></ebook-header>
   <ebook-title></ebook-title>
   <ebook-reader></ebook-reader>
   <ebook-menu></ebook-menu>
   <ebook-bookmark></ebook-bookmark>
   <ebook-footer></ebook-footer>
 </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookBookmark from '../../components/ebook/EbookBookmark'
import EbookHeader from '../../components/ebook/EbookHeader'
import EbookFooter from '../../components/ebook/EbookFooter'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMixin } from '../../utils/mixin'

export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  watch: {
    offsetY(value) {
      if(!this.menuVisible && this.bookAvailable) {
        if(value > 0) {
          this.move(value)
        } else if(value === 0) {
          this.restore()
        }
      }
    }
  },
  methods: {
    startLoopReadTime() { // 实现阅读时间记录功能
      let readTime = getReadTime(this.fileName)
      if(!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if(readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    },
    move(value) { // 电子书界面下拉功能实现
        this.$refs.ebook.style.top = value + 'px'
    },
    restore() { // 下拉后还原
      this.$refs.ebook.style.top = 0 + 'px'
      this.$refs.ebook.style.transition = 'all .2s linear'
      setTimeout(() => {
        this.$refs.ebook.style.transition = 'none'
      }, 200)
    }
  },
  mounted() {
    this.startLoopReadTime()
  },
  beforeDestroy() {
    if(this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
