<template>
    <div id="list-wrap">
        <ul v-infinite-scroll="load" class="infinite-list" infinite-scroll-distance='1'
            style="height: 170px;width: 380px;list-style: none;overflow: auto;">
            <div v-for=" (p) in personList.list.length" id="personList">
                <div v-if="p<=count*10">
                                    {{ updateShowListNumber(p) }}
                    <div id="person" > 
                        <span>{{ p }}</span>
                        <div class="el-input__wrapper input" @focusin="changeFocusColor(1, $event)" style="width: 130px;"> 
                            <input type="text" class="el-input__inner" autocomplete="off" tabindex="0" :placeholder="isInDraw==true?'用户':'姓名或编号'"
                                v-model.lazy="personList.list[p - 1].id" @blur="changeFocusColor(0, $event)"
                                style="width: 130px;" :disabled="isInDraw && false" >
                        </div>
                        <transition name="animate__animated animate__bounce" appear enter-active-class="animate__fadeIn"
                            leave-active-class="animate__fadeOut">
                            <div class="el-input__wrapper input animate__fadeIn" @focusin="changeFocusColor(1, $event)"
                                v-if="props.assignRole">
                                <input type="text" class="el-input__inner " autocomplete="off" tabindex="0"
                                    placeholder="角色或身份" v-model.lazy="personList.list[p - 1].role"
                                    @blur="changeFocusColor(0, $event)">
                            </div>
                        </transition>
                        <el-button type="danger" circle @click="deletePerson(p - 1)" v-if="!isInDraw"><el-icon>
                                <Delete />
                            </el-icon></el-button>
                    </div>
                </div>
            </div>
        </ul>

    </div>
</template>
<script>
import { ref, reactive, toRaw, watch,computed } from "vue"
import { useMain } from "../store/index"
import { storeToRefs } from "pinia"
export default {

}
</script>
<script setup>
const props = defineProps(['personList', 'assignRole','clearAllPerson','isInDraw'])
const personList = reactive(props.personList)


const isInDraw=computed(()=>{
    return props.isInDraw
})

const showListNumber = ref(0)
const updateShowListNumber = (index) => {
    showListNumber.value = index
}


const count = ref(1)
function load() {
    if (showListNumber.value < personList.list.length)
        count.value++
    else {
        while(count.value*5 > personList.list.length + 5){
            count.value--
        }
        
    }
}

function deletePerson(index) {
    personList.list.splice(index, 1)
}
const store = useMain()
const { classStore,drawStore,isDrawing } = storeToRefs(store)


watch(personList, (newValue,oldValue) => {
    if(isInDraw.value){
        console.log("触发人物draw监视")
        drawStore.value.personListStore = personList.list
    }else{
        console.log("触发人物class监视")
        classStore.value.personListStore=personList.list
    }
}, { immediate: true })

const clearAllPerson = computed(()=>{
    return props.clearAllPerson
})
watch(clearAllPerson,(newValue,oldValue)=>{
    load()
})


//修改后的el-input的focus效果复刻
function changeFocusColor(model, event) {
    if (model == 1) {
        event.target.parentNode.className += " myfocus "
    } else if (model == 0) {
        event.target.parentNode.className = event.target.parentNode.className.replace(/myfocus/g, "")
    }
}

</script>
<style lang="scss" scoped>
#list-wrap {
    position: absolute;
    left: 150px;
    top:180px;
    height: 180px;
    width: 400;
    // overflow: auto;

    #personList {
        align-items: center;
        text-align: center;

        #person {
            margin-top: 5px;
            display: flex;
            width: 350px;
            height: 30px;
            justify-content: start;
            text-align: center;
            align-items: center;

            span {
                margin-right: 5px;
                width: 20px;
            }

            .input {
                width: 130px;
            }

            .el-button {
                height: inherit;
                width: 30px;
                align-items: center;

            }
        }
    }
}
</style>