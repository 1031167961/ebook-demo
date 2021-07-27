<template>
<transition name="popup-slide-up">
  <div class="ebook-popup-list" v-show="fontFamilyVisible">
    <div class="ebook-popup-title">
      <div class="ebook-popup-title-icon" @click="hide">
        <span class="icon-down2"></span>
      </div>
      <span class="ebook-popup-title-text">选择字体</span>
    </div>
    <div class="ebook-popup-list-wrapper">
      <div class="ebook-popup-item" v-for="(item, index) in fontFamilyList" :key="index" @click="setFontFamily(item.font)">
        <div class="ebook-popup-item-text" :class="{'selected': isSelected(item)}">{{item.font}}</div>
        <div class="ebook-popup-item-check" v-if="isSelected(item)">
          <span class="icon-check"></span>
        </div>
      </div>
    </div>
  </div>
 </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { FONT_FAMILY } from '../../utils/book'
import { saveFontFamily } from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontFamilyList: FONT_FAMILY
    }
  },
  methods: {
    hide() { // 隐藏字体选择弹出层
      this.setFontFamilyVisible(false)
    },
    isSelected(item) { // 判断字体是否选中
      return this.defaultFontFamily === item.font
    },
    setFontFamily(font) {
      this.setDefaultFontFamily(font)
      saveFontFamily(this.fileName, font)
      if(font === 'Default') {
        this.currentBook.rendition.themes.font('微软雅黑')
      } else {
        this.currentBook.rendition.themes.font(font)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
.ebook-popup-list {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 300;
  background: #fff;
  box-shadow: 0 pr(-4) pr(6) rgba($color: #000, $alpha: 0.1);
  .ebook-popup-title {
    padding: pr(15);
    box-sizing: border-box;
    border-bottom: pr(1) solid #b8b9bb;
    text-align: center;
    position: relative;
    @include center;
    .ebook-popup-title-icon {
      position: absolute;
      left: pr(15);
      top: 0;
      height: 100%;
      font-size: pr(16);
      font-weight: bold;
      @include center;
    }
    .ebook-popup-title-text {
      font-size: pr(14);
      font-weight: bold;
    }
  }
  .ebook-popup-list-wrapper {
    .ebook-popup-item {
      display: flex;
      padding: pr(15);
      .ebook-popup-item-text {
        flex: 1;
        font-size: pr(14);
        text-align: left;
        &.selected {
          color: #0aa1ed;
          font-weight: bold;
        }
      }
      .ebook-popup-item-check {
        flex: 1;
        font-size: pr(14);
        color: #0aa1ed;
        font-weight: bold;
        text-align: right;
      }
    }
  }
}
</style>
