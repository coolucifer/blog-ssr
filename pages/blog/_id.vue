<template>
  <div class="article-content">
  </div>
</template>

<script>
export default {
  layout: 'blog',
  name: 'ArticleContent',
  components: {
  },
  computed: {
  },
  watch: {
  },
  async asyncData({ $axios, params }) {
    const { id } = params;
    console.log('id: ', id);
    const res = await $axios.$get('/api/post', {
      params: { id },
    });
    const { content } = res.post;
    // console.log('content: ', content);
    return {
      content,
    };
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss">
.article-content {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  min-height: calc(100vh - 100px);
  // min-height: calc(100% - 30px);
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  // 代码样式
  code {
    font-family: 'Consolas';
  }
  img,
  video {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
  table {
    display: block;
    width: 100%;
    margin-top: 0;
    margin-bottom: 16px;
    overflow: auto;
    border-spacing: 0;
    border-collapse: collapse;
    th {
      font-weight: 600;
    }

    th,
    td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }

    tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
  }

  .el-dialog__wrapper {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-dialog {
      display: flex;
      flex-direction: column;
      margin: 0;
      height: 90%;
      .el-dialog__body {
        flex-grow: 1;
        // 解决子元素溢出
        overflow: hidden;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>
