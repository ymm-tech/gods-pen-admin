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
                  资源信息修改
                </div>
              </h4>
              <p>

                <div v-if="id">
                  修改资源信息
                </div>
              </p>
            </div>
            <div class="col-lg-9" v-if="form.categoryId">
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="类型">
                  <el-tag>{{form.categoryId|categoryDesc(typeMap)}}</el-tag>
                </el-form-item>

                <el-form-item v-if="categoryType!='image'" label="图标">
                  <div class="headIcon">
                    <img :src="form.icon">
                  </div>
                  <upload key="icon" accept="image" :showBtn="true" :auto="true" @uploadSuccess="uploadIconEnd"></upload>
                </el-form-item>

                <el-form-item label="名称" prop="name">
                  <el-input placeholder="名称" :maxlength="35" v-model="form.name">
                  </el-input>
                </el-form-item>

                <!-- 图片资源content 内容就是图片信息 -->
                <el-form-item label="内容">
                  <template v-if="categoryType=='image'">
                    <div class="headIcon">
                      <img :src="form.content">
                    </div>
                    <upload key="image" accept="image" :showBtn="true" :auto="true" @uploadSuccess="uploadContentEnd"></upload>
                  </template>
                  <template v-if="categoryType=='audio'">
                    <div v-if="form.content" class="headAudio">
                      <audio :src="form.content" controls />
                    </div>
                    <upload key="audio" accept="audio" :showBtn="true" :auto="true" @uploadSuccess="uploadContentEnd"></upload>
                  </template>
                  <template v-if="categoryType=='video'">
                    <video v-if="form.content" class="headVideo" :src="form.content" controls />
                    <upload key="video" accept="video" :showBtn="true" :auto="true" @uploadSuccess="uploadContentEnd"></upload>
                  </template>
                  <template v-if="categoryType=='script'">
                    <code-editer class="scriptEditer" ctype='javascript' :options="{readOnly:false}" :contents.sync='form.content'></code-editer>
                  </template>
                  <template v-if="categoryType=='combinedcomponent'">
                    <code-editer class="scriptEditer" ctype='json' :options="{readOnly:true}" :contents='JSON.stringify(JSON.parse(form.content),null,2)'></code-editer>
                  </template>
                </el-form-item>

                <el-form-item label="标签">
                  <tags :can-add="true" :category-id="form.categoryId" v-if="form.categoryId" :tags.sync="form.tags"></tags>
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
        form: {
          id: 0,
          name: '',
          icon: '',
          content: '',
          categoryId: 0,
          visibilitylevel: 0,
          desc: '',
          tags: []
        }
      }
    },
    computed: mapState({
      typeMap: state => {
        var obj = {}
        state.Categorys.filter(val => {
          obj[val.id] = val
        })
        return obj
      }, // 资源类型
      categoryType: function () {
        return this.typeMap[this.form.categoryId] && this.typeMap[this.form.categoryId].name
      },
      Categorys: state => state.Categorys
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
          url: 'editor/resources/info',
          method: 'get',
          params: {
            id: this.id
          }
        }).then((res) => {
          var data = res.data.data
          for (const key in this.form) {
            if (this.form.hasOwnProperty(key)) {
              if (data[key]) {
                this.form[key] = data[key]
              }
            }
          }
          console.log(data)
        })
      },
      onSubmit: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            Server({
              url: 'editor/resources/save',
              method: 'post',
              data: {...this.form}
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
