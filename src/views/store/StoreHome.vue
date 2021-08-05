<template>
 <div class="store-home">
   <search-bar></search-bar>
   <flap-card :data="random"></flap-card>
   <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
     <div class="banner-wrapper">
       <div class="banner-img" :style="{backgroundImage: `url('${banner}')`}"></div>
     </div>
     <guess-you-like :data="guessYouLike"></guess-you-like>
     <recommend :data="recommend" class="recommend"></recommend>
     <featured :data="featured" class="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')"></featured>
     <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
       <category-book :data="item"></category-book>
     </div>
     <category :data="categories" class="categories"></category>
   </scroll>
 </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar'
import FlapCard from '../../components/home/FlapCard'
import Scroll from '../../components/common/Scroll'
import { storeHomeMixin } from '../../utils/mixin'
import { home } from '../../api/store'
import GuessYouLike from '../../components/home/GuessYouLike'
import Recommend from '../../components/home/Recommend'
import Featured from '../../components/home/Featured'
import CategoryBook from '../../components/home/CategoryBook'
import Category from '../../components/home/Category'

export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
  },
  data() {
    return {
      scrollTop: 94,
      random: null,
      banner: null,
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: [],
      categories: []
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
        console.log(data)
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
        this.banner = data.banner
        this.guessYouLike = data.guessYouLike
        this.recommend = data.recommend
        this.featured = data.featured
        this.categoryList = data.categoryList
        this.categories = data.categories
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
  .banner-wrapper {
    width: 100%;
    padding: pr(10);
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: pr(150);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .recommend {
    margin-top: pr(20);
  }
  .featured {
    margin-top: pr(20);
  }
  .category-list-wrapper {
    margin-top: pr(20);
  }
  .categories {
    margin-top: pr(20);
  }
}
</style>
