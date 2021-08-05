<template>
<div>
  <!-- 顶部搜索栏 -->
  <div class="search-bar" :class="{ 'hide-title': !titleVisible, 'hide-shadow': !shadowVisible }">
    <!-- 标题栏 -->
    <transition name="title-move">
      <div class="search-bar-title-wrapper" v-show="titleVisible">
        <div class="title-text-wrapper">
          <span class="title-text title">{{ $t("home.title") }}</span>
        </div>
        <div class="title-icon-shake-wrapper" @click="showFlapCard">
          <span class="icon-shake icon"></span>
        </div>
      </div>
    </transition>
    <!-- 返回按钮 -->
    <div class="title-icon-back-wrapper" :class="{'hide-title': !titleVisible}" @click="back">
      <span class="icon-back icon"></span>
    </div>
    <!-- 搜索框 -->
    <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
      <div class="search-bar-blank" :class="{ 'hide-title': !titleVisible }"></div>
      <div class="search-bar-input">
        <span class="icon-search icon"></span>
        <input type="text" class="input" :placeholder="$t('home.hint')" v-model="searchText" @click="showHotSearch" />
      </div>
    </div>
  </div>
  <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
</div>
</template>

<script>
import HotSearchList from './HotSearchList'
import { storeHomeMixin } from '../../utils/mixin'
// 复杂交互实现思路
// 1. 分析：捕捉细节，看懂需求
// 2. 拆分：将复杂问题转化为若干简单问题的集合
// 3. 求解：针对简单问题进行求解（脑洞）
// 4. 优化：对实现过程进行优化（简化逻辑）
// 向下滑动屏幕交互细节
// 1. 标题和推荐图标向下渐隐
// 2. 搜索框向上移动到标题位置
// 3. 搜索框逐渐变窄以适应屏幕（★★）
// 4. 返回按钮向下居中
// 5. 标题栏下方显示阴影
// 推荐图书教学交互细节
// 1. 弹出卡片
// 2. 卡片翻转动画（★★）
// 3. 烟花动画（★★）
// 4. 弹出推荐图书
export default {
  mixins: [storeHomeMixin],
  components: {
    HotSearchList
  },
  data() {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hotSearchOffsetY(offsetY) {
      if(offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    showFlapCard() {
      this.setFlapCardVisible(true)
    },
    back() {
      if(this.offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      this.hideHotSearch()
    },
    hideHotSearch() {
      this.hotSearchVisible = false
      if(this.offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    showHotSearch() {
      this.hotSearchVisible = true
      this.titleVisible = false
      this.hideShadow()
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
    },
    hideTitle() {
      this.titleVisible = false
    },
    showTitle() {
      this.titleVisible = true
    },
    hideShadow() {
      this.shadowVisible = false
    },
    showShadow() {
      this.shadowVisible = true
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.search-bar {
  position: relative;
  z-index: 150;
  width: 100%;
  height: pr(94);
  box-shadow: 0 pr(5) pr(5) 0 rgba($color: #000, $alpha: .2);
  &.hide-title {
    height: pr(52);
  }
  &.hide-shadow {
    box-shadow: none
  }
  // 标题栏样式
  .search-bar-title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: pr(42);
    .title-text-wrapper {
      width: 100%;
      @include center;
      height: pr(42);
    }
    .title-icon-shake-wrapper {
      position: absolute;
      top: 0;
      right: pr(15);
      height: pr(42);
      @include center;
    }
  }
  // 返回按钮样式
  .title-icon-back-wrapper {
      position: absolute;
      top: 0;
      left: pr(15);
      z-index: 200;
      height: pr(42);
      transition: all $animationTime $animationType;
      @include center;
      &.hide-title {
        height: pr(52);
      }
    }
  // 搜索框样式
  .search-bar-input-wrapper {
    position: absolute;
    left: 0;
    top: pr(42);
    display: flex;
    width: 100%;
    height: pr(52);
    padding: pr(10);
    box-sizing: border-box;
    transition: top $animationTime $animationType;
    &.hide-title {
      top: 0;
    }
    .search-bar-blank {
      flex: 0 0 0;
      width: 0;
      transition: all $animationTime $animationType;
      &.hide-title {
        flex: 0 0 pr(31);
        width: pr(31);
      }
    }
    .search-bar-input {
      flex: 1;
      width: 100%;
      background: #f4f4f4;
      border-radius: pr(20);
      padding: pr(5) pr(15);
      box-sizing: border-box;
      border: pr(1) solid #eee;
      @include left;
      .icon-search {
        color: #999;
      }
      .input {
        width: 100%;
        height: pr(22);
        border: none;
        background: transparent;
        margin-left: pr(10);
        font-size: pr(12);
        color: #666;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
  }
}
</style>
