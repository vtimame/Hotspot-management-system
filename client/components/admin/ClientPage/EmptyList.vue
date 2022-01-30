<template>
  <div class="empty-list">
    <div class="empty-list__icon">
      <img :src="config.icon" alt="hub" />
    </div>
    <div class="empty-list__title">{{ config.title }}</div>
    <div class="empty-list__message">{{ config.message }}</div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.empty-list {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &__icon {
    width: 120px;
    height: 120px;
    margin-bottom: 0.3rem;

    img {
      width: 100%;
      height: auto;
    }
  }

  &__title {
    font-weight: 600;
  }

  &__message {
    font-size: 0.85rem;
    font-style: italic;
  }
}
</style>
