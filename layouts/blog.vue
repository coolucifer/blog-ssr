<!-- 文字及背景样式 参照https://tomotoes.com/ 与 https://zhengrh.com/ -->
<template>
  <div class="blog-layout">
    <div class="home-cover" :class="{ 'scroll-top': !showCover }" @wheel="onMouseWheel">
      <div class="home-cover-container">
        <canvas class="home-background" id="fluid-canvas"></canvas>
        <div class="type-area" :style="typerAreaStyle">
        </div>
      </div>
      <!-- <el-button class="scroll-btn" type="text" v-show="showBtn" @click="onMouseWheel">
        <i class="iconfont icon-arrow-down" />
      </el-button> -->
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
import WebGLFluid from '@/utils/webgl-fluid-simulation.js';
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
      showCover: true,
      showBtn: false,
      // 鼠标向上滚动计数器
      wheelTop: 0,
      // 调试好的页面基础高度
      baseHeight: 1297,
      // 浏览器高度
      clientHeight: 1297,
      typeHTML: `
      <p class="large-font">Doco</p>
      <p>Do Cool</p>`,
    };
  },
  computed: {
    typerAreaStyle() {
      return {
        // transform: `scale(${this.clientHeight / this.baseHeight})`,
      };
    },
  },
  created() {},
  mounted() {
    this.clientHeight = window.innerHeight;
    window.onresize = () => {
      this.clientHeight = window.innerHeight;
    };
    const fluidEl = document.querySelector('#fluid-canvas');
    WebGLFluid(fluidEl);
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
        // const el = document.querySelector('.home-cover');
        // this.coverScrollToTop(el);
        this.showCover = false;
      }
    },
    coverScrollToTop(el) {
      let start = 0;
      const step = () => {
        el.style.transform = `translateY(-${start}vh)`;
        start += 100 / 30;
        if (start <= 100) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
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
  .home-cover {
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    user-select: none;
    transition: all ease-in-out .5s;
    &.scroll-top {
      transform: translateY(-100vh);
    }
    .home-cover-container {
      z-index: 10;
      width: 100vw;
      height: 100vh;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(30, 31, 33, 1);
    }
    .home-background {
      z-index: -1;
      position: absolute;
      width: 100vw;
      height: 100%;
    }
    .type-area {
      margin-bottom: 25px;
      font: 200 6vw/1 "Comic Sans MS","Helvetica Neue","Microsoft Yahei","Microsoft Yahei",-apple-system,sans-serif;
      text-shadow: #452d2d 0 0 1px, #fffffb 0 0 1px, #fffffb 0 0 2px;
      color: #fff;
      text-align: center;
      line-height: 1;
      animation: whiteShadow 1.5s ease-in-out infinite alternate;
      .large-font {
        font-size: 10vw;
      }
    }
    @keyframes whiteShadow {
      0% {
        text-shadow: 0 0 1px #fff,0 0 2px #fff,0 0 3px #fff,0 0 5px #333,0 0 8px #333,0 0 9px #333,0 0 10px #333,0 0 15px #333
      }

      to {
        text-shadow: 0 0 .5px #fff,0 0 1px #fff,0 0 1.5px #fff,0 0 2px #333,0 0 4px #333,0 0 5px #333,0 0 6px #333,0 0 8px #333
      }
    }
    span {
      animation: letter-glow .7s 0s ease both;
      &:first-child {
        animation-delay: 50ms
      }

      &:nth-child(2) {
        animation-delay: .1s
      }

      &:nth-child(3) {
        animation-delay: .15s
      }

      &:nth-child(4) {
        animation-delay: .2s
      }

      &:nth-child(5) {
        animation-delay: .25s
      }

      &:nth-child(6) {
        animation-delay: .3s
      }

      &:nth-child(7) {
        animation-delay: .35s
      }
    }
    // 文字从左向右发光
    @keyframes letter-glow {
      0% {
        opacity: 0;
        text-shadow: 0 0 1px hsla(0,0%,100%,.1)
      }

      66% {
        opacity: 1;
        text-shadow: 0 0 20px hsla(0,0%,100%,.9)
      }

      77% {
        opacity: 1
      }

      to {
        opacity: .7;
        text-shadow: 0 0 20px hsla(0,0%,100%,.2)
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
