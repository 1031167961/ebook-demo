<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <!-- 进度条设置 -->
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText(this.fileName)}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection()">
            <span class="icon-back"></span>
          </div>
          <input class="progress" type="range"
                                  max="100"
                                  min="0"
                                  step="1"
                                  @change="onProgressChange($event.target.value)"
                                  @input="onProgressInput($event.target.value)"
                                  :value="progress"
                                  :disabled="!bookAvailable"
                                  ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span>{{bookAvailable ? progress + "%" : '加载中...'}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'

export default {
  mixins: [ebookMixin],
  computed: {
    getSectionName() {
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    onProgressChange(progress) { // 进度条拖动松手时调用的方法
      this.setProgress(progress).then(() => {
        this.displayProgress()
        this.updateProgressBg()
      })
    },
    displayProgress() { // 根据进度跳转到对应页面
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      this.display(cfi)
    },
    onProgressInput(progress) { // 进度条拖动时调用的方法
      this.setProgress(progress).then(() => {
        this.updateProgressBg()
      })
    },
    updateProgressBg() { // 拖动进度条时，左侧（已读）进度条背景颜色加深
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    },
    prevSection() { // 上一章按钮事件
      if(this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection()
        })
      }
    },
    nextSection() { // 下一章按钮事件
      if(this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
        this.setSection(this.section + 1).then(() => {
          this.displaySection()
        })
      }
    },
    displaySection() { // 章节跳转具体实现
      const sectionInfo = this.currentBook.section(this.section)
      if(sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href)
      }
    }
  },
  updated() {
    this.updateProgressBg()
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
  // 进度条设置
  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;
    .read-time-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: pr(40);
      font-size: pr(12);
      @include center;
    }
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 pr(15);
      box-sizing: border-box;
      .progress-icon-wrapper {
        font-size: pr(20);
      }
      .progress {
        width: 100%;
        -webkit-appearance: none;
        height: pr(2);
        margin: 0 pr(10);
        &.focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: pr(20);
          width: pr(20);
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 pr(4) pr(4) 0 #00000033;
          border: pr(1) solid #ddd;
        }
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: pr(10);
      width: 100%;
      color: #333;
      font-size: pr(12);
      padding: 0 pr(15);
      box-sizing: border-box;
      @include center;
      .progress-section-text {
        @include ellipsis;
      }
    }
  }
}
</style>
