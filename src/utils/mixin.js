import { mapActions, mapGetters } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from '../utils/book'
import { saveLocation, getBookmark } from '../utils/localStorage'

export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible'
    ]),
    showBookDetail(book) {
      this.$router.push({
        path: '/store/detail',
        query: {
          fileName: book.fileName,
          category: book.categoryText
        }
      })
    }
  }
}

export const ebookMixin = {
  computed: {
    getSectionName() { // 章节标题
      return this.section ? this.navigation[this.section].label : ''
    },
    themeList() { // 主题列表
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
      if(currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi) // 将阅读进度存储到缓存中
        // 判断当前页是否为书签，获取书签信息
        const bookmark = getBookmark(this.fileName)
        if(bookmark) {
          if(bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          }else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        // 分页处理
        if(this.pagelist) {
          const totalPage = this.pagelist.length
          const currentPage = currentLocation.start.location
          if(currentPage && currentPage > 0) { // 如果分页完成且页数信息大于0，就将具体分页信息传入vuex（paginate）中
            this.setPaginate(currentPage + ' / ' + totalPage)
          } else {
            this.setPaginate('')
          }
        } else {
          this.setPaginate('')
        }
      }
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
    },
    hideTitleAndMenu() { // 翻页时隐藏菜单栏和标题栏
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false) // 隐藏菜单栏
      this.setSettingVisible(-1) // 隐藏工具栏
      this.setFontFamilyVisible(false) // 隐藏字体选择栏
    },
    getReadTimeText(fileName) { // 记录阅读时间
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(fileName))
    }
  }
}
