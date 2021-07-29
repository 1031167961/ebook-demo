<template>
 <div class="ebook-slide-contents">
   <div class="slide-contents-search-wrapper">
     <div class="slide-contents-search-input-wrapper">
       <div class="slide-contents-search-icon">
         <span class="icon-search"></span>
       </div>
       <input type="text"
              class="slide-contents-search-input"
              :placeholder="$t('book.searchHint')"
              @keyup.enter="search()"
              @click="showSearchPage()"
              v-model="searchText">
     </div>
     <div class="slide-contents-search-cancel" v-show="searchVisible" @click="hideSearchPage()">{{$t('book.cancel')}}</div>
   </div>
   <div class="slide-contents-book-wrapper" v-show="!searchVisible">
     <div class="slide-contents-book-img-wrapper">
       <img :src="cover" class="slide-contends-book-img" alt="">
     </div>
     <div class="slide-contents-book-info-wrapper">
       <div class="slide-contents-book-title">{{metadata.title}}</div>
       <div class="slide-contents-book-author">作者：{{metadata.creator}}</div>
     </div>
     <div class="slide-contents-book-progress-wrapper">
       <div class="slide-contents-book-progress">
         <span class="progress">{{progress + '%'}}</span>
         <span class="progress-text">{{$t('book.haveRead2')}}</span>
       </div>
       <div class="slide-contents-book-time">{{getReadTimeText(this.fileName)}}</div>
     </div>
   </div>
   <scroll class="slide-contents-list" :top="156" :bottom="48" ref="scroll" v-show="!searchVisible">
     <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
       <span class="slide-contents-item-label" :class="{'selected': section === index}" :style="contentItemStyle(item.level)" @click="displayContent(item.href)">{{item.label}}</span>
       <span class="slide-contents-item-page">{{item.page}}</span>
     </div>
   </scroll>
   <scroll class="slide-search-list" v-show="searchVisible" :top="66" :bottom="48">
     <div class="slide-search-item"
          v-for="(item, index) in searchList" :key="index"
          v-html="item.excerpt" @click="displayContent(item.cfi, true)"></div>
   </scroll>
 </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import Scroll from '../common/Scroll'
import { pr } from '../../utils/utils'

export default {
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data() {
    return {
      searchVisible: false,
      searchList: null,
      searchText: ''
    }
  },
  methods: {
    doSearch(q) { // epubjs官方全文搜索算法（https://github.com/futurepress/epub.js/wiki/Tips-and-Tricks-%28v0.3%29）
        return Promise.all(
            this.currentBook.spine.spineItems.map(section => section.load(this.currentBook.load.bind(this.currentBook)).then(section.find.bind(section, q)).finally(section.unload.bind(section)))
        ).then(results => Promise.resolve([].concat.apply([], results)))
    },
    showSearchPage() { // 显示搜索页面
      this.searchVisible = true
    },
    hideSearchPage() { // 取消搜索页面
      this.searchVisible = false
      this.searchText = ''
      this.searchList = null
    },
    contentItemStyle(level) { // 多级列表缩进
      return {
        marginLeft: `${pr(level) * 15}rem`
      }
    },
    displayContent(target, highlight = false) { // 跳转并关闭目录
      this.display(target, () => {
        this.hideTitleAndMenu()
        if(highlight) {
          this.currentBook.rendition.annotations.highlight(target)
        }
      })
    },
    search() { // 搜索功能实现
      if(this.searchText && this.searchText.length > 0) {
        this.doSearch(this.searchText).then(result => {
          this.searchList = result
          this.searchList.map(item => {
            item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
            return item
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  // 搜索栏样式
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: pr(30);
    margin: pr(20) 0 pr(10) 0;
    padding: 0 pr(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      @include center;
      .slide-contents-search-icon {
        flex: 0 0 pr(28);
        font-size: pr(12);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: pr(28);
        font-size: pr(14);
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 pr(50);
      font-size: pr(14);
      @include right
    }
  }
  // 书籍信息样式
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: pr(90);
    padding: pr(10) pr(15) pr(20);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 pr(45);
      .slide-contends-book-img {
        width: pr(45);
        height: pr(60);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      padding: 0 pr(10);
      box-sizing: border-box;
      .slide-contents-book-title {
        width: pr(153.75);
        font-size: pr(14);
        line-height: pr(20);
        margin-top: pr(5);
        @include ellipsis2(2);
      }
      .slide-contents-book-author {
        width: pr(153.75);
        font-size: pr(12);
        @include ellipsis;
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 pr(75);
      .slide-contents-book-progress {
        margin-top: pr(15);
        .progress {
          font-size: pr(14);
        }
        .progress-text {
          font-size: pr(12);
        }
      }
      .slide-contents-book-time {
        font-size: pr(12);
        margin-top: pr(5);
      }
    }
  }
  // 书籍目录样式
  .slide-contents-list {
    padding: 0 pr(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: pr(15) 0;
      .slide-contents-item-label {
        flex: 1;
        font-size: pr(14);
        line-height: pr(16);
        @include ellipsis;
      }
      .slide-contents-item-page {}
    }
  }
  .slide-search-list {
    width: 100%;
    padding: 0 pr(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: pr(14);
      line-height: pr(16);
      padding: pr(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>
