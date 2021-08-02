<template>
 <div class="ebook-bookmark" ref="bookmark">
   <div class="ebook-bookmark-text-wrapper">
     <div class="ebook-bookmark-down-wrapper" ref="iconDown">
       <span class="icon-down"></span>
     </div>
     <div class="ebook-bookmark-text">{{text}}</div>
   </div>
   <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
     <bookmark :color="color" :width="15" :height="35"></bookmark>
   </div>
 </div>
</template>

<script>
import { realPx, pr } from '../../utils/utils'
import { ebookMixin } from '../../utils/mixin'
import { getBookmark, saveBookmark } from '../../utils/localStorage'
import Bookmark from '../common/Bookmark'
const BLUE = '#346cbc'
const WHITE = '#fff'

export default {
  mixins: [ebookMixin],
  components: {
    Bookmark
  },
  computed: {
    height() {
      return realPx(35)
    },
    threshold() {
      return realPx(55)
    },
    fixedStyle() {
      return {
        position: 'fixed',
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      }
    }
  },
  watch: {
    offsetY(v) {
      if(!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return
      }
      if(v >= this.height && v < this.threshold) {
        this.beforeThreshold(v) // 状态2：下拉到达临界状态
      } else if(v >= this.threshold) {
        this.afterThreshold(v) // 状态3：下拉超越临界状态
      } else if(v > 0 && v < this.height) {
        this.beforeHeight() // 状态1：下拉还未超过书签高度
      } else if(v === 0) {
        this.restore() // 状态0：归位
      }
    },
    isBookmark(isBookmark) {
      if(isBookmark) {
        this.color = BLUE
        this.isFixed = true
      } else {
        this.color = WHITE
        this.isFixed = false
      }
    }
  },
  data() {
    return {
      text: '',
      color: WHITE,
      isFixed: false
    }
  },
  methods: {
    restore() { // 状态0：归位
      setTimeout(() => {
        this.$refs.bookmark.style.top = pr(-this.height) + 'rem'
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)
      if(this.isFixed) {
        this.setIsBookmark(true)
        this.addBookmark()
      } else {
        this.setIsBookmark(false)
        this.removeBookmark()
      }
    },
    beforeHeight() { // 状态1：下拉还未超过书签高度
      if(this.isBookmark) { // 判断：如果当前是书签状态
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
        this.isFixed = true
      } else { // 判断：如果当前不是书签状态
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      }
    },
    beforeThreshold(v) { // 状态2：下拉到达临界状态
      this.$refs.bookmark.style.top = `${-v}px`
      this.beforeHeight()
      const iconDown = this.$refs.iconDown
      if(iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
    },
    afterThreshold(v) { // 状态3：下拉超越临界状态
      this.$refs.bookmark.style.top = `${-v}px`
      if(this.isBookmark) { // 判断：如果当前是书签状态
        this.text = this.$t('book.releaseDeleteMark')
        this.color = WHITE
        this.isFixed = false
      } else { // 判断：如果当前不是书签状态
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      }
      const iconDown = this.$refs.iconDown
      if(iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
        iconDown.style.transform = 'rotate(180deg)'
      }
    },
    addBookmark() { // 添加书签
      // 初始化书签列表
      this.bookmark = getBookmark(this.fileName)
      if(!this.bookmark) {
        this.bookmark = []
      }
      // 获取书记位置内容信息（epub）
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
      const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
      const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
      // console.log(cfibase, cfistart, cfiend)
      const cfirange = `${cfibase}!,${cfistart},${cfiend})`
      // console.log(cfirange)
      this.currentBook.getRange(cfirange).then(range => { // 根据epub查找规则查找当前页面内容
        const text = range.toString().replace(/\s\s/g, '') // 去除多余空格
        // console.log(text)
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text
        })
        saveBookmark(this.fileName, this.bookmark)
      })
    },
    removeBookmark() { // 移除书签
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      this.bookmark = getBookmark(this.fileName)
      if(this.bookmark) {
        this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
        saveBookmark(this.fileName, this.bookmark)
        this.setIsBookmark(false)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
.ebook-bookmark {
  position: absolute;
  top: pr(-35);
  left: 0;
  z-index: 200;
  width: 100%;
  height: pr(35);
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: pr(45);
    bottom: 0;
    display: flex;
    .ebook-bookmark-down-wrapper {
      font-size: pr(14);
      color: #fff;
      transition: all .2s linear;
      @include center;
    }
    .ebook-bookmark-text {
      font-size: pr(14);
      color: #fff;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: pr(15);
  }
}
</style>
