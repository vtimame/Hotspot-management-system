<template>
  <div class='main-menu-item'>
    <div class='icon'>
      <i :class="icon"></i>
    </div>
    <div v-if='!compact' class='text'>
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    compact: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang='scss' scoped>
.main-menu-item {
  display: grid;
  grid-template-columns: 35px 1fr;
  grid-column-gap: 16px;
  color: white;
  height: 37px;
  align-items: center;
  transition: 0.3s;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 5px;

  &:hover {
    background-color: rgb(39,39,39);
    .text {
      color: white;
    }
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    --ggs: 1;
  }

  .text {
    font-weight: 600;
    color: rgb(134,134,138);
    transition: 0.3s;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
