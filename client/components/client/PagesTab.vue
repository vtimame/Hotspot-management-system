<template>
  <div class="pages-tab">
    <div class="pages-tab__header">
      <div class="pages-tab__title">Страницы авторизации</div>
      <a-space>
        <a-button type="dashed" size="small" @click="setEditInstance(null)"
        
          >Добавить страницу</a-button
        >
      </a-space>
    </div>
    <div class="pages-tab__body">
      <pages-list
        is-client
        :pages="myAuthPages"
        @on-page-select="prepareEditInstance($event)"
      />
    </div>
    <page-editor
      :visible="pageEditor.visible"
      :edit-instance="pageEditor.editInstance"
      @close="closePageEditor"
    />
  </div>
</template>

<script>
import PageEditor from '~/components/common/AuthPageEditor/PageEditor'
import pageEditorMixin from '~/components/common/AuthPageEditor/page-editor.mixin'
import PagesList from '~/components/common/AuthPageEditor/PagesList'
import { AuthPagesQuery } from '~/graphql/client.graphql'
import {
  AuthPageAddedSub,
  AuthPageUpdatedSub,
  AuthPageDeletedSub,
  AuthPageRestoredSub,
} from '~/graphql/admin/client/auth-pages'

export default {
  mixins: [pageEditorMixin],
  data() {
    return {
      myAuthPages: [],
      subs: {
        addedSub: null,
        updatedSub: null,
        deletedSub: null,
        restoredSub: null,
      },
    }
  },
  mounted() {
    this.subs.addedSub = this.$apollo.subscribe({ query: AuthPageAddedSub })
    this.subs.updatedSub = this.$apollo.subscribe({ query: AuthPageUpdatedSub })
    this.subs.deletedSub = this.$apollo.subscribe({ query: AuthPageDeletedSub })
    this.subs.restoredSub = this.$apollo.subscribe({
      query: AuthPageRestoredSub,
    })

    this.subs.addedSub.subscribe({ next: () => this.reFetchPages() })
    this.subs.updatedSub.subscribe({ next: () => this.reFetchPages() })
    this.subs.deletedSub.subscribe({ next: () => this.reFetchPages() })
    this.subs.restoredSub.subscribe({ next: () => this.reFetchPages() })
  },
  apollo: {
    myAuthPages: {
      query: AuthPagesQuery,
    },
  },
  computed: {
    client: function () {
      return this.$store.getters['client/instance']
    },
  },
  methods: {
    reFetchPages() {
      this.$apollo.queries.myAuthPages.refetch()
    },
    prepareEditInstance(page) {
      const { zone, ...editInstance } = page
      this.setEditInstance(editInstance)
    },
  },
  components: {
    PagesList,
    PageEditor,
  },
}
</script>

<style lang="scss" scoped>
.pages-tab {
  flex: 1;
  max-height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-weight: 600;
    font-size: 1.2rem;
  }

  &__body {
    flex: 1;
    max-height: 100%;
    overflow-y: auto;
    margin-top: 0.5rem;
  }
}
</style>
