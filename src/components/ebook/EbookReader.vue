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
    initEpub() { // 初始化电子书
      const url = 'http://10.8.134.55:9000/books/' + this.fileName + '.epub'
      this.book = new Epub(url)
      console.log(this.book)
      this.renditions = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default' // 微信兼容性配置
      })
      this.renditions.display() // 渲染电子书
      // 实现手势操作（滑动翻页）
      this.renditions.on('touchstart', event => {
        // console.log(event)
        this.touchStartX = event.changedTouches[0].clientX // 当前手指按下的X轴坐标
        this.touchStartTime = event.timeStamp // 当前手指按下的时间
      })
      this.renditions.on('touchend', event => {
        // console.log(event)
        const offsetX = event.changedTouches[0].clientX - this.touchStartX // 手指离开屏幕时的X轴坐标-原来X轴坐标（即偏移量）
        const time = event.timeStamp - this.touchStartTime // 手指离开屏幕时的时间-原来时间（即手指滑动时间）
        // console.log(offsetX, time)
        if(time < 500 && offsetX > 40) {
          this.prevPage()
        }else if(time < 500 && offsetX < -40) {
          this.nextPage()
        }else {
          this.toggleTitleAndMenu()
        }
        event.preventDefault() // 禁用事件默认行为
        event.stopPropagation() // 禁止事件进行传播
      }) // rendition.on()将事件绑定到iframe中
    },
    // 上一页
    prevPage() {
      if(this.renditions) {
        this.renditions.prev()
      }
    },
    // 下一页
    nextPage() {
      if(this.renditions) {
        this.renditions.next()
      }
    },
    toggleTitleAndMenu() {
      console.log('show title and menu')
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
