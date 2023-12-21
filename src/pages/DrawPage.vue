<template>
    <div id="header">
        <div id="title">
            <ruby>
                抽<rp>(</rp>
                <rt>chou</rt>
                <rp>)</rp>
                签 <rp>(</rp>
                <rt>qian</rt>
                <rp>)</rp>
                系 <rp>(</rp>
                <rt>xi</rt>
                <rp>)</rp>
                统 <rp>(</rp>
                <rt>tong</rt>
                <rp>)</rp>
            </ruby>
        </div>
        <div id="userInfo">
            <img id="userPicture" src="../../public/picture.jpg" alt="抱歉，头像文件丢失" title="头像">
            <div id="userNickname" @click="isShowLogout = !isShowLogout" style="width: 50px;height: 50px;text-align: left;">
                {{ nickname }}</div>
            <div id="logout" @click="logout" v-if="isShowLogout">退出登录</div>
        </div>
    </div>
    <div id="teamName" style="position: absolute;top: 70px;left: 0;right: 0;margin: auto; font-size:x-large;">{{
        ownerNickname }}的团队
    </div>
    <el-button id="goout" type="primary" @click="goback" v-if="!isShowGoout">
        <el-icon>
            <Back />
        </el-icon>
        退出
    </el-button>
    <div id="leftInfo">
        <div style="text-align: left; width: 400px;height: 70px;overflow: auto;">
            <span>奖池剩余:</span>
            <div>
                <span v-for="(i, index) in newdrawList">
                    {{ i.id }}:{{ i.number }},
                </span>
            </div>
        </div>
        <div style="height: 200px;overflow: auto;" ref="showResult">
            <h4 v-for="(i, index) in winList" style="width: 380px;height: 30px;margin: 5px 0px;font-family: '楷书';">
                恭喜<span class="textShadow" style="margin: 2px;">{{ i.nickname }}</span>抽中了 <span class="textShadow">{{
                    i.grade }}</span>
            </h4>
        </div>
    </div>
    <div id="rightInfo" v-if="!isManage">
        <drawAnimation :newdrawList="newdrawList" style="position: absolute;right: 0;left: 0;margin: auto;" :signal="signal"
            :inviteCode="inviteCode">

        </drawAnimation>
    </div>
    <div id="rightInfo" v-if="isManage">
        <div style="border: 1px solid black;width: 380px;height: 250px;">
            <span>未抽奖名单:</span>
            <h4 v-for="i in newpersonList" style="display: inline;">
                {{ i }},
            </h4>
        </div>
        <div>已抽奖人数
            <span>{{ drawNumber }}人</span>
        </div>
    </div>
    <div v-if="!isManage">
        <el-button type="primary" plain style="position: absolute;bottom: 180px;
        background-image: linear-gradient(135deg,#fffc00,#ffffff);
        left: 0;right: 0;margin: auto;width: 100px;" @click="startDraw" :disabled="!isAlowDraw">开始抽奖</el-button>
    </div>
    <div v-if="isManage" id="userButton">
        <el-button type="danger" @click="drawOver">结束抽奖</el-button>
        <el-button type="primary">查看结果</el-button>
    </div>
</template>
<script>
import { ref, computed, onMounted, defineProps, inject, reactive, onBeforeUnmount, onBeforeMount } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from "pinia"
import { useMain } from "../store/index"
import drawAnimation from "./drawAnimation.vue"
export default {

}
</script>
<script setup>

const props = defineProps([])

const axios = inject("$axios")
const socket = inject('$socket')
const router = useRouter()
let isManage = window.history.state.isManage
let drawList = JSON.parse(window.history.state.drawList)
let ownerNickname = window.history.state.nickname
let inviteCode = window.history.state.inviteCode
const isShowLogout = ref(false)
const { nickname, userId, drawStore, teamCode, isDrawing, isAlowClear, username } = storeToRefs(useMain())
const winList = reactive([])
const showResult = ref(null)

const isShowGoout = ref(true)//生产模式下要改为false
const signal = ref(0)
const isAlowDraw = ref(true)
function logout() {
    window.sessionStorage.clear()
    router.replace({
        name: 'login'
    })
}
function goback() {

    router.replace({
        name: 'Draw'
    })

}
function startDraw() {

    isShowGoout.value = !isShowGoout.value//显示退出按钮
    signal.value++ //标记+1，标记的值会传入转盘vue组件里，里面会监视这个值，这个值发生改动说明开始抽奖，
    isAlowDraw.value = !isAlowDraw.value//将开始抽奖按钮禁用
    // setTimeout(() => {
    //     //5s后才能继续使用开始抽奖
    //     isAlowDraw.value=!isAlowDraw.value
    // }, 5000);
}
function drawOver() {
    //这里是结束的时候关闭socket



    axios.post('over')





    
    socket.emit('over', { userId: userId })
    socket.close()
    router.replace({
        name: 'Result'
    })
    isDrawing.value = false
    isAlowClear.value = true
}

const newdrawList = reactive([])
const newpersonList = ref([])
const drawNumber = ref(0)
onBeforeMount(() => {
    drawList.forEach(i => [
        newdrawList.push({ id: Object.keys(i)[0], number: parseInt(i[Object.keys(i)[0]]) })
    ])
    console.log(newdrawList)
    //这里是进入界面的时候检查socket有没有连接上，没有就再连接
    if (socket.connected == false) {
        socket.open()
        socket.emit('inviteCode', { inviteCode: inviteCode })
        setTimeout(() => {
            if (socket.connected == true) {
                console.log('join')
                socket.emit('join', { id: userId.value, nickname: nickname.value, username: username.value })
            }
        }, 1000);
    }
        socket.on('prsonNumber',data=>{
            drawNumber.value++
        })
        //我都触发合格invitecode时间了
        //这是对获奖进行监视，有获奖的会把获奖的人的数据传过来然后可以呈现
        //我存的hash结构所以查询漆面的key就可以
        socket.on('winPrize', data => {
            // console.log(socket)
            console.log('收到了')
            winList.push({ nickname: data.nickname, grade: data.grade })//需要返回中奖的人的昵称和中的奖的名字
            
            for (let i of newdrawList) {
                if (i.id == data.grade) {
                    i.number--
                    break
                }
            }
            if (showResult.value.scrollTop) {
                showResult.value.scrollTop = showResult.value.scrollHeight - 200
            }

        })


        socket.on('over', () => {
            socket.close()
        })
        if (isManage) {

            let personList = drawStore.value.personListStore
            // console.log(personList, drawStore.value)
            personList.forEach(i => {
                newpersonList.value.push(i.id)
            })
            // console.log(newpersonList.value)
            socket.on('watchList', data => {
                //这里数据返回的是已经点击抽奖的人的
                try {
                    newpersonList.value.forEach((i, index, arr) => {
                        if (i == data.username) {
                            arr.splice(index)
                            throw new Error()
                        }
                    })
                } catch (err) {

                }
            })
        }
        // console.log(socket.io.open,socket.io.emit,socket.io.on)
    })

onBeforeUnmount(() => {
    if (socket.connected) {
        socket.close()
    }
})
</script>
<style lang="scss" scoped>
#header {
    width: 100%;
    height: 50px;
    background-color: $backgroundColor;
    color: $fontColor;
    align-items: center;
    line-height: 50px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auth;
    display: flex;

    #title {
        position: relative;
        left: 50px;
        width: 150px;
        height: inherit;
        font-size: large;
    }

    #userInfo {
        display: flex;
        position: absolute;
        justify-content: center;
        right: 50px;
        cursor: pointer;

        img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        #userNickname {
            margin-left: 10px;
            height: inherit;
            vertical-align: middle;
        }

        #logout {
            position: absolute;
            top: 50px;
            // border: 1px solid black;
            background-image: linear-gradient(135deg, #8e9eab, #eef2f3);
            width: 100px;
            height: 30px;
            line-height: 30px;
            color: #8a8886;

            &:hover {
                background-image: $addHoverBackgroundImage;
            }
        }
    }
}

#goout {
    position: absolute;
    top: 70px;
    right: 200px;
}

#leftInfo {
    border: 1px solid black;
    width: 400px;
    height: 300px;
    position: absolute;
    left: 200px;
    top: 180px;
    overflow: auto;
}

#rightInfo {
    border: 1px solid black;
    width: 400px;
    height: 300px;
    position: absolute;
    left: 900px;
    top: 180px;
}

#userButton {
    position: absolute;
    bottom: 180px;
    left: 0;
    right: 0;
    margin: auto;
    width: 300px;
    display: flex;
    justify-content: space-between;
}

.textShadow {
    margin: 0;
    font-size: 15px;
    color: #ffff8d;
    text-shadow: 0px 1px 0px #c0c0c0,
        0px 2px 0px #b0b0b0,
        0px 3px 0px #a0a0a0,
        0px 4px 0px #909090,
        0px 5px 10px rgba(0, 0, 0, .9);
}</style>