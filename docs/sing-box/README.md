# sing-box 官方文档快照

这里保存了 [SagerNet/sing-box](https://github.com/SagerNet/sing-box) 仓库中
`docs/` 目录的本地快照，目的是让开发者和无法联网的 agent 能直接搜索、阅读
sing-box 的配置文档。

## 使用方式

- 文档入口：[`upstream/index.zh.md`](upstream/index.zh.md)
- 配置文档：[`upstream/configuration/`](upstream/configuration/)
- 迁移指南：[`upstream/migration.zh.md`](upstream/migration.zh.md)
- 废弃功能：[`upstream/deprecated.zh.md`](upstream/deprecated.zh.md)
- 上游版本：[`SOURCE`](SOURCE)

例如，可以使用以下命令快速检索配置项：

```sh
rg 'domain_strategy' docs/sing-box/upstream
```

## 更新方式

在仓库根目录执行：

```sh
./scripts/update-sing-box-docs.sh
```

脚本通过浅克隆和 sparse checkout 只获取官方仓库的 `docs/` 目录，并同步
上游许可证及准确的 commit SHA。`.github/workflows/update-sing-box-docs.yml`
也会定期运行此脚本；有变更时自动提交到当前默认分支。

`upstream/` 是生成的第三方内容，请勿手动修改。快照遵循上游项目许可证，
许可证副本位于 [`LICENSE`](LICENSE)。
