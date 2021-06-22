import DVideoPlayer from "./src/index.vue";
DVideoPlayer.install = function (Vue) {
  Vue.component(DVideoPlayer.name, DVideoPlayer);
};
export default DVideoPlayer;
