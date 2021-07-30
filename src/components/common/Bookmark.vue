<template>
 <div class="book-mark" :style="style" ref="bookmark"></div>
</template>

<script>
import { pr } from '../../utils/utils'

export default {
  props: {
    width: Number,
    height: Number,
    color: String
  },
  computed: {
    style() {
      if(this.color) {
        return {
          borderColor: `${this.color} ${this.color} #ffffff00 ${this.color}`
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    refesh() {
      if(this.height && this.width) {
        this.$refs.bookmark.style.borderWidth = `${pr(this.height - 5)}rem ${pr(this.width / 2)}rem ${pr(5)}rem ${pr(this.width / 2)}rem`
      }
    }
  },
  mounted() {
    this.refesh()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
.book-mark {
  width: 0;
  height: 0;
  border-width: pr(50) pr(10) pr(10) pr(10);
  border-style: solid;
  border-color: #fff #fff #ffffff00 #fff;
}
</style>
