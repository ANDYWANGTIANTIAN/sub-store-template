# Agent instructions

## sing-box reference

- The repository vendors the official sing-box documentation in
  `docs/sing-box/upstream/`. Consult that snapshot before changing any sing-box
  template or answering questions about sing-box configuration.
- Start with the Chinese (`*.zh.md`) page when one exists, then use the English
  page if the Chinese translation is incomplete.
- `docs/sing-box/SOURCE` records the exact upstream commit. Do not edit files in
  `docs/sing-box/upstream/` by hand; run `scripts/update-sing-box-docs.sh`
  instead.
- Documentation can describe a newer sing-box release than a versioned template
  in this repository. Check the relevant migration/deprecation pages and the
  template's target version before applying an option.
