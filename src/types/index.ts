import z from "zod";

export type Axis = "x" | "y" | "z";

export type CameraMode = "perspective" | "orthographic";

const zLayer = z.object({
  canvasDataUrl: z.string(),
  id: z.string(),
  height: z.number(),
  thickness: z.number(),
  name: z.string(),
});
export type Layer = z.infer<typeof zLayer>;

export const zSprackFile = z.object({
  projectName: z.string(),
  layers: z.array(zLayer),
  layerWidth: z.number(),
  layerHeight: z.number(),
  glb: z.any(), // Actually attempting to parse this crashes the browser...
});
export type SprackFile = z.infer<typeof zSprackFile>;
