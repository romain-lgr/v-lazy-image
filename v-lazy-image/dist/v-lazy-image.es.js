var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { ref, reactive, computed, onMounted, onBeforeUnmount, h } from "vue";
var index = {
  props: {
    src: {
      type: String,
      required: true
    },
    srcPlaceholder: {
      type: String,
      default: "data:,"
    },
    srcset: {
      type: String
    },
    intersectionOptions: {
      type: Object,
      default: () => ({})
    },
    usePicture: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false,
  setup(props, { attrs, slots, emit }) {
    const root = ref(null);
    const state = reactive({ observer: null, intersected: false, loaded: false });
    const srcImage = computed(() => state.intersected && props.src ? props.src : props.srcPlaceholder);
    const srcsetImage = computed(() => state.intersected && props.srcset ? props.srcset : false);
    const load = () => {
      if (root.value.getAttribute("src") !== props.srcPlaceholder) {
        state.loaded = true;
        emit("load");
      }
    };
    const error = () => emit("error", root.value);
    onMounted(() => {
      if ("IntersectionObserver" in window) {
        state.observer = new IntersectionObserver((entries) => {
          const image = entries[0];
          if (image.isIntersecting) {
            state.intersected = true;
            state.observer.disconnect();
            emit("intersect");
          }
        }, props.intersectionOptions);
        state.observer.observe(root.value);
      }
    });
    onBeforeUnmount(() => {
      if ("IntersectionObserver" in window) {
        state.observer.disconnect();
      }
    });
    return () => {
      const img = h("img", __spreadProps(__spreadValues({
        ref: root,
        src: srcImage.value,
        srcset: srcsetImage.value || null
      }, attrs), {
        class: [attrs.class, "v-lazy-image", { "v-lazy-image-loaded": state.loaded }],
        onLoad: load,
        onError: error
      }));
      return props.usePicture ? h("picture", { ref: root, onLoad: load }, state.intersected ? [slots.default, img] : [img]) : img;
    };
  }
};
export { index as default };
