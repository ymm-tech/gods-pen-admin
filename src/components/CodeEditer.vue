<template>
  <div class="codeviewer">
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .codeviewer {
    height: 100%;
    width: 100%;
  }
</style>
<script type="text/ecmascript-6">
  /**
   * 代码编辑器
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import * as monaco from 'monaco-editor'
  var debounce = require('lodash/debounce')
  export default {
    mixins: [BaseComponent],
    name: 'CodeViewer',
    props: {
      ctype: {
        type: String,
        default: 'javascript'
      },
      contents: {
        type: String,
        default: ''
      },
      // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
      options: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // 内容变化后会调用
      onChange: {
        type: Function,
        default: function () {
        }
      },
      ctrls: Boolean
    },
    editer: null,
    data: function () {
      return {
        content: '',
        mEditor: null,
        codeChangeEmitter: null
      }
    },
    watch: {
      contents: function (newVal) {
        if (this.$options.editor) {
          if (newVal != this.$options.editor.getValue()) {
            this.$options.editor.setValue(newVal || '') // editor初始化
          }
        }
      },
      ctype: function (val, old) {
        if (val != old) this.initEditer()
      }
    },
    mounted () {
      this.$nextTick(this.initEditer)
    },
    beforDestroy: function () {
      if (this.$options.editor) {
        this.$options.editor.container.remove()
      }
    },
    methods: {
      initEditer: function () {
        var that = this
        this.mEditor = monaco.editor.create(this.$el, dealOptions())
        this.mEditor.getModel().updateOptions({tabSize: 2})
        this.mEditor.onDidChangeModelContent(event => {
          that.editorChange(event)
        })
        if (this.ctrls) {
          this.mEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
            this.$emit('ctrls')
          })
        }
        this.changeContent()
        function dealOptions () {
          var type = that.ctype || 'javascript'
          return Object.assign({}, {
            language: type,
            theme: 'maliang',
            lineNumbers: type === 'javascript' ? 'on' : 'off',
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            scrollbar: {
              verticalScrollbarSize: 5,
              horizontalScrollbarSize: 5,
            }
          }, that.options || {})
        }
      },
      editorChange: function (e) {
        var that = this
        if (that.codeChangeEmitter) {
          this.codeChangeEmitter(e)
        } else {
          this.codeChangeEmitter = debounce(e => {
            var content = this.mEditor.getValue()
            that.$emit('update:contents', content)
            that.onChange(content)
          }, 500)
        }
      },
      changeContent: function () {
        this.mEditor.setValue(this.contents || '')
      }
    }
  }
</script>

