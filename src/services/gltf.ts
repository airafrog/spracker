import { Loading, Notify } from "quasar";
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
    try {
      Loading.show({
        message: "Loading GLTF model... 0%",
      });

      const gltf = await new Promise<GLTF>((resolve, reject) => {
        this.loader.load(
          path,
          (gltf) => resolve(gltf),
          (xhr) => {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            Loading.show({
              message: `Loading GLTF model... ${percent}%`,
            });
          },
          (error) => reject(error)
        );
      });

      return gltf;
    } catch (error) {
      console.error(error);
      Notify.create({
        type: "negative",
        message: "Failed to load GLTF model",
      });

      throw error;
    } finally {
      Loading.hide();
    }
  }

  async export(
    value: THREE.Scene | THREE.Mesh | THREE.Object3D,
    binary: boolean
  ) {
    try {
      Loading.show({
        message: "Exporting GLTF model...",
      });

      const result = await new Promise<ExportResult>((resolve, reject) => {
        this.exporter.parse(
          value,
          (result) => resolve(result),
          (error) => reject(error),
          { binary }
        );
      });

      return result;
    } catch (error) {
      console.error(error);
      Notify.create({
        type: "negative",
        message: "Failed to export GLTF model",
      });

      throw error;
    } finally {
      Loading.hide();
    }
  }
}

export const gltfService = new GltfService();
