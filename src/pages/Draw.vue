<template>
    <div>
        <div id="list-header">
            <span>名单</span>
            <el-button type="danger" style="height:30px;width:60px" @click="cleanAllPerson(), load()"
                :disabled="isDrawing || !isAlowClear">清空</el-button>
        </div>
        <PersonList :personList="personList" :assignRole="false" :clearAllPerson="clearAllPerson" :isInDraw="true" />
        <ClassList :assignRole="false" :isInDraw="true" :Msg="drawMsg" />
        <div id="addPerson" ref="addPerson">
            <div id="addPersonIcon">
                <span>添加</span>
                <el-icon @click="isDrawing == true ? null : isShowPersonAdd = !isShowPersonAdd"
                    style="vertical-align:middle;" :size="20">
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
    </div>

    <!-- 团队抽奖 -->
    <div id="drawTeam">
        <el-button type="primary" round style="margin-bottom: 5px;" @click="isShowTeam = !isShowTeam">团队抽奖</el-button>
        <transition name="animate__animated animate__bounce" appear enter-active-class="animate__fadeIn"
            leave-active-class="animate__fadeOut">
            <div v-if="isShowTeam">
                <div style="align-items: center;margin-bottom: 5px;">
                    <el-button text @click="addTeam" style="width: 80px;height: 30px;border: 1px solid  #a0cfff;"
                        type="primary" around id="joinButton">加入团队</el-button>
                </div>
                <div>
                    <el-button type="primary" style="width: 80px;height: 30px;border: 1px solid  #a0cfff;" plain
                        @click="createRoom">生成邀请码</el-button>
                </div>
            </div>
        </transition>

    </div>

    <!-- excel导入 -->
    <div id="xlsx-wrap" v-if="false">
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
                <el-button class="xlsxButton" style="width: 80px;height: 30px;" type="primary" plain @click="importXLSX"
                    :disabled="isDrawing">确认导入</el-button>
            </div>
        </div>

    </div>
</template>
<script>
import { ref, reactive, onMounted, onBeforeUnmount, onBeforeUpdate, onUpdated, watch, inject } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus'
import PersonList from "./PersonList.vue"
import ClassList from "./ClassList.vue"
import { storeToRefs } from "pinia"
import { useMain } from "../store/index"
import { InfoFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
export default {

}
</script>
<script setup>

const DeveloperModel = false //开发者模式，不需要团队码直接进入团队界面

const addPerson = ref(null)
const addPersonCount = ref(0)
const isShowPersonAdd = ref(false)
const isShowPersonCount = ref(false)
const sheetJSON = reactive([])
const fileRef = ref(null)
const isShowTeam = ref(false)
const inviteCode = ref("")
const router = useRouter()
const axios = inject('$axios')

const { classStore, drawStore, userId, isDrawing, nickname, username, teamCode, isAlowClear } = storeToRefs(useMain())

const socket = inject('$socket')

const drawMsg = {
    addName: '添加奖',
    addOneName: '添加奖等',
    classTitle: '级别',
    classChooseName: '默认级别',
    selectList: [
        {
            value: 2,
            label: "一,二,三..."
        },
        {
            value: 5,
            label: "一等奖、二等奖、三等奖"
        },
        {
            value: 4,
            label: "甲,乙,丙,丁..."
        },
        {
            value: 0,
            label: "自定义"
        }],
    averageName: '平均'
}

const clearAllPerson = ref(0)
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
const addTeam = () => {
    ElMessageBox.prompt('请填写团队邀请码', '加入团队', {
        confirmButtonText: '加入',
        cancelButtonText: '取消',
    })
        .then(({ value }) => {
            // console.log(value)
            if (false) {
                router.push({
                    path: '/DrawPage',
                    state: { isManage: false, drawList:JSON.stringify(drawStore.value.classListStore) , nickname: '412312' }
                })
            } else {
                axios.post('/team',  {
                     
                        id: userId.value,
                        inviteCode: value
                    
                }).then(res => {
                    console.log(res)
                    let { isManage, drawList, nickName } = res.data.data
                    
                    teamCode.value = value
                    console.log(drawList)
                    router.replace({
                        path: '/DrawPage',
                        state: { isManage: isManage, drawList: JSON.stringify(drawList), nickname: nickName,inviteCode:value }
                        //isManage是加入团队的这个人是不是团队的管理员，我对这个要额外处理，drawlis要那个加入那个团队的抽奖的奖项设置的列表
                        //例如[{id:'一等奖',number:10}]

                    })
                    ElMessage({
                        type: 'success',
                        message: `成功加入团队`,
                    })
                }).catch(err => {
                    console.log(userId)
                    console.log(value)
                    ElMessage({
                        type: 'error',
                        message: `团队不存在或已解散`,
                    })
                })
            }

        })
        .catch(() => {
        })
}
function createRoom() {
    ElMessageBox.confirm('你确认创建团队并生成邀请码吗？之后再无法修改奖项设置')
        .then(() => {
           
            axios.post('/inviteCode',  {
                inviteCode: userId.value,
                classList: drawStore.value.classListStore,
            }).then(res => {
                inviteCode.value = userId.value
                isAlowClear.value = false
                ElMessage({
                    type: 'success',
                    message: '成功生成邀请码'
                })
                ElMessageBox.confirm(userId.value)
                    .then(() => {
                        copyCode()
                    })
                    .catch(() => {
                        copyCode()
                    })
                socket.open()
                socket.emit('inviteCode',{inviteCode:inviteCode.value})
                socket.on('Person', data => {
                    console.log('收到了')
                    personList.list.push({ id: data.username + "  " + data.nickname })
                })
                isDrawing.value = true
            }).catch(err => {
                console.log(userId.value)
            console.log(drawStore.value.classListStore)
                ElMessage({
                    type: 'error',
                    message: '你已拥有邀请码，请结束正在进行的抽奖后再试'
                })
            })
        })
        .catch(() => {
            // catch error
        })

}

function copyCode() {
    // console.log()
    navigator.clipboard.writeText(inviteCode.value).then(() => {
        ElMessage({
            message: `已将邀请码复制到粘贴板`,
            type: 'success',
        })
    },
        (err) => {
            console.log(err)
            ElMessage({
                message: `发生未知错误，复制失败`,
                type: 'error',
            })
        }
    )
}


onMounted(() => {
    // console.log("Draw的onMounted")
    document.addEventListener('click', closeAll)
    let list = JSON.parse(window.sessionStorage.getItem('drawPersonList')) == null ? [] : JSON.parse(window.sessionStorage.getItem('drawPersonList'))
    while (drawStore.value.personListStore.length) {
        drawStore.value.personListStore.pop()
    }
    personList.list = list
    list.forEach(i => {
        drawStore.value.personListStore.push(i)
    });

    list = JSON.parse(window.sessionStorage.getItem('drawClassList')) == null ? [] : JSON.parse(window.sessionStorage.getItem('drawClassList'))
    while (drawStore.value.classListStore.length) {
        drawStore.value.classListStore.pop()
    }
    list.forEach(i => {
        drawStore.value.classListStore.push(i)
    });
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    try {
        userId.value = userInfo.userId
        username.value = userInfo.username
        nickname.value = userInfo.nickname
        teamCode.value = userInfo.teamCode
        isDrawing.value = userInfo.isDrawing
    } catch (error) {

    }
    window.addEventListener("beforeunload", () => {

        window.sessionStorage.setItem('userInfo', JSON.stringify({ userId: userId.value, username: username.value, nickname: nickname.value, teamCode: teamCode.value, isDrawing: isDrawing.value }))
        window.sessionStorage.setItem('drawPersonList', JSON.stringify(drawStore.value.personListStore))
        window.sessionStorage.setItem('drawClassList', JSON.stringify(drawStore.value.classListStore))
        window.sessionStorage.setItem('classPersonList', JSON.stringify(classStore.value.personListStore))
        window.sessionStorage.setItem('classClassList', JSON.stringify(classStore.value.classListStore))
    })
})
onBeforeUnmount(() => {
    // socket.close() //需要开启
    document.removeEventListener('click', closeAll)
})
</script>
<style lang="scss" scoped>
#list-header {
    align-items: center;
    width: 200px;
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

#drawTeam {
    width: 100px;
    align-items: center;
    height: 100px;
    display: flex;
    flex-direction: column;
    top: 130px;

    #joinButton {
        &:hover {
            box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
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

    #drawTeam {
        position: fixed;
        left: 46%;
        right: 0;
        margin-left: -100px;
    }
}

@media screen and (max-width:1000px) {
    #xlsx-wrap {
        position: absolute;
        left: 580px;
    }

    #drawTeam {
        position: absolute;
        left: 450px;
    }
}
</style>