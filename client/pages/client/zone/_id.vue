<template>
  <div class="client-zone">
    <div class="header">
      <a-tabs v-model="tab">
        <a-tab-pane key="stats" tab="Статистика подключений" />
        <a-tab-pane key="sessions" tab="Сессии" />
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
import StatsTab from '~/components/client/zone/StatsTab.vue'
import SessionsTab from '~/components/client/zone/SessionsTab.vue'

export default {
  name: 'client-zone',
  layout: 'client',
  middleware: ['client-auth'],
  data() {
    return {
      tab: 'stats',
    }
  },
  components: {
    'a-tabs': Tabs,
    'a-tab-pane': Tabs.TabPane,
    'stats-tab': StatsTab,
    'sessions-tab': SessionsTab,
  },
}
</script>

<style lang="scss">
@import '~open-color/open-color';

.client-zone {
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
