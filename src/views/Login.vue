<template>
    <div>
        <el-container>
            <el-header><router-link to="/blogs">
                <img src="https://www.markerhub.com/dist/images/logo/markerhub-logo.png"
                     style="height: 60%; margin-top: 10px;">
            </router-link></el-header>
            <el-main>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="用户名称" prop="username">
                        <el-input v-model="ruleForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input  v-model="ruleForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>

            </el-main>
        </el-container>
    </div>
</template>

<script>

        export default {
            data() {
                return {
                    ruleForm: {
                        username: 'markerhub',
                        password: '111111'

                    },
                    rules: {
                        username: [
                            { required: true, message: '请输入用户名称', trigger: 'blur' },
                            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                        ],
                        password: [
                            { required: true, message: '请输入密码', trigger: 'change' },
                            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                        ]

                    }
                };
            },
            methods: {
                submitForm(formName) {
                    const _this = this;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.$axios.post("/login",this.ruleForm).then(res=>{
                                // console.log(res.headers);
                                // console.log(res);
                                const jwt = res.headers['authorization'];
                                const userinfo = res.data.data;
                                _this.$store.commit('SET_TOKEN',jwt);
                                _this.$store.commit('SET_USERINFO',userinfo);
                                // console.log(_this.$store.getters.getUser);
                                _this.$router.push("/blogs");
                            })
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                },
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                }
            }
        }
</script>

<style>
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
</style>