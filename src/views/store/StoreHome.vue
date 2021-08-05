<template>
 <div class="store-home">
   <search-bar></search-bar>
   <flap-card :data="random"></flap-card>
   <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
     <div>111111</div>
   </scroll>
 </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar'
import FlapCard from '../../components/home/FlapCard'
import Scroll from '../../components/common/Scroll'
import { storeHomeMixin } from '../../utils/mixin'
import { home } from '../../api/store'

export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard
  },
  data() {
    return {
      scrollTop: 94,
      random: null
    }
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY)
      if(offsetY > 0) {
        this.scrollTop = 52
      } else {
        this.scrollTop = 94
      }
      this.$refs.scroll.refresh()
    }
  },
  mounted() { // 随机显示图书
    home().then(response => {
      if(response && response.status === 200) {
        const data = response.data
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
      }
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
.store-home {
  width: 100%;
  height: 100%;
}
</style>
