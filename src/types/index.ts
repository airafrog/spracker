import type { Ref } from "vue";

export type Layer = {
  id: string;
  name: string;
  height: Ref<number>;
};
