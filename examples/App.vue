<template>
  <div class="app">
    <tooltip placement="top">
      <template v-slot:title>
        <span>上上上上上</span>
      </template>
      <span style="margin-top: 100px; font-size: 32px">上上上上上</span>
    </tooltip>

    <tooltip placement="bottom">
      <template v-slot:title>
        <span>下下下下下</span>
      </template>
      <span style="margin-top: 100px; font-size: 32px">下下下下下</span>
    </tooltip>

    <tooltip placement="left" backgroundColor="#2196f3">
      <template v-slot:title>
        <span>左左左左左</span>
      </template>
      <span style="margin-top: 100px; font-size: 32px">左左左左左</span>
    </tooltip>

    <tooltip placement="right">
      <template v-slot:title>
        <span>右右右右右</span>
      </template>
      <span style="margin-top: 100px; font-size: 32px">右右右右右</span>
    </tooltip>
  </div>
</template>
<script>
export default {
  name: 'App',
};
</script>

<style lang="less" scoped>
span {
  display: inline-block;
  margin: 20px 40px;
}
</style>
