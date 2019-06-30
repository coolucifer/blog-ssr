<template>
  <div>
    <!-- 不是首页时不显示头图 -->
    <div v-if="showHeaderImg" class="header-img">
      <!-- 背景图片 -->
      <div class="home-background" :style="bgImgStyle" />
      <!-- 灰色遮罩部分 -->
      <el-collapse-transition>
        <div v-show="showCover" class="home-cover" @mousewheel="onMouseWheel">
          <el-button type="text" @click="onMouseWheel">
            <i class="iconfont icon-arrow-down" />
          </el-button>
        </div>
      </el-collapse-transition>
    </div>
    <div class="container">
      <nav-bar></nav-bar>
      <el-scrollbar
        id="scroll-box"
        ref="scrollbar"
        class="scroll-bar"
        wrap-style="overflow-x: hidden;"
      >
        <div class="grid-layout">
          <nuxt />
          <side-list></side-list>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import SideList from '@/components/SideList';

export default {
  components: {
    NavBar,
    SideList,
  },
  data() {
    return {
      showCover: false,
      bgImgStyle: {
        'background-image': 'url(63740442_p0.png)',
      },
      // 鼠标向上滚动计数器
      wheelTop: 0,
    };
  },
  computed: {
    showHeaderImg() {
      // return this.$route.path === '/';
      return false;
    },
  },
  created() {
    this.showCover = this.$route.path === '/';
  },
  methods: {
    onMouseWheel(e) {
      // 鼠标滚轮向下滚动
      if (!e.wheelDelta || e.wheelDelta < 0) {
        this.showCover = false;
      }
    },
    onContainerMouseWheel(e) {
      console.log('wheel: ', this);
      if (this.$route.path !== '/') {
        return;
      }
      const wrapperTop = this.$refs.scrollbar.$refs.wrap.scrollTop;
      // 鼠标向上滚动 && 页面中滚动框已滚到最上
      if (e.wheelDelta > 0 && Number(wrapperTop) === 0) {
        this.wheelTop = this.wheelTop + 1;
      } else {
        this.wheelTop = 0;
      }
      if (this.wheelTop > 4) {
        this.showCover = true;
        this.$nextTick(() => {
          this.wheelTop = 0;
        });
      }
    },
  },
};
</script>

<style lang='scss'>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.header-img {
  .home-background {
    z-index: -1;
    position: fixed;
    min-width: 800px;
    width: 100vw;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50%;
  }
  .home-cover {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100vh;
    padding-bottom: 20px;
    background-color: rgba(0, 0, 0, .5);
    .el-button--text {
      padding: 0;
      color: #e4e4e4;
      &:hover {
        color: #ffffff;
      }
    }
    .iconfont {
      font-size: 50px;
    }
  }
}
.container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  height: 100vh;
  .scroll-bar {
    flex-grow: 1;
    width: 100vw;
    .el-scrollbar__wrap {
      // 元素自带-17px, don't know why
      // 为了隐藏系统scrollbar, 下面的样式firefox,ie兼容性不佳
      margin-bottom: 0 !important;
      margin-right: 0 !important;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .el-scrollbar__view {
      // scrollbar最内层元素
      padding: 10px;
      .grid-layout {
        width: 1040px;
        max-width: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: auto  300px;
        grid-column-gap: 20px;
      }
    }
  }
}
</style>
