<template>
    <LuckyWheel ref="myLucky" width="300px" height="300px" :prizes="prizes" :blocks="blocks" :buttons="buttons"
        @start="startCallback" @end="endCallback" />
</template>
  
<script>
import { inject } from 'vue'
import { storeToRefs } from "pinia"
import { useMain } from "../store/index"
export default {
    props: ['newdrawList', 'signal','inviteCode'],
    setup() {
        const axios = inject('$axios')
        const socket=inject('$socket')
        const { classStore, drawStore, userId, isDrawing,nickname,username } = storeToRefs(useMain())
        return {
            axios,
            userId,
            socket,
            nickname,
            username
        }
    },
    data() {
        return {
            blocks: [{ padding: '5px', background: '#ffee58' }],
            prizes: [

            ],
            buttons: [{
                radius: '35%',
                background: '#9fa8da',
                pointer: true,
                fonts: [{ text: '开始', top: '-10px' }]
            }],
        }
    },
    computed: {
        readDrawList() {
            return this.newdrawList
        },
        startSignal() {
            return this.signal
        }
    },
    watch: {
        readDrawList: {
            deep: true,
            handler(newval, oldval) {

            }
        },
        startSignal() {
            if(this.startSignal!=0)
                this.startCallback()
        }

    },
    mounted() {
        console.log(this.newdrawList)
        this.newdrawList.forEach((i, index) => {
            if (index % 2 == 0) {
                this.prizes.push({ fonts: [{ text: i.id, top: '10%' }], background: 'white', })
            } else {
                this.prizes.push({ fonts: [{ text: i.id, top: '10%' }], background: 'white', })
            }
        })
        this.prizes.push({ fonts: [{ text: '谢谢参与', top: '10%' }], background: 'white', })
    },
    methods: {
        // 点击抽奖按钮会触发star回调
        startCallback() {
            // 调用抽奖组件的play方法开始游戏
            this.$refs.myLucky.play()
            // 模拟调用接口异步抽奖
            setTimeout(() => {
                // 假设后端返回的中奖索引是0
                console.log(this.userId)
                this.axios.post('/draw', {
                    id: this.userId
                    
                }).then(res => {
                    console.log("结果如下:"+res.data)
                    this.socket.emit('redis',{username:this.username,inviteCode:this.inviteCode,nickname:this.nickname})
                    try {
                        this.prizes.forEach((i, index) => {
                            //这个要返回中奖的结果啊原来 嗯 好了
                            if (i.fonts[0].text == res.data.data) {
                                // 调用stop停止旋转并传递中奖索引
                                this.$refs.myLucky.stop(index)
                                throw new Error()
                            }
                        })
                    } catch (error) {
                        console.log(this.userId)
                    }
                })

            }, 3000)
        },
        // 抽奖结束会触发end回调
        endCallback(prize) {
            console.log(prize)
        },
    }
}
</script>