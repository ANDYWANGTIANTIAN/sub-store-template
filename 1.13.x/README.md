# sing-box 1.13 模板设计

本目录以 sing-box **1.13** 为唯一目标版本。`sing-box.json` 面向通用客户端并提供地区自动测速组，`iphone.json` 保留 Apple 客户端的精简手动组；同名 JavaScript 会把 Sub-Store 产出的节点注入空策略组。裸 JSON 中的空策略组因此不是可独立运行的最终配置。

## 路由流水线

规则按以下顺序执行，越靠前优先级越高：

1. **协议识别与 DNS 劫持**：先执行 `sniff`，再用 `hijack-dns` 接管 53 端口或已识别为 DNS 的流量。规则动作替代了 1.13 已移除的旧 `dns` 特殊出站和旧入站探测字段。
2. **基础安全边界**：私有地址、BitTorrent 和 1.13 新支持的 `icmp` 网络直连。ICMP 不再依赖旧版本无法表达的旁路行为。
3. **用户模式优先**：Clash `Global` / `Direct` 模式在内容分流前生效。
4. **域名优先分流**：广告直接拒绝；流媒体、AI、开发、支付等服务进入独立选择器；Steam 中国区优先直连；其后依次处理非中国域名和中国域名。域名命中后不必等待 DNS，既快又能避免仅凭 CDN IP 误判。
5. **按需解析与 IP 兜底**：只有前述域名规则未命中时才执行 `resolve`，随后匹配 Telegram、Google、Netflix 和中国 IP。最后交给“漏网之鱼”，不使用不可见的隐式直连。

没有继续沿用“禁用全部 QUIC/UDP 443”的规则：现代代理可以承载 UDP，强制回退 TCP 会损失 HTTP/3 能力。也移除了 TUN 层的中国 IP 排除；否则数据包会在进入 sing-box 路由器之前被内核旁路，使服务选择器和 Global 模式无法接管。

## DNS 设计

* `local`（AliDNS UDP）只负责加密 DNS 服务器的域名引导，消除递归依赖。
* 中国域名由 `domestic`（AliDNS DoH）解析；其规则位于 FakeIP 之前，因此能返回真实地址并配合中国 IP 兜底。
* 其余 A/AAAA 查询使用 FakeIP，保留域名上下文，提升 TUN 分流确定性；非地址记录最终经默认代理访问 `foreign`（Google DoH）。
* Apple Intelligence 使用独立的 `apple-intelligence` 规则集并优先进入“🧠 AI”，避免被更宽泛的 Apple 规则提前分流。
* 广告域名在 DNS 和连接路由两层拒绝。缓存按上游隔离，避免同一问题在国内、国外和 FakeIP 结果之间相互污染。
* 不再拒绝 HTTPS/SVCB 记录，也不再把 FakeIP TTL 强制改为 1 秒，避免破坏现代 DNS 与产生无意义的高频重查。

## 规则集与更新

规则集统一使用 MetaCubeX `meta-rules-dat` 的 sing-box 二进制规则，按服务拆分，并固定每天检查更新。下载走直连，启动阶段不依赖尚未可用的代理选择器。模板只使用 `rule_set`，不使用已废弃的 `geoip` / `geosite` 配置字段。

## 1.13 能力与兼容边界

模板采用结构化 DNS 服务器、规则动作（`sniff`、`hijack-dns`、`resolve`、`reject`）、远程二进制规则集以及 ICMP 路由。没有启用仅 Linux 可用的 `auto_redirect` / `bypass`，因为同一模板还服务于 Apple、Android、Windows 和普通 Linux TUN 场景；平台专属优化不应让共享配置失去可移植性。

## 集成验证

模板不以裸 JSON 的占位状态冒充验证结果。维护时使用真实 Sub-Store 后端执行同名 JavaScript，把本地 SOCKS5 测试订阅转换成最终配置，再交给目标版本的 sing-box：

1. Sub-Store `2.36.32` 从四个分别标记为香港、日本、新加坡和美国的 SOCKS5 节点生成通用版与 iPhone 版配置；检查节点注入数量、地区组和自动选择组。
2. sing-box `1.13.18` 对两份 Sub-Store 最终产物执行 `sing-box check`。
3. 启动最终产物的 mixed 入站和 Clash API，加载全部远程二进制规则集，并通过真实 SOCKS5 上游发起 HTTP 请求。
4. 运行时确认 `baidu.com` 选择全球直连，`google.com`、`github.com` 和 `example.com` 选择测试代理，`doubleclick.net` 被拒绝；代理侧请求均实际完成。

集成测试还发现 MetaCubeX 当前并不发布 `geoip/apple.srs`，所以所有版本模板都删除了这个启动时必然下载失败的 Apple IP 规则；1.13 模板按普通 Apple 域名和独立的 Apple Intelligence 域名分流。Apple 未携带域名的流量仍按非中国域名/IP 兜底策略处理。
