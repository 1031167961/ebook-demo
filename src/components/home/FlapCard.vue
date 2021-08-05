<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{ animation: runFlapCardAnimation }" v-show="runFlapCardAnimation">
      <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{ zIndex: item.zIndex }">
        <!-- 卡片翻转动画 -->
        <div class="flap-card-circle">
          <div class="flap-card-semi-circle flap-card-semi-circle-left" :style="simeCircleStyle(item, 'left')" ref="left"></div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right" :style="simeCircleStyle(item, 'right')" ref="right"></div>
        </div>
      </div>
      <!-- 烟花动画 -->
      <div class="point-wrapper">
        <div class="point" :class="{ animation: runPointAnimation }" v-for="(item, index) in pointList" :key="index"></div>
      </div>
    </div>
    <!-- 推荐图书卡片 -->
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img :src="data ? data.cover : ''" class="img" />
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{ data ? data.title : "" }}</div>
          <div class="content-author sub-title-medium">{{ data ? data.author : "" }}</div>
          <div class="content-category">{{ categoryText() }}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{ $t("home.readNow") }}</div>
      </div>
    </div>
    <div class="close-btn-wrapper">
      <span class="icon-close" @click="close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin'
import { flapCardList, categoryText } from '../../utils/store'


export default {
  mixins: [storeHomeMixin],
  props: {
    data: Object
  },
  data() {
    return {
      flapCardList,
      front: 0,
      back: 1,
      interValTime: 25,
      runFlapCardAnimation: false,
      pointList: null,
      runPointAnimation: false,
      runBookCardAnimation: false
    }
  },
  watch: {
    flapCardVisible(v) {
      // 设置监听器，当翻转动画层出现时，调用翻转动画
      if (v) {
        this.runAnimation()
      }
    }
  },
  methods: {
    close() { // 关闭动画层后要停止动画，清除计时器
      this.stopAnimation()
      this.setFlapCardVisible(false)
    },
    simeCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    },
    rotate(index, type) { // 半圆转动方法
      const item = this.flapCardList[index]
      let dom
      if (type === 'front') {
        dom = this.$refs.right[index]
      } else {
        dom = this.$refs.left[index]
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
    },
    flapCardRotate() { // 卡片转动功能
      // 左边（正面）的元素
      const frontFlapCard = this.flapCardList[this.front]
      // 右边（反面）的元素
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      backFlapCard.rotateDegree -= 10
      if(backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5
      }
      if(frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
        // 临界点1: 当卡片转动角度到达90°
        backFlapCard.zIndex += 2
      }
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      if(frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        // 临界点2: 当正面的卡片转动到180°，背面的卡片转动到0°（即重合后）切换下一组
        this.next()
      }
    },
    next() { // 切换下一组
      // 获取元素
      const frontFlapCard = this.flapCardList[this.front] // 左边（正面）的元素
      const backFlapCard = this.flapCardList[this.back] // 右边（反面）的元素
      // 属性值复位
      frontFlapCard.rotateDegree = 0
      backFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard._g = backFlapCard.g
      this.rotate(this.front, 'front') // 还原
      this.rotate(this.back, 'back')
      // 切换下一个
      this.front++
      this.back++
      // 当溢出时，复位
      const len = this.flapCardList.length
      if (this.front >= len) {
        this.front = 0
      }
      if (this.back >= len) {
        this.back = 0
      }
      // 动态设置zIndex
      // 100 -> 96
      // 99 -> 100
      // 98 -> 99
      // 97 -> 98
      // 96 -> 97
      // (0 - 1 + 5) % 5 = 4
      // (1 - 1 + 5) % 5 = 0
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len)
      })
      this.prepare()
    },
    prepare() { // 让位于背面的卡片与位于正面正在运动的卡片重叠
      const backFlapCard = this.flapCardList[this.back]
      backFlapCard.rotateDegree = 180
      backFlapCard._g -= backFlapCard._g - 5 * 18
      this.rotate(this.back, 'back')
    },
    reset() { // 重置元素
      // 重置翻转动画
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      // 隐藏推荐图书卡片及翻转动画卡片及烟花动画
      this.runBookCardAnimation = false
      this.runFlapCardAnimation = false
      this.runPointAnimation = false
    },
    startFlapCardAnimation() { // 开始翻转动画
      this.prepare()
      this.task = setInterval(() => {
        this.flapCardRotate()
      }, this.interValTime)
    },
    startPointAnimation() { // 开始烟花动画
      this.runPointAnimation = true
      setTimeout(() => {
        this.runPointAnimation = false
      }, 750)
    },
    stopAnimation() { // 结束动画
      if (this.task) { // 清除定时任务
        clearInterval(this.task)
      }
      if(this.timeout) { // 清除定时任务
        clearTimeout(this.timeout)
      }
      if(this.timeout2) { // 清除定时任务
        clearTimeout(this.timeout2)
      }
      this.reset()
    },
    runAnimation() {
      this.runFlapCardAnimation = true
      this.timeout = setTimeout(() => { // 翻转动画背景弹出后再执行翻转动画与烟波画
        this.startFlapCardAnimation()
        this.startPointAnimation()
      }, 300)
      this.timeout2 = setTimeout(() => { // 2.5s后结束翻转动画并显示图书
        this.stopAnimation()
        this.runBookCardAnimation = true
      }, 2500)
    },
    categoryText() {
      if(this.data) {
        return categoryText(this.data.category, this)
      } else {
        return ''
      }
    }
  },
  created() {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
@import "../../assets/styles/flapCard";
.flap-card-wrapper {
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.6);
  @include absCenter;
  @include center;
  // 翻转动画样式
  .flap-card-bg {
    position: relative;
    width: pr(64);
    height: pr(64);
    border-radius: pr(5);
    background: #fff;
    transform: scale(0);
    opacity: 0;
    &.animation {
      animation: flap-card-move 0.3s ease-in both;
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flap-card {
      width: pr(48);
      height: pr(48);
      @include absCenter;
      .flap-card-circle {
        display: flex;
        width: 100%;
        height: 100%;
        .flap-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          backface-visibility: hidden; // 当旋转到背面时，隐藏
        }
        .flap-card-semi-circle-left {
          border-radius: pr(24) 0 0 pr(24);
          background-position: center right;
          transform-origin: right; // 设置transform的旋转轴
        }
        .flap-card-semi-circle-right {
          border-radius: 0 pr(24) pr(24) 0;
          background-position: center left;
          transform-origin: left; // 设置transform的旋转轴
        }
      }
    }
    .point-wrapper {
      z-index: 1500;
      @include absCenter;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          // scss循环
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  // 图书推荐卡片样式
  .book-card {
    position: relative;
    width: 65%;
    max-width: pr(400);
    box-sizing: border-box;
    border-radius: pr(15);
    background: white;
    &.animation {
      animation: scale .3s ease-in both;
      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
    .book-card-wrapper {
      width: 100%;
      height: 100%;
      margin-bottom: pr(30);
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: pr(20);
        @include center;
        .img {
          width: pr(90);
          height: pr(130);
        }
      }
      .content-wrapper {
        padding: 0 pr(20);
        margin-top: pr(20);
        .content-title {
          color: #333;
          font-weight: bold;
          font-size: pr(18);
          line-height: pr(20);
          max-height: pr(40);
          text-align: center;
          @include ellipsis2(2)
        }
        .content-author {
          margin-top: pr(10);
          text-align: center;
        }
        .content-category {
          color: #999;
          font-size: pr(14);
          margin-top: pr(10);
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        border-radius: 0 0 pr(15) pr(15);
        padding: pr(15) 0;
        text-align: center;
        color: white;
        font-size: pr(14);
        background: $color-blue;
      }
    }
  }
  // 关闭按钮样式
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: pr(20);
    z-index: 1100;
    width: 100%;
    @include center;
    .icon-close {
      width: pr(45);
      height: pr(45);
      font-size: pr(25);
      border-radius: 50%;
      background: #333;
      color: #fff;
      cursor: pointer;
      @include center;
    }
  }
}
</style>
