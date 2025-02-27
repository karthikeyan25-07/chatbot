<template>
  <div class="relative">
    <div class="chat-box"></div>
  </div>
</template>
<script>
export default {
  name: "chatScreen",
};
</script>
<style scoped>
.chat-box {
  position: absolute;
  left: 1454px;
  top: 330px;
  height: 500px;
  width: 370px;
  border: 2px solid red;
  border-radius: 10px;
  /* display: none; */
}
.relative {
  position: relative;
  
}
</style>
