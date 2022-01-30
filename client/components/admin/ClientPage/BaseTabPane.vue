<template>
  <div class="client-stats">
    <div class="client-stats__header">
      <slot name="header" />
    </div>
    <div class="client-stats__body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../node_modules/open-color/open-color';
@import '../../../assets/scss/scrollbars';

.client-stats {
  background-color: white;
  border-left: 1px solid $oc-gray-3;
  border-right: 1px solid $oc-gray-3;
  border-bottom: 1px solid $oc-gray-3;
  border-radius: 0 0 5px 5px;
  max-height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  &__header {
    padding: 0.5rem 1rem 0.25rem 1rem;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 0.25rem 1rem 0.5rem 1rem;
    @include scrollbars(3px, $oc-gray-4);
  }
}
</style>
