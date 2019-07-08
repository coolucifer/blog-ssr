<!-- 聊天气泡chat bubble -->
<template>
  <div class="chat-bubble" :class="side">
    <div class="avatar">
      <slot name="avatar">
        <img src="" alt="avatar" @error="imgErr">
      </slot>
    </div>
    <div class="detail">
      <div class="top">
        <span class="name">
          {{ data.client || '' }}
        </span>
        <!-- <span class="time">
          {{ data.timestamp | timeFilter }}
        </span> -->
      </div>
      <div class="bubble">
        <slot>
          <div>{{ data.payload.message || '' }}</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  filters: {
    timeFilter(val) {
      return new Date(val).toLocaleString();
    },
  },
  props: {
    side: {
      type: String,
      default: 'right',
    },
    data: {
      type: Object,
      default() {
        return {
          userInfo: {
            avatar: '',
            userName: '',
          },
          timestamp: '',
          content: '',
        };
      },
    },
  },
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    imgErr(e) {
      const el = e.srcElement;
      el.src = '/default_avatar.jpg';
    },
  },
};

</script>
<style lang="scss">
.chat-bubble {
  display: flex;
  align-items: flex-start;
  padding: 0 10px;
  margin-top: 10px;
  // box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  &.right {
    flex-direction: row-reverse;
    .detail {
      align-items: flex-end;
    }
    .top {
      flex-direction: row-reverse;
    }
  }
  .avatar {
    width: 50px;
    height: 50px;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .detail {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 40%;
    margin: 0 20px;
    .top {
      display: flex;
      .name {
        margin: 0 10px;
      }
    }
    .bubble {
      padding: 10px;
      word-break: break-all;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
  }
}
</style>
