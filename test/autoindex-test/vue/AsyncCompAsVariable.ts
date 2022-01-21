import { defineComponent, defineAsyncComponent } from "vue";
const c = defineComponent({
  emits: {
    changed: ((_evt) => {}) as (evt: any) => void,
  },
});

const component = defineAsyncComponent({
  loader: async () => c,
});

export default component;