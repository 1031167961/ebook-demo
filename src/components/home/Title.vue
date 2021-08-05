<template>
  <div class="home-title-wrapper">
    <div class="label">{{label}}</div>
    <div class="btn" @click="click">{{btn}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      label: String,
      btn: String
    },
    methods: {
      click() {
        this.$emit('onClick')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .home-title-wrapper {
    width: 100%;
    padding: pr(15) pr(10);
    box-sizing: border-box;
    @include top;
    .label {
      flex: 1;
      font-size: pr(18);
      color: #333;
      font-weight: bold;
    }
    .btn {
      font-size: pr(14);
      color: rgba(64, 158, 255, 1);
      &:active {
        color: rgba(64, 158, 255, .5);
      }
    }
  }
</style>
