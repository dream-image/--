<template>
    <div>
        <div id="list-header">
            <span>名单</span>
            <el-button type="danger" style="height:30px;width:60px" @click="cleanAllPerson(), load()">清空</el-button>
            <div>
                是否分配角色
                <el-switch v-model="assignRole" style="--el-switch-on-color: #13ce66;" inline-prompt active-text="是"
                    inactive-text="否" />
            </div>
        </div>
    </div>

    <PersonList :personList="personList" :assignRole="assignRole" :clearAllPerson="clearAllPerson" :isInDraw="false" />
    <ClassList :assignRole="assignRole" :isInDraw="false" :Msg="classMsg" />

    <div id="addPerson" ref="addPerson">
        <div id="addPersonIcon">
            <span>添加</span>
            <el-icon @click="isShowPersonAdd = !isShowPersonAdd" style="vertical-align:middle;" :size="20">
                <CirclePlus />
            </el-icon>
        </div>
        <i id="triangle" v-if="isShowPersonAdd"></i>
        <div id="addwrap" v-if="isShowPersonAdd">
            <div @click="addPersons(1)">添加一人</div>
            <div @click="isShowPersonCount = !isShowPersonCount">批量添加</div>
            <el-input-number v-if="isShowPersonCount" v-model="addPersonCount" :min="1" :step="1" @change="null"
                style="width: auto;height: 20px;" />
            <div id="personButton" v-if="isShowPersonCount">
                <el-button style="width: 45px;height: 10px;" type="primary" round
                    @click="isShowPersonCount = !isShowPersonCount">取消</el-button>
                <el-button style="width: 45px;height: 10px;" type="primary" round
                    @click="addPersons(addPersonCount), isShowPersonCount = !isShowPersonCount">确认</el-button>
            </div>
        </div>
    </div>
    <div id="xlsx-wrap">
        <div style="display: flex;flex-direction: column;justify-content:space-around;height: 250px;align-items: center;">
            <div style="display: flex;width: 210px;justify-content: space-around;">
                <el-button class="xlsxButton" style="width: 80px;height: 30px;" type="primary" plain @click="downloadXlsx">
                    <el-icon>
                        <Download />
                    </el-icon>导出模板</el-button>
                <el-button class="xlsxButton" style="width: 80px;height: 30px;" type="primary" plain @click="loadFile">
                    <el-icon>
                        <Document />
                    </el-icon>导入名单</el-button>
                <input v-show="false" ref="fileRef" type="file" @change="fileload" />
            </div>
            <div style="width: 210px;height: 170px;border: solid 1px black;text-align: left;">导入名单如下:
                <div
                    style="display: flex;flex-direction: column;width: 200px;height: 146px;overflow: auto;position: relative;left: 5px;">
                    <el-text v-for="i in sheetJSON" style="width: 180px;height: 20px;text-align: left;">
                        {{ i['名单'] }}{{ assignRole == true ? (i['角色(选填)'] == undefined ? "" : ":" + i['角色(选填)']) : "" }}
                    </el-text>
                </div>
            </div>
            <div style="display: flex;width: 210px;justify-content: space-around;">
                <el-button class="xlsxButton" style="width: 80px;height: 30px;" type="primary" plain
                    @click="cancelXLSX">取消导入</el-button>
                <el-button class="xlsxButton" style="width: 80px;height: 30px;" type="primary" plain
                    @click="importXLSX">确认导入</el-button>
            </div>
        </div>

    </div>
</template>
<script>
import { ref, reactive, onMounted, onBeforeUnmount, onBeforeUpdate, onUpdated, watch, watchEffect } from "vue"
import { ElMessage } from "element-plus"
export default {
    name: "Class"
}
</script>
<script setup>
import PersonList from "./PersonList.vue"
import ClassList from "./ClassList.vue"
import { storeToRefs } from "pinia"
import { useMain } from "../store/index"
const { classStore, drawStore, userId, username, nickname,teamCode,isDrawing } = storeToRefs(useMain())
const assignRole = ref(true)
const addPersonCount = ref(0)
const addPerson = ref(null)
const isShowPersonAdd = ref(false)
const isShowPersonCount = ref(false)
const clearAllPerson = ref(0)
const sheetJSON = reactive([])
const fileRef = ref(null)

const classMsg = {
    addName: '添加组',
    addOneName: '添加一组',
    classTitle: '分组',
    classChooseName: '默认组号(名)',
    selectList: [{
        value: 1,
        label: "1,2,3..."
    },
    {
        value: 2,
        label: "一,二,三..."
    },
    {
        value: 3,
        label: "A,B,C..."
    },
    {
        value: 4,
        label: "甲,乙,丙,丁..."
    },
    {
        value: 0,
        label: "自定义"
    }],
    averageName: '平均分组'
}


const load = () => {
    //在personList组件中对这个值进行了监视，一旦发生改变就清空列表
    clearAllPerson.value++
}

const personList = reactive({
    list: []
})

function cleanAllPerson() {
    personList.list.splice(0, personList.list.length)
}
function addPersons(number) {
    while (number--) {
        personList.list.push({ id: '', role: '' })
    }
}
function closeAll(e) {
    //这里实现点击空白处关闭所有弹出窗口
    if (!addPerson.value.contains(e.target)) {
        isShowPersonAdd.value = false;
        isShowPersonCount.value = false;
    }
}
function downloadXlsx() {
    window.open('../../public/添加模板.xlsx')
}
function loadFile() {
    fileRef.value.dispatchEvent(new MouseEvent('click'))
}
function fileload() {

    let file = fileRef.value.files[0];
    fileRef.value.value = "";
    ((file) => {
        return new Promise(function (resolve, reject) {
            let reader = new FileReader();
            reader.readAsArrayBuffer(file)
            reader.onloadend = (e) => {
                let data = e.target.result
                let workbook = XLSX.read(data, { type: 'binary' })
                resolve(workbook)
            }
        })
    })(file).then((workbook) => {
        sheetJSON.splice(0, sheetJSON.length)
        XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]).forEach(i => {
            if (i['名单'] != undefined) {
                // console.log(i['名单']!=undefined)
                sheetJSON.push(i)
            }

        })
        if (sheetJSON[0]['名单'] == undefined) {
            sheetJSON.splice(0, sheetJSON.length)
            ElMessage({
                message: `excel识别失败`,
                type: 'error',
            })
        }
        // console.log(sheetJSON)
    })

}

function cancelXLSX() {
    sheetJSON.splice(0, sheetJSON.length)
}

function importXLSX() {
    sheetJSON.forEach(i => {
        personList.list.push({ id: i['名单'] + "", role: i['角色(选填)'] == undefined ? "" : i['角色(选填)'] + "" })
    })
    sheetJSON.splice(0, sheetJSON.length)
}

onMounted(() => {
    // console.log("Class的onMounted")
    document.addEventListener('click', closeAll)
    let list = JSON.parse(window.sessionStorage.getItem('classPersonList')) == null ? [] : JSON.parse(window.sessionStorage.getItem('classPersonList'))
    while (classStore.value.personListStore.length) {
        classStore.value.personListStore.pop()
    }
    personList.list = list
    list.forEach(i => {
        classStore.value.personListStore.push(i)
    });

    list = JSON.parse(window.sessionStorage.getItem('classClassList')) == null ? [] : JSON.parse(window.sessionStorage.getItem('classClassList'))
    while (classStore.value.classListStore.length) {
        classStore.value.classListStore.pop()
    }
    list.forEach(i => {
        classStore.value.classListStore.push(i)
    });
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    try {
        userId.value = userInfo.userId
        username.value = userInfo.username
        nickname.value = userInfo.nickname
        isDrawing.value=userInfo.isDrawing
    } catch (error) {

    }
    window.addEventListener("beforeunload", () => {

        window.sessionStorage.setItem('userInfo', JSON.stringify({ userId: userId.value, username: username.value, nickname: nickname.value, teamCode: teamCode.value,isDrawing:isDrawing.value }))
        window.sessionStorage.setItem('classPersonList', JSON.stringify(classStore.value.personListStore))
        window.sessionStorage.setItem('classClassList', JSON.stringify(classStore.value.classListStore))
        window.sessionStorage.setItem('drawPersonList', JSON.stringify(drawStore.value.personListStore))
        window.sessionStorage.setItem('drawClassList', JSON.stringify(drawStore.value.classListStore))
    })
})

onBeforeUnmount(() => {

    document.removeEventListener('click', closeAll)
})


</script>
<style lang="scss" scoped>
#list-header {
    align-items: center;
    width: 300px;
    display: flex;
    justify-content: space-around;
    position: absolute;
    top: 150px;
    left: 200px;

    span {
        width: 30px;
    }
}

#addPerson {

    user-select: none; //取消鼠标点击而出现选中文字的效果
    position: absolute;
    top: 158px;
    left: 40px;
    width: 100px;

    #addPersonIcon {
        position: relative;
        right: -30px;
        cursor: pointer;

        &>i {
            color: #0d47a1;
        }

        &>i:hover {
            border-radius: 50%;
            background-image: $addIconHoverBackgroundImage;
        }
    }

    #triangle {
        width: 0;
        height: 0;
        border-bottom: 5px solid #c7e0f4;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;

        position: absolute;
        top: 20px;
        right: 0;
    }

    #addwrap {
        margin-top: 2px;
        color: #8a8886;
        background-image: linear-gradient(135deg, #f7f0ac, #acf7f0, #f0acf7);

        &>div:nth-child(2):hover,
        div:first-child:hover {
            background-image: $addHoverBackgroundImage;
        }

        div {
            border: 1px solid #fffbc7;

        }

        #personButton {
            display: flex;
            width: 100px;
            justify-content: space-around;
        }
    }
}

#xlsx-wrap {

    width: 220px;
    height: 250px;
    top: 85px;
}

@media screen and (min-width:1000px) {
    #xlsx-wrap {
        position: fixed;
        left: 50%;
        right: 0;
        padding: 0;
        margin-right: 0px;
    }
}

@media screen and (max-width:1000px) {
    #xlsx-wrap {
        position: absolute;
        left: 580px;
    }
}</style>