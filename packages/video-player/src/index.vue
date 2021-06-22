<template>
  <div class="videoPlayer">
    <div
      class="Html5Player"
      :id="playerInfo.idName"
      v-if="playerVersion === 'Html5Player'"
    ></div>
    <div
      class="ActiveX"
      :id="playerInfo.idName"
      v-if="playerVersion === 'ActiveX'"
    ></div>
  </div>
</template>
<script>
import { Browser } from "@src/utils/Browser";
export default {
  name: "DVideoPlayer",
  data() {
    return {
      playerVersion: "",
      videoPlayer: null,
    };
  },
  props: {
    playerInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mounted() {
    if (Browser().engine === "Trident") {
      this.playerVersion = "ActiveX";
    } else {
      this.playerVersion = "Html5Player";
    }
  },
  methods: {
    loadOcx() {
      var objDom = document.createElement("object");
      objDom.setAttribute("id", this.playerInfo.idName + "_ocx");
      objDom.setAttribute("name", this.playerInfo.idName + "_ocx");
      objDom.setAttribute(
        "classid",
        "CLSID:70E6DFC4-022A-4197-8125-02191A01B8C1"
      );
      objDom.setAttribute("style", "width:100%;height: 100%;");
      document.getElementById(this.playerInfo.idName).appendChild(objDom); // 添加控件object标签
      var scriptDom = document.createElement("object");
      scriptDom.setAttribute("for", this.playerInfo.idName + "_ocx");
      scriptDom.setAttribute("language", "javascript");
      scriptDom.event =
        "OnEventAndResult(type, param1, param2, param3, strParam)";
      scriptDom.appendChild(
        document.createTextNode(
          "ocxEvent.OnEventAndResult(type, param1, param2, param3, strParam)"
        )
      );
      document.body.appendChild(scriptDom); // 添加控件script标签
    },
    setOcx() {
      var _default = parseInt(this.$t("ocx.color.border.default"));
      var _background = 6312009;
      var _select = parseInt(this.$t("ocx.color.border.select"));
      var ocx = document.getElementById(this.playerInfo.idName + "_ocx");
      ocx.SetWndParam(_default, _background, _select); // 设置视频窗口颜色
      ocx.SetNetTransmitType(3); // 设置实时视频网络传输模式,同步接口
      ocx.SetWndSplit(1);
      ocx.Login(
        this.playerInfo.ocx.cmsIp,
        this.playerInfo.ocx.pcmsPort,
        this.playerInfo.ocx.username,
        this.playerInfo.ocx.password,
        0
      );
      ocx.SetOsdShow(0);
    },
    playOcxVideo() {
      var ocx = document.getElementById(this.playerInfo.idName + "_ocx");
      ocx.StopPlay(-1);
      var channelNum = this.playerInfo.channelNum - 1;
      ocx.PlayView(this.playerInfo.deviceId, channelNum, 0, ocx.GetCurSelWnd());
    },
    playH5video(url) {
      this.videoPlayer = new WasmPlayer(
        null,
        this.playerInfo.idName || "wasmPlayer",
        this.H5videoCallback,
        {
          cbUserPtr: this,
          decodeType: "auto",
          openAudio: 1,
          BigPlay: false,
          Height: true,
        }
      );
      setTimeout(() => {
        this.videoPlayer.play(url, 1);
      }, 500);
    },
    H5videoCallback(e) {
      if (e === "play") {
        this.$emit("H5videoCallback");
      }
    },
    stopVideoPlay() {
      this.$emit("stopVideoPlay");
    },
  },
};
</script>
<style lang="less" scoped>
@import "./css/index.less";
</style>
