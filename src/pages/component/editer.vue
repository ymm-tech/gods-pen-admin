<template>

  <div class="content-wrapper">
    <div class="flash-container flash-container-page">
    </div>
    <div class="container-fluid container-limited ">
      <div class="content">
        <div class="project-edit-container">
          <div class="project-edit-errors">

          </div>
          <div class="row prepend-top-default">
            <div class="col-lg-3 profile-settings-sidebar">
              <h4 class="prepend-top-0">
                <div v-if="id">
                  组件信息修改
                </div>
              </h4>
              <p>

                <div v-if="id">
                  组件信息修改
                </div>
              </p>
            </div>
            <div class="col-lg-9">
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="名称" prop="name">
                  <el-input placeholder="名称" disabled :maxlength="35" v-model="form.name">
                  </el-input>
                </el-form-item>
                <el-form-item label="标签">
                  <tags :category-id="categoryId" :tags.sync="form.tags"></tags>
                </el-form-item>
                <el-form-item label="描述" prop="desc" :rules="[{ required: false,message: '输入描述', trigger: 'blur'},
                                { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
                  <el-input type="textarea" :maxlength="50" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="是否公开">
                  <el-radio-group v-model="form.visibilitylevel">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loading" @click="onSubmit">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .project-edit-container {
    .scriptEditer {
      height: 400px;
    }

    .headVideo {
      width: 200px;
      height: 200px;
    }

    .headIcon {
      width: 100px;
      height: 100px;
      overflow: hidden;
      background-color: #ddd;
      border-radius: 5px;

      img {
        width: 100%;
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import Upload from 'src/components/Upload'
  import Tags from 'src/components/Tags'
  import {mapState} from 'vuex'
  import CodeEditer from 'src/components/CodeEditer'

  export default {
    mixins: [BasePage],
    components: {Upload, Tags, CodeEditer},
    data () {
      return {
        loading: false,
        id: 0,
        categoryId: 3,
        form: {
          id: 0,
          name: '',
          content: '',
          visibilitylevel: 0,
          desc: '',
          tags: []
        }
      }
    },
    computed: mapState({
    }),
    watch: {},
    mounted: function () {
      this.id = this.$route.query.id - 0
      this.getTypeList()
    },
    filters: {
      categoryDesc: function (params, typeMap) {
        return typeMap[params] && typeMap[params].desc
      }
    },
    methods: {
      uploadContentEnd: function (url) {
        this.form.content = url
      },
      uploadIconEnd: function (url) {
        this.form.icon = url
      },
      // 获取分类列表
      getTypeList: function () {
        Server({
          url: 'component/info',
          method: 'get',
          params: {
            id: this.id
          }
        }).then((res) => {
          var data = res.data.data
          this.form = data
        })
      },
      onSubmit: function () {
        var data = {}
        data.tags = this.form.tags
        data.id = this.form.id
        data.name = this.form.name
        data.desc = this.form.desc
        data.visibilitylevel = this.form.visibilitylevel
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            Server({
              url: 'component/updata',
              method: 'post',
              data: data
            }).then((response) => {
              this.loading = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
            }).catch(() => {
              this.loading = false
              this.$notify({
                itle: '警告',
                message: '修改失败',
                type: 'warning'
              })
            })
          } else {
            this.$message('信息填写错误')
            return false
          }
        })
      }
    }
  }
</script>
