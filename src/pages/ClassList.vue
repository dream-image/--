<template>
    <div id="addClass" ref="addClass"> <!--添加组-->
        <div id="addClassIcon">
            <span>{{ props.Msg.addName }}</span>
            <el-icon @click="isDrawing==true?null:isShowClassAdd = !isShowClassAdd" style="vertical-align:middle;" :size="20">
                <CirclePlus />
            </el-icon>
        </div>

        <i id="triangle" v-if="isShowClassAdd"></i>
        <div id="addwrap" v-if="isShowClassAdd">
            <div @click="addClasses(1)">{{ props.Msg.addOneName }}</div>
            <div @click="isShowClassCount = !isShowClassCount">批量添加</div>
            <el-input-number v-if="isShowClassCount" v-model="addClassCount" :min="1" :max="99" :step="1" @change="null"
                style="width: auto;height: 20px;" />
            <div id="ClassButton" v-if="isShowClassCount">
                <el-button style="width: 45px;height: 10px;" type="primary" round
                    @click="isShowClassCount = !isShowClassCount">取消</el-button>
                <el-button style="width: 45px;height: 10px;" type="primary" round
                    @click="addClasses(addClassCount), isShowClassCount = !isShowClassCount">确认</el-button>
            </div>
        </div>
    </div>
    <div id="classHeader" ref="classHeader">
        <div id="move">
            <div id="donghua"></div>
        </div>

        <div><!--title和清空-->
            <span>{{ props.Msg.classTitle }}</span>
            <el-button type="danger" style="height:27px;width:60px;margin-left: 10px;" @click="cleanAllClass(), load()" :disabled="isDrawing">清空
            </el-button>
        </div>
        <div><!--组号选择-->
            <span>{{ props.Msg.classChooseName }}</span>
            <el-select v-model="chooseClassName" placeholder="请选择" :disabled="isDrawing">
                <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <div> <!-- 平均分组-->
            <span>{{ props.Msg.averageName }}</span>
            <el-switch v-model="averageClass" style="--el-switch-on-color: #13ce66;width: 30px;" :disabled="isDrawing" />
        </div>
        <div style="position: relative;" v-if="!isInDraw">
            <transition name="animate__animated animate__bounce" appear enter-active-class="animate__fadeIn"
                leave-active-class="animate__fadeOut">
                <div style="width: 200px;height: 120px;position: absolute;top:-130px;left: -50px;border-radius: 15px;border: 2px solid #449cfc;"
                    v-if="isShowTip" ref="Tip">
                    <el-icon style="position: absolute;left: 0;right: 0;margin: auto;color: #ffb900;z-index:-1;"
                        :size="100">
                        <Warning />
                    </el-icon>
                    <el-icon style="position: absolute;left: 0;right: 0;margin: auto;top: 113px;color:#449cfc;" :size="20">
                        <CaretBottom />
                    </el-icon>
                    <!-- <span> &nbsp;&nbsp;&nbsp;&nbsp;是否更新人员列表数据？</span> -->
                    <span>&nbsp;&nbsp;是否初始化平均角色分配？</span>
                    <span style="font-size:smaller;">Do you want to initialize the average role assignment?</span>
                    <div
                        style="text-align: center;align-items: center;display: flex;justify-content: space-around;vertical-align: middle;">
                        <el-button style="height: 20px;width: 20px;border-radius:10px;" type="primary"
                            @click="isShowTip = !isShowTip">不</el-button>
                        <el-button style="height: 20px; width: 20px;border-radius:10px;" type="primary"
                            @click="assignRoles(), isShowTip = !isShowTip">是</el-button>
                    </div>

                </div>
            </transition>
            <div ref="AssignButtonAndList">
                <el-button type="primary" style="height: 27px;width: 100px;" @click="showAssignRole(),
                    isShowAssignRole == false ? isShowTip = !isShowTip : null,
                    isShowAssignRole = !isShowAssignRole" @click.once="assignRoles()" ref="AssignRoleUniformButton"
                    :disabled="averageClass || !props.assignRole">统一角色分配</el-button>
                <div id="assignUniform" v-if="isShowAssignRole" ref="assignUniform">
                    <div id="assignUniformList">
                        <div v-for="(i, index) in roleAssignNumber" style="height: 27px;width: 100px;"
                            class="assignRoleUniform">
                            <div @click="openRoleCount(index)">{{ i.role }}</div>
                            <transition name="animate__animated animate__bounce" appear enter-active-class="animate__fadeIn"
                                leave-active-class="animate__fadeOut">
                                <el-input-number v-if="i.isShowAssignCount" v-model="i.number" :min="0" :max="i.maxLimit"
                                    :step="1" @change="null" style="width: 100px;height: 27px;" class="assignRoleCount" />
                            </transition>

                        </div>
                    </div>

                </div>
            </div>

        </div>

        <div v-if="!isInDraw"><!--自定义角色分配-->
            <span>自定义分配角色</span>
            <el-switch v-model="customizeClass" style="--el-switch-on-color: #13ce66;width: 30px;" inline-prompt
                :active-icon="Check" :inactive-icon="Close" :disabled="switchAssignRole" />
        </div>
    </div>
    <div id="classList-wrap"> <!--class列表-->
        <ul v-infinite-scroll="load" class="infinite-list" infinite-scroll-distance='1'
            style="height: 185px;width: 720px;list-style: none;overflow: auto;">
            <div v-for="(i, index) in classList">
                <li v-if="index <= count * 5">
                    {{ updateShowListNumber(index) }}
                    <div id="classInput">
                        <span>{{ index + 1 }}</span>

                        <el-input placeholder="组号(名)" v-model.lazy="i.id" :disabled="isChangeClassName"
                            style="width: 100px;"></el-input>
                        <el-input placeholder="分配人数" v-model.lazy="i.number" :disabled="isChangeClassCount"
                            style="width: 100px;"></el-input>
                        <el-button type="danger" circle @click="deleteClass(index)" id="deleteClassButton">
                            <el-icon>
                                <Delete />
                            </el-icon>
                        </el-button>
                        <el-button v-if="isShowAssignRoleButton" style="border-radius: 10px;width: 100px !important;"
                            @click="showAssignRoleAlone(index)">分配角色</el-button>
                        <transition name="animate__animated animate__bounce" appear enter-active-class="animate__fadeIn"
                            leave-active-class="animate__fadeOut">
                            <div v-if="isShowAssignRoleAlone[index]" class="assignRoleAloneList">
                                <div v-for="(x, key, x_index) in classList[index]" style="width:100px;height: 30px;"
                                    :key="x_index" v-show="key != 'id' && key != 'number'"
                                    class="assignRoleAloneListChoice">
                                    <div>{{ key }}</div>
                                    <el-input-number v-model="classList[index][key]" :min="0" :max="99" :step="1"
                                        @change="null" style="width: 100px;height: 27px;"
                                        class="assignRoleAloneListCount" />
                                </div>

                            </div>
                        </transition>

                    </div>
                </li>

            </div>
        </ul>

    </div>
    <div style="width: 100px;height: 38px;text-align: center;
    position: absolute;
    bottom: 50px;
    left: 700px;
    border-radius: 5px;
    " id="startClassify">
        <el-button style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;width: 90px;"
            @click="startClassify" :disabled="isInDraw && isDrawing">开始{{ isInDraw==true?'抽奖':'分组' }}</el-button>
    </div>
</template>
<script>
import { ref, reactive, onMounted, watch, onBeforeUnmount, toRefs, toRef, toRaw, computed, inject, onActivated, watchEffect } from "vue"
import NTC from "../middleware/numberToChinese"
import { ElMessage, ElMessageBox } from 'element-plus'
import { Warning } from "@element-plus/icons-vue"
import { useMain } from "../store/index"
import { storeToRefs } from "pinia"
import { emitChangeClass } from "../middleware/debounce/emitChangeClass"
import { Check, Close } from '@element-plus/icons-vue'
export default {

}

</script>
<script setup>
/*
    开发者模式下，可以启用，会在页面加载时就进行计算
*/
const DeveloperModel = true

const props = defineProps(['assignRole', 'isInDraw', 'Msg'])

const isInDraw = computed(() => {
    return props.isInDraw
})

const monitorAssignRole = toRef(props, "assignRole")

const averageClass = ref(true)
const customizeClass = ref(false)
const isChangeClassName = ref(true)
const isShowClassAdd = ref(false)
const isShowClassCount = ref(false)
const addClassCount = ref(0)
const addClass = ref(null)
const classHeader = ref(null)
const isChangeClassCount = ref(false)
const classList = reactive([])
const fullPersonList = reactive([])
const { classStore, drawStore, userId,isDrawing,classResult } = storeToRefs(useMain())
const isShowAssignRole = ref(false)
const assignUniform = ref(null)
const roleList = reactive([])
const roleAssignNumber = reactive([])
const isShowTip = ref(false)
const Tip = ref(null)
const AssignRoleUniformButton = ref(null)
const AssignButtonAndList = ref(null)

const isShowAssignRoleAlone = ref([])
const isShowAssignRoleButton = ref(false)
const axios = inject("$axios")

const showListNumber = ref(0)
const switchAssignRole = ref(false)
const updateShowListNumber = (index) => {
    showListNumber.value = index + 1
}

const count = ref(1)
function load() {
    if (showListNumber.value < classList.length)
        count.value++
    else {
        while (count.value * 5 > classList.length + 5) {
            count.value--
        }
    }
}
// console.log(roleList)
//组别选择列表
const selectList = props.Msg.selectList
const tenHeavenlyStemsand = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const chooseClassName = ref()



watch(chooseClassName, async (newValue, oldValue) => {
    setEveryClassID(newValue)
})

function setEveryClassID(newValue) {
    let x
    try {

        if (isInDraw.value) {
            x = '级'
        } else {
            x = '组'
        }
        if (newValue == 1) {
            classList.forEach((i, index) => {
                i.id = index + 1
            })
            isChangeClassName.value = true
        } else if (newValue == 2) {
            classList.forEach((i, index) => {
                i.id = NTC(index + 1)
                if (index >= 98) {
                    isChangeClassName.value = true
                    throw new Error(2)
                }
            })

            isChangeClassName.value = true
        } else if (newValue == 3) {
            classList.forEach((i, index) => {
                i.id = String.fromCharCode(index + 65)
                if (index >= 25) {
                    isChangeClassName.value = true
                    throw new Error(3)
                }
            })
            isChangeClassName.value = true
        } else if (newValue == 4) {
            classList.forEach((i, index) => {
                i.id = tenHeavenlyStemsand[index]
                if (index >= 9) {
                    isChangeClassName.value = true
                    throw new Error(4)
                }
            })
            isChangeClassName.value = true
        } else if (newValue == 5) {
            classList.forEach((i, index) => {
                i.id = NTC(index + 1) + "等奖"
                if (index >= 9) {
                    isChangeClassName.value = true
                    throw new Error(5)
                }
            })
        } else if (newValue == 0 || newValue.length == 0) {
            isChangeClassName.value = false
        }
    } catch (error) {
        // console.log(typeof error.message)
        switch (error.message) {
            case '2':
                ElMessage({
                    message: `警告！${x}别为一、二、三...时不宜超过99${x}`,
                    type: 'warning',
                    showClose: true,
                })
                break;
            case '3':
                ElMessage({
                    message: `警告！${x}号为A,B,C...时不宜超过26`,
                    type: 'warning',
                    showClose: true,
                })
                break;
            case '4':
                ElMessage({
                    message: `警告！${x}号为十大天干时不宜超过10${x}`,
                    type: 'warning',
                    showClose: true,
                })
                break;
            case '5':
                ElMessage({
                    message: '警告！级别为一等奖、二等奖...时不宜超过10级',
                    type: 'warning',
                    showClose: true,
                })
                break;
        }
    }
}
watch(averageClass, async (newValue, oldValue) => {
    if (isInDraw.value && newValue) {
        calculateClassNumber()
    } else {
        if (newValue == true) {
            statisticalRoles()
            calculateClassNumber()
            isChangeClassCount.value = true
            switchAssignRole.value = true
            customizeClass.value = false
        } else {
            if (props.assignRole == true)
                isChangeClassCount.value = true
            else {
                isChangeClassCount.value = false
            }
            switchAssignRole.value = false
        }
    }

})




watchEffect(() => {
    // console.log("class");
    fullPersonList.splice(0, fullPersonList.length)
    if (isInDraw.value == false) {
        classStore.value.personListStore.forEach((i, index) => {
            if (i.id != '' && i.role != '' && props.assignRole == true) {
                fullPersonList.push(i)
                // console.log(1)
            }
            else if (i.id != '' && props.assignRole == false) {
                fullPersonList.push(i)
                // console.log(2)
            }
        });
        (emitChangeClass(() => { }, statisticalRoles, () => { }))()
    } else {
        drawStore.value.personListStore.forEach((i, index) => {
            if (i.id != '' && props.assignRole == false) {
                fullPersonList.push(i)
                // console.log(2)
            }
        });

    }

})



watch(fullPersonList, (newValue, oldValue) => {
    // console.log("fullPersonList监视")
    if (isInDraw.value) {
        (emitChangeClass(() => { }, calculateClassNumber, () => { }))()
    }
    else {
        if (monitorAssignRole)
            (emitChangeClass(statisticalRoles, assignRoles, calculateClassNumber))()
        else {
            (emitChangeClass(calculateClassNumber, () => { }, () => { }))()
        }
    }

})

//监视 是否分配角色按钮
watch(monitorAssignRole, (newValue, oldValue) => {
    if (newValue) {
        statisticalRoles()
        assignRoles()
        if (averageClass) {
            switchAssignRole.value = true

        }
        else {
            switchAssignRole.value = false
        }
    } else {
        switchAssignRole.value = true
    }
    calculateClassNumber()
})
//#############
//加入防抖操作，不然才批量价几十组就卡到我了
const classListLength = computed(() => classList.length)
watch(classList, (newValue, oldValue) => {
    // classListId.value.splice(0, classListId.value.length)
    // classList.forEach(i => {
    //     classListId.value.push(i.id)
    // })
    if (isInDraw.value) {
        drawStore.value.classListStore = classList
    }
    else {
        classStore.value.classListStore = classList
    }
    if (props.assignRole == true) {
        classList.forEach((i, index, arr) => {
            let number = 0
            for (let j in i) {
                if (j != 'id' && j != 'number' && i[j] != undefined) {
                    number += i[j]
                }
            }
            arr[index].number = number
        })
    }

})
watch(classListLength, (newValue, oldValue) => {
    if (newValue != oldValue) {
        // console.log("触发分组长度监视");
        (emitChangeClass(() => { }, calculateClassNumber, () => { }))()
        isShowAssignRoleAlone.value = (new Array(classList.length)).fill(false)
    }

})
//##################


//当右侧滚动条出现后，右移17px抵消滚动条的宽度
watch(roleList, () => {
    setTimeout(() => {
        try {
            if (roleList.length > 4) {
                assignUniform.value.style.right = "-17px"
            } else {
                assignUniform.value.style.right = "0px"
            }
        } catch (error) {
            // console.log(error)
        }
    }, 0);


})

//初始化的提示自动关闭
watch(isShowTip, (newValue, oldValue) => {
    if (newValue == true) {
        setTimeout(() => {
            if (isShowTip.value == true)
                isShowTip.value = !isShowTip.value
        }, 3000)
    }
})

//统一分配按钮的分配监视
const StringRoleAssignNumber = computed(() => {
    let x = ''
    roleAssignNumber.forEach(i => {
        x += i.number
    })
    return x
})
watch(StringRoleAssignNumber, (newValue, oldValue) => {
    if (newValue != oldValue) {
        (emitChangeClass(() => { }, () => { }, calculateClassNumber))()
    }

}, { deep: true })


watch(customizeClass, (newValue, oldValue) => {
    if (newValue == true) {
        isShowAssignRoleButton.value = true
        isShowAssignRoleAlone.value = (new Array(classList.length)).fill(false)
    } else {
        isShowAssignRoleButton.value = false

    }
})



function cleanAllClass() {
    classList.splice(0, classList.length)
}
function addClasses(number) {
    let x
    if (isInDraw.value) {
        x = '级'
    } else {
        x = '组'
    }
    while (number--) {
        if (chooseClassName.value == 1 || chooseClassName.value == undefined) {
            classList.push({ id: classList.length + 1, number: 0 })
        } else if (chooseClassName.value == 2) {
            if (classList.length <= 98) {
                classList.push({ id: NTC(classList.length + 1), number: null })
            } else {
                ElMessage({
                    message: `警告！${x}别为一、二、三...时不宜超过99${x}`,
                    type: 'warning',
                })
                break;
            }
        } else if (chooseClassName.value == 3) {
            if (classList.length <= 25) {
                classList.push({ id: String.fromCharCode(classList.length + 65), number: null })
            } else {
                ElMessage({
                    message: `警告！${x}别为A,B,C时不宜超过26${x}`,
                    type: 'warning',
                })
                break;
            }
        } else if (chooseClassName.value == 4) {
            if (classList.length <= 9) {
                classList.push({ id: tenHeavenlyStemsand[classList.length], number: null })
            } else {
                ElMessage({
                    message: `警告！${x}别为十大天干时不宜超过10组${x}`,
                    type: 'warning',
                })
                break;
            }
        } else if (chooseClassName.value == 5) {
            if (classList <= 9) {
                classList.push({ id: tenHeavenlyStemsand[classList.length], number: null })
            } else {
                ElMessage({
                    message: '警告！级别为一等奖、二等奖...时不宜超过10个级别',
                    type: 'warning',
                })
                break;
            }
        }
        else if (chooseClassName.value == 0) {
            classList.push({ id: '', number: null })
        }

    }
}
function closeAll(e) {
    //这里实现点击空白处关闭所有弹出窗口
    if (isInDraw.value == false) {
        if (!addClass.value.contains(e.target) && !AssignButtonAndList.value.contains(e.target)) {
            isShowClassAdd.value = false;
            isShowClassCount.value = false;
            isShowAssignRole.value = false
            roleAssignNumber.forEach(i => {
                i.isShowAssignCount = false
            })
        }
    } else {
        if (!addClass.value.contains(e.target)) {
            isShowClassAdd.value = false;
            isShowClassCount.value = false;
        }
    }


}

function deleteClass(index) {
    try {
        if (isInDraw.value) {
            classList.splice(index, 1);
            (emitChangeClass(() => { }, () => { }, calculateClassNumber))()
        }
        else {
            classList.splice(index, 1);
            (emitChangeClass(statisticalRoles, assignRoles, calculateClassNumber))()
        }

    } catch (error) {

    }

}


//统计角色
function statisticalRoles() {
    roleList.splice(0, roleList.length)
    // console.log(fullPersonList)
    fullPersonList.forEach((i, index) => {
        if (i.role != '') {
            // console.log(1)
            if ((new RegExp(JSON.stringify(i.role))).test(JSON.stringify(roleList))) {
                try {
                    roleList.forEach((j, index) => {
                        if (j.role == i.role) {
                            j.number++
                            throw error('over')
                        }
                    })
                } catch (e) {

                }

            } else {
                roleList.push({ role: i.role, number: 1 })
            }
        }
    })
    // console.log("statisticalRoles")
}
//平均分配角色
function assignRoles() {
    // console.log("assignRoles")
    roleAssignNumber.splice(0, roleAssignNumber.length)
    roleList.forEach((i, index) => {
        roleAssignNumber.push({ role: i.role, number: Math.ceil(i.number / classList.length), maxLimit: Math.ceil(i.number / classList.length), isShowAssignCount: false })
    })

}
//计算分组人数
function calculateClassNumber() {
    // console.trace()
    // console.log("calculateClassNumber")
    //如果没有角色分配
    if (!props.assignRole) {
        // console.log("无角色分配")
        if (classList.length != 0) {
            let number = Math.floor(fullPersonList.length / classList.length)
            classList.forEach((i, index) => {
                i.number = number
            })
            for (let i = 0; i < fullPersonList.length - number * classList.length; i++) {
                classList[i].number++
            }
        }
        isChangeClassCount.value = true
    }
    //如果有角色分配并且平均分配 
    else if (averageClass.value) {
        // console.log("有角色并且平均分配")
        classList.forEach(i => {
            i.number = 0
            for (let j of roleList) {
                i[j.role] = 0
            }
        })
        for (let j of roleList) {
            let number = Math.floor(j.number / classList.length)
            classList.forEach(n => {
                n[j.role] = number
                n.number += number
            })
            classList.forEach((n, index, arr) => {
                for (let x in n) {
                    if (!(new RegExp(x)).test(JSON.stringify(roleList)) && x != 'id') {
                        delete arr[index][x]
                    }
                }
            })
            for (let m = 0; m < j.number - number * classList.length; m++) {
                classList[m][j.role]++
                classList[m].number++
            }
        }

    }
    //如果有角色分配并且没有平均分配
    else if (!averageClass.value) {
        // console.log("有角色分配并且没有平均分配")
        classList.forEach(i => {
            i.number = 0
            for (let j of roleList) {
                i[j.role] = 0
            }
        })
        for (let j of roleAssignNumber) {
            let number = j.number
            classList.forEach(n => {
                n[j.role] = number
                n.number += number
            })
            for (let x of roleList) {
                if (x.role == j.role) {
                    for (let m = classList.length - 1, i = x.number - number * classList.length; i < 0; m--, i++) {
                        classList[m][j.role]--
                        classList[m].number--
                    }

                }
            }
        }
        classList.forEach((n, index, arr) => {
            for (let x in n) {
                // console.log(x)
                if ((!(new RegExp(x)).test(JSON.stringify(roleList)) && x != 'id')) {
                    // console.log(x == 'id')
                    delete arr[index][x]
                }
            }
        })
    }

}
function showAssignRole() {

    if (isShowAssignRole.value == false) {
        statisticalRoles()
    }


}


function showAssignRoleAlone(index) {
    if (isShowAssignRoleAlone.value[index] == false) {
        try {
            isShowAssignRoleAlone.value.forEach((i, index, arr) => {
                // console.log(i)
                if (i == true) {
                    arr[index] = false
                }

            })

        } catch (error) {

        } finally {
            isShowAssignRoleAlone.value[index] = true
        }
    }
    else {
        isShowAssignRoleAlone.value[index] = false
    }
}

function startClassify() {
    // console.log(axios)
    if (isInDraw.value) {
        ElMessageBox.confirm(
            '你确定要开始吗？开始后未加入者无法再加入',
            'Warning',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
                axios.post('/drawlot', null, {
                    params: {
                        type: 'draw',
                        id: userId,
                        isAssignRole: false,
                    }
                }).then(res => {
                    ElMessage({
                        type: 'success',
                        message: '抽奖开始！',
                    })
                    isDrawing.value=true
                }).catch(err => {
                    ElMessage({
                        type: 'error',
                        message: '抽奖已开始',
                    })
                    ElMessage({
                        type: 'error',
                        message: '你没有团队，请生成邀请码以创建团队',
                    })
                })
            })
            .catch(() => {

            })
    } else {
        axios.post('/drawlot',{

                type: 'classify',
                id: userId.value,//这里id随便填的，还没写好登录注册
                isAssignRole: monitorAssignRole.value,//是否要角色分配 值为 boolen
                classList: classList,//组列表 对象列表
                personList: fullPersonList //人员列表 对象列表
            }
        ).then(res => {
            console.log(res.data)
            classResult.value.splice(0,classResult.value.length)
            for(let i in res.data.data){
                classResult.value.push({classId:i,classPerson:res.data.data[i]})
            }
            console.log(res.data)
        }).catch(err => {

        })
    }
}

function openRoleCount(index) {

    if (roleAssignNumber[index].isShowAssignCount == true) {
        roleAssignNumber[index].isShowAssignCount = false
    } else {
        roleAssignNumber.forEach(i => {
            i.isShowAssignCount = false
        })
        roleAssignNumber[index].isShowAssignCount = true
    }

}
onActivated(() => {

})

onMounted(() => {
    // console.log("ClassList的onMounted")
    document.addEventListener('click', closeAll)
    if (isInDraw.value) {
        classHeader.value.style.width = "600px"
    }
    setTimeout(() => {
        while (classList.length) {
            classList.pop()
        }
        if (isInDraw.value) {
            drawStore.value.classListStore.forEach(i => {
                classList.push(i)
            })
        } else {
            classStore.value.classListStore.forEach(i => {
                classList.push(i)
            })
        }

    }, 500);

    // if (DeveloperModel) {
    //     classList.forEach((i, index) => {
    //         i.id = index + 1
    //     })
    //     calculateClassNumber()
    //     // let deg=0
    //     // const changeBackground=setInterval(()=>{
    //     //     classHeader.value.style.backgroundImage=`linear-gradient(${deg}deg,#fbed96,#abecd6)`
    //     //     deg+=3
    //     // },1000)
    //     // console.log(classHeader.value)
    //     setTimeout(() => {

    //         statisticalRoles()
    //     }, 1000);

    // }


})
onBeforeUnmount(() => {
    document.removeEventListener('click', closeAll)

})
</script>
<style lang="scss">
#addClass {
    user-select: none; //取消鼠标点击而出现选中文字的效果
    position: absolute;
    top: 380px;
    left: 40px;
    width: 100px;

    #addClassIcon {
        position: relative;
        right: -20px;
        cursor: pointer;

        &>i {
            color: #0d47a1;
        }

        &>i:hover {
            border-radius: 50%;
            background-image: linear-gradient(135deg, #ff75c3, #ffa647, #ffe83f, #9fff5b, #70e2ff, #cd93ff);
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
        right: 5px;
    }

    #addwrap {
        margin-top: 2px;
        color: #8a8886;
        background-image: linear-gradient(135deg, #f7f0ac, #acf7f0, #f0acf7);

        &>div:nth-child(2):hover,
        div:first-child:hover {
            background-image: linear-gradient(135deg, #ede574, #e1f5c4);
        }

        div {
            border: 1px solid #fffbc7;

        }

        #ClassButton {
            display: flex;
            width: 100px;
            justify-content: space-around;
        }

        .el-input-number {
            .el-input__inner {
                width: 15px;
            }
        }

    }
}

#classHeader {
    // border: 1px solid black;
    // background-image: linear-gradient(135deg,#ede574,#e1f5c4);
    user-select: none;
    align-items: center;
    // width: 1000px;
    $limitwith: 950px;
    text-align: center;
    overflow: visible;
    z-index: 10;
    height: 50px;
    display: flex;
    justify-content: space-around;
    position: absolute;
    top: 380px;
    left: 170px;

    #assignUniform {
        position: absolute;
        height: 110px;
        overflow: visible !important;
        // direction: rtl;
        right: 0px;
        width: inherit;
        top: 35px;

        margin: auto;

        #assignUniformList {
            right: 0;
            height: inherit;
            position: absolute;
            overflow: auto;
            width: 230px;

            // border: 1px solid black;
            .assignRoleUniform {
                background-image: $addBackgroundImage;
                text-align: center;
                align-items: center;
                line-height: 27px;
                position: relative;
                right: -110px;

                &:hover {
                    background-image: $addHoverBackgroundImage;
                }

                .assignRoleCount {
                    position: relative;
                    left: -100px;
                    top: -27px;
                }
            }


        }


    }

    #move {
        animation: 3.5s move infinite normal;
        animation-timing-function: linear;
        position: absolute;
        height: 50px;
        width: 50px;

        @keyframes move {
            0% {
                left: 0%;
            }

            100% {
                left: 90%;
            }
        }

        #donghua {
            content: '';
            position: absolute;
            background-image: url("../../public/飞龙.jfif");
            animation: go 0.4s steps(2) infinite;
            background-position: 168px 157px;
            height: 55px;
            width: 100px;
            z-index: -1;


            @keyframes go {
                0% {
                    background-position: 168px 157px;
                }

                100% {
                    background-position: 400px 157px;
                }
            }
        }
    }



    span {
        margin-right: 5px;
        line-height: 30px;
    }

    @media screen and (max-width:$limitwith) {
        width: $limitwith - 200px;
    }

    @media screen and (min-width:$limitwith) {
        width: 80%;
    }




    .el-input__wrapper {
        width: 150px;

        .el-input__suffix {
            width: 15px;
        }

        i {
            position: absolute;
            right: 10px;
        }
    }
}

#classList-wrap {

    position: absolute;
    top: 420px;
    left: 150px;
    height: 185px;
    width: 700px;
    // overflow: auto;

    #classInput {
        display: flex;
        width: 700px;
        height: 30px;
        align-items: center;
        text-align: center;
        justify-content: start;
        margin-top: 5px;

        .assignRoleAloneList {
            display: flex;
            position: relative;
            flex-direction: column;
            left: 5px;
            top: 45px;
            width: 220px;
            height: 125px;

            overflow: auto;

            .assignRoleAloneListChoice {
                text-align: center;
                line-height: 27px;
                height: 27px;
                background-image: $addBackgroundImage;

                &:hover {
                    background-image: $addHoverBackgroundImage;
                }

                .assignRoleAloneListCount {
                    position: relative;
                    left: 100px;
                    top: -27px;
                }
            }
        }

        &>span:first-child {
            margin-right: 8px;
            width: 15px;

        }

        #deleteClassButton {
            display: block;
            height: 30px;
            width: 30px;

        }
    }

    .el-input__wrapper {
        width: 108px;
        height: 30px;
    }
}

#startClassify {

    overflow: hidden;
    box-sizing: border-box;

    @keyframes change {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg)
        }
    }

    &:hover {
        border: 2px solid gold;
        // box-shadow:0 0 0 1px  var(--el-color-primary) inset !important;
    }

    &::before {
        content: '';
        align-items: center;
        width: 100px;
        height: 100px;
        background-image: conic-gradient(transparent,
                transparent,
                transparent,
                transparent,
                transparent,
                #76ff03,
                transparent,
                gold);
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border-radius: 20px;
        animation: change 4s linear infinite;
        z-index: -1;
    }

    &::after {
        content: "";
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 100px;
        height: 100px;
        background-image: conic-gradient(transparent,
                transparent,
                transparent,
                transparent,
                transparent,
                #f06292,
                transparent,
                #00ccff);
        border-radius: 20px;
        animation: change 4s linear infinite;
        animation-delay: -2s;
        z-index: -1;
    }

    .el-button {
        &:hover {
            border: #00ccff 2px solid;

            background-image: linear-gradient(135deg, #d9f2f8, #6dd5fa, #ffffff);
            opacity: 0.9;

        }
    }
}
</style>