export type Layer = {
  canvasDataUrl: string;
  id: string;
  height: number;
  thickness: number;
  name: string;
};

export type Axis = "x" | "y" | "z";

export type CameraMode = "perspective" | "orthographic";
