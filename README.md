# sub-store-template

## sing-box 文档

仓库内置了可供开发者和 agent 离线检索的
[sing-box 官方文档快照](docs/sing-box/README.md)，并通过定时任务保持更新。

## 根目录模板

根目录的 `sing-box.js`、`sing-box.json`、`iphone.js` 和 `iphone.json` 是当前最高版本目录中同名模板的副本，方便通过 jsDelivr 的固定根路径引用。例如：

```text
https://cdn.jsdelivr.net/gh/ANDYWANGTIANTIAN/sub-store-template@main/sing-box.json
https://cdn.jsdelivr.net/gh/ANDYWANGTIANTIAN/sub-store-template@main/iphone.json
```

这里特意使用普通文件而不是符号链接：[jsDelivr 的 GitHub 端点代理 GitHub 文件内容](https://github.com/jsdelivr/jsdelivr/issues/18290#issuecomment-801978949)，不能像检出 Git 仓库后那样解析符号链接。新增更高版本目录时，请同步更新这四个根目录文件。
