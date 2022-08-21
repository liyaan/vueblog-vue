import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'


const str = location.href.substr(0,location.href.lastIndexOf("#"));
const url = str.substr(str,str.lastIndexOf("/"));
//axios.defaults.baseURL = "http://127.0.0.1:8081";
axios.defaults.baseURL = url;
console.log();
axios.interceptors.request.use(config=>{
    return config
})

axios.interceptors.response.use(response=>{
    let res = response.data
    console.log("=================")
    console.log(res)
    console.log("=================")

    if (res.code === 0){
        return response
    }else{

        Element.Message.error(response.data.msg, {duration: 3 * 1000})
        return Promise.reject(response.data.msg)
    }
},
    error=>{
        console.log(error.response.data)
        if (error.response.data){
            error.message = error.response.data.msg
        }
        if (error.response.status ==401){
            store.commit("REMOVE_INFO")
            router.push("/login")
        }
        Element.Message.error(error.message, {duration: 3 * 1000})

        return Promise.reject(error)
    })