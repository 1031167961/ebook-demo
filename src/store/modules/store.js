const store = {
  state: {
    hotSearchOffsetY: 0, // 用于储存热门搜索组件中的Y轴偏移量
    flapCardVisible: false // 控制翻转卡片组件显示隐藏
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY(state, offsetY) {
      state.hotSearchOffsetY = offsetY
    },
    SET_FLAP_CARD_VISIBLE(state, visible) {
      state.flapCardVisible = visible
    }
  }
}

export default store
