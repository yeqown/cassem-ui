<template>
  <div style="max-width: 500px; margin: 40px auto 0; text-align: center">
    <result title="创建成功" :is-success="true" />
    <a-button type="primary" @click="doOnceAgin">再创建一个</a-button>
    <a-button
      style="margin-left: 8px"
      @click="
        () => {
          this.$router.push(`/application/detail/${appId}`);
        }
      "
      >返回列表</a-button
    >
  </div>
</template>

<script>
import Result from "@/components/result/Result";
export default {
  name: "Step3",
  i18n: require("./i18n"),
  props: {
    appId: {
      type: String,
      required: true,
    },
    env: {
      type: String,
      required: true,
    },
  },
  components: { Result },
  methods: {
    doOnceAgin() {
      this.$emit("finish");
    },
  },
};
</script>

<style scoped>
</style>
