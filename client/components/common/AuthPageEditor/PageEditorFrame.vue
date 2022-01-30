<template>
  <div class="page-editor-frame resizable" id="page-editor-frame">
    <iframe ref="frame" class="frame-window" :src="frameSrc" />
    <div class="resizers">
      <div class="resizer top-left"></div>
      <div class="resizer top-right"></div>
      <div class="resizer bottom-left"></div>
      <div class="resizer bottom-right"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    schema: {
      type: Object,
      required: true,
    },
  },
  methods: {
    makeResizableDiv(div) {
      const element = document.querySelector(div)
      const resizers = document.querySelectorAll(div + ' .resizer')
      const minimum_size = 20
      let original_width = 0
      let original_height = 0
      let original_x = 0
      let original_y = 0
      let original_mouse_x = 0
      let original_mouse_y = 0
      for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i]
        currentResizer.addEventListener('mousedown', function (e) {
          e.preventDefault()
          original_width = parseFloat(
            getComputedStyle(element, null)
              .getPropertyValue('width')
              .replace('px', '')
          )
          original_height = parseFloat(
            getComputedStyle(element, null)
              .getPropertyValue('height')
              .replace('px', '')
          )
          original_x = element.getBoundingClientRect().left
          original_y = element.getBoundingClientRect().top
          original_mouse_x = e.pageX
          original_mouse_y = e.pageY
          window.addEventListener('mousemove', resize)
          window.addEventListener('mouseup', stopResize)
        })

        function resize(e) {
          if (currentResizer.classList.contains('bottom-right')) {
            const width = original_width + (e.pageX - original_mouse_x)
            const height = original_height + (e.pageY - original_mouse_y)
            if (width > minimum_size) {
              element.style.width = width + 'px'
            }
            if (height > minimum_size) {
              element.style.height = height + 'px'
            }
          } else if (currentResizer.classList.contains('bottom-left')) {
            const height = original_height + (e.pageY - original_mouse_y)
            const width = original_width - (e.pageX - original_mouse_x)
            if (height > minimum_size) {
              element.style.height = height + 'px'
            }
            if (width > minimum_size) {
              element.style.width = width + 'px'
              // element.style.left =
              //   original_x + (e.pageX - original_mouse_x) + 'px'
            }
          } else if (currentResizer.classList.contains('top-right')) {
            const width = original_width + (e.pageX - original_mouse_x)
            const height = original_height - (e.pageY - original_mouse_y)
            if (width > minimum_size) {
              element.style.width = width + 'px'
            }
            if (height > minimum_size) {
              element.style.height = height + 'px'
              // element.style.top =
              //   original_y + (e.pageY - original_mouse_y) + 'px'
            }
          } else {
            const width = original_width - (e.pageX - original_mouse_x)
            const height = original_height - (e.pageY - original_mouse_y)
            if (width > minimum_size) {
              element.style.width = width + 'px'
              // element.style.left =
              //   original_x + (e.pageX - original_mouse_x) + 'px'
            }
            if (height > minimum_size) {
              element.style.height = height + 'px'
              // element.style.top =
              //   original_y + (e.pageY - original_mouse_y) + 'px'
            }
          }
        }

        function stopResize() {
          console.log("stop")
          window.removeEventListener('mousemove', resize)
        }
      }
    },
  },
  mounted() {
    this.makeResizableDiv('.resizable')
    setTimeout(() => {
      this.$refs.frame.contentWindow.postMessage({ schema: this.schema }, '*')
    })
  },
  computed: {
    frameSrc: function () {
      return `${process.env.AUTH_PAGE_URL}/preview`
    },
    frameSchema: function () {
      return this.schema
    },
  },
  watch: {
    schema: {
      deep: true,
      handler(schema) {
        const frame = this.$refs.frame
        frame.contentWindow.postMessage({ schema }, '*')
      },
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../node_modules/open-color/open-color';
.resizable {

}

.resizable .resizers{
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  box-sizing: border-box;
}

.resizable .resizers .resizer{
  width: 10px;
  height: 10px;
   /*magic to turn square into circle*/
  

  position: absolute;
}

.resizable .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  border-top: 3px solid black;
  border-left: 3px solid black;
  cursor: nwse-resize; /*resizer cursor*/
}
.resizable .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  border-top: 3px solid black;
  border-right: 3px solid black;
  cursor: nesw-resize;
}
.resizable .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  border-bottom: 3px solid black;
  border-left: 3px solid black;
  cursor: nesw-resize;
}
.resizable .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  border-bottom: 3px solid black;
  border-right: 3px solid black;
  cursor: nwse-resize;
}
.page-editor-frame {
  width: 450px;
  height: 800px;
  min-width: 450px;
  min-height: 600px;
  max-height: 90%;
  max-width: 90%;
  background-color: white;
  position: relative;
  

  .frame-window {
    border: none;
    width: 100%;
    height: 100%;
  }

  .size-switch {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 3px solid $oc-blue-5;
    border-radius: 100%;
    transition: all 0.3s;
    background-color: white;

    &:hover {
      border-color: $oc-blue-7;
    }

    &-y {
      top: -8px;
      right: calc(50% - 8px);
      cursor: row-resize;
    }

    &-x {
      right: -8px;
      bottom: calc(50% - 8px);
      cursor: col-resize;
    }
  }
}
</style>
