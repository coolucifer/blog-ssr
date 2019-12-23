<template>
  <div class="blog-layout">
    <!-- 不是首页时不显示头图 -->
    <div v-if="showHeaderImg" class="header-img">
      <!-- 背景图片 -->
      <div class="home-background" :style="bgImgStyle" />
      <!-- 灰色遮罩部分 -->
      <el-collapse-transition>
        <div v-show="showCover" class="home-cover" @wheel="onMouseWheel">
          <div class="type-area" :style="typerAreaStyle">
          </div>
          <el-button class="scroll-btn" type="text" v-show="showBtn" @click="onMouseWheel">
            <i class="iconfont icon-arrow-down" />
          </el-button>
        </div>
      </el-collapse-transition>
    </div>
    <div class="container" @wheel="onContainerMouseWheel">
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
import NavBar from '@/components/NavBar.vue';
import SideList from '@/components/SideList.vue';
import Typer from '@/utils/typer.js';

export default {
  components: {
    NavBar,
    SideList,
  },
  data() {
    return {
      showCover: false,
      showBtn: false,
      bgImgStyle: {
        // 'background-image': 'url(63740442_p0.png)',
        'background-image': 'url(77991355_p0.jpg)',
      },
      // 鼠标向上滚动计数器
      wheelTop: 0,
      // 调试好的页面基础高度
      baseHeight: 1297,
      // 浏览器高度
      clientHeight: 1297,
      typeHTML: `
      <p>Hello, I'm</p>
      <p class="bold large-font">Doco</p>
      <p>and I'm a</p>
      <p class="bold large-font">Developer</p>`,
    };
  },
  computed: {
    showHeaderImg() {
      // return this.$route.path === '/';
      return true;
      // return false;
    },
    typerAreaStyle() {
      return {
        transform: `scale(${this.clientHeight / this.baseHeight})`,
      };
    },
  },
  created() {
    this.showCover = this.$route.path === '/';
  },
  mounted() {
    this.clientHeight = window.innerHeight;
    window.onresize = () => {
      this.clientHeight = window.innerHeight;
    };
    const el = document.querySelector('.type-area');
    Typer(el, { html: this.typeHTML }, () => {
      this.showBtn = true;
    });
  },
  methods: {
    onMouseWheel(e) {
      e.preventDefault();
      if (!this.showBtn) return;
      // 鼠标滚轮向下滚动
      if (!e.wheelDelta || e.wheelDelta < 0) {
        this.showCover = false;
      }
    },
    onContainerMouseWheel(e) {
      if (e) return;
      if (this.$route.path !== '/') {
        return;
      }
      const wrapperTop = this.$refs.scrollbar.$refs.wrap.scrollTop;
      // 鼠标向上滚动 && 页面中滚动框已滚到最上
      if (e.wheelDelta > 0 && Number(wrapperTop) === 0) {
        this.wheelTop++;
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
.blog-layout {
  .header-img {
    .home-background {
      z-index: -1;
      position: fixed;
      min-width: 1366px;
      width: 100vw;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 50%;
    }
    .home-cover {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      padding-bottom: 20px;
      background-color: rgba(0, 0, 0, .5);
      .type-area {
        margin-bottom: 25px;
        font-size: 40px;
        font-weight: bold;
        color: #7f7f7f;
        text-align: center;
        line-height: 1;
        .large-font {
          font-size: 50px;
        }
        .bold {
          font-weight: 1000;
        }
      }
      .scroll-btn {
        position: absolute;
        bottom: 10px;
        left: calc(50% - 26px);
      }
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
    background-color: #fff;
    .scroll-bar {
      flex-grow: 1;
      width: 100%;
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
          grid-template-columns: calc(100% - 320px)  300px;
          grid-column-gap: 20px;
          grid-template-areas: 'main side';
          .side-list {
            grid-area: side;
          }
        }
      }
    }
  }
}
</style>
