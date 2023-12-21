<template>
    <div id="classify">
        <span style="font-size: larger;">分组结果如下:</span>
        <div id="classPerson">
            <div v-for="i in classResult" class="everyClass">
                {{ i.classId }}
                <div v-for="j of Object.keys(i.classPerson)" class="everyPerson">
                    {{ j }}{{ i.classPerson[j] == null ? null : ':' }}{{ i.classPerson[j] }}
                </div>
            </div>
        </div>
    </div>
    <div id="draw">
        <span style="font-size: larger;">抽奖结果如下:</span>
        <div id="classPerson">
            <div v-for="i in drawResult" class="everyClass">
                {{ i.classId }}
                <div v-for="j of i.classPerson" class="everyPerson">
                    {{ j }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { onMounted, ref, inject, computed, onBeforeUnmount } from 'vue'
import { useMain } from "../store/index"
import { storeToRefs } from "pinia"
export default {

}
</script>
<script setup>
const { classResult, teamCode, userId, username, nickname, drawStore, classStore } = storeToRefs(useMain())
const axios = inject('$axios')
const drawResult = ref([])
onMounted(() => {
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    
    try {
        userId.value = userInfo.userId
        username.value = userInfo.username
        nickname.value = userInfo.nickname
        teamCode.value = userInfo.teamCode!=null?userInfo.teamCode:teamCode.value
        
        if(JSON.parse(window.sessionStorage.getItem('classResult')))
            classResult.value=JSON.parse(window.sessionStorage.getItem('classResult'))
    } catch (error) {

    }
    axios.post('/drawResult', {
            teamCode: teamCode.value
        
    }).then(res => {
        
        console.log(11111,res.data,teamCode.value)
        drawResult.value.splice(0, drawResult.value.length)
        for (let i in res.data.data) {
            drawResult.value.push({ classId: i, classPerson: res.data.data[i] })
        }
    })

    window.addEventListener("beforeunload", () => {

        window.sessionStorage.setItem('userInfo', JSON.stringify({ userId: userId.value, username: username.value, nickname: nickname.value, teamCode: teamCode.value }))
        window.sessionStorage.setItem('classResult',JSON.stringify(classResult.value))
        window.sessionStorage.setItem('drawPersonList', JSON.stringify(drawStore.value.personListStore))
        window.sessionStorage.setItem('drawClassList', JSON.stringify(drawStore.value.classListStore))
        window.sessionStorage.setItem('classPersonList', JSON.stringify(classStore.value.personListStore))
        window.sessionStorage.setItem('classClassList', JSON.stringify(classStore.value.classListStore))
    })

})
onBeforeUnmount(() => {
    console.log('触发销毁前')

})
</script>
<style lang="scss" scoped>
#classify {
    position: absolute;
    width: 700px;
    height: 300px;
    left: 170px;
    top: 120px;
    text-align: left;

    #classPerson {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
        width: 680px;
        height: 250px;
        display: flex;
        flex-direction: column;
        overflow: auto;

        .everyClass {
            display: inline-block;
            border-bottom: 1px solid gold;

            .everyPerson {
                display: inline-block;
                margin-left: 10px;
            }
        }
    }

}

#draw {
    position: absolute;
    width: 700px;
    height: 300px;
    left: 170px;
    top: 420px;
    text-align: left;

    #classPerson {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
        width: 680px;
        height: 250px;
        display: flex;
        flex-direction: column;
        overflow: auto;

        .everyClass {
            display: inline-block;
            border-bottom: 1px solid gold;

            .everyPerson {
                display: inline-block;
                margin-left: 10px;
            }
        }
    }

}</style>