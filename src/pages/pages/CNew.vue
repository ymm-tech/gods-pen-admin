<template>
  <div class="project-edit-container">
    <div class="project-edit-errors">

    </div>
    <div class="row prepend-top-default">
      <div class="col-lg-3 profile-settings-sidebar">
        <h4 class="prepend-top-0">
          <div v-if="id">
            更新页面
          </div>
          <div v-else>
            新建页面
          </div>
        </h4>
        <div>
          <div v-if="id">
            修改自己的页面内容
          </div>
          <div v-else>
            创建的页面必须在指定的一个组里面，可以自己新建团队
          </div>
        </div>
      </div>
      <div class="col-lg-9">

        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="图标">
            <div class="headIcon">
              <img :src="form.image|defaultProject">
            </div>
            <upload accept="image" :showBtn="true" :auto="true" @uploadSuccess="uploadEnd"></upload>

          </el-form-item>
          <el-form-item label="所属项目">
            <el-select v-model="form.projectId" placeholder="请选择">
              <el-option v-for="item in myProjects" :key="item.id" :label="item.groupName+'/'+item.projectName" :value="item.id">
                <span style="float: left">{{ item.groupName+'/'+item.projectName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="页面名称" prop="name" :rules="[
                        { required: true,message: '输入1-35位页面名', trigger: 'blur'},
                        { min: 1, max: 35, message: '长度在 1 到 35 个字符', trigger: 'blur' }
                        ]">
            <el-input placeholder="页面名称" :maxlength="35" v-model="form.name">
            </el-input>
          </el-form-item>
          <el-form-item label="页面key" prop="key" :rules="[
                        { required: true,message: '输入1-35位页面名', trigger: 'blur'}
                        ]">
            <el-input placeholder="页面名称" v-model="form.key">
            </el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description" :rules="[{ required: false,message: '输入描述', trigger: 'blur'},
                                { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]">
            <el-input type="textarea" :maxlength="50" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <tags :can-add="true" :category-id="1" :tags.sync="form.tags"></tags>
          </el-form-item>
          <el-form-item label="页面类型">
            <el-select label="页面类型" v-model="form.type" placeholder="请选择">
              <el-option
                v-for="item in pageType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设为模板">
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
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .group-img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    float: right;
    position: relative;
    bottom: 5px;
  }

  .desc {
    line-height: 15px;
    color: darkred;
    margin: 5px;
    padding: 5px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 3px;
  }

  .headIcon {
    width: 150px;
    height: 250px;
    overflow: hidden;
    margin: 20px;
    background: url('/src/assets/image/header/default.png');
    background-size: 100% 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Upload from 'src/components/Upload'
  import Server from 'src/extend/Server'
  import Tags from 'src/components/Tags'
  import {mapState} from 'vuex'

  export default {
    mixins: [BasePage],
    components: {Upload, Tags},
    name: 'pages_cnew',
    props: {
      id: { // 页面id
        type: Number
      },
      info: {
        type: Object
      }
    },
    data () {
      return {
        // 一个典型列表数据格式
        loading: false,
        myProjects: [],
        form: {
          tags: [],
          id: '',
          key: '',
          name: '',
          type: '0',
          image: '',
          desc: '',
          projectId: '',
          visibilitylevel: 0
        }
      }
    },
    computed: mapState({
      pageType: state => state.Metadata.pageType
    }),
    mounted: function () {
      if (this.id) {
        this.getProjectInfo()
      }
      this.getGrops()
    },
    methods: {
      uploadEnd: function (url) {
        this.form.image = url
      },
      getProjectInfo: function () {
        Server({
          url: 'editor/pages/info',
          method: 'post',
          data: {id: this.id + ''}
        }).then((response) => {
          var data = response.data.data
          this.form = {
            id: data.id,
            key: data.key,
            image: data.image,
            type: data.type,
            desc: data.desc,
            name: data.name,
            projectId: data.projectId,
            visibilitylevel: data.visibilitylevel,
            tags: data.tags || []
          }
        })
      },
      getGrops: function () {
        Server({
          url: 'project/project',
          method: 'get',
          needLoading: true,
          params: {
            count: 100,
            start: 0
          }
        }).then((response) => {
          var data = response.data.data
          this.myProjects = data
        }).catch(() => {
        })
      },
      onSubmit: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            Server({
              url: 'editor/pages/save',
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
