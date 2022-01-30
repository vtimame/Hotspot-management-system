<template>
  <header class="aside-header" :class="{ 'aside-header--compact': compact }">
    <div></div>
    <transition name="fade">
      <div v-if="!compact" class="aside-header__logo">H</div>
    </transition>
    <div class="d-flex justify-content-end">
      <div class="aside-header__button" @click="$emit('toggleCompact')">
        <i :class="`gg-chevron-${compact ? 'right' : 'left'}-o`"></i>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    compact: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../../assets/scss/transitions';

.aside-header {
  display: grid;
  height: 40px;
  grid-template-columns: 1fr 1fr;

  &__logo {
    position: absolute;
    background-color: rgb(40, 40, 40);
    width: 40px;
    height: 40px;
    border-radius: 3px;
    color: rgb(230, 230, 230);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 1rem;
  }

  &__button {
    color: rgb(230, 230, 230);
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(40, 40, 40);
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:hover {
      background-color: rgb(50, 50, 50);
    }

    .gg-chevron-left-o {
      --ggs: 1;
    }
  }
}
</style>
