# 高德 App Scheme 参考

## 目标

这份文档只记录本项目后续会真正用到的高德 App Scheme 调用约定，避免每次再回高德开放平台翻原文档。

本项目面向国内移动 Web 用户，地图唤起默认优先高德 App Scheme，不再把 URI Web 作为主方案。

## 官方来源

- Android 路径规划
  https://lbs.amap.com/api/amap-mobile/guide/android/route
- iOS 路线规划
  https://lbs.amap.com/api/amap-mobile/guide/ios/route
- Android 导航
  https://lbs.amap.com/api/amap-mobile/guide/android/navigation
- iOS 导航
  https://lbs.amap.com/api/amap-mobile/guide/ios/navi

最后核对时间：2026-03-27

## 项目结论

- 默认统一走“路径规划” App Scheme。
- 不再以 URI Web 为主，也不再围绕 URI Web 做能力设计。
- 单独的“导航”入口更适合 `我的位置 -> 单终点` 的一键导航，但不适合作为我们项目的统一模型，因为它不覆盖固定起点和多途径点。
- 我们真正要的能力，统一放在“路径规划” scheme 上处理：
  - 当前位置 -> 目的地
  - 当前位置 -> 单途径点 -> 目的地
  - 当前位置 -> 多途径点 -> 目的地
  - 指定起点 -> 途径点 -> 目的地
  - 分段导航

## 统一 Scheme

### Android

- 路径规划：`amapuri://route/plan/?...`

### iOS

- 路径规划：`iosamap://path?...`

## 核心参数

### 公共参数

- `sourceApplication`
  应用名。项目里固定传自己的来源标识。
- `dev`
  坐标是否需要国测加密。项目内统一传 `0`，前提是我们保存和传入的都是 GCJ-02 坐标。
- `t`
  交通方式。
  - `0` 驾车
  - `1` 公交
  - `2` 步行
  - `3` 骑行
  - `4` 火车
  - `5` 客车
- `rideType`
  只在 `t=3` 时生效。
  - `bike` 或留空：自行车
  - `elebike`：电动车

### 起点参数

- `sid`
  起点 POI ID。已知时优先传。
- `slat`
  起点纬度。
- `slon`
  起点经度。
- `sname`
  起点名称。

### 终点参数

- `did`
  终点 POI ID。已知时优先传。
- `dlat`
  终点纬度。
- `dlon`
  终点经度。
- `dname`
  终点名称。

### 途径点参数

- `vian`
  途径点数量。
- `vialons`
  多个途径点经度，用 `|` 分隔。
- `vialats`
  多个途径点纬度，用 `|` 分隔。
- `vianames`
  多个途径点名称，用 `|` 分隔。

高德官方要求这四组途径点参数的数量一致。项目里如果 `viaPoints.length > 0`，就必须一次性成组输出。

## 平台差异

### Android 路线规划

- 高德官方说明：如果不传 `slat` 和 `slon`，会自动把“我的位置”作为起点。
- 对 Android，项目里把 `dlat` 和 `dlon` 当成必传项处理，不依赖纯名称匹配。
- `m` 是旧的偏好参数，官方文档注明 Android 7.5.9 起不再支持；路线偏好会以用户本地设置为准。

### iOS 路线规划

- 高德官方备注明确写了 6 条规则：
  1. 起点经纬度不为空，则按该坐标发起。
  2. 起点经纬度为空、名称不为空，则按名称发起。
  3. 起点经纬度和名称都为空，则按“我的位置”发起。
  4. 终点经纬度不为空，则按该坐标发起。
  5. 终点经纬度为空、名称不为空，则按名称发起。
  6. 终点经纬度和名称都为空，则按“我的位置”发起。
- `m` 也是旧参数，官方文档注明 iOS 7.7.4 起不再支持；路线偏好会以用户本地设置为准。

### 项目统一约定

- 不依赖 `m` 这种旧偏好参数。
- 需要“交通方式”时只用 `t`。
- 只要有坐标，就优先传坐标；名称只作为展示和兜底。
- 只要有 POI ID，就一起传 `sid` / `did`，但不拿它替代坐标。

## 本项目支持的四类调用

### 1. 当前位置 -> 目的地

适用场景：

- 景点详情页的“去这里”
- 餐厅、酒店、停车场等单点唤起

项目规则：

- 不传起点参数
- 只传终点和交通方式
- 高德按“我的位置”发起路径规划

Android：

```text
amapuri://route/plan/?sourceApplication=AutoBioInterview&dlat=39.98848272&dlon=116.47560823&dname=官方终点B&dev=0&t=0
```

iOS：

```text
iosamap://path?sourceApplication=AutoBioInterview&dlat=39.98848272&dlon=116.47560823&dname=官方终点B&dev=0&t=0
```

### 2. 当前位置 -> 单途径点 -> 目的地

适用场景：

- 先去游客中心，再去正式景点
- 先去停车场，再去步行入口

项目规则：

- 起点继续省略，让高德走“我的位置”
- 通过 `vian=1` 和 `vialons/vialats/vianames` 传一个途径点

Android：

```text
amapuri://route/plan/?sourceApplication=AutoBioInterview&dlat=39.98848272&dlon=116.47560823&dname=官方终点B&dev=0&t=0&vian=1&vialons=116.402796&vialats=39.936915&vianames=途径点1
```

iOS：

```text
iosamap://path?sourceApplication=AutoBioInterview&dlat=39.98848272&dlon=116.47560823&dname=官方终点B&dev=0&t=0&vian=1&vialons=116.402796&vialats=39.936915&vianames=途径点1
```

### 3. 当前位置 -> 多途径点 -> 目的地

适用场景：

- 自驾串多个景点
- 一天内按固定顺序跑多个中途停靠点

项目规则：

- 继续省略起点，走“我的位置”
- 多个途径点统一放进 `vian/vialons/vialats/vianames`

Android：

```text
amapuri://route/plan/?sourceApplication=AutoBioInterview&dlat=39.98848272&dlon=116.47560823&dname=官方终点B&dev=0&t=0&vian=2&vialons=116.402796|116.438&vialats=39.936915|39.965&vianames=途径点1|途径点2
```

iOS：

```text
iosamap://path?sourceApplication=AutoBioInterview&dlat=39.98848272&dlon=116.47560823&dname=官方终点B&dev=0&t=0&vian=2&vialons=116.402796|116.438&vialats=39.936915|39.965&vianames=途径点1|途径点2
```

### 4. 指定起点 -> 途径点 -> 目的地

适用场景：

- 行程卡片里要明确从某个酒店或停车场出发
- 后续的分段导航中，第二段及以后每一段都要定死起点

项目规则：

- 只要指定起点，就把起点坐标和名称一起传
- 如果这一段还要经过中间点，再加 `viaPoints`

Android：

```text
amapuri://route/plan/?sourceApplication=AutoBioInterview&slat=39.92848272&slon=116.39560823&sname=官方起点A&dlat=39.98848272&dlon=116.47560823&dname=官方终点B&dev=0&t=0&vian=1&vialons=116.402796&vialats=39.936915&vianames=途径点1
```

iOS：

```text
iosamap://path?sourceApplication=AutoBioInterview&slat=39.92848272&slon=116.39560823&sname=官方起点A&dlat=39.98848272&dlon=116.47560823&dname=官方终点B&dev=0&t=0&vian=1&vialons=116.402796&vialats=39.936915&vianames=途径点1
```

## 分段导航

“分段导航”不是高德提供的单个参数，而是我们自己的产品编排方式。

项目定义：

- 把一天的路线拆成多个 leg
- 每个 leg 都生成一条独立的 App Scheme
- 第一段通常省略起点，让它从“我的位置”发起
- 第二段开始，把上一段终点作为下一段显式起点

推荐场景：

- 一日游包含多个停靠点，但不希望一次把所有点都塞进一个大路线里
- 用户需要在每段之间自己决定是否继续下一段
- 想兼容临时变更，而不是锁死整天线路

推荐数据结构：

```js
[
  { name: "海埂公园", lon: 102.661, lat: 24.957 },
  { name: "海埂大坝", lon: 102.673, lat: 24.949 },
  { name: "民族村", lon: 102.680, lat: 24.965 },
]
```

推荐生成策略：

```js
function buildSegmentedRoutePlans({ platform, stops, travelType = "0" }) {
  return stops.slice(1).map((destination, index) => ({
    label: index === 0
      ? `我的位置 -> ${destination.name}`
      : `${stops[index].name} -> ${destination.name}`,
    url: buildAmapAppRouteUrl(platform, {
      start: index === 0 ? null : stops[index],
      destination,
      travelType,
    }),
  }));
}
```

项目约定：

- 不把“分段导航”理解成高德单个 deep link 的特殊能力
- 它就是多条 App Scheme 的顺序组织

## 推荐封装

前端统一只保留一套 App Scheme builder：

```js
buildAmapAppRouteUrl(platform, {
  start: null,
  destination,
  viaPoints: [],
  travelType: "0",
  rideType: "",
})
```

约定：

- `start = null` 表示从“我的位置”发起
- `destination` 必传，且优先传坐标
- `viaPoints` 允许 0 个、1 个或多个
- `travelType` 只暴露 `0/1/2/3`
- `rideType` 只在 `travelType = "3"` 时启用

## 不推荐做法

- 不再为新功能接 URI Web
- 不依赖只传名称、不传坐标的模糊匹配
- 不依赖 `m` 这种已经被官方标注为失效的偏好参数
- 不把“整天多点行程”硬塞成一条超长路线；更适合拆成分段导航

## 代码落点

- App Scheme builder:
  `static/guide/js/services/amap.js`
- 测试场景配置：
  `static/guide/js/config.js`

后续如果要把真实景点接进去，优先新增地点坐标和 POI ID，不要先改 URL 拼接规则。
