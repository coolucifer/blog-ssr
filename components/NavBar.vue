<!-- nav bar -->
<template>
  <div class="nav-bar">
    <el-menu
      mode="horizontal"
      :default-active="activeIndex"
      @select="handleNavSelect"
    >
      <el-menu-item
        v-for="item in navList"
        :key="item.index"
        :index="item.index"
      >
        {{ item.name }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      activeIndex: 'blog',
      navList: [
        { index: 'blog', name: 'Blog' },
        { index: 'practice', name: 'Practice' },
        { index: 'about', name: 'About Me' },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    if (/practice/.test(this.$route.path)) {
      this.activeIndex = 'practice';
    }
    if (/about/.test(this.$route.path)) {
      this.activeIndex = 'about';
    }
  },
  mounted() {},
  methods: {
    handleNavSelect(key) {
      if (key === 'blog') {
        this.$router.push('/');
        return;
      }
      this.$router.push(`/${key}`);
    },
  },
};

</script>
<style lang="scss">
.nav-bar {
  flex-shrink: 0;
  .el-menu {
    width: 1040px;
    max-width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
    margin: auto;
    border-bottom: none;
    .el-menu-item {
      color: #666;
      &.is-active {
        color: #000;
      }
    }
  }
  z-index: 2;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  position: relative;
  transition: height 0.3s ease;
}
</style>
