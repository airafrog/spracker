import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { ref } from "vue";

class GltfService {
  loader = new GLTFLoader();
  dracoLoader = new DRACOLoader();
  loading = ref(false);
  loadingPercentage = ref(0);

  constructor() {
    this.dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
    this.loader.setDRACOLoader(this.dracoLoader);
  }

  async load(path: string) {
    this.loading.value = true;
    this.loadingPercentage.value = 0;

    const gltf = await new Promise<GLTF>((resolve) => {
      this.loader.load(
        path,
        (gltf) => resolve(gltf),
        (xhr) => {
          this.loadingPercentage.value = (xhr.loaded / xhr.total) * 100;
        }
      );
    });

    this.loading.value = false;
    return gltf;
  }
}

export const gltfService = new GltfService();
