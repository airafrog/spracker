import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

type ExportResult = ArrayBuffer | { [key: string]: unknown };

const gltfLoader = new GLTFLoader();
const gltfExporter = new GLTFExporter();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
gltfLoader.setDRACOLoader(dracoLoader);

export async function loadGltf(path: string) {
  const gltf = await new Promise<GLTF>((resolve, reject) => {
    gltfLoader.load(
      path,
      (gltf) => resolve(gltf),
      () => {},
      (error) => reject(error)
    );
  });

  return gltf;
}

export async function exportGltf(
  value: THREE.Scene | THREE.Mesh | THREE.Object3D,
  binary: boolean
) {
  const result = await new Promise<ExportResult>((resolve, reject) => {
    gltfExporter.parse(
      value,
      (result) => resolve(result),
      (error) => reject(error),
      { binary }
    );
  });

  return result;
}
