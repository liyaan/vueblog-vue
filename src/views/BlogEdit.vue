<template>
    <div class="m-container">
        <Header></Header>
        <div class="m-content">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="摘要" prop="description">
                    <el-input type="textarea" v-model="ruleForm.description"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <mavon-editor ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel" v-model="ruleForm.content"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Header from "../components/Header";
    export default {
        name: "BlogDetail",
        components:{Header},
        data() {
            return {
                ruleForm: {
                    id:'',
                    title: '',
                    description: '',
                    content: ''
                },
                rules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur' },
                        {min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入摘要', trigger: 'change' }
                    ],
                    content: [
                        {required: true, message: '请输入内容', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const _this = this;
                        this.$axios.post("/blog/edit",this.ruleForm,{
                            headers:{
                                "Authorazation":localStorage.getItem("token")
                            }
                        }).then(res=>{
                            _this.$alert('提交成功', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    _this.$router.push("/blogs")
                                }
                            });
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            $imgAdd(pos, $file) {
                // 第一步.将图片上传到服务器.
                var formdata = new FormData();
                formdata.append('image', $file);
                formdata.append('userId',1)
                // console.log(formdata)
                // console.log($file.miniurl)
                const _this = this
                this.$axios({
                    url: '/imgpath/changePhoto',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((url) => {
                    // console.log(url.data.url)
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    // $vm.$img2Url 详情见本页末尾
                    this.$refs.md.$img2Url(pos, url.data.url);
                })
            },
            $imgDel(pos) {
                delete this.img_file[pos];
            }

        },
        created() {
            const blogId = this.$route.params.blogId
            const _this = this;
            if (blogId){
                this.$axios.get('/blog/' + blogId).then((res) => {
                    const blog = res.data.data
                    this.ruleForm.id = blog.id
                    this.ruleForm.title = blog.title
                    this.ruleForm.description = blog.description
                    this.ruleForm.content = blog.content

                })
            }
        }
    }
</script>

<style scoped>
    .m-content{
        text-align: center;
    }
</style>