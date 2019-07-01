<template>
  <div class="index-page">
    <article-card
      v-for="item in list"
      :key="item.id"
      :item="item"
    >
    </article-card>
  </div>
</template>

<script>
import ArticleCard from '@/components/ArticleCard';

export default {
  layout: 'blog',
  components: {
    ArticleCard,
  },
  async asyncData({ $axios }) {
    const { list } = await $axios.$get('/api/post/list');
    return {
      list,
    };
  },
};
</script>

<style lang="scss">
</style>
