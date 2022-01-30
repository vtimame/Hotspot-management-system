<template>
  <div class="container py-3 settings-page">
    <header class="settings-page__header">
      <div
        class="settings-page__name d-flex align-items-center"
        :style="{ paddingLeft: '0.5rem' }"
      >
        <div :style="{ marginLeft: '0.5rem' }">Настройки</div>
      </div>
    </header>
    <div class="settings-page__body">
      <div class="settings-page__tabs">
        <a-tabs v-model="currentTab">
          <a-tab-pane key="users" tab="Пользователи" />
        </a-tabs>
      </div>
      <div class="settings-page__content">
        <div class="settings-page__content-card">
          <div class="settings-page__content-card__header">
            <div class="settings-page__content-card__title">Пользователи</div>
            <a-space>
              <a-button type="dashed" size="small" @click="openUserDrawer"
                >Добавить</a-button
              >
            </a-space>
          </div>
          <div class="settings-page__content-card__body">
            <users-list @change-user="setUserInstance($event)" />
          </div>
        </div>
      </div>
    </div>
    <user-drawer
      :visible="userDrawer.visible"
      :edit-instance="userDrawer.editInstance"
      @close="closeUserDrawer"
    />
  </div>
</template>

<script>
import { Tabs } from 'ant-design-vue'
import UsersList from '~/components/admin/SettingsPage/UsersList'
import UserDrawer from '~/components/admin/SettingsPage/UserDrawer'

export default {
  name: 'amin-settings',
  layout: 'admin',
  middleware: ['user-auth'],
  data() {
    return {
      currentTab: 'users',
      userDrawer: {
        visible: false,
        editInstance: null,
      },
    }
  },
  methods: {
    openUserDrawer() {
      this.userDrawer.visible = true
    },
    closeUserDrawer() {
      this.userDrawer.visible = false
      this.userDrawer.editInstance = null
    },
    setUserInstance(user) {
      this.userDrawer.editInstance = user
      this.openUserDrawer()
    },
  },
  components: {
    UsersList,
    UserDrawer,
    'a-tabs': Tabs,
    'a-tab-pane': Tabs.TabPane,
  },
}
</script>

<style lang="scss">
@import '~open-color/open-color';
@import 'assets/scss/scrollbars';

.settings-page {
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-tabs-bar {
    margin: 0 !important;
    border-bottom: none;
    user-select: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__name {
    font-size: 1.5rem;
    font-weight: 600;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }

  &__tabs {
    padding: 0 1rem 0 1rem;
    background-color: white;
    border: 1px solid $oc-gray-3;
    margin-top: 1rem;
    border-radius: 5px 5px 0 0;
  }

  &__content {
    flex: 1;
    overflow-y: hidden;
    max-height: 100%;

    &-card {
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1rem 0.5rem 1rem;
      }

      &__title {
        font-weight: 600;
        font-size: 1.2rem;
      }

      &__body {
        flex: 1;
        max-height: 100%;
        overflow-y: auto;
        padding: 0.5rem 1rem 1rem 1rem;
        @include scrollbars(3px, $oc-gray-4);
      }
    }
  }
}
</style>
