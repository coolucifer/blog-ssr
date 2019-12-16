<template>
  <div class="index-page">
    <article-card
      v-for="item in list"
      :key="item.id"
      :item="item"
      @click.native="cardClick(item.id)"
    >
    </article-card>
  </div>
</template>

<script>
import ArticleCard from '@/components/ArticleCard.vue';

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
  methods: {
    cardClick(id) {
      this.$router.push(`/blog/${id}`);
    },
  },
};
</script>

<style lang="scss">
</style>
