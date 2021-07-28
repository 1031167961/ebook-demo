import { mapActions, mapGetters } from 'vuex'
import { themeList, addCss, removeAllCss } from '../utils/book'
import { saveLocation } from '../utils/localStorage'

export const ebookMixin = {
  computed: {
    themeList() {
      return themeList(this)
    },
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ])
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle() { // 初始化全局主题样式
      removeAllCss() // 初始化全局样式之前先清除所有主题样式文件
      switch(this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    refreshLocation() { // 章节切换完后调用，用来刷新当前位置
      const currentLocation = this.currentBook.rendition.currentLocation()
      const startCfi = currentLocation.start.cfi
      const progress = this.currentBook.locations.percentageFromCfi(startCfi)
      // console.log(progress)
      this.setProgress(Math.floor(progress * 100))
      this.setSection(currentLocation.start.index)
      saveLocation(this.fileName, startCfi) // 将阅读进度存储到缓存中
    },
    display(target, cb) { // 自定义display()方法，代替epubjs中的rendition.display()渲染电子书
      if(target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation() // 阅读进度初始化
        })
        if(cb) cb()
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation() // 阅读进度初始化
        })
        if(cb) cb()
      }
    }
  }
}
