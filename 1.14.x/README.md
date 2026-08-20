# sing-box 1.14 模板说明

本目录以 sing-box **1.14** 为目标版本。`sing-box.json` 面向通用客户端，
`iphone.json` 面向 Apple 客户端；同名 JavaScript 会将 Sub-Store 生成的节点
注入 JSON 中预留的空策略组，因此裸 JSON 不是可直接运行的最终配置。

## 1.14 迁移

* DNS 缓存现在始终按传输名称隔离，因此不再配置已废弃的
  `dns.independent_cache`。
* 远程规则集通过顶层 `http_clients` 中的 `direct` 客户端下载，并由
  `route.default_http_client` 统一引用；不再使用已废弃的
  `rule_set.download_detour`。
* `direct` HTTP 客户端仍绕行“🎯 全球直连”，保持旧模板的规则集直连下载行为。

旧版本目录继续保留各目标版本支持的字段。例如，1.13 及更早版本不支持
`http_clients` 和 `route.default_http_client`，因此不能同步套用本目录的迁移。
