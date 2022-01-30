<template>
  <base-tab-pane class="client-pages">
    <div
      slot="header"
      class="d-flex justify-content-between align-items-center"
    >
      <div class="client-pages__title">Страницы</div>
      <a-space>
        <a-button size="small" type="dashed" @click="setEditInstance(null)"
          >Добавить страницу</a-button
        >
      </a-space>
    </div>
    <empty-list
      v-if="authPages.length === 0"
      :config="{
        icon: '/fingerprint.svg',
        title: 'Здесь пока нет страниц',
        message: 'Но вы можете добавить новую!',
      }"
    />
    <pages-list
      v-if="authPages.length > 0"
      :pages="authPages"
      @on-page-select="setEditInstance($event)"
    />
    <page-editor
      :visible="pageEditor.visible"
      :edit-instance="pageEditor.editInstance"
      :clientId="clientId"
      @close="closePageEditor"
    />
  </base-tab-pane>
</template>

<script>
import {
  AuthPagesQuery,
  AuthPageAddedSub,
  AuthPageUpdatedSub,
} from '~/graphql/admin/client/auth-pages'
import BaseTabPane from '~/components/admin/ClientPage/BaseTabPane'
import EmptyList from '~/components/admin/ClientPage/EmptyList'
import PageEditor from '~/components/common/AuthPageEditor/PageEditor'
import PagesList from '~/components/common/AuthPageEditor/PagesList'
import pageEditorMixin from '~/components/common/AuthPageEditor/page-editor.mixin'

export default {
  mixins: [pageEditorMixin],
  props: {
    clientId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    authPages: [],
  }),
  mounted() {
    this.$apollo.queries.authPages.subscribeToMore({
      document: AuthPageAddedSub,
      updateQuery: (previousQueryResult, { subscriptionData }) => {
        return {
          authPages: [
            ...previousQueryResult.authPages,
            subscriptionData.data['authPageAdded'],
          ],
        }
      },
    })

    const updatedSub = this.$apollo.subscribe({
      query: AuthPageUpdatedSub,
    })

    updatedSub.subscribe({
      next: (value) => {
        this.$apollo.queries.authPages.refetch()
      },
      error(errorValue) {
        console.log(errorValue)
      },
    })
  },
  apollo: {
    authPages: {
      query: AuthPagesQuery,
      variables() {
        return {
          filter: {
            clientId: this.clientId,
          },
          input: {
            withDeleted: true,
          },
        }
      },
    },
  },
  components: { PagesList, PageEditor, EmptyList, BaseTabPane },
}
</script>

<style lang="scss" scoped>
.client-pages {
  &__title {
    font-size: 1.2rem;
    font-weight: 600;
  }
}
</style>
