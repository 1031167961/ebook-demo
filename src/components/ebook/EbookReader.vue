<template>
 <div class="ebook-reader">
   <div id="read"></div>
 </div>
</template>

<script>
import { getFontFamily, getFontSize, saveFontFamily, saveFontSize, getTheme, saveTheme, getLocation } from '../../utils/localStorage'
import Epub from 'epubjs'
import { ebookMixin } from '../../utils/mixin'

global.epub = Epub
export default {
  mixins: [ebookMixin],
  methods: {
    initEpub() { // 初始化电子书
      const url = process.env.VUE_APP_RES_URL + '/books/' + this.fileName + '.epub'
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      console.log(this.book)
      this.initRendition()
      this.initGesture()
      // 分页
      this.book.ready.then(() => { // book解析完成后会调用ready方法
        // 分页算法(粗略分页)
        // 每页750字左右，根据屏幕宽度以及字体大小进行调整（但会受到字体样式以及图片等因素的影响，做不到精确分页）
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)).then(locations => {
          console.log('进度加载完毕...')
          this.setBookAvailable(true)
          this.refreshLocation()
        })
      })
    },
    initRendition() { // 初始化rendition对象
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default' // 微信兼容性配置
      })
      const location = getLocation(this.fileName) // 获取缓存中location（阅读进度）的值，并传给自定义display()方法
      this.display(location, () => { // 采用自定义display()方法
        // 电子书渲染完成后初始化样式
        this.initTheme() // 电子书主题样式初始化（背景，文字颜色）
        this.initGlobalStyle() // 全局主题样式初始化（菜单栏，工具栏等）
        this.initFontSize() // 字号大小初始化
        this.initFontFamily() // 字体样式初始化
      })
      this.rendition.hooks.content.register(contents => {
      Promise.all([
        // 使用环境变量，规定生产模式中的静态资源服务器地址（.env.development文件）
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
      ]).then(() => {
        console.log('字体全部加载完毕...')
      })
    }) // 通过.rendition.hooks.content.register的钩子函数，将字体文件注入到epub的iframe中
    },
    initGesture() { // 初始化手势操作
      // 实现手势操作（滑动翻页）
      this.rendition.on('touchstart', event => {
        // console.log(event)
        this.touchStartX = event.changedTouches[0].clientX // 当前手指按下的X轴坐标
        this.touchStartTime = event.timeStamp // 当前手指按下的时间
      })
      this.rendition.on('touchend', event => {
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
    initFontSize() { // 初始化字号设置
      let fontSize = getFontSize(this.fileName)
      if(!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    initFontFamily() { // 初始化字体设置
      let font = getFontFamily(this.fileName)
      if(!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily) // 若本地缓存中没有字体设置，则将字体设置为默认字体
      } else {
        this.rendition.themes.font(font) // 页面渲染完成后，若本地缓存中有字体设置，则将字体设置为缓存中
        this.setDefaultFontFamily(font) // 并修改vuex中默认字体
      }
    },
    initTheme() { // 初始化电子书主题样式
      let defaultTheme = getTheme(this.fileName) // 获取缓存中的主题
      if(!defaultTheme) { // 如果缓存中没有主题，初始化第一个主题为默认主题
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme) // 将当前主题储存到缓存中
      }
      this.setDefaultTheme(defaultTheme) // 修改vuex中的默认主题
      this.themeList.forEach(theme => { // 遍历themeList，并注册主题
        this.rendition.themes.register(theme.name, theme.style)
      })
      this.rendition.themes.select(this.defaultTheme) // 设置初始化主题
    },
    // 初始化全局样式写在mixin.js中
    prevPage() { // 上一页
      if(this.rendition) {
        this.rendition.prev().then(() => { // 翻页
          this.refreshLocation() // 将阅读进度存储到缓存中
        })
        this.hideTitleAndMenu() // 隐藏菜单栏和工具栏
      }
    },
    nextPage() { // 下一页
      if(this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation() // 将阅读进度存储到缓存中
        })
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu() { // 调整显示隐藏菜单栏和工具栏
      if(this.menuVisible) {
        this.setSettingVisible(-1) // 隐藏工具栏
        this.setFontFamilyVisible(false) // 隐藏字体选择栏
      }
      // this.$store.dispatch('setMenuVisible', !this.menuVisible)
      this.setMenuVisible(!this.menuVisible) // 隐藏菜单栏
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
