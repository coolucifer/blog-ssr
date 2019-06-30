<!-- side list -->
<template>
  <div class="side-list">
    <el-input v-model="searchValue" size="small" @keyup.enter.native="search">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-card class="side-card">
      <el-button-group>
        <a href="https://github.com/coolucifer" target="_blank">
          <el-button plain icon="iconfont icon-github">Github</el-button>
        </a>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=1045606768&site=qq&menu=yes" targe="_blank">
          <el-button plain icon="iconfont icon-qq">QQ</el-button>
        </a>
        <a href="mailto:me@doco.dev">
          <el-button plain icon="iconfont icon-mail">Mailto</el-button>
        </a>
      </el-button-group>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      searchValue: '',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    search() {
      const { searchValue } = this;
      console.log('search: ', searchValue);
      this.$emit('search', searchValue);
    },
  },
};

</script>
<style lang="scss">
.side-list {
  position: sticky;
  top: 80px;
}
</style>
