<template>
  <base-tab-pane class="client-stats">
    <empty-list
      :config="{
        icon: '/widget.svg',
        title: 'Здесь будет статистика',
        message: 'Когда-нибудь',
      }"
    />
  </base-tab-pane>
</template>

<script>
import BaseTabPane from '~/components/admin/ClientPage/BaseTabPane'
import EmptyList from '~/components/admin/ClientPage/EmptyList'
export default {
  components: { EmptyList, BaseTabPane },
}
</script>

<style lang="scss" scoped>
.client-stats {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-weight: 600;
      font-size: 1.2rem;
    }
  }
}
</style>
