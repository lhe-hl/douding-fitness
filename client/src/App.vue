<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { bindSessionReady } from "./auth/session-gate";
import { ensureWechatLogin } from "./auth/wechat-session";

bindSessionReady(ensureWechatLogin());

onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
