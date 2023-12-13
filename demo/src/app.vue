<script>
import { reactive, toRefs } from 'vue';
export default {
  setup() {
    const state = reactive({
      title: 'hello ',
      list: [3, 4, 5],
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<template>
  <div>
    <li v-for="item in list" :key="item">{{ item }} :: -> {{ title }}</li>
  </div>
</template>