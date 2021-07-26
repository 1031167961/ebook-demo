<template>
  <transition name="slide-down">
    <div class="title-wrapper" v-show="menuVisible">
      <div class="left">
        <span class="icon-back" @click="back"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="icon-shelf"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-cart"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-more"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'

export default {
  mixins: [ebookMixin],
  methods: {
    back() {
      console.log('back')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.title-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 101;
  display: flex;
  width: 100%;
  height: pr(48);
  background: #fff;
  box-shadow: 0 pr(8) pr(8) rgba(0, 0, 0, 0.2);
  font-size: pr(20);
  .left {
    flex: 0 0 pr(60);
    @include center;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .icon-wrapper {
      flex: 0 0 pr(40);
      @include center;
      margin-left: pr(15);
      .icon-shelf {
        font-size: pr(22);
      }
      .icon-cart {
        font-size: pr(22);
      }
    }
  }
}
</style>
