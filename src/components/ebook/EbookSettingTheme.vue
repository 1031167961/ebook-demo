<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
      <!-- 主题设置 -->
      <div class="setting-theme">
        <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index" @click="setTheme(index)">
          <div class="preview" :style="{background: item.style.body.background}" :class="{'slected': item.name === defaultTheme}"></div>
          <div class="text" :class="{'slected': item.name === defaultTheme}">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { saveTheme } from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  data() {
    return {
    }
  },
  methods: {
    setTheme(index) {
      const theme = this.themeList[index]
      this.setDefaultTheme(theme.name).then(() => {
        this.currentBook.rendition.themes.select(this.defaultTheme)
        this.initGlobalStyle()
      })
      saveTheme(this.fileName, theme.name) // 将当前主题储存到缓存中
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
.setting-wrapper {
  position: absolute;
  bottom: pr(48);
  left: 0;
  z-index: 101;
  width: 100%;
  height: pr(90);
  background: #fff;
  box-shadow: 0 pr(-8) pr(8) rgba(0, 0, 0, 0.2);
  // 主题设置
  .setting-theme {
    height: 100%;
    display: flex;
    .setting-theme-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: pr(5);
      box-sizing: border-box;
      .preview {
        flex: 1;
        border: pr(1) solid #ccc;
        box-sizing: border-box;
        &.slected {
          box-shadow: 0 pr(2) pr(6) 0 rgba($color: #000, $alpha: .2);
        }
      }
      .text {
        flex: 0 0 pr(20);
        font-size: pr(14);
        color: #333;
        color: #ccc;
        @include center;
        &.slected {
          color: #333;
        }
      }
    }
  }
}
</style>
