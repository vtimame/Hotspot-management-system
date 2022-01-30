<template>
  <div class="client-index">
    <div class="header">
      <a-tabs v-model="tab">
        <a-tab-pane key="zones" tab="Зоны" />
        <a-tab-pane key="pages" tab="Страницы" />
      </a-tabs>
    </div>
    <div class="content">
      <transition name="tab" mode="out-in">
        <component :is="`${tab}-tab`" :key="`${tab}-tab`" />
      </transition>
    </div>
  </div>
</template>

<script>
import { Tabs } from 'ant-design-vue'
import ZonesTab from '~/components/client/ZonesTab.vue'
import PagesTab from '~/components/client/PagesTab.vue'

export default {
  name: 'client-index',
  layout: 'client',
  middleware: ['client-auth'],
  data() {
    return {
      tab: 'zones',
    }
  },
  components: {
    ZonesTab,
    PagesTab,
    'a-tabs': Tabs,
    'a-tab-pane': Tabs.TabPane,
  },
}
</script>

<style lang="scss">
@import '~open-color/open-color';

.client-index {
  border: 1px solid $oc-gray-3;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: hidden;

  .header {
    border-bottom: 1px solid $oc-gray-3;
    padding: 0 1rem;
  }

  .ant-tabs-bar {
    margin-bottom: 0;
    border-bottom: none;
  }

  .content {
    padding: 0.5rem 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }
}
</style>
