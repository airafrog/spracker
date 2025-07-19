import { Loading } from "quasar";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { ref } from "vue";

class GltfService {
  loader = new GLTFLoader();
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

      const gltf = await new Promise<GLTF>((resolve) => {
        this.loader.load(
          path,
          (gltf) => resolve(gltf),
          (xhr) => {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);

            Loading.show({
              message: `Loading GLTF model... ${percent}%`,
            });
          }
        );
      });

      return gltf;
    } finally {
      Loading.hide();
    }
  }
}

export const gltfService = new GltfService();
