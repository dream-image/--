<template>
    <div id="form">
        <div>抽签系统登录</div>

        <el-input id="userName" v-model="userName" placeholder="请输入用户名" clearable style="width: 200px;">
            <template #prefix>
                <el-icon>
                    <User />
                </el-icon>
            </template>
        </el-input>

        <el-input id="userPasswd" v-model="userPasswd" type="password" placeholder="请输入密码" clearable style="width: 200px;">
            <template #prefix>
                <el-icon>
                    <Lock />
                </el-icon>
            </template>
        </el-input>
        <div id="button">
            <el-button type="primary" @click="login" round>登录</el-button>
            <el-button type="primary" round @click="gotoRegister">注册</el-button>
        </div>


    </div>
</template>
<script>
import { reactive, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from "pinia"
import { useMain } from "../store/index"
import { ElMessage } from 'element-plus'
export default {
    setup() {

        const DeveloperModel = true //开发这模式，不需要用户名密码登录

        const userName = ref("")
        const userPasswd = ref("")
        const router = useRouter()
        const { username, nickname, userId } = storeToRefs(useMain())
        const axios = inject("$axios")
        function gotoRegister() {
            router.push({ name: 'Register' })
        }
        function login() {
            if (DeveloperModel) {
                router.replace({
                    name: 'Class'
                })
            } else {
                axios.post('/login', null, {
                    params: {
                        userName: userName.value,
                        password: userPasswd.value
                    }
                }).then(res => {
                    if(res.data.code==1){
                        router.replace({
                        name: 'Class'
                    })
                    console.log(res.data)
                    window.sessionStorage.setItem('userInfo',JSON.stringify({userId:res.data.data.id,nickname:res.data.data.nickname,username:userName.value}))
                    username.value = userName.value
                    nickname.value = res.data.data.nickname
                    userId.value = res.data.data.id
                    }
                    else{
                        ElMessage({
                        message: '用户名或密码错误',
                        type: 'error',
                    })
                    }
                    
                }).catch(err => {
                    
                })
            }



        }
        return {
            userName,
            userPasswd,
            login,
            gotoRegister
        }
    }
}
</script>
<style lang="scss" scoped>
#form {
    width: 300px;
    height: 300px;
    display: flex;
    font-family: 'dm';
    flex-direction: column;
    justify-content: space-around;
    // background-image: linear-gradient(135deg,#17ead9,#6078ea);
    overflow: hidden;
    align-items: center;
    border-radius: 15px;
    position: relative;

    #button {
        width: 200px;
        display: flex;
        justify-content: space-around;
    }

    &::before {
        content: "";
        width: 600;
        height: 600px;
        background-image: linear-gradient(135deg, #17ead9, #6078ea);
        position: absolute;
        align-items: center;
    }
}
</style>