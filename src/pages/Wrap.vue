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
            <div id="userNickname" @click="isShowLogout=!isShowLogout" style="width: 50px;height: 50px;text-align: left;">{{ nickname }}</div>
            <div id="logout" @click="logout" v-if="isShowLogout">退出登录</div>
        </div>

    </div>
    <nav id="nav">
        <router-link ref="Class" to="/Class" replace class="nav"
            @click="changeBackground($event, Draw, Result)">分组</router-link>
        <router-link ref="Draw" to="/Draw" replace class="nav"
            @click="changeBackground($event, Class, Result)">抽奖</router-link>
        <router-link ref="Result" to="/Result" replace class="nav"
            @click="changeBackground($event, Class, Draw)">结果</router-link>
    </nav>
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>
<script>
import { ref, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { storeToRefs } from "pinia"
import { useMain } from "../store/index"
export default {
    setup() {
        const Class = ref(null)
        const Draw = ref(null)
        const Result = ref(null)
        const router = useRouter()
        const isShowLogout=ref(false)
        const { nickname } = storeToRefs(useMain())
        function logout(){
            window.sessionStorage.clear()

            router.replace({
                name:'login'
            })
        }
        function changeBackground(e, other1, other2) {
            e.target.style.backgroundImage = "linear-gradient(10deg,#abdcff,#0396ff)"
            other1.$el.style.backgroundImage = "linear-gradient(135deg,#ffeeee,#ddefbb)"
            other2.$el.style.backgroundImage = "linear-gradient(135deg,#ffeeee,#ddefbb)"
        }
        onMounted(() => {
            console.log('wrap的onMounted触发')
            //解决页面刷新导致的三个路由连接的颜色变回初始状态问题

            if (router.currentRoute.value.name =='Class') {
 
                Class.value.$el.style.backgroundImage = "linear-gradient(10deg,#abdcff,#0396ff)"
                Draw.value.$el.style.backgroundImage = "linear-gradient(135deg,#ffeeee,#ddefbb)"
                Result.value.$el.style.backgroundImage = "linear-gradient(135deg,#ffeeee,#ddefbb)"
            } else if (router.currentRoute.value.name =='Draw') {

                Draw.value.$el.style.backgroundImage = "linear-gradient(10deg,#abdcff,#0396ff)"
                Class.value.$el.style.backgroundImage = "linear-gradient(135deg,#ffeeee,#ddefbb)"
                Result.value.$el.style.backgroundImage = "linear-gradient(135deg,#ffeeee,#ddefbb)"
            } else if (router.currentRoute.value.name =='Result') {
                Result.value.$el.style.backgroundImage = "linear-gradient(10deg,#abdcff,#0396ff)"
                Draw.value.$el.style.backgroundImage = "linear-gradient(135deg,#ffeeee,#ddefbb)"
                Class.value.$el.style.backgroundImage = "linear-gradient(135deg,#ffeeee,#ddefbb)"
            }

        })
        return {
            changeBackground,
            Class,
            Draw,
            Result,
            nickname,
            logout,
            isShowLogout
        }
    }
}
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

        #userNickname {
            margin-left: 10px;
            height: inherit;
            vertical-align: middle;
        }

        #logout {
            position: absolute;
            top: 50px;
            // border: 1px solid black;
            background-image: linear-gradient(135deg,#8e9eab,#eef2f3);
            width: 100px;
            height: 30px;
            line-height: 30px;
            color: #8a8886;
            &:hover{
                background-image: $addHoverBackgroundImage;
            }
        }
    }
}

#nav {
    color: white;
    text-shadow: 1px 1px 2px white;
    position: absolute;
    left: 50px;
    top: 75px;
    box-sizing: border-box;

    &>.nav:not(:first-child) {
        background-image: $notChosenBackgroundImage;

    }

    &>.nav:first-child {
        background-image: $ChosenBackgroundImage;
    }

    .nav {
        display: inline-block;
        border: 1px solid #48dbfb;
        width: 75px;
        height: 25px;

    }
}</style>