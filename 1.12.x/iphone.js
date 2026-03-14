const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

// 清理 filter 字段和 {all} 占位符（兼容旧模板）
config.outbounds.forEach(i => {
  delete i.filter
  if (Array.isArray(i.outbounds)) {
    i.outbounds = i.outbounds.filter(t => t !== '{all}')
  }
})

config.outbounds.map(i => {
  if (['🐸 手动选择'].includes(i.tag)) {
    i.outbounds.push(
      ...getTags(
        proxies,
        null,
        /网站|流量|地址|剩余|过期|免费|时间|有效|Traffic|ExpireDate|GB|Expire Date/i
      )
    )
  }
  if (['🇭🇰 香港手动'].includes(i.tag)) {
    i.outbounds.push(
      ...getTags(proxies, /🇭🇰|HK|hk|香港|港|HongKong/i, /免费/i)
    )
  }
  if (['🇯🇵 日本手动'].includes(i.tag)) {
    i.outbounds.push(
      ...getTags(proxies, /🇯🇵|JP|jp|日本|日|Japan/i, /免费/i)
    )
  }
  if (['🇸🇬 狮城手动'].includes(i.tag)) {
    i.outbounds.push(
      ...getTags(proxies, /新加坡|坡|狮城|SG|Singapore/i, /免费/i)
    )
  }
  if (['🇺🇲 美国手动'].includes(i.tag)) {
    i.outbounds.push(
      ...getTags(proxies, /🇺🇸|US|us|美国|美|United States/i, /AUS|RUS|免费/i)
    )
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, includeRegex, excludeRegex) {
  return proxies
    .filter(p => (includeRegex ? includeRegex.test(p.tag) : true))
    .filter(p => (excludeRegex ? !excludeRegex.test(p.tag) : true))
    .map(p => p.tag)
}
