<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible ===0">
      <!-- 字体设置 -->
      <div class="setting-font-size">
        <div class="preview" :style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
        <div class="select">
          <div class="select-wrapper" v-for="(item, index) in fontSizeList" :key="index" @click="setFontSize(item.fontSize)">
            <div class="line"></div>
            <div class="point-wrapper">
              <div class="point" v-show="defaultFontSize === item.fontSize">
                <div class="small-point"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
      </div>
      <div class="setting-font-family" @click="showFontFamilyPopup">
        <div class="setting-font-family-text-wrapper">
          <span class="setting-font-family-text">{{defaultFontFamily}}</span>
        </div>
        <div class="setting-font-family-icon-wrapper">
          <span class="icon-forward"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {ebookMixin} from '../../utils/mixin'
import { FONT_SIZE_LIST } from '../../utils/book'
import { saveFontSize } from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontSizeList: FONT_SIZE_LIST
    }
  },
  methods: {
    setFontSize(fontSize) { // 设置字号
      this.setDefaultFontSize(fontSize)
      saveFontSize(this.fileName, fontSize) // 将字号修改保存到缓存中
      this.currentBook.rendition.themes.fontSize(fontSize)
    },
    showFontFamilyPopup() { // 设置字体弹出弹出层
      this.setFontFamilyVisible(true)
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
  display: flex;
  flex-direction: column;
  z-index: 101;
  width: 100%;
  height: pr(90);
  background: #fff;
  box-shadow: 0 pr(-8) pr(8) rgba(0, 0, 0, 0.2);
  // 字号设置
  .setting-font-size {
    flex: 2;
    display: flex;
    height: 100%;
    .preview {
      flex: 0 0 pr(40);
      @include center;
    }
    .select {
      display: flex;
      flex: 1;
      .select-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        &:first-child {
          .line {
            &:first-child {
              border-top: none;
            }
          }
        }
        &:last-child {
          .line {
            &:last-child {
              border-top: none;
            }
          }
        }
        .line {
          flex: 1;
          height: 0;
          border-top: pr(1) solid #ccc;
        }
        .point-wrapper {
          position: relative;
          flex: 0 0 0;
          width: 0;
          height: pr(7);
          border-left: pr(1) solid #ccc;
          .point {
            position: absolute;
            top: pr(-7);
            left: pr(-10);
            width: pr(20);
            height: pr(20);
            border-radius: 50%;
            background: #fff;
            border: pr(1) solid #ccc;
            box-shadow: 0 pr(4) pr(4) #00000033;
            @include center;
            .small-point {
              width: pr(5);
              height: pr(5);
              border-radius: 50%;
              background: #333;
            }
          }
        }
      }
    }
  }
  // 字体设置
  .setting-font-family {
    flex: 1;
    font-size: pr(14);
    @include center;
    .setting-font-family-text-wrapper {
      @include center;
    }
    .setting-font-family-icon-wrapper {
      @include center;
    }
  }
}
</style>
