import type { LayerService } from "../services/layer";

export type LayerItem = {
  id: string;
  layer: LayerService;
  layerHeight: number;
  layerThickness: number;
  name: string;
};
