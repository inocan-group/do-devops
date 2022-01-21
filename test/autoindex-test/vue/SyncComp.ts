import { defineComponent } from "vue";

export default defineComponent({
  emits: {
    changed: ((_evt) => {}) as (evt: any) => void,
  },
});
