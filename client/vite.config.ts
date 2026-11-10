import os from "os";
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

function deviceApiBase(): string {
  const found: { address: string; score: number }[] = [];
  for (const [name, addrs] of Object.entries(os.networkInterfaces())) {
    if (/vmware|virtual|hyper-v|mihomo|wsl|loopback|vethernet|bluetooth|tun|clash|本地连接/i.test(name)) {
      continue;
    }
    for (const addr of addrs ?? []) {
      const isIPv4 = addr.family === "IPv4" || addr.family === 4;
      if (!isIPv4 || addr.internal) continue;
      let score = 0;
      if (/wlan|wi-?fi|wireless/i.test(name)) score += 100;
      if (/以太网|ethernet/i.test(name)) score += 50;
      if (addr.address.startsWith("192.168.")) score += 10;
      if (addr.address.startsWith("10.")) score += 5;
      found.push({ address: addr.address, score });
    }
  }
  found.sort((a, b) => b.score - a.score);
  return `http://${found[0]?.address ?? "127.0.0.1"}:3000/api`;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  define: {
    __DOUDING_DEVICE_API_BASE__: JSON.stringify(deviceApiBase()),
  },
});
