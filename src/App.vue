
<template>
  <router-view v-slot="{ Component }">
        <keep-alive :include="DrawPage">
            <component :is="Component" />
        </keep-alive>
    </router-view>
  
</template>

<script>
</script>
<script setup>




</script>

<style lang="scss">
@font-face {
    font-family:'dm' ;
    src: url(../../public/2.woff);
}
:root{
  margin: 0;
  padding: 0;
  list-style: none;
  font-family:"dm","SF Pro SC", "SF Pro Text", "SF Pro Icons", "PingFang SC", Verdana, Arial, '微软雅黑', '宋体';
  font-size: 14px;
  box-sizing: border-box;
  .myfocus{
  box-shadow:0 0 0 1px  var(--el-color-primary) inset !important;
}
}


</style>
