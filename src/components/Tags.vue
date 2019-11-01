<template>
  <div class="editerTags">

    <span class="tagWarp">

      <el-tag class="tag" v-for="(tag,key) in tags" :closable="true" :key="key" :close-transition="false" @close="handleClose(key,tag)">
        <i class="ifont icon-tag"></i>{{tag.name}}
      </el-tag>
      <el-autocomplete v-if="inputVisible" size="mini" value-key="name" v-model="inputValue" :fetch-suggestions="querySearchAsync" :maxlength="10" :minlength="1" @keyup.enter.native="handleInputConfirm" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
      <el-button v-if="canAdd&&inputBtnVisible" class="button-new-tag" size="small" @click="inputVisible = true,inputBtnVisible = false">+新标签</el-button>
    </span>
    <div>
      <h4>可快速选标签列表</h4>
      <el-tag class="tag" v-for="(tag,key) in canSelectTags" :key="key" @click.native="selectTag(tag)">
        <i class="ifont icon-tag"></i>{{tag.name}}
      </el-tag>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .editerTags {
    .input-new-tag {
      width: 150px;
    }

    .tagWarp {
    }

    .tag {
      margin: 0 10px;
      cursor: pointer;
    }
  }
</style>
<script type="text/ecmascript-6">
  /**
   * 选择图片上传组件
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import Server from '../extend/Server'

  export default {
    mixins: [BaseComponent],
    name: 'UploadImage',
    components: {},
    props: {
      tags: {
        type: Array,
        default: function (params) {
          return []
        }
      },
      categoryId: {
        type: Number
      },
      // 可添加新的标签
      canAdd: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        canSelectTags: [],
        inputVisible: false,
        inputBtnVisible: true,
        inputValue: '',
      }
    },
    watch: {

    },
    beforeDestroy: function () {
    },
    mounted: function () {
      if (this.categoryId) {
        this.loadTags()
      }
    },
    methods: {
      querySearchAsync: function (queryString, cb) {
        Server({
          url: 'editor/tags/list',
          data: {
            categoryId: this.categoryId,
            name: queryString
          },
          method: 'post'
        }).then((response) => {
          var data = response.data.data
          console.log(data)
          cb(data)
        }).catch((e) => {
        })
      },
      handleSelect (item) {
        this.selectTag(item)
        this.$nextTick(() => {
          this.inputValue = ''
        })
      },
      /**
       * 选中一个标签
       */
      selectTag: function (params) {
        var hasOne = this.tags.find(val => {
          if (val.id == params.id) {
            return true
          }
        })
        if (!hasOne) {
          this.tags.push(params)
        }
      },
      loadTags: function (params) {
        Server({
          url: 'editor/tags/list',
          data: {
            categoryId: this.categoryId,
            name: ''
          },
          method: 'post'
        }).then((response) => {
          var data = response.data.data
          this.canSelectTags = data
        }).catch((e) => {
        })
      },
      /**
       * 添加标签
       */
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (!inputValue) {
          return
        }
        Server({
          url: 'editor/tags/add',
          data: {
            categoryId: this.categoryId,
            name: inputValue
          },
          method: 'post'
        }).then((response) => {
          var data = response.data.data
          this.selectTag({id: data.id, name: inputValue})
          this.inputVisible = false
          this.inputValue = ''
          if (this.tags.length > 2) {
            this.inputBtnVisible = false
          } else {
            this.inputBtnVisible = true
          }
        }).catch((e) => {
          this.$message('标签添加失败')
        })
      },
      handleClose (key, tag) {
        this.tags.splice(this.tags.indexOf(key), 1)
        if (this.tags.length > 2) {
          this.inputBtnVisible = false
        } else {
          this.inputBtnVisible = true
        }
      },
    }
  }
</script>

