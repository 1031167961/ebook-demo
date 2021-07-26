<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div class="menu-wrapper" v-show="menuVisible" :class="{ 'hide-box-shadow': !menuVisible }">
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
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  methods: {
    showSetting(key) {
      console.log(key)
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
  z-index: 101;
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
