<template>
  <div>
    <hr>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="图标">
        <div class="headIcon">
          <img :src="form.logo|defaultGroup">
        </div>
        <upload accept="image" :showBtn="true" :auto="true" @uploadSuccess="uploadEnd"></upload>

        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="名称"
                    prop="name"
                    :rules="[{ required: true,message: '输入1-10位组名', trigger: 'blur'},
                    { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }]"

      >
        <el-input placeholder="名称" :maxlength="15"  v-model="form.name">
        </el-input>
      </el-form-item>
      <el-form-item label="描述"
                    prop="description"
                    :rules="[{ required: true,message: '输入描述', trigger: 'blur'},
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]"
      >
        <el-input type="textarea"  :maxlength="50" v-model="form.description"></el-input>
      </el-form-item>

      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <!-- <ul>
            <li>项目都是在每个具体的团队里面</li>
            <li>每个组里面可以添加多个用户，添加的用户都可以看到该组的项目</li>
            <li>项目的名称是和组名一起唯一确定项目的</li>
            <li>团队不能重复</li>
          </ul> -->

        </div>
      </div>

      <el-form-item>

        <el-button v-if="id" type="primary" @click="onSubmit">立即修改</el-button>
        <el-button v-else type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .headIcon
    width 150px
    overflow hidden
    margin 20px
    background-size 100% 100%
    img
      width: 100%
      height 100%
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import Upload from 'src/components/Upload'
  export default{
    mixins: [ BasePage ],
    components: { Upload },
    name: 'groups_cnew',
    props: {
      id: '',
      onSuccess: {
        type: Function,
        default: function () {}
      }
    },
    data () {
      return {
        info: {},
        form: {
          logo: '',
          name: '',
          description: ''
        }
      }
    },
    mounted: function () {
      if (this.id) {
        Server({
          url: 'project/groupinfo',
          method: 'get',
          params: {
            id: this.id
          }
        }).then((response) => {
          this.info = response.data.data
          this.form.logo = this.info.logo
          this.form.name = this.info.name
          this.form.description = this.info.description
        })
      }
    },
    methods: {
      uploadEnd: function (url) {
        this.form.logo = url
      },
      onSubmit: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.info.id) {
              var req = {
                logo: this.form.logo,
                name: this.form.name,
                description: this.form.description,
                id: this.info.id
              }
              Server({
                url: 'project/group',
                method: 'put',
                data: req
              }).then((response) => {
                this.$message('修改成功')
                this.onSuccess(response.data.data)
              }).catch(() => {
                this.$message('修改失败')
                this.onSuccess()
              })
            } else {
              Server({
                url: 'project/group',
                method: 'post',
                data: this.form
              }).then((response) => {
                this.$message('添加成功')
                this.onSuccess(response.data.data)
              }).catch(() => {
                this.onSuccess()
                this.$message('添加失败')
              })
            }
          } else {
            this.$message('信息填写错误')
            return false
          }
        })
      }
    }
  }
</script>
