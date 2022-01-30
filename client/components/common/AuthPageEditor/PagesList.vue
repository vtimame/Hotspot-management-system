<template>
  <div class="pages-list">
    <a-table
      size="small"
      :columns="table.columns"
      :data-source="pages"
      :row-key="(record) => record.id"
    >
      <span slot="actions" slot-scope="page">
        <a-space>
          <a-button
            type="dashed"
            size="small"
            @click="$emit('on-page-select', page)"
            >Изменить</a-button
          >
          <a-button
            v-if="!page['disabledAt']"
            type="danger"
            size="small"
            @click="toggleDisabled(page)"
            :style="{ paddingLeft: '1.7rem', paddingRight: '1.7rem' }"
            >Удалить</a-button
          >
          <a-button
            v-else
            type="primary"
            size="small"
            @click="toggleDisabled(page)"
            >Восстановить</a-button
          >
        </a-space>
      </span>
      <span slot="status" slot-scope="page">
        <a-badge
          v-if="status(page) === 'error'"
          :status="status(page)"
          text="Страница удалена"
        />
        <a-badge
          v-if="status(page) === 'warning'"
          :status="status(page)"
          text="Страница не используется"
        />
        <a-badge
          v-if="status(page) === 'processing' && page.zone"
          :status="status(page)"
          :text="`Страница используется в зоне: ${page.zone.name}`"
        />
      </span>
      <span slot="authTypes" slot-scope="page">
        <span v-if="page.zone">
          <a-tag v-for="type in page.zone.authTypes" :key="type">{{
            type
          }}</a-tag>
        </span>
      </span>
    </a-table>
  </div>
</template>

<script>
import {
  DeleteAuthPageMut,
  RestoreAuthPageMut,
} from '~/graphql/admin/client/auth-pages'
import { DeleteMyAuthPageMut } from '~/graphql/client.graphql'
import SimpleThumbnail from '~/components/common/SimpleThumbnail'
import FIcon from '~/components/common/FIcon'
import { Dropdown, Menu } from 'ant-design-vue'

export default {
  props: {
    pages: {
      type: Array,
      required: true,
    },
    isClient: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      table: {
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '70px',
          },
          {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: 'Статус',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: 'Типы авторизации',
            scopedSlots: { customRender: 'authTypes' },
          },
          {
            key: 'actions',
            scopedSlots: { customRender: 'actions' },
            align: 'right',
          },
        ],
      },
    }
  },
  methods: {
    async deletePage(id) {
      try {
        await this.$apollo.mutate({
          mutation: DeleteMyAuthPageMut,
          variables: {
            id: Number(id),
          },
        })
      } catch (error) {
        console.log(error)
      }
    },
    showMessage(pageIdDisabled) {
      this.$message[pageIdDisabled ? 'success' : 'error'](
        `Страница ${pageIdDisabled ? 'восстановлена' : 'удалена'}`
      )
    },
    async toggleDisabled(page) {
      try {
        const pageIdDisabled = page['disabledAt']
        if (this.isClient && !pageIdDisabled) {
          await this.deletePage(page.id)
        } else {
          await this.$apollo.mutate({
            mutation: pageIdDisabled ? RestoreAuthPageMut : DeleteAuthPageMut,
            variables: {
              id: Number(page.id),
            },
          })
        }

        this.showMessage(pageIdDisabled)
      } catch (error) {
        console.log(error)
      }
    },
    status(page) {
      if (page['disabledAt']) return 'error'
      if (page.zone) return 'processing'
      else return 'warning'
    },
  },
  components: {
    FIcon,
    SimpleThumbnail,
    'a-dropdown': Dropdown,
    'a-menu': Menu,
    'a-menu-item': Menu.Item,
    'a-menu-divider': Menu.Divider,
  },
}
</script>
