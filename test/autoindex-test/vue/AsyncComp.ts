import { defineComponent, defineAsyncComponent } from "vue";
const c = defineComponent({
  emits: {
    changed: ((_evt) => {}) as (evt: any) => void,
  },
});

export default defineAsyncComponent({
  loader: async () => c,
});
