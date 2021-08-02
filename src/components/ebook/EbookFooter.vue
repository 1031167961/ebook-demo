<template>
  <div class="ebook-footer">
    <!-- 阅读进度 -->
    <!-- 按百分比显示 -->
    <span class="ebook-footer-text">{{this.progress + '%'}}</span>
    <!-- 按页数显示 -->
    <!-- <span class="ebook-footer-text">{{this.paginate}}</span> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin]
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: pr(48);
    padding: 0 pr(15);
    box-sizing: border-box;
    @include right;
    .ebook-footer-text {
      font-size: pr(12);
      color: #6d7178;
    }
  }
</style>
