<template>
  <div>
    <transition name="slide-up">
      <div class="menu-wrapper" v-show="menuVisible" :class="{ 'hide-box-shadow': !menuVisible || settingVisible >= 0 }">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <!-- 设置字体字号栏 -->
    <ebook-setting-font></ebook-setting-font>
    <!-- 选择字体栏 -->
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <!-- 设置主题栏 -->
    <ebook-setting-theme></ebook-setting-theme>
    <!-- 进度条设置 -->
    <ebook-setting-progress></ebook-setting-progress>
    <!-- 目录组件 -->
    <ebook-slide></ebook-slide>
  </div>
</template>

<script>
import EbookSettingFont from './EbookSettinfFont'
import EbookSettingFontPopup from './EbookSettingFontPopup'
import EbookSettingTheme from './EbookSettingTheme'
import EbookSettingProgress from './EbookSettingProgress'
import EbookSlide from './EbookSlide'

import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  },
  methods: {
    showSetting(key) {
      this.setSettingVisible(key)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.menu-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 200;
  display: flex;
  width: 100%;
  height: pr(48);
  background: #fff;
  box-shadow: 0 pr(-8) pr(8) rgba(0, 0, 0, 0.2);
  font-size: pr(20);
  &.hide-box-shadow {
    box-shadow: none;
  }
  .icon-wrapper {
    flex: 1;
    @include center;
    .icon-progress {
      font-size: pr(28);
    }
    .icon-bright {
      font-size: pr(24);
    }
  }
}
</style>
