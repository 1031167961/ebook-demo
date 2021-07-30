import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function setLocalStorage(key, value) {
  return localStorage.set(key, value)
}

export function getLocalStorage(key) {
  return localStorage.get(key)
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}

export function setBookObject(fileName, key, value) {
  let book = getLocalStorage(`${fileName}-info`)
  if(!book) {
    book = {}
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)
}

export function getBookObject(fileName, key) {
  let book = getLocalStorage(`${fileName}-info`)
  if(book) {
    return book[key]
  } else {
    return null
  }
}

// 获取默认语言
export function getLocale() {
  return getLocalStorage('locale')
}

// 存储默认语言
export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}

// 获取阅读进度
export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}

// 存储阅读进度
export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}

// 获取书签信息
export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}

// 存储书签信息
export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}

// 获取阅读时间
export function getReadTime(fileName) {
  return getBookObject(fileName, 'time')
}

// 存储阅读时间
export function saveReadTime(fileName, theme) {
  setBookObject(fileName, 'time', theme)
}

export function getProgress(fileName) {
  return getBookObject(fileName, 'progress')
}

export function saveProgress(fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}

export function getNavigation(fileName) {
  return getBookObject(fileName, 'navigation')
}

export function saveNavigation(fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}

export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}

export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}

export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}

export function saveCover(fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}

// 获取字体缓存
export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}

// 存储字体缓存
export function saveFontFamily(fileName, fontFamily) {
  setBookObject(fileName, 'fontFamily', fontFamily)
}

// 获取主题缓存
export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}

// 存储主题缓存
export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}

// 获取字号缓存
export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}

// 存储字号缓存
export function saveFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}
