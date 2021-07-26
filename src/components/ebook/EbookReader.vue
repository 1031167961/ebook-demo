<template>
 <div class="ebook-reader">
   <div id="read"></div>
 </div>
</template>

<script>
import Epub from 'epubjs'
import {ebookMixin} from '../../utils/mixin'
global.epub = Epub
export default {
  mixins: [ebookMixin],
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
    prevPage() { // 上一页
      if(this.renditions) {
        this.renditions.prev() // 翻页
        this.hideTitleAndMenu() // 隐藏菜单栏和工具栏
      }
    },
    nextPage() { // 下一页
      if(this.renditions) {
        this.renditions.next()
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu() { // 调整显示隐藏菜单栏和工具栏
      if(this.menuVisible) {
        this.setSettingVisible(-1)
      }
      // this.$store.dispatch('setMenuVisible', !this.menuVisible)
      this.setMenuVisible(!this.menuVisible)
    },
    hideTitleAndMenu() { // 翻页时隐藏菜单栏和标题栏
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
    }
  },
  mounted() {
    // 获取url中的路由并拆分
    const fileName = this.$route.params.fileName.split('|').join('/')
    // this.$store.dispatch('setFileName', fileName).then(() => {
    //   this.initEpub()
    // })
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
</style>
