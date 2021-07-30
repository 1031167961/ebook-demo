const book = {
  state: {
    fileName: '', // url路径
    menuVisible: false, // 控制菜单栏是否显示
    settingVisible: -1, // -1:不显示, 0:字号, 1:主题, 2:进度条, 3:目录
    defaultFontSize: 16, // 默认字号
    defaultFontFamily: 'Default', // 默认字体
    fontFamilyVisible: false, // 控制字体设置栏是否显示
    defaultTheme: 'Default', // 控制默认主题
    bookAvailable: false, // 电子书是否可用（是否加载完毕）
    progress: 0, // 存储进度信息，默认为0
    section: 0, // 用于指定当前章节位置（目录）
    isPaginating: true,
    currentBook: null, // 电子书对象（this.book）
    navigation: null,
    cover: null, // 书籍封面路径
    metadata: null,
    paginate: '',
    pagelist: null,
    offsetY: 0, // 鼠标在Y轴上下拉的偏移量（下拉书签功能使用）
    isBookmark: null
  },
  mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENU_VISIBLE': (state, visible) => {
      state.menuVisible = visible
    },
    'SET_SETTING_VISIBLE': (state, visible) => {
      state.settingVisible = visible
    },
    'SET_DEFAULT_FONT_SIZE': (state, fontSize) => {
      state.defaultFontSize = fontSize
    },
    'SET_DEFAULT_FONT_FAMILY': (state, font) => {
      state.defaultFontFamily = font
    },
    'SET_FONT_FAMILY_VISIBLE': (state, visible) => {
      state.fontFamilyVisible = visible
    },
    'SET_DEFAULT_THEME': (state, theme) => {
      state.defaultTheme = theme
    },
    'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    'SET_PROGRESS': (state, progress) => {
      state.progress = progress
    },
    'SET_SECTION': (state, section) => {
      state.section = section
    },
    'SET_IS_PAGINATING': (state, isPaginating) => {
      state.isPaginating = isPaginating
    },
    'SET_CURRENT_BOOK': (state, currentBook) => {
      state.currentBook = currentBook
    },
    'SET_NAVIGATION': (state, navigation) => {
      state.navigation = navigation
    },
    'SET_COVER': (state, cover) => {
      state.cover = cover
    },
    'SET_METADATA': (state, metadata) => {
      state.metadata = metadata
    },
    'SET_PAGINATE': (state, paginate) => {
      state.paginate = paginate
    },
    'SET_PAGELIST': (state, pagelist) => {
      state.pagelist = pagelist
    },
    'SET_OFFSETY': (state, offsetY) => {
      state.offsetY = offsetY
    },
    'SET_IS_BOOKMARK': (state, isBookmark) => {
      state.isBookmark = isBookmark
    }
  }
}

export default book
