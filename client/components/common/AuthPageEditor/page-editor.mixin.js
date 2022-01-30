export default {
  data() {
    return {
      pageEditor: {
        visible: false,
        editInstance: null,
      },
    }
  },
  methods: {
    openPageEditor() {
      this.pageEditor.visible = true
    },
    closePageEditor() {
      this.pageEditor.visible = false
    },
    setEditInstance(page) {
      if (page) {this.pageEditor.editInstance = page}
      else {
        this.pageEditor.editInstance = {
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
      }
      console.log(page)
      this.openPageEditor()
    },
  },
}
