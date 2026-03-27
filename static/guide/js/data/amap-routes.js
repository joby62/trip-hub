const AMAP_TRAVEL_MODES = {
  car: { id: "0", label: "驾车", shortLabel: "驾车", tagline: "默认适合长距离、跨城和赶节奏日。" },
  transit: { id: "1", label: "公共交通", shortLabel: "公交", tagline: "默认适合城内切换和不用抢停车的点。" },
  walk: { id: "2", label: "步行", shortLabel: "步行", tagline: "默认适合已经靠近景区后再点开。" },
};

const AMAP_PLACE_LIBRARY = {
  kunming_old_street: {
    title: "昆明老街",
    name: "昆明老街",
    lon: 102.7075116,
    lat: 25.0428545,
    coordType: "wgs84",
  },
  yunnan_university_east: {
    title: "云南大学东陆校区",
    name: "云南大学东陆校区",
    lon: 102.7000427,
    lat: 25.0570048,
    coordType: "wgs84",
  },
  green_lake_park: {
    title: "翠湖公园",
    name: "翠湖公园",
    lon: 102.7025178,
    lat: 25.0514918,
    coordType: "wgs84",
  },
  haigeng_park: {
    title: "海埂公园",
    name: "海埂公园",
    lon: 102.6591731,
    lat: 24.9627305,
    coordType: "wgs84",
  },
  haigeng_dam: {
    title: "海埂大坝",
    name: "海埂大坝",
    lon: 102.6494599,
    lat: 24.9758572,
    coordType: "wgs84",
  },
  kunming_station: {
    title: "昆明站",
    name: "昆明站",
    lon: 102.720287,
    lat: 25.0186616,
    coordType: "wgs84",
  },
  dali_station: {
    title: "大理站",
    name: "大理站",
    lon: 100.2485243,
    lat: 25.5919445,
    coordType: "wgs84",
  },
  dali_port: {
    title: "大理港码头",
    name: "大理港",
    lon: 100.2340668,
    lat: 25.6044613,
    coordType: "wgs84",
  },
  dali_xiaguan: {
    title: "下关街道",
    name: "下关街道",
    lon: 100.2245218,
    lat: 25.5855109,
    coordType: "wgs84",
  },
  ideal_state: {
    title: "理想邦",
    name: "理想邦",
    lon: 100.2682569,
    lat: 25.7007479,
    coordType: "wgs84",
  },
  jinsuo_wharf: {
    title: "金梭岛码头",
    name: "金梭岛码头",
    lon: 100.259558,
    lat: 25.7132911,
    coordType: "wgs84",
  },
  haitung_town: {
    title: "海东镇",
    name: "海东镇",
    lon: 100.2545425,
    lat: 25.7170874,
    coordType: "wgs84",
  },
  wenbi_village: {
    title: "文笔村",
    name: "文笔村",
  },
  xiaoputuo: {
    title: "小普陀",
    name: "小普陀",
    lon: 100.2219074,
    lat: 25.8106403,
    coordType: "wgs84",
  },
  wase_town: {
    title: "挖色镇",
    name: "挖色镇",
    lon: 100.223,
    lat: 25.8309,
    coordType: "wgs84",
  },
  shuanglang: {
    title: "双廊古镇",
    name: "双廊古镇",
    lon: 100.19346,
    lat: 25.90942,
    coordType: "wgs84",
  },
  xizhou: {
    title: "喜洲古镇",
    name: "喜洲古镇",
    lon: 100.16028,
    lat: 25.84446,
    coordType: "wgs84",
  },
  dali_ancient_south_gate: {
    title: "大理古城南门",
    name: "大理古城南门",
    lon: 100.162485,
    lat: 25.698269,
    coordType: "wgs84",
  },
  caicun: {
    title: "才村",
    name: "才村完小",
    lon: 100.1883963,
    lat: 25.7234608,
    coordType: "wgs84",
  },
  xiabopeng: {
    title: "下波棚",
    name: "下波棚",
  },
  langqiao: {
    title: "廊桥",
    name: "海西廊桥",
  },
  shaxi: {
    title: "沙溪古镇",
    name: "沙溪古镇",
    lon: 99.86948,
    lat: 26.31964,
    coordType: "wgs84",
  },
  daluoshui: {
    title: "大落水村",
    name: "大落水村",
  },
  lovers_beach: {
    title: "云南情人滩",
    name: "云南情人滩",
  },
  lige_peninsula: {
    title: "里格半岛",
    name: "里格半岛",
  },
  bird_island: {
    title: "鸟岛",
    name: "泸沽湖鸟岛",
  },
  lugu_lake: {
    title: "泸沽湖风景区",
    name: "泸沽湖风景区",
    lon: 100.85517,
    lat: 27.72898,
    coordType: "wgs84",
  },
  luyuan_cliff: {
    title: "泸源崖",
    name: "泸源崖",
  },
  goddess_bay: {
    title: "女神湾",
    name: "女神湾",
  },
  wuzhiluo_wharf: {
    title: "五支洛码头",
    name: "五支洛码头",
  },
  caohai: {
    title: "草海",
    name: "草海",
  },
  walking_marriage_bridge: {
    title: "走婚桥",
    name: "走婚桥",
  },
  langfang: {
    title: "蒗放",
    name: "蒗放村",
  },
  shangri_la_city: {
    title: "香格里拉市",
    name: "香格里拉市",
    lon: 99.70867,
    lat: 27.82539,
    coordType: "wgs84",
  },
  hamu_village: {
    title: "纳帕海 / 哈木古村",
    name: "哈木古村",
  },
  dukezong: {
    title: "独克宗古城",
    name: "独克宗古城",
    lon: 99.70867,
    lat: 27.82539,
    coordType: "wgs84",
  },
  pudacuo: {
    title: "普达措森林公园",
    name: "普达措森林公园",
  },
  songzanlin: {
    title: "松赞林寺",
    name: "松赞林寺",
  },
  waka_town: {
    title: "瓦卡镇",
    name: "瓦卡镇",
  },
  jinsha_bend: {
    title: "金沙江大拐弯",
    name: "金沙江大拐弯",
  },
  baima_view: {
    title: "白马雪山观景台",
    name: "白马雪山观景台",
  },
  baima_pass: {
    title: "白马雪山垭口",
    name: "白马雪山垭口",
  },
  wunongding: {
    title: "雾浓顶",
    name: "雾浓顶",
  },
  feilai_temple: {
    title: "飞来寺",
    name: "飞来寺",
    lon: 98.88026,
    lat: 28.4463,
    coordType: "wgs84",
  },
  tiger_leaping_gorge: {
    title: "虎跳峡",
    name: "虎跳峡风景区",
    lon: 100.09397,
    lat: 27.18809,
    coordType: "wgs84",
  },
  lijiang_old_town_north_gate: {
    title: "丽江古城北门",
    name: "丽江古城北门",
    lon: 100.36394,
    lat: 26.96208,
    coordType: "wgs84",
  },
  yulong_visitor_center: {
    title: "玉龙雪山游客服务中心",
    name: "玉龙雪山景区游客服务中心(雪川游客港)",
  },
  blue_moon_valley: {
    title: "蓝月谷",
    name: "蓝月谷",
  },
  glacier_park: {
    title: "冰川公园",
    name: "冰川公园",
  },
  yunshanping: {
    title: "云杉坪",
    name: "云杉坪",
  },
  baisha_town: {
    title: "白沙古镇",
    name: "丽江白沙镇",
  },
};

const AMAP_DAY_ROUTE_GUIDES = {
  day1: {
    overview: {
      routeLabel: "昆明老街 → 云南大学东陆校区 → 翠湖公园 → 海埂公园 → 海埂大坝",
      body: "先把云大、翠湖和滇池一线整段串熟。这里固定从昆明老街出发，统一按驾车模式打开，先建立全天地理脉络。",
      start: "kunming_old_street",
      via: ["yunnan_university_east", "green_lake_park", "haigeng_park"],
      destination: "haigeng_dam",
      tail: "晚上回老街的收口，直接用下面的“昆明老街”按钮补一跳。",
    },
    stops: [
      { place: "kunming_old_street", mode: "car", note: "回正义路和老街一带，直接用这张收口。" },
      { place: "yunnan_university_east", mode: "car", note: "原文写的是上午第一跳直接打车去云大。" },
      { place: "green_lake_park", mode: "walk", note: "云大出来到翠湖只有几百米，顺着走最自然。" },
      { place: "haigeng_park", mode: "transit", note: "原文建议用观光 1 号线切过去，省心也不抢停车位。" },
      { place: "haigeng_dam", mode: "walk", note: "从海埂公园沿滇池路慢慢走过去，这一跳就是纯步行。" },
    ],
  },
  day2: {
    overview: {
      routeLabel: "昆明老街 → 昆明站 → 大理站 → 大理港码头 → 下关街道 → 理想邦 → 金梭岛码头 → 海东镇",
      body: "这一天的重点是先完成进城与落地，再把洱海东线的视野打开。整段固定起点，统一驾车打开，先熟悉全日骨架。",
      start: "kunming_old_street",
      via: ["kunming_station", "dali_station", "dali_port", "dali_xiaguan", "ideal_state", "jinsuo_wharf"],
      destination: "haitung_town",
    },
    stops: [
      { place: "kunming_station", mode: "car", note: "赶高铁这跳优先求稳，直接打车最省脑力。" },
      { place: "dali_station", mode: "car", note: "到站后租车或打车取车，先把站点记住。" },
      { place: "dali_port", mode: "car", note: "下关落地后的第一段湖边开场，直接去码头。" },
      { place: "dali_xiaguan", mode: "car", note: "午餐与补给点，放在下关最顺。" },
      { place: "ideal_state", mode: "car", note: "海东上坡段统一看作自驾点，节奏最稳。" },
      { place: "jinsuo_wharf", mode: "car", note: "傍晚水边机位更适合开车切换。" },
      { place: "haitung_town", mode: "car", note: "收尾回海东镇住，直接按住宿落脚点处理。" },
    ],
  },
  day3: {
    overview: {
      routeLabel: "海东镇 → 文笔村 → 小普陀 → 挖色镇 → 双廊古镇 → 喜洲古镇 → 大理古城南门",
      body: "这天本质是东线扫点再切回海西和古城，节奏全靠车控。先用固定起点把文笔村、小普陀、双廊和喜洲这条线跑熟。",
      start: "haitung_town",
      via: ["wenbi_village", "xiaoputuo", "wase_town", "shuanglang", "xizhou"],
      destination: "dali_ancient_south_gate",
    },
    stops: [
      { place: "wenbi_village", mode: "car", note: "上午从海东切去文笔村，原文就是按自驾处理。" },
      { place: "xiaoputuo", mode: "car", note: "文笔村和小普陀之间就是短距开车切换。" },
      { place: "wase_town", mode: "car", note: "午餐点单独拎出来，防止路上临时找饭。" },
      { place: "shuanglang", mode: "car", note: "双廊更适合作为下午主停留点，直接开过去。" },
      { place: "xizhou", mode: "car", note: "双廊转喜洲依旧是开车最顺。" },
      { place: "dali_ancient_south_gate", mode: "car", note: "夜里回古城前先把车停好，再开始步行夜游。" },
    ],
  },
  day4: {
    overview: {
      routeLabel: "大理古城南门 → 才村 → 下波棚 → 廊桥 → 沙溪古镇",
      body: "海西长廊这天看的是一路慢慢挪的节奏，不是冲单点。整体统一按驾车熟悉，傍晚把终点锁到沙溪。",
      start: "dali_ancient_south_gate",
      via: ["caicun", "xiabopeng", "langqiao"],
      destination: "shaxi",
    },
    stops: [
      { place: "caicun", mode: "car", note: "原文导航名就是“才村完小”，更适合停车起步。" },
      { place: "xiabopeng", mode: "car", note: "下波棚是沿海西长廊顺手切进去的拍照点。" },
      { place: "langqiao", mode: "car", note: "廊桥依旧按开车切点处理，不在这里压太多时间。" },
      { place: "shaxi", mode: "car", note: "长距离收口段，直接锁定沙溪古镇。" },
    ],
  },
  day5: {
    overview: {
      routeLabel: "沙溪古镇 → 大落水村 → 云南情人滩 → 里格半岛 → 鸟岛 → 泸沽湖风景区",
      body: "这是从沙溪进湖区的长距离转场日。先把进湖、环湖第一圈和晚上的住点用一条驾车路线串起来。",
      start: "shaxi",
      via: ["daluoshui", "lovers_beach", "lige_peninsula", "bird_island"],
      destination: "lugu_lake",
    },
    stops: [
      { place: "daluoshui", mode: "car", note: "下午第一站先去大落水，餐饮和补给最成熟。" },
      { place: "lovers_beach", mode: "car", note: "进湖后拍照点多，情人滩适合单独点开。" },
      { place: "lige_peninsula", mode: "car", note: "里格半岛是泸沽湖第一天最该留住的点。" },
      { place: "bird_island", mode: "car", note: "傍晚顺手切鸟岛，再决定是否继续停留。" },
      { place: "lugu_lake", mode: "car", note: "晚上回湖区住点，统一落在泸沽湖风景区范围。" },
    ],
  },
  day6: {
    overview: {
      routeLabel: "泸沽湖风景区 → 泸源崖 → 女神湾 → 五支洛码头 → 草海 → 走婚桥 → 蒗放",
      body: "完整环湖日不适合临场想路线。这里先用固定起点把源头、湖湾、码头和草海一串跑熟，统一按驾车模式打开。",
      start: "lugu_lake",
      via: ["luyuan_cliff", "goddess_bay", "wuzhiluo_wharf", "caohai", "walking_marriage_bridge"],
      destination: "langfang",
    },
    stops: [
      { place: "luyuan_cliff", mode: "car", note: "源头点位离湖区住点不近，直接按开车跳转。" },
      { place: "goddess_bay", mode: "car", note: "女神湾适合留时间发呆，路线先别算太碎。" },
      { place: "wuzhiluo_wharf", mode: "car", note: "如果当天想坐船，就把码头单独拎出来。" },
      { place: "caohai", mode: "car", note: "草海和走婚桥在同一段，开车切更顺。" },
      { place: "walking_marriage_bridge", mode: "walk", note: "到了草海边后再点这张，会更像实际游逛节奏。" },
      { place: "langfang", mode: "car", note: "最后一段回到更安静的蒗放，作为环湖收尾。" },
    ],
  },
  day7: {
    overview: {
      routeLabel: "泸沽湖风景区 → 香格里拉市 → 纳帕海 / 哈木古村 → 独克宗古城",
      body: "这天是湖区切入高原的适应日，主线很明确，就是长途移动后再补两个轻强度点。先用固定起点把它跑熟。",
      start: "lugu_lake",
      via: ["shangri_la_city", "hamu_village"],
      destination: "dukezong",
    },
    stops: [
      { place: "shangri_la_city", mode: "car", label: "香格里拉午餐", note: "长途移动先回城区吃饭和补给，最稳。" },
      { place: "hamu_village", mode: "car", label: "纳帕海 / 哈木古村", note: "原文导航名给的是哈木古村，纳帕海就按这一跳落地。" },
      { place: "dukezong", mode: "car", note: "第一晚先回独克宗住，夜里再慢慢步行逛。" },
    ],
  },
  day8: {
    overview: {
      routeLabel: "独克宗古城 → 普达措森林公园 → 香格里拉市 → 松赞林寺",
      body: "这天先徒步，再回城补给，最后去寺院。为了避免起终点重合，这里把总脉络收在松赞林寺，晚上的回古城放到下方逐点导航。",
      start: "dukezong",
      via: ["pudacuo", "shangri_la_city"],
      destination: "songzanlin",
      tail: "傍晚回独克宗古城，直接点下面最后一张卡片。",
    },
    stops: [
      { place: "pudacuo", mode: "car", note: "普达措离古城不远，但车进车出最省体力。" },
      { place: "shangri_la_city", mode: "car", label: "香格里拉市午餐", note: "徒步后回城区吃饭，顺手补水补氧。" },
      { place: "songzanlin", mode: "car", note: "寺院这跳继续按开车处理，不和徒步混在一起。" },
      { place: "dukezong", mode: "walk", note: "晚上真正进入古城后，再点这张更贴合夜游节奏。" },
    ],
  },
  day9: {
    overview: {
      routeLabel: "独克宗古城 → 瓦卡镇 → 金沙江大拐弯 → 白马雪山观景台 → 白马雪山垭口 → 雾浓顶 → 飞来寺",
      body: "梅里观景走廊这天就是一串停车点。顶部这条路线专门用来熟悉先后顺序，统一按驾车打开。",
      start: "dukezong",
      via: ["waka_town", "jinsha_bend", "baima_view", "baima_pass", "wunongding"],
      destination: "feilai_temple",
    },
    stops: [
      { place: "waka_town", mode: "car", note: "先把瓦卡镇午餐点记住，别错过补给。" },
      { place: "jinsha_bend", mode: "car", note: "月亮湾这类机位，开过去比临场翻图省事。" },
      { place: "baima_view", mode: "car", note: "白马雪山第一观景停靠点。" },
      { place: "baima_pass", mode: "car", note: "垭口海拔更高，做好高反节奏预期。" },
      { place: "wunongding", mode: "car", note: "雾浓顶适合傍晚停留，继续按车控时间。" },
      { place: "feilai_temple", mode: "car", note: "夜里收在飞来寺，方便第二天继续看雪山。" },
    ],
  },
  day10: {
    overview: {
      routeLabel: "飞来寺 → 香格里拉市 → 虎跳峡 → 丽江古城北门",
      body: "这天本质是长途移动加一个硬朗的峡谷转场。先把飞来寺、香格里拉补给、虎跳峡和丽江落脚点串成一条固定线。",
      start: "feilai_temple",
      via: ["shangri_la_city", "tiger_leaping_gorge"],
      destination: "lijiang_old_town_north_gate",
    },
    stops: [
      { place: "shangri_la_city", mode: "car", label: "香格里拉市午餐", note: "先回城区吃饭，再决定后半段体力分配。" },
      { place: "tiger_leaping_gorge", mode: "car", note: "虎跳峡是这天唯一强景点，单独点开更直接。" },
      { place: "lijiang_old_town_north_gate", mode: "car", note: "晚上回丽江北门住，别和古城内部步行路线混为一谈。" },
    ],
  },
  day11: {
    overview: {
      routeLabel: "丽江古城北门 → 玉龙雪山游客服务中心 → 蓝月谷 → 白沙古镇",
      body: "收官日最重要的是先把游客中心、景区内部和白沙的关系理顺。顶部依然固定从古城北门出发，统一按驾车模式打开。",
      start: "lijiang_old_town_north_gate",
      via: ["yulong_visitor_center", "blue_moon_valley"],
      destination: "baisha_town",
      tail: "冰川公园或云杉坪留给下面逐点导航，按当天票务和高反情况临场做减法。",
    },
    stops: [
      { place: "yulong_visitor_center", mode: "car", note: "雪山日真正该锁定的是游客服务中心，而不是在山里乱搜。" },
      { place: "blue_moon_valley", mode: "walk", note: "这张更适合进景区后再点，内部节奏偏步行。" },
      { place: "glacier_park", mode: "walk", note: "冰川公园是景区内部选择项，适合进山后再单独判断。" },
      { place: "yunshanping", mode: "walk", note: "如果放弃冰川公园，就把云杉坪当成内部替代选项。" },
      { place: "baisha_town", mode: "car", note: "白沙是下午最好的收束点，直接开过去吃饭看雪山。" },
      { place: "lijiang_old_town_north_gate", mode: "car", note: "夜里回北门住，最后一跳单独留给这张。" },
    ],
  },
};

function clonePlace(placeKey) {
  const place = AMAP_PLACE_LIBRARY[placeKey];
  if (!place) return null;
  return { ...place };
}

function resolvePlaceEntry(entry) {
  if (!entry) return null;
  if (typeof entry === "string") return clonePlace(entry);

  const base = entry.place ? clonePlace(entry.place) : null;
  return {
    ...(base || {}),
    ...entry,
    title: entry.label || entry.title || base?.title || entry.name || "",
    name: entry.name || base?.name || entry.label || "",
  };
}

function getAmapTravelMode(mode) {
  return AMAP_TRAVEL_MODES[mode] || AMAP_TRAVEL_MODES.car;
}

function getAmapDayRouteGuide(dayId) {
  const guide = AMAP_DAY_ROUTE_GUIDES[dayId];
  if (!guide) return null;

  return {
    overview: guide.overview
      ? {
          ...guide.overview,
          start: resolvePlaceEntry(guide.overview.start),
          via: (guide.overview.via || []).map(resolvePlaceEntry).filter(Boolean),
          destination: resolvePlaceEntry(guide.overview.destination),
        }
      : null,
    stops: (guide.stops || []).map((stop) => ({
      ...stop,
      place: resolvePlaceEntry(stop.place),
      modeMeta: getAmapTravelMode(stop.mode),
    })),
  };
}

export {
  AMAP_PLACE_LIBRARY,
  AMAP_TRAVEL_MODES,
  getAmapDayRouteGuide,
  getAmapTravelMode,
};
