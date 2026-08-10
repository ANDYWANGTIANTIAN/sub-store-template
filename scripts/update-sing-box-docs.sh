#!/usr/bin/env bash
set -euo pipefail

readonly REPOSITORY_URL="${SING_BOX_REPOSITORY_URL:-https://github.com/SagerNet/sing-box.git}"
readonly REVISION="${SING_BOX_REVISION:-testing}"
readonly ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly DESTINATION="${ROOT_DIR}/docs/sing-box"

temporary_directory="$(mktemp -d)"
trap 'rm -rf "${temporary_directory}"' EXIT

echo "Fetching sing-box documentation (${REVISION})..."
git clone --depth 1 --filter=blob:none --no-checkout \
  --branch "${REVISION}" "${REPOSITORY_URL}" "${temporary_directory}/sing-box"
git -C "${temporary_directory}/sing-box" sparse-checkout init --cone
git -C "${temporary_directory}/sing-box" sparse-checkout set docs LICENSE
git -C "${temporary_directory}/sing-box" checkout

commit="$(git -C "${temporary_directory}/sing-box" rev-parse HEAD)"
rm -rf "${DESTINATION}/upstream"
mkdir -p "${DESTINATION}/upstream"
cp -a "${temporary_directory}/sing-box/docs/." "${DESTINATION}/upstream/"
cp "${temporary_directory}/sing-box/LICENSE" "${DESTINATION}/LICENSE"
printf '%s\n' "${commit}" > "${DESTINATION}/SOURCE"

echo "Updated sing-box documentation to ${commit}."
