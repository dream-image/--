<template>
    <div id="form">
        <div>抽签系统注册</div>

        <el-input id="userName" v-model="userNickname" placeholder="请输入昵称" clearable style="width: 200px;">
            <template #prefix>
                <el-icon>
                    <User />
                </el-icon>
            </template>
        </el-input>
        <el-input id="userName" v-model="userName" placeholder="请输入用户名" clearable style="width: 200px;">
            <template #prefix>
                <el-icon>
                    <User />
                </el-icon>
            </template>
        </el-input>

        <el-input class="userPasswd" v-model="userPasswd" type="password" placeholder="请输入密码" clearable
            style="width: 200px;">
            <template #prefix>
                <el-icon>
                    <Lock />
                </el-icon>
            </template>
        </el-input>
        <el-input class="userPasswd" v-model="userPasswdRepeat" type="password" placeholder="请重复密码" clearable
            style="width: 200px;">
            <template #prefix>
                <el-icon style="color:#646464;">
                    <Lock />
                </el-icon>
            </template>
        </el-input>
        <div id="button">
            <el-button type="primary" @click="signin" round>注册</el-button>
            <el-button type="primary" round @click="goout">退出</el-button>
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

        const DeveloperModel = false //开发者模式，点击注册会直接回到登陆界面

        const userNickname = ref('')
        const userName = ref("")
        const userPasswd = ref("")
        const userPasswdRepeat = ref('')
        const router = useRouter()
        const { username, nickname, userId } = storeToRefs(useMain())
        const axios = inject('$axios')

        function signin() {
            if (DeveloperModel) {
                router.replace({ name: 'login' })
            }
            else {
                axios.post('/login/register', {
                        nickname: userNickname.value,
                        username: userName.value,
                        password: userPasswd.value
                    
                }).then(res => {
                    if(res.data.code==1){
                        username.value = userName.value
                    nickname.value = userNickname.value
                    userId.value = res.data.data.id
                    router.replace({ name: 'login' })
                    }else{
                        ElMessage.error({
                            message: "用户名已存在"
                        })
                    }
                    
                }).catch(error => {
                })
            }


        }
        function goout() {
            router.push({ name: 'login' })
        }
        return {
            userName,
            userPasswd,
            signin,
            goout,
            userPasswdRepeat,
            userNickname
        }
    }
}
</script>
<style lang="scss" scoped>
#form {
    width: 300px;
    height: 260px;
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