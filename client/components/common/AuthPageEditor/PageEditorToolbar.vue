<template>
  <div class="toolbar">
    <div class="mb-3">
      <div class="mb-1">Заголовок</div>
      <a-input
        placeholder="Введите заголовок"
        :value="schema.title"
        @input="onChange('title', $event.target.value)"
      />
    </div>
    <div class="mb-2">
      <color-picker
        title="Цвет текста"
        :value="schema.textColor"
        @input="onChange('textColor', $event)"
      />
    </div>
    <div class="mb-2">
      <color-picker
        title="Цвет кнопки"
        :value="schema.buttonColor"
        @input="onChange('buttonColor', $event)"
      />
    </div>
    <div class="mb-2">
      <color-picker
        title="Цвет текста кнопки"
        :value="schema.buttonTextColor"
        @input="onChange('buttonTextColor', $event)"
      />
    </div>
    <div class="mb-3">
      <color-picker
        title="Цвет фона"
        :value="schema.backgroundColor"
        @input="onChange('backgroundColor', $event)"
      />
    </div>
    <div class="mb-3">
      <color-picker
        title="Цвет логотипа Oyster Telecom"
        :value="schema.termsColor"
        @input="onChange('termsColor', $event)"
      />
    </div>

    <div class="mb-2">
      <div class="mb-1">Размер фона</div>
      <a-select
        :style="{ width: '100%' }"
        :value="schema.backgroundSize"
        @change="onBackgroundSizeChange"
        
      >
        <a-select-option key="auto">Исходный</a-select-option>
        <a-select-option key="contain">По размеру</a-select-option>
        <a-select-option key="cover">Заполнить</a-select-option>
      </a-select>
    </div>

     <div class="mb-2">
      <div class="mb-1">Позиция фона</div>
      <a-select
        :style="{ width: '100%' }"
        :value="schema.backgroundPosition"
        @change="onBackgroundPositionChange"
        
      >
        <a-select-option key="top">Сверху</a-select-option>
        <a-select-option key="bottom">Снизу</a-select-option>
        <a-select-option key="center">По центру</a-select-option>
        <a-select-option key="left">Слева</a-select-option>
        <a-select-option key="right">Справа</a-select-option>
      </a-select>
    </div>

    <div class="mb-3">
      <div class="mb-1">Повторять фон</div>
      <a-select
        :style="{ width: '100%' }"
        :value="schema.backgroundRepeat"
        @change="onBackgroundRepeatChange"
      >
        <a-select-option key="no-repeat">Не повторять</a-select-option>
        <a-select-option key="repeat">Повторять</a-select-option>
        <a-select-option key="repeat-x">Повторять по X</a-select-option>
        <a-select-option key="repeat-y">Повторять по Y</a-select-option>
      </a-select>
    </div>

    <div class="mb-2">
      <a-button
        block
        @click="loadLogotype"
        :type="schema.logoImage ? 'danger' : 'default'"
      >
        <span>{{ schema.logoImage ? 'Удалить' : 'Загрузить' }} логотип</span>
      </a-button>
      <input
        hidden
        value=""
        ref="logotypeInput"
        type="file"
        @change="e => onLogotypeMessage(e.target.files[0])"
      />
    </div>
    <div class="mb-2">
      <a-button
        block
        @click="loadBackground"
        :type="schema.backgroundImage ? 'danger' : 'default'"
      >
        <span>{{ schema.backgroundImage ? 'Удалить' : 'Загрузить' }} фон</span>
      </a-button>
      <input
        hidden
        value=""
        ref="backgroundInput"
        type="file"
        @change="e => onBackgroundMessage(e.target.files[0])"
      />
    </div>
    <div class="mb-2">
      <a-button
        block
        @click="loadBanner"
        :type="schema.bannerImage ? 'danger' : 'default'"
      >
        <span>{{ schema.bannerImage ? 'Удалить' : 'Загрузить' }} банер</span>
      </a-button>
      <input
        hidden
        value=""
        ref="bannerInput"
        type="file"
        @change="e => onBannerMessage(e.target.files[0])"
      />
    </div>
  </div>
</template>

<script>
import { Select } from 'ant-design-vue'
import SketchPicker from 'vue-color/src/components/Sketch.vue'
import FIcon from '~/components/common/FIcon'
import ColorPicker from '~/components/common/AuthPageEditor/PageEditorToolbar/ColorPicker'

export default {
  props: {
    schema: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onChange(key, value) {
      this.$emit('onSchemaChange', { ...this.schema, [key]: value })
    },
    onBackgroundSizeChange(value) {
      this.onChange('backgroundSize', value)
    },
    onBackgroundPositionChange(value) {
      this.onChange('backgroundPosition', value)
    },
    onBackgroundRepeatChange(value) {
      this.onChange('backgroundRepeat', value)
    },
    loadLogotype() {
     
      if (!this.schema.logoImage) {
        this.$refs.logotypeInput.click()
      } else {
        this.onChange('logoImage', null)
      }
    },
    loadBackground() {
      if (!this.schema.backgroundImage) {
        this.$refs.backgroundInput.click()
      } else {
        this.onChange('backgroundImage', null)
      }
    },
    loadBanner() {
      if (!this.schema.bannerImage) {
        this.$refs.bannerInput.click()
      } else {
        this.onChange('bannerImage', null)
      }
    },
    // async onLogotypeSelected(event) {
    //   const res = await this.loadImage(event.target.files[0], 'logotypes')
    //   this.$refs.logotypeInput.value = ''
    //   const { folder, name } = res.data
    //   this.onChange('logoImage', `${folder}/${name}`)
    // },
    async onLogotypeMessage(img) {
      const res = await this.loadImage(img, 'logotypes')
      this.$refs.logotypeInput.value = ''
      const { folder, name } = res.data
      this.onChange('logoImage', `${folder}/${name}`)
    },
    // async onBackgroundSelected(event) {
    //   const res = await this.loadImage(
    //     event.target.files[0],
    //     'background_images'
    //   )
    //   this.$refs.backgroundInput.value = ''
    //   const { folder, name } = res.data
    //   this.onChange('backgroundImage', `${folder}/${name}`)
    // },
    async onBackgroundMessage(img) {
      const res = await this.loadImage(
        img,
        'background_images'
      )
      this.$refs.backgroundInput.value = ''
      const { folder, name } = res.data
      this.onChange('backgroundImage', `${folder}/${name}`)
    },
    // async onBannerSelected(event) {
    //   const res = await this.loadImage(event.target.files[0], 'banners')
    //   this.$refs.bannerInput.value = ''
    //   const { folder, name } = res.data
    //   this.onChange('bannerImage', `${folder}/${name}`)
    // },
    async onBannerMessage(img) {
      const res = await this.loadImage(img, 'banners')
      this.$refs.bannerInput.value = ''
      const { folder, name } = res.data
      this.onChange('bannerImage', `${folder}/${name}`)
    },
    async loadImage(file, folder) {
      try {
        const formData = new FormData()
        formData.append('folder', folder)
        formData.append('file', file)

        return this.$axios.post('stack/upload', formData, {
          headers: {
            Authorization: `Bearer ${this.$apolloHelpers.getToken()}`,
          },
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    
    window.addEventListener("message", async (e) => {
      if (e.data.type == "logotypes") {
        await this.onLogotypeMessage(e.data.file)
      }
      else if (e.data.type == "banners") {
        await this.onBannerMessage(e.data.file)
      }

    })
  },
  components: {
    ColorPicker,
    FIcon,
    SketchPicker,
    'a-select': Select,
    'a-select-option': Select.Option,
  },
}
</script>

<style lang="scss" scoped>
.toolbar {
  //
}
</style>
