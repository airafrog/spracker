import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

type ExportResult = ArrayBuffer | { [key: string]: unknown };

class GltfService {
  loader = new GLTFLoader();
  exporter = new GLTFExporter();
  dracoLoader = new DRACOLoader();

  constructor() {
    this.dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
    this.loader.setDRACOLoader(this.dracoLoader);
  }

  async load(path: string) {
    const gltf = await new Promise<GLTF>((resolve, reject) => {
      this.loader.load(
        path,
        (gltf) => resolve(gltf),
        () => {},
        (error) => reject(error)
      );
    });

    return gltf;
  }

  async export(
    value: THREE.Scene | THREE.Mesh | THREE.Object3D,
    binary: boolean
  ) {
    const result = await new Promise<ExportResult>((resolve, reject) => {
      this.exporter.parse(
        value,
        (result) => resolve(result),
        (error) => reject(error),
        { binary }
      );
    });

    return result;
  }
}

export const gltfService = new GltfService();
