<template>
  <a-drawer
    :visible="visible"
    height="100%"
    width="100%"
    placement="bottom"
    :mask-closable="false"
    :closable="false"
    :body-style="{ padding: 0, height: '100%' }"
    :after-visible-change="afterVisibleChange"
  >
    <div class="page-editor">
      <div class="page-editor__body">
        <div class="page-editor__toolbar">
          <div class="page-editor__toolbar__header">
            <div class="page-editor__toolbar__title">Добавить страницу</div>
          </div>
          <div class="page-editor__toolbar__body">
            <page-editor-toolbar
              :style="{ flex: 1 }"
              :schema="page.schema"
              @onSchemaChange="onSchemaChange"
            />
            <div>
              <a-button
                type="primary"
                block
                @click="onSubmit"
                :disabled="$v.page.schema.$invalid"
                >Сохранить</a-button
              >
            </div>
          </div>
          <div class="page-editor__toolbar__footer">
            <a-button type="dashed" block @click="$emit('close')"
              >Отмена</a-button
            >
          </div>
        </div>
        <div class="page-editor__preview">
          <page-editor-frame :schema="page.schema" />
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import PageEditorPreview from '~/components/common/AuthPageEditor/PageEditorPreview'
import PageEditorToolbar from '~/components/common/AuthPageEditor/PageEditorToolbar'
import {
  CreateAuthPageMut,
  UpdateAuthPageMut,
} from '~/graphql/admin/client/auth-pages'
import {
  CreateMyAuthPageMut,
  UpdateMyAuthPageMut,
} from '~/graphql/client.graphql'
import PageEditorFrame from '~/components/common/AuthPageEditor/PageEditorFrame'

const defaultPageSchema = {
  title: '',
  textColor: '#000000',
  buttonColor: '#1890ff',
  buttonTextColor: '#ffffff',
  backgroundColor: '#ffffff',
  termsColor: '#000000',
  logoImage: null,
  backgroundImage: null,
  bannerImage: null,
  backgroundSize: 'auto',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top',
}

export default {
  data() {
    return {
      page: {
        schema: defaultPageSchema,
      },
    }
  },
  props: {
    clientId: {
      type: Number,
      required: false,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    editInstance: {
      type: Object,
      required: false,
    },
  },
  validations: {
    page: {
      schema: {
        title: { required },
        textColor: { required, maxLength: maxLength(7) },
        buttonColor: { required, maxLength: maxLength(7) },
        buttonTextColor: { required, maxLength: maxLength(7) },
        backgroundColor: { required, maxLength: maxLength(7) },
        termsColor: { required, maxLength: maxLength(7) },
        logoImage: {},
        backgroundImage: {},
        bannerImage: {},
        backgroundSize: {},
        backgroundRepeat: {},
      },
    },
  },
  methods: {
    onSchemaChange(schema) {
      this.page.schema = schema
      this.$v.page.schema.$touch()
    },
    afterVisibleChange(visible) {
      if (!visible) {
        this.schema = defaultPageSchema
        return false
      }
      if (this.editInstance) {
        this.page.schema = this.editInstance
      } else {
        this.page.schema = { ...defaultPageSchema }
        this.$v.page.schema.$touch()
      }
    },
    getMutation() {
      if (this.editInstance && this.editInstance.id) {
        return this.clientId ? UpdateAuthPageMut : UpdateMyAuthPageMut
      } else {
        return this.clientId ? CreateAuthPageMut : CreateMyAuthPageMut
      }
    },
    getVariables() {
      let {
        id,
        __typename,
        zone,
        disabledAt,
        ...inputVariables
      } = this.page.schema
      const input = this.clientId
        ? Object.assign({}, inputVariables, { clientId: this.clientId })
        : inputVariables
      console.log(this.editInstance)
      
      return (this.editInstance && this.editInstance.id)
        ? {
            id: Number(this.editInstance.id),
            input,
          }
        : { input }
    },
    async onSubmit() {
      console.log(this.getVariables())
      try {
        await this.$apollo.mutate({
          mutation: this.getMutation(),
          variables: this.getVariables(),
        })

        this.$message.success('Страница сохранена')
        this.$emit('close')
      } catch (error) {
        console.log(error)
      }
    },
  },
  components: { PageEditorFrame, PageEditorToolbar, PageEditorPreview },
}
</script>

<style lang="scss" scoped>
@import '../../../node_modules/open-color/open-color';

.page-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1rem;
  background-color: rgb(244, 247, 249);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
  }

  &__body {
    display: flex;
    flex: 1;
  }

  &__toolbar {
    width: 300px;
    min-width: 300px;
    border-radius: 5px;
    background-color: white;
    color: $oc-gray-9;
    border: 1px solid $oc-gray-3;
    margin-right: 1rem;
    display: flex;
    flex-direction: column;

    &__header,
    &__body,
    &__footer {
      padding: 0.5rem 1rem;
    }

    &__title {
      font-weight: 600;
    }

    &__header {
      border-bottom: 1px solid $oc-gray-3;
    }

    &__body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &__footer {
      border-top: 1px solid $oc-gray-3;
    }
  }

  &__preview {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
