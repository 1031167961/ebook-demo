const store = {
  state: {
    hotSearchOffsetY: 0 // 用于储存热门搜索组件中的Y轴偏移量
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY(state, offsetY) {
      state.hotSearchOffsetY = offsetY
    }
  }
}

export default store
