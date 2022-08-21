<template>
    <div>
        <Header></Header>
        <div class="dblog">
            <h2 class="dblog_title">{{blog.title}}</h2>
            <el-link icon="el-icon-edit" v-if="ownBlog">
                <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}" >
                    编辑
                </router-link>
            </el-link>
            <el-divider class="dblog_divider"></el-divider>
            <div class="content markdown-body" v-html="blog.content"></div>
        </div>
    </div>
</template>

<script>
    import 'github-markdown-css/github-markdown.css' // 然后添加样式markdown-body
    import Header from "../components/Header";
    export default {
        name: "BlogEdit",
        components: {Header},
        data(){
            return{
                blog:{
                    id:"",
                    title:"",
                    content:""
                },
                ownBlog:false

            }
        },
        methods:{
            getBlog(){
                const blogId = this.$route.params.blogId
                const _this = this
                this.$axios.get("/blog/"+blogId).then(res=>{
                    console.log(res)
                    console.log(res.data.data)
                    const blog = res.data.data
                    _this.blog.id = blog.id
                    _this.blog.title = blog.title
                     // _this.blog.content = blog.content
                    var MarkdownIt = require('markdown-it'),
                        md = new MarkdownIt();
                    const str = location.href.substr(0,location.href.lastIndexOf("#"));
                    const url = str.substr(str,str.lastIndexOf("/"));

                    var result = md.render(blog.content);
                    this.blog.content = result
                    _this.ownBlog = (blog.userId === _this.$store.getters.getUser.id)
                })
            }
        },
        created() {
            this.getBlog()
        }
    }
</script>

<style scoped>
    .dblog{
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        width: 100%;
        min-height: 600px;
        padding: 0 20px;
    }
    .dblog_title{
        padding-top: 25px;
    }

</style>