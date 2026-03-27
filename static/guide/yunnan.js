const phaseOptions = [
  { id: "all", label: "全部日程", hint: "11 天游完整闭环" },
  { id: "warmup", label: "昆明与大理", hint: "城市、洱海与古镇铺垫" },
  { id: "lugu", label: "泸沽湖", hint: "两天环湖慢节奏" },
  { id: "plateau", label: "香格里拉与梅里", hint: "高原、寺院、雪山观景" },
  { id: "lijiang", label: "丽江与雪山", hint: "虎跳峡过渡，玉龙雪山收尾" },
];

const routeStops = ["昆明", "大理", "泸沽湖", "香格里拉", "梅里", "丽江"];

const riskNotes = [
  "民族文化村门票贵，文档明确建议直接去滇池。",
  "理想邦上楼顶要消费，走免费长廊即可。",
  "纳帕海走环湖路可免门票，不必进收费景区。",
  "飞来寺收费机位可跳过，往下 200 米景观几乎一样。",
  "虎跳峡扶梯票和蓝月谷观光车都不值。",
  "玉龙雪山冰川公园才是真正需要守点抢票的项目。",
];

const bookingTimeline = [
  {
    step: "01",
    title: "先锁昆明站到大理站",
    detail:
      "文档把高铁票列为必须提前处理的事项。大理之后基本转入自驾，前半程节奏能不能顺下来，取决于这张票。",
  },
  {
    step: "02",
    title: "大理海东、沙溪、泸沽湖、梅里尽量提早订",
    detail:
      "海东和飞来寺这种景观型住宿波动大，文档建议在去哪儿或携程找到电话后直接议价，不要只看平台内价格。",
  },
  {
    step: "03",
    title: "玉龙雪山提前 7 天 20:00 抢票",
    detail:
      "关注“丽江旅游集团”，提前录入所有出行人。19:55 进页面，19:58 把手指按在拼图验证上，20:00 放手抢冰川公园。",
  },
  {
    step: "04",
    title: "高原段前一天把氧气和药补齐",
    detail:
      "香格里拉、梅里、玉龙雪山是连续高海拔区，最好在丽江或古城内提前买好氧气、感冒药、晕车药和薄荷糖。",
  },
];

const globalNotes = [
  {
    title: "穿衣逻辑",
    body:
      "昆明、大理、丽江可以按夏装准备，但早晚温差和雨后会立刻变凉。香格里拉和梅里要加针织层，玉龙雪山最好单独准备羽绒服或厚外层。",
  },
  {
    title: "药品与高反",
    body:
      "原文建议至少带晕车药、感冒药、消炎药、胃药、鼻炎喷雾和薄荷糖。第一次上高海拔，最好在古城先买氧气瓶，不要到了雪山再找。",
  },
  {
    title: "防晒与保湿",
    body:
      "云南紫外线强，墨镜、面罩、防晒霜、帽子、唇膏和护肤品都不是可选项。风大日照强的地方，嘴唇和鼻腔会比平原更快干。",
  },
  {
    title: "吃住省钱",
    body:
      "餐饮优先看团购，住宿优先看平台找电话后再问价。文档里几乎所有“容易被坑”的店和项目，都建议先看是否有套餐或是否值得付费。",
  },
  {
    title: "自驾取舍",
    body:
      "泸沽湖到香格里拉如果追求舒适走泸南高速；如果想省钱且路况平稳，丽宁公路更合适。高原段的核心不是开快，而是把体力留给景点和观景台。",
  },
  {
    title: "付费避坑",
    body:
      "理想邦楼顶茶位、纳帕海收费景区、飞来寺收费机位、虎跳峡扶梯票、蓝月谷观光车都在文档里被点名。路线真正值得提前花力气的，反而是高铁和雪山门票。",
  },
];

const packingGroups = [
  {
    id: "wear",
    title: "衣物穿搭",
    items: [
      "内裤、袜子、睡衣、舒适鞋",
      "背包与每天随身衣服",
      "墨镜，近视镜片或隐形备用",
      "针织层或薄羽绒，给香格里拉和雪山段",
    ],
  },
  {
    id: "care",
    title: "洗护药品",
    items: [
      "刮胡刀、擦镜布、唇膏",
      "护肤品、防晒霜",
      "鼻炎喷雾、消炎药、感冒药、胃药",
      "薄荷糖与常用补给",
    ],
  },
  {
    id: "power",
    title: "数码电力",
    items: [
      "充电宝",
      "手机和相机充电器",
      "耳机",
      "车载充电补口如果自驾",
    ],
  },
  {
    id: "docs",
    title: "证件杂项",
    items: [
      "身份证",
      "银行卡和少量现金",
      "酒店与门票预订截图",
      "驾驶证与车辆资料",
    ],
  },
];

const dayData = [
  {
    id: "day1",
    day: "Day 1",
    date: "3.30",
    city: "昆明",
    phase: "warmup",
    phaseLabel: "昆明与大理",
    pace: "轻",
    altitude: "低海拔",
    title: "昆明老街、云大与滇池的缓冲日",
    summary:
      "第一天不追求密度，重点是把昆明的学院气、街巷烟火和滇池湖风串起来，给后面长线自驾留出体力。",
    route: "昆明老街 → 云南大学 → 翠湖公园 → 海埂公园 / 海埂大坝 → 昆明老街",
    logistics:
      "老街到云大打车约 10 元；海埂回城可以坐观光 1 号线，但海埂大坝末班 17:00，要么卡点走，要么直接打车回正义路。",
    highlights: [
      "云南大学的会泽楼、龙门道和老贡院建筑群，是昆明最有书卷气的一段。",
      "翠湖适合作为午间停顿，看本地人散步、打牌、晒太阳。",
      "海埂大坝适合看湖风和候鸟，民族文化村可以直接跳过。",
    ],
    food: [
      "早餐可吃元吉老一碗小锅米线。",
      "午饭靠翠湖：爱尚菌野生菌火锅、茴香熙楼或过桥米线厂牌。",
      "晚饭回昆明老街：老滇山寨、太阳饭店、菌故野生菌火锅。",
    ],
    stay:
      "住昆明老街最顺手，预算从 180+ 的连锁到 330+ 的别院都有，核心是第二天去昆明站方便。",
    tips: [
      "云大要先关注“平安云大”预约东陆校区。",
      "海埂这段以散步看景为主，不建议为民族文化村单独花门票。",
    ],
  },
  {
    id: "day2",
    day: "Day 2",
    date: "3.31",
    city: "大理海东",
    phase: "warmup",
    phaseLabel: "昆明与大理",
    pace: "中",
    altitude: "低海拔",
    title: "高铁进大理，先把洱海东线拍开",
    summary:
      "这天的重点不是古城，而是从下关到海东把视野打开。理想邦、金梭岛和海东镇会把整条大理线的审美基调先立住。",
    route: "昆明老街 → 昆明站 → 大理站 → 大理港码头 → 下关街道 → 理想邦 → 金梭岛码头 → 海东镇",
    logistics:
      "昆明老街到昆明站打车约 8 元；到大理站后租车，自驾段从大理港到海东基本都在 20 至 30 分钟区间。",
    highlights: [
      "大理港码头适合刚到大理时先看一眼苍山洱海的大场面。",
      "下关是本地人吃饭的老城区，物价比古城友好。",
      "理想邦免费区和长廊足够出片，金梭岛码头适合傍晚拍水边倒影。",
    ],
    food: [
      "下关可选滨海鱼庄、巅西味道铜瓢牛肉、老缅婆傣味或玉田鱼馆。",
      "海东镇晚饭文档推荐驴肉馆、野生菌火锅、石板烧烤和巍山火巴肉饵丝。",
    ],
    stay:
      "住海东镇海景民宿，文档给到 700+ 到 2000+ 的别墅类选择，并特别提醒可通过平台电话议价。",
    tips: [
      "理想邦上楼顶要消费，文档明确建议只走免费的长廊。",
      "海东镇是后续绕洱海东线最顺手的落脚点，当天不必再挤进大理古城。",
    ],
  },
  {
    id: "day3",
    day: "Day 3",
    date: "4.1",
    city: "洱海东线与大理古城",
    phase: "warmup",
    phaseLabel: "昆明与大理",
    pace: "中",
    altitude: "低海拔",
    title: "文笔村、小普陀、双廊、喜洲，再落到大理古城",
    summary:
      "这是大理段最完整的一天，既有湖边悬崖村落，也有成熟古镇和古城夜游，适合把洱海周边的不同气质一次看够。",
    route: "海东镇 → 文笔村 → 小普陀 → 挖色镇午餐 → 双廊古镇 → 喜洲古镇 → 大理古城南门",
    logistics:
      "各段自驾多在 10 到 30 分钟。晚上进大理古城前先把车停好，夜游尽量全程步行。",
    highlights: [
      "文笔村建在半山悬崖，村落和湖景的层次非常适合拍照。",
      "双廊适合看码头、花海和海景下午茶，不上南诏风情岛也成立。",
      "喜洲看麦田、吃粑粑、体验扎染，晚上再切到大理古城夜游。",
    ],
    food: [
      "小普陀午饭可选杨家饭店、小院木桶鱼或渔家村野生菌火锅。",
      "双廊可把杨丽萍太阳宫、半山半水下午茶和老奶奶烤乳扇作为体验点。",
      "大理古城正餐更推荐振华饭店、金兵清香园、亦乐饭店这类偏本地或实用向餐厅。",
    ],
    stay:
      "住大理古城南门或洱海门一带，晚上逛古城方便，第二天也容易往海西和沙溪出发。",
    tips: [
      "南诏风情岛需要船票，如果不执着上岛，岸边看看已经足够。",
      "古城夜游路线里，红龙井建议只逛前半段，后半段夜里营业内容不多。",
    ],
  },
  {
    id: "day4",
    day: "Day 4",
    date: "4.2",
    city: "海西生态长廊与沙溪",
    phase: "warmup",
    phaseLabel: "昆明与大理",
    pace: "中",
    altitude: "低海拔",
    title: "才村、下波棚、廊桥一路拍，再去沙溪住一晚",
    summary:
      "这天前半段是洱海西岸的拍照线，后半段则切去沙溪古镇，把大理从热闹的商业古城转成更安静的氛围场。",
    route: "大理古城南门 → 才村 → 下波棚 → 廊桥 → 沙溪古镇",
    logistics:
      "古城到才村十分钟左右，自驾沿海西长廊向北慢慢挪。廊桥到沙溪约 1.5 小时，适合把傍晚留给玉津桥和古镇街巷。",
    highlights: [
      "才村适合拍枯树和芦苇荡，是海西很稳的出片点。",
      "下波棚主打网红 S 弯，能不能拍到理想机位要看天气和现场。",
      "沙溪真正的灵魂在玉津桥、落日、牛羊和古镇外的稻田书店。",
    ],
    food: [
      "才村文档推荐餐海海景餐厅或风鹤轩。",
      "沙溪可吃百味轩私房菜、带皮毛驴肉牛肉火锅、龙凤瑞英清真饭馆。",
    ],
    stay:
      "住沙溪古镇一晚，文档给出望山小筑和轻奢民宿两档，核心是晚上感受古镇氛围而不是赶点。",
    tips: [
      "才村路边可停，但担心贴罚单就停收费场。",
      "沙溪不是靠景点堆满的地方，最好把速度放慢，不要只在主街打卡。",
    ],
  },
  {
    id: "day5",
    day: "Day 5",
    date: "4.3",
    city: "泸沽湖",
    phase: "lugu",
    phaseLabel: "泸沽湖",
    pace: "中",
    altitude: "中高海拔",
    title: "从沙溪进泸沽湖，下午先环一圈湖",
    summary:
      "泸沽湖的第一天重点是抵达、适应和先看几个最经典的观景点，不必急着把所有点跑满，晚上一间湖景房比篝火晚会更值。",
    route: "沙溪古镇 → 大落水村 → 云南情人滩 → 里格半岛 → 鸟岛 → 泸沽湖风景区",
    logistics:
      "沙溪到大落水自驾约 4.5 小时，下午再继续环湖。大落水是泸沽湖最热闹、餐饮最成熟的集散点。",
    highlights: [
      "里格半岛是泸沽湖最重要的景点之一，观景台和湖边都值得停。",
      "鸟岛更适合顺路看看，兴趣不强可以压缩停留时间。",
      "第一天把湖景房和日落留出来，比把体力耗在娱乐项目上更划算。",
    ],
    food: [
      "大落水村午饭可在阿妈野生菌土鸡腊排骨、摩梭菌香腊排骨石锅鱼等店解决。",
      "鸟岛附近晚饭可看泸沽湖鱼味餐厅、野生菌蒸汽石锅鱼或聚香源柴火鸡。",
    ],
    stay:
      "泸沽湖住两晚更合理，文档从 200+ 的标间到 900+ 的湖景民宿都给了选项。",
    tips: [
      "篝火晚会人工痕迹重，文档明确建议不如躺平看湖景。",
      "如果一定想看篝火晚会，建议在二手平台买票，不要原价冲动消费。",
    ],
  },
  {
    id: "day6",
    day: "Day 6",
    date: "4.4",
    city: "泸沽湖",
    phase: "lugu",
    phaseLabel: "泸沽湖",
    pace: "中",
    altitude: "中高海拔",
    title: "泸沽湖完整环湖日，把源头、草海和走婚桥都看掉",
    summary:
      "第二天是泸沽湖真正的完整环湖日。重点从观景台切到文化和地貌层面，节奏仍然不必赶，哪个码头上船要看住在哪里。",
    route: "泸源崖 → 女神湾 → 五支洛码头 → 草海 → 走婚桥 → 蒗放",
    logistics:
      "如果要看晨雾，可就近找达祖码头、五支洛码头或大落水码头包船。包船多在 150 到 200 元区间，文档提醒现场可讲价。",
    highlights: [
      "泸源崖是泸沽湖源头，地貌感强。",
      "女神湾是泸沽湖最美的湖湾之一，适合慢慢停留。",
      "草海和走婚桥把自然与摩梭文化连在一起，蒗放则更原生态。",
    ],
    food: [
      "草海附近午饭推荐香村土菜馆，人均更友好。",
      "如果想坐猪槽船，文档推荐五支洛或洛洼码头，并且记得对半砍价。",
    ],
    stay:
      "继续住前一晚酒店，不折腾换房，第二天直接向香格里拉转场。",
    tips: [
      "这个季节草海偏黄、花未开，文档认为更该把时间放在湖湾和码头而不是期待花海。",
      "坐船不是必须项，不想上船可以把时间留给女神湾和蒗放。",
    ],
  },
  {
    id: "day7",
    day: "Day 7",
    date: "4.5",
    city: "香格里拉",
    phase: "plateau",
    phaseLabel: "香格里拉与梅里",
    pace: "中",
    altitude: "进入高原",
    title: "泸沽湖离场，纳帕海和独克宗古城作为高原适应日",
    summary:
      "这一天真正的意义是从湖区切进高原，先把海拔适应好，再用纳帕海和独克宗古城做一个强度适中的过渡。",
    route: "泸沽湖风景区 → 香格里拉午餐 → 纳帕海 → 独克宗古城",
    logistics:
      "泸沽湖到香格里拉约 5 小时。文档对三条路做了取舍：泸南高速最舒适，丽宁公路最省钱，翠依线风景虽好但并不推荐在天气一般时走。",
    highlights: [
      "纳帕海重点不是景区门，而是环湖路和哈木古村一线。",
      "独克宗古城适合作为高原第一晚，节奏可以慢一点。",
      "这天建议把氧气和后面两三天需要的高原补给提前买好。",
    ],
    food: [
      "香格里拉市区午饭和晚饭文档都重复推荐五彩雪域藏餐馆、一品羊酒楼、线太爷牦牛肉火锅。",
      "独克宗古城晚饭可看舌尖上的小厨师、青木厨坊、塔洛藏餐吧或顺顺小吃。",
    ],
    stay:
      "独克宗古城连住两晚最稳，文档给出 180+ 到 350+ 的富氧酒店与观景酒店。",
    tips: [
      "纳帕海走环湖路就能深入草原，没必要进收费景区。",
      "这是进入高原的第一天，不建议安排太满，重点是状态别崩。",
    ],
  },
  {
    id: "day8",
    day: "Day 8",
    date: "4.6",
    city: "普达措与松赞林寺",
    phase: "plateau",
    phaseLabel: "香格里拉与梅里",
    pace: "重",
    altitude: "高海拔",
    title: "普达措走徒步，傍晚去松赞林寺和独克宗",
    summary:
      "这是香格里拉段的体力日。普达措本质是 5 到 6 小时轻徒步，松赞林寺则把藏区气质补满，整天以自然和宗教景观为主。",
    route: "独克宗古城 → 普达措森林公园 → 香格里拉市午餐 → 松赞林寺 → 独克宗古城",
    logistics:
      "普达措离古城约 30 分钟，自驾方便。门票 138 元；松赞林寺门票加观光车 65 元，必须带身份证。",
    highlights: [
      "普达措有三段徒步线，可按体力取舍：洛茸村更原生态，属都湖最开阔，碧塔湖更像秘境。",
      "松赞林寺是云南规模最大的藏传佛教寺院之一，被称为小布达拉宫。",
      "晚上回独克宗古城，龟山公园的大转经筒值得去看。",
    ],
    food: [
      "中午回香格里拉市区继续吃五彩雪域藏餐馆、一品羊酒楼或线太爷牦牛火锅。",
      "晚上独克宗古城一带依旧是火锅、炒菜和藏餐的组合最稳。",
    ],
    stay:
      "继续住独克宗，避免高海拔当天还要搬酒店。",
    tips: [
      "如果更想纯徒步，也可考虑把普达措换成无底湖，但那是更长的往返和徒步强度。",
      "想拍“大金幡”造型照的，可以知道它存在，但文档明确说门票不值。",
    ],
  },
  {
    id: "day9",
    day: "Day 9",
    date: "4.7",
    city: "梅里雪山",
    phase: "plateau",
    phaseLabel: "香格里拉与梅里",
    pace: "中",
    altitude: "高海拔",
    title: "从独克宗开去梅里，沿途把月亮湾和白马雪山一起吃掉",
    summary:
      "这一段路程看似很长，但真正的价值在于沿路层层抬高的雪山视野。瓦卡镇补给以后，下午基本是在观景台之间移动。",
    route: "独克宗古城 → 瓦卡镇 → 金沙江大拐弯 → 白马雪山观景台 → 白马雪山垭口 → 雾浓顶 → 飞来寺",
    logistics:
      "独克宗到瓦卡镇约 1.5 小时，再往后是一串观景停靠。飞来寺附近如果收费，文档建议往下走 200 米看同样的景，不必执着付费机位。",
    highlights: [
      "金沙江大拐弯也叫月亮湾，是路上最有记忆点的转折景观。",
      "白马雪山观景台和垭口负责把海拔和视野一起推高。",
      "雾浓顶人少、视野开阔，是文档明确推荐的梅里机位。",
    ],
    food: [
      "瓦卡镇一定要吃，过了这里很久不一定再有稳妥的饭点。",
      "飞来寺晚饭尽量简餐，文档点名说附近大餐店容易坑，最好只选团购或保守型餐馆。",
    ],
    stay:
      "住飞来寺观景酒店，预算 250+ 到 500+ 都有，关键是第二天清晨继续看梅里。",
    tips: [
      "日落时间大约 19:00，运气好能看到日照金山，行程安排要给这个窗口留余量。",
      "飞来寺收费机位不是必须项，文档态度很明确：不值得为它单独掏钱。",
    ],
  },
  {
    id: "day10",
    day: "Day 10",
    date: "4.8",
    city: "虎跳峡与丽江",
    phase: "lijiang",
    phaseLabel: "丽江与雪山",
    pace: "中",
    altitude: "高海拔转回中海拔",
    title: "从梅里回丽江，中途用虎跳峡做一个硬朗转场",
    summary:
      "这是返程承上启下的一天。上午长距离回香格里拉补给，下午视兴趣处理虎跳峡，晚上把落脚点换到丽江，为第二天的玉龙雪山做准备。",
    route: "飞来寺 → 香格里拉市午餐 → 虎跳峡 → 丽江古城北门",
    logistics:
      "飞来寺到香格里拉约 3 小时，香格里拉到虎跳峡约 1.5 小时，虎跳峡到丽江再 1.5 小时。当天要接受长途移动为主的现实。",
    highlights: [
      "虎跳峡是否进收费景区完全看兴趣，文档认为只是想看看峡谷的话，路上也能看到。",
      "晚上住丽江古城北门，第二天去雪山最顺路。",
      "这天更像重置体力和补给的一天，不必硬把丽江古城安排得太满。",
    ],
    food: [
      "香格里拉午饭仍然回市区老三样：五彩雪域藏餐、一品羊酒楼、线太爷火锅。",
      "丽江晚饭可优先找老城区馆子，如云南鲜野生菌火锅、三川火腿乌骨鸡、金川火塘。",
    ],
    stay:
      "丽江古城北门建议连住两晚，文档给的客栈与观景民宿都在 650+ 到 1000+ 区间。",
    tips: [
      "虎跳峡扶梯票 80 元完全没必要，步行单程十分钟左右。",
      "如果只想看虎跳峡而不是专门下景区大拐弯，甚至可以不买票。",
    ],
  },
  {
    id: "day11",
    day: "Day 11",
    date: "4.9",
    city: "玉龙雪山与丽江",
    phase: "lijiang",
    phaseLabel: "丽江与雪山",
    pace: "重",
    altitude: "高海拔",
    title: "玉龙雪山收官，下午白沙，晚上回丽江",
    summary:
      "收尾日是整条线最需要预先准备的一天。玉龙雪山内部要做减法，冰川公园和云杉坪二选一，再搭配蓝月谷，就足够完整。",
    route: "丽江古城北门 → 玉龙雪山游客服务中心 → 蓝月谷 / 冰川公园或云杉坪 → 白沙镇 → 丽江古城北门",
    logistics:
      "去雪山自驾约 40 分钟，建议预约 9:00 左右进山。文档强调：一天内不可能把冰川公园、云杉坪、牦牛坪、蓝月谷全走完，必须主动删减。",
    highlights: [
      "如果想爬雪山，选冰川公园加蓝月谷；怕高反就改成云杉坪加蓝月谷。",
      "白沙镇是远观玉龙雪山最稳的地方，也是商业化最轻的一段丽江。",
      "晚上的大研古城可以只走一条核心环线，不必在商业街里消耗太久。",
    ],
    food: [
      "玉龙雪山内餐饮不算密集，文档建议自带路餐；游客中心可考虑雪厨餐厅。",
      "白沙午饭可选云雪丽白沙火塘、白沙人家餐厅或陈大厨白沙风味馆。",
      "回丽江北门晚饭可在云雪丽纳西庭院、阿婆情腊排骨火锅、遇见马帮菜等店解决。",
    ],
    stay:
      "继续住前一晚酒店。玉龙雪山结束后再慢慢回古城，别把退房和搬行李叠加到雪山日。",
    tips: [
      "冰川公园门票必须提前 7 天 20:00 抢；云杉坪和牦牛坪虽不用抢成这样，也建议提前买。",
      "蓝月谷 50 元观光车完全没必要，文档最后再次强调可以直接走。",
    ],
  },
];

const PACKING_STORAGE_KEY = "yunnan_guide_packing_v1";
const PACKING_GROUP_STORAGE_KEY = "yunnan_guide_packing_groups_v1";
const BLUEPRINT_PATH = "/static/guide/data/yunnan.blueprint.json";
const DAY_MAP_PATH = "/static/guide/source/yunnan_trip_v4/day-map.json";
const imageExtOverrides = new Set([3, 11, 12, 16, 21]);
const DETAIL_TABS = [
  { id: "route", label: "路线" },
  { id: "stay", label: "吃住" },
  { id: "source", label: "原文" },
];
const SEARCH_FILTERS = [
  { id: "all", label: "全部" },
  { id: "days", label: "天数" },
  { id: "attractions", label: "景点" },
  { id: "tools", label: "工具" },
  { id: "source", label: "原文" },
  { id: "images", label: "图片" },
];
const SEARCH_GROUP_LABELS = {
  days: "天数与路线",
  attractions: "景点与目的地",
  tools: "工具与备忘",
  source: "原文段落",
  images: "图片引用",
};
const PITFALL_CATEGORIES = ["all", "收费不值", "建议绕开", "必须提前订", "高原提醒"];
const VIEW_OPTIONS = [
  { id: "overview", label: "总览", hint: "路线骨架、重点入口与避坑" },
  { id: "itinerary", label: "行程", hint: "按天展开完整图文章节" },
  { id: "attractions", label: "景点", hint: "按目的地查看图片与原文" },
  { id: "checklist", label: "清单", hint: "预订、备忘与打包工具" },
];
const CHECKLIST_TOPBAR_ITEMS = [
  { id: "packingSection", label: "出发前勾一下" },
  { id: "toolsSection", label: "关键预订" },
  { id: "notesSection", label: "统一备忘" },
];
const AMAP_SOURCE_APPLICATION = "AutoBioInterview";
const AMAP_TEST_ROUTES = {
  destination: {
    destinationName: "玉龙雪山景区游客服务中心(雪川游客港)",
    travelType: "0",
  },
  route: {
    startName: "海埂公园",
    destinationName: "海埂大坝",
    travelType: "2",
  },
};
const PRIMARY_VIEW_SECTION = {
  overview: "overviewSection",
  itinerary: "daysSection",
  attractions: "gallerySection",
  checklist: "packingSection",
};
const SECTION_TO_VIEW = {
  overviewSection: "overview",
  daysSection: "itinerary",
  gallerySection: "attractions",
  toolsSection: "checklist",
  notesSection: "checklist",
  packingSection: "checklist",
};
const SOURCE_KIND_LABELS = {
  story: "行程正文",
  transit: "转场交通",
  food: "餐饮补给",
  stay: "住宿落脚",
  booking: "预约提醒",
  tip: "避坑提示",
};

const routeSpine = [
  { name: "昆明", note: "缓冲身体和作息，把第一天放松下来。" },
  { name: "大理", note: "海东、双廊、喜洲和沙溪拉开审美基调。" },
  { name: "泸沽湖", note: "两天慢下来，重点看湖湾、码头和住景房。" },
  { name: "香格里拉", note: "从纳帕海开始进入高原，先适应再发力。" },
  { name: "梅里", note: "把雪山观景台和飞来寺留给天光窗口。" },
  { name: "丽江", note: "用虎跳峡转场，最后把雪山段单独留出来。" },
];

const heroHighlightCards = [
  {
    eyebrow: "Lake Line",
    title: "洱海东线到海西",
    body: "海东、理想邦、双廊、喜洲和海西长廊把大理段拆成了两种完全不同的观看方式。",
  },
  {
    eyebrow: "Plateau",
    title: "Day 7 起进入高原",
    body: "纳帕海、独克宗、普达措、松赞林寺和梅里，需要把体力和海拔都算进去。",
  },
  {
    eyebrow: "Snow End",
    title: "雪山收官要提前准备",
    body: "冰川公园抢票、氧气、项目减法和蓝月谷步行，是最后一天真正的关键。",
  },
  {
    eyebrow: "Avoid",
    title: "先记住收费避坑",
    body: "理想邦楼顶、纳帕海收费景区、飞来寺机位、虎跳峡扶梯和蓝月谷观光车都该后置。",
  },
];

const overviewCards = [
  {
    eyebrow: "First",
    title: "先锁交通和雪山票",
    body: "昆明到大理的高铁和玉龙雪山冰川公园门票，是整条线最该提前处理的两个点。",
    action: "看预订",
    target: "toolsSection",
  },
  {
    eyebrow: "Pace",
    title: "Day 7 开始进入高原",
    body: "泸沽湖之后别再塞爆行程。纳帕海和独克宗古城本质上是适应日，不是打卡日。",
    action: "看高原段",
    target: "daysSection",
  },
  {
    eyebrow: "Avoid",
    title: "先记住不值的付费点",
    body: "理想邦楼顶、纳帕海收费景区、飞来寺机位、虎跳峡扶梯和蓝月谷观光车都该靠后。",
    action: "看避坑",
    target: "overviewSection",
  },
  {
    eyebrow: "Pack",
    title: "药、防晒、充电别拖到后半程",
    body: "真正容易出问题的是高原段和雪山段，补给最好在丽江或古城里提前解决。",
    action: "看清单",
    target: "packingSection",
  },
];

const bookingToolCards = [
  {
    id: "train",
    title: "先锁昆明 → 大理高铁",
    body: "这张票决定前半程节奏能不能顺下来，越临近越容易被迫改计划。",
    meta: ["高铁", "Day 2"],
    actions: [
      { label: "看时间线", kind: "scroll", target: "toolsSection" },
      { label: "打开 Day 2", kind: "day", dayId: "day2", tab: "route" },
    ],
  },
  {
    id: "hotel",
    title: "海东 / 沙溪 / 泸沽湖 / 梅里提前订",
    body: "这几段住宿波动最大，文档建议先用平台找电话，再直接沟通议价。",
    meta: ["住宿", "电话议价"],
    actions: [
      { label: "筛到大理段", kind: "phase", phase: "warmup" },
      { label: "看 Day 9", kind: "day", dayId: "day9", tab: "stay" },
    ],
  },
  {
    id: "snow",
    title: "冰川公园提前 7 天 20:00 抢",
    body: "玉龙雪山最重要的不是临场冲，而是提前把所有出行人信息录完，守准 20:00。",
    meta: ["必须提前订", "Day 11"],
    actions: [
      { label: "打开抢票原文", kind: "day", dayId: "day11", tab: "source" },
      { label: "只看必须提前订", kind: "pitfall", category: "必须提前订" },
    ],
  },
  {
    id: "oxygen",
    title: "高原段前先补氧气和药",
    body: "真正连续高海拔的是香格里拉、梅里和玉龙雪山，别等上去之后再找氧气瓶。",
    meta: ["高原提醒", "Day 7+"],
    actions: [
      { label: "看高原提醒", kind: "pitfall", category: "高原提醒" },
      { label: "打开 Day 7", kind: "day", dayId: "day7", tab: "route" },
    ],
  },
];

const pitfallTemplates = [
  {
    id: "day1_skip_village",
    dayId: "day1",
    title: "民族村直接绕开",
    category: "建议绕开",
    terms: ["民族文化村建议不去"],
    fallback: "民族文化村建议不去，就是个人造村子门票还贵，去滇池玩玩就行了。",
  },
  {
    id: "day2_skip_rooftop",
    dayId: "day2",
    title: "理想邦别上楼顶",
    category: "收费不值",
    terms: ["楼顶要喝茶消费", "免费的长廊即可"],
    fallback: "但上到楼顶要喝茶消费，这个就看自己了，个人觉得走走免费的长廊即可。",
  },
  {
    id: "day3_skip_island",
    dayId: "day3",
    title: "南诏风情岛不是必须",
    category: "建议绕开",
    terms: ["没有兴趣上岛", "就在岸边看看也可以"],
    fallback: "这里是仙剑一的拍摄地，如果没有兴趣上岛，就在岸边看看也可以了。",
  },
  {
    id: "day7_napa_free",
    dayId: "day7",
    title: "纳帕海走环湖路",
    category: "收费不值",
    terms: ["完全不用进收费景区", "走环湖路不仅可以深入其中"],
    fallback: "走环湖路不仅可以深入其中，更重要的是可以免门票，完全不用进收费景区！",
  },
  {
    id: "day7_plateau",
    dayId: "day7",
    title: "高原第一天别排满",
    category: "高原提醒",
    terms: ["泸沽湖到香格里拉", "附近午餐（自驾约5小时）"],
    fallback: "9:00—16:00沽湖风景区—香格里拉，附近午餐（自驾约5小时）。这天更适合把状态稳住，而不是继续加码。",
  },
  {
    id: "day8_dajinfan",
    dayId: "day8",
    title: "大金幡不值得进",
    category: "收费不值",
    terms: ["大金幡", "非常不值"],
    fallback: "注：如果想凹造型出片，可以导航“大金幡”，就在独克宗边缘。但也要收门票，非常不值。",
  },
  {
    id: "day9_feilai",
    dayId: "day9",
    title: "飞来寺机位别硬买",
    category: "收费不值",
    terms: ["往下走200米", "完全没必要花钱"],
    fallback: "如果还是要收费往下走200米，看到的景色一模一样，总之完全没必要花钱。",
  },
  {
    id: "day10_tiger",
    dayId: "day10",
    title: "虎跳峡扶梯别买",
    category: "收费不值",
    terms: ["没必要补80元", "扶梯票"],
    fallback: "下去单程10分钟就到了，如果想省钱，完全没必要补80元/人的扶梯票。",
  },
  {
    id: "day11_ticket",
    dayId: "day11",
    title: "冰川公园要提前 7 天守点",
    category: "必须提前订",
    terms: ["提前7天20:00放票", "冰川公园必须准点抢票"],
    fallback: "关注“丽江旅游集团”，提前7天20:00放票，旺季必须提前预订。",
  },
  {
    id: "day11_oxygen",
    dayId: "day11",
    title: "上雪山前先买氧气瓶",
    category: "高原提醒",
    terms: ["最好在古城买个氧气瓶", "高海拔地区"],
    fallback: "如果之前没去过高海拔地区，最好在古城买个氧气瓶。",
  },
  {
    id: "day11_bluemoon",
    dayId: "day11",
    title: "蓝月谷观光车别坐",
    category: "收费不值",
    terms: ["蓝月谷50元", "观光车完全没必要"],
    fallback: "最后强调！蓝月谷50元/人观光车完全没必要买，走一点路很快出去了！",
  },
];

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

const dayEnhancements = {
  day1: {
    decision: "第一天别贪多，重点是缓冲、散步和把长线状态养起来。",
    images: range(1, 5),
  },
  day2: {
    decision: "高铁进大理后先拍海东，不急着把精力花在古城里。",
    images: range(6, 10),
  },
  day3: {
    decision: "这一天适合把洱海东线最完整地跑一遍，但晚上别再硬塞项目。",
    images: range(11, 15),
  },
  day4: {
    decision: "海西适合慢拍，沙溪适合慢住，节奏宁可松一点也不要赶。",
    images: range(16, 19),
  },
  day5: {
    decision: "泸沽湖第一天先适应和看湖，住景房比娱乐项目更值。",
    images: range(20, 24),
  },
  day6: {
    decision: "第二天才是完整环湖日，重点放在湖湾、码头和文化地貌。",
    images: range(25, 31),
  },
  day7: {
    decision: "这是高原过渡日，不是加码日，最重要的是状态别崩。",
    images: range(32, 33),
  },
  day8: {
    decision: "香格里拉最重体力的一天，徒步和寺院只能留够体力慢慢看。",
    images: range(34, 39),
  },
  day9: {
    decision: "梅里段的价值在一路抬升的视野，不在赶到终点本身。",
    images: range(40, 43),
  },
  day10: {
    decision: "返程这天以移动和补给为主，虎跳峡只是硬朗的转场点。",
    images: range(44, 44),
  },
  day11: {
    decision: "收官日必须主动做减法，雪山里别妄想一天全刷完。",
    images: range(45, 48),
  },
};

const els = {
  siteTopbar: document.querySelector(".site-topbar"),
  openViewMenuBtn: document.getElementById("openViewMenuBtn"),
  phasePickerBtn: document.getElementById("phasePickerBtn"),
  phasePickerLabel: document.getElementById("phasePickerLabel"),
  topbarMenuShell: document.getElementById("topbarMenuShell"),
  topbarMenuBackdrop: document.getElementById("topbarMenuBackdrop"),
  viewMenu: document.getElementById("viewMenu"),
  phaseMenu: document.getElementById("phaseMenu"),
  heroImage: document.getElementById("heroImage"),
  heroActions: document.getElementById("heroActions"),
  heroHighlights: document.getElementById("heroHighlights"),
  overviewFacts: document.getElementById("overviewFacts"),
  viewPanels: document.querySelectorAll("[data-view-panel]"),
  routeStrip: document.getElementById("routeStrip"),
  overviewTools: document.getElementById("overviewTools"),
  phaseFilter: document.getElementById("phaseFilter"),
  pitfallFilters: document.getElementById("pitfallFilters"),
  pitfallList: document.getElementById("pitfallList"),
  featuredGallery: document.getElementById("featuredGallery"),
  attractionFocus: document.getElementById("attractionFocus"),
  dateRail: document.getElementById("dateRail"),
  daysContainer: document.getElementById("daysContainer"),
  bookingTools: document.getElementById("bookingTools"),
  bookingList: document.getElementById("bookingList"),
  globalNotes: document.getElementById("globalNotes"),
  packingActions: document.getElementById("packingActions"),
  packingList: document.getElementById("packingList"),
  packingFloatingProgress: document.getElementById("packingFloatingProgress"),
  searchShell: document.getElementById("searchShell"),
  searchClearBtn: document.getElementById("searchClearBtn"),
  searchInput: document.getElementById("searchInput"),
  searchFilters: document.getElementById("searchFilters"),
  searchSummary: document.getElementById("searchSummary"),
  searchResults: document.getElementById("searchResults"),
  openSearchBtn: document.getElementById("openSearchBtn"),
  detailShell: document.getElementById("detailShell"),
  detailSheet: document.getElementById("detailSheet"),
  detailPhaseBadge: document.getElementById("detailPhaseBadge"),
  detailLeadImage: document.getElementById("detailLeadImage"),
  detailEyebrow: document.getElementById("detailEyebrow"),
  detailTitle: document.getElementById("detailTitle"),
  detailDecision: document.getElementById("detailDecision"),
  detailSummary: document.getElementById("detailSummary"),
  detailBadges: document.getElementById("detailBadges"),
  detailGalleryRail: document.getElementById("detailGalleryRail"),
  detailTabs: document.getElementById("detailTabs"),
  detailBody: document.getElementById("detailBody"),
  lightboxShell: document.getElementById("lightboxShell"),
  lightboxFrame: document.getElementById("lightboxFrame"),
  lightboxImage: document.getElementById("lightboxImage"),
  lightboxCounter: document.getElementById("lightboxCounter"),
  lightboxCaption: document.getElementById("lightboxCaption"),
  lightboxSource: document.getElementById("lightboxSource"),
  lightboxSourceBtn: document.getElementById("lightboxSourceBtn"),
  scrollProgress: document.getElementById("scrollProgress"),
};

const sourceStore = {
  ready: false,
  mode: "",
  trip: null,
  stats: null,
  byDayId: {},
  themesById: {},
  attractionsById: {},
  attractionOrder: [],
  mediaBySequence: {},
  loadError: "",
};

const state = {
  currentView: "itinerary",
  phase: "all",
  itineraryDayId: "day1",
  attractionId: "",
  searchQuery: "",
  searchMode: "all",
  searchOpen: false,
  detailOpen: false,
  detailDayId: "",
  detailTab: "route",
  detailImageIndex: 0,
  sourceFocusSequence: null,
  lightboxOpen: false,
  lightboxDayId: "",
  lightboxIndex: 0,
  pitfallCategory: "all",
  activeSection: "daysSection",
  viewMenuOpen: false,
  phaseMenuOpen: false,
  packing: loadJsonStorage(PACKING_STORAGE_KEY, {}),
  packingOpenGroups: loadPackingGroupState(),
};

let hashSyncSuspended = false;
let chromeSyncFrame = 0;
let viewportSyncFrame = 0;
let chromeResizeObserver = null;
let lightboxTouchStartX = 0;
let lightboxTouchStartY = 0;
let keyboardOpen = false;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function trimText(value, maxLength = 120) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1)}…`;
}

function normalizeComparableText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function uniqueBy(items, getKey) {
  const seen = new Set();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeSourcePath(relativePath) {
  return `/static/guide/source/yunnan_trip_v4/${String(relativePath).replace(/^\.\//, "")}`;
}

function loadJsonStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJsonStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
}

function loadPackingGroupState() {
  const stored = loadJsonStorage(PACKING_GROUP_STORAGE_KEY, null);
  if (stored) {
    return stored;
  }

  return Object.fromEntries(packingGroups.map((group) => [group.id, true]));
}

function savePackingGroupState() {
  saveJsonStorage(PACKING_GROUP_STORAGE_KEY, state.packingOpenGroups);
}

function getMobilePlatform() {
  const userAgent = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "ios";
  }
  if (/Android/i.test(userAgent)) {
    return "android";
  }
  return "unknown";
}

function buildQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    query.set(key, String(value));
  });
  return query.toString();
}

function buildAmapRouteUrl(platform, config) {
  const query = buildQueryString({
    sourceApplication: AMAP_SOURCE_APPLICATION,
    sname: config.startName || "",
    dname: config.destinationName,
    dev: "0",
    t: config.travelType,
    m: "0",
  });

  if (platform === "ios") {
    return `iosamap://path?${query}`;
  }

  return `amapuri://route/plan/?${query}`;
}

function openAmapTestRoute(testId) {
  const config = AMAP_TEST_ROUTES[testId];
  if (!config) return;

  const platform = getMobilePlatform();
  if (platform === "unknown") {
    window.alert("请在手机浏览器里点这个高德测试入口。");
    return;
  }

  window.location.href = buildAmapRouteUrl(platform, config);
}

function buildList(items) {
  return `<ul class="detail-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function docImage(index) {
  const seq = String(index).padStart(3, "0");
  const ext = imageExtOverrides.has(index) ? "jpeg" : "png";
  return `/static/guide/source/yunnan_trip_v4/images/image-${seq}.${ext}`;
}

function getDayById(dayId) {
  return dayData.find((day) => day.id === dayId) || null;
}

function getDayEnhancement(dayId) {
  return dayEnhancements[dayId] || { decision: "", images: [] };
}

function getDaySource(dayId) {
  return sourceStore.byDayId[dayId] || null;
}

function getAttractionById(attractionId) {
  return sourceStore.attractionsById[attractionId] || null;
}

function getThemeById(themeId) {
  return sourceStore.themesById[themeId] || null;
}

function getThemeLabel(themeId) {
  return getThemeById(themeId)?.title || "";
}

function getAttractionLabel(attractionId) {
  return getAttractionById(attractionId)?.title || "";
}

function getMediaBySequence(sequence) {
  return sourceStore.mediaBySequence[Number(sequence)] || null;
}

function getDayImageItems(dayId) {
  const daySource = getDaySource(dayId);
  if (daySource?.images?.length) {
    return daySource.images;
  }

  return getDayEnhancement(dayId).images.map((sequence) => ({
    sequence,
    src: docImage(sequence),
    paragraph_index: null,
    reference_excerpt: "",
    reference_before: "",
    reference_after: "",
  }));
}

function findImageIndexBySequence(dayId, sequence) {
  const images = getDayImageItems(dayId);
  return images.findIndex((image) => Number(image.sequence) === Number(sequence));
}

function renderMetaPills({ attractionIds = [], themeIds = [], limit = 4 } = {}) {
  const entries = [
    ...attractionIds
      .map((attractionId) => ({ kind: "attraction", label: getAttractionLabel(attractionId) }))
      .filter((item) => item.label),
    ...themeIds
      .map((themeId) => ({ kind: "theme", label: getThemeLabel(themeId) }))
      .filter((item) => item.label),
  ]
    .filter((item, index, array) =>
      array.findIndex((candidate) => candidate.kind === item.kind && candidate.label === item.label) === index,
    )
    .slice(0, limit);

  if (!entries.length) {
    return "";
  }

  return `
    <div class="meta-pills">
      ${entries
        .map(
          (entry) => `
            <span class="meta-pill" data-kind="${escapeHtml(entry.kind)}">${escapeHtml(entry.label)}</span>
          `,
        )
        .join("")}
    </div>
  `;
}

function includesQuery(value, query) {
  return String(value || "").toLowerCase().includes(query);
}

function getSearchBlob(day) {
  const daySource = getDaySource(day.id);
  return [
    day.day,
    day.date,
    day.city,
    day.phaseLabel,
    day.title,
    day.summary,
    day.route,
    day.logistics,
    ...day.highlights,
    ...day.food,
    day.stay,
    ...day.tips,
    ...(daySource?.attraction_ids || []).map((attractionId) => getAttractionLabel(attractionId)),
    daySource?.text_blob || "",
  ]
    .join(" ")
    .toLowerCase();
}

function getPhaseDays() {
  return dayData.filter((day) => state.phase === "all" || day.phase === state.phase);
}

function getPhaseLabel() {
  return phaseOptions.find((phase) => phase.id === state.phase)?.label || "全部日程";
}

function getDayTags(day) {
  return [day.city, `${day.pace}节奏`, day.altitude];
}

function getReferenceSnippet(image) {
  return trimText(image.reference_excerpt || image.reference_after || image.reference_before || "", 86);
}

function getSafeDetailTab(tabId) {
  return DETAIL_TABS.some((tab) => tab.id === tabId) ? tabId : "route";
}

function getDaySourceParagraphs(dayId) {
  const daySource = getDaySource(dayId);
  if (!daySource?.source_blocks?.length) {
    return [];
  }

  return daySource.source_blocks.flatMap((block) => {
    if (block.type !== "text") {
      return [];
    }

    return block.paragraph_items?.length
      ? block.paragraph_items
      : [{
          id: block.id,
          text: block.text,
          block_kind: block.block_kind || "story",
          attraction_ids: block.attraction_ids || [],
          theme_ids: block.theme_ids || [],
        }];
  });
}

function collectDayParagraphs(dayId, matcher) {
  return uniqueBy(
    getDaySourceParagraphs(dayId)
      .filter((paragraph) => paragraph.text && matcher(paragraph))
      .map((paragraph) => paragraph.text.trim())
      .filter(Boolean),
    (text) => normalizeComparableText(text),
  );
}

function renderDetailNoteCards(items, fallbackText = "") {
  if (!items.length) {
    return fallbackText ? `<p>${escapeHtml(fallbackText)}</p>` : `<p class="chapter-panel__empty">当前没有补充内容。</p>`;
  }

  return `
    <div class="detail-note-stack">
      ${items
        .map(
          (item) => `
            <article class="detail-note-card">
              <p>${escapeHtml(item)}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function getSearchResultTags(result) {
  return [
    result.typeLabel || "",
    ...(result.tags || []),
  ].filter(Boolean);
}

function highlightMatch(text, query) {
  if (!query.trim()) {
    return escapeHtml(text);
  }

  const matcher = new RegExp(escapeRegExp(query.trim()), "ig");
  let cursor = 0;
  let result = "";

  for (const match of text.matchAll(matcher)) {
    const index = match.index ?? 0;
    result += escapeHtml(text.slice(cursor, index));
    result += `<mark>${escapeHtml(match[0])}</mark>`;
    cursor = index + match[0].length;
  }

  result += escapeHtml(text.slice(cursor));
  return result;
}

function syncBodyLock() {
  document.body.classList.toggle(
    "has-modal-open",
    state.searchOpen || state.detailOpen || state.lightboxOpen,
  );
  scheduleViewportMetricSync();
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 719px)").matches;
}

function syncScrollableSelection(container, selector = ".is-active") {
  if (!container || !isMobileViewport()) return;
  const active = container.querySelector(selector);
  if (!active) return;

  window.requestAnimationFrame(() => {
    active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  });
}

function syncViewportMetrics() {
  const rootStyle = document.documentElement.style;
  const viewport = window.visualViewport;
  const viewportHeight = Math.round(viewport?.height || window.innerHeight);
  const viewportWidth = Math.round(viewport?.width || window.innerWidth);
  const keyboardOffset = viewport
    ? Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop))
    : 0;

  keyboardOpen = isMobileViewport() && keyboardOffset > 120;
  document.body.classList.toggle("is-keyboard-open", keyboardOpen);
  rootStyle.setProperty("--app-height", `${viewportHeight}px`);
  rootStyle.setProperty("--app-width", `${viewportWidth}px`);
}

function syncChromeOffsets() {
  const rootStyle = document.documentElement.style;
  const topbarRect = els.siteTopbar?.getBoundingClientRect();
  const topOffset = topbarRect
    ? Math.max(Math.ceil(topbarRect.bottom + 12), 88)
    : 96;

  rootStyle.setProperty("--chrome-top-offset", `${topOffset}px`);
  rootStyle.setProperty("--chrome-bottom-offset", `${keyboardOpen ? 20 : 28}px`);
}

function scheduleChromeOffsetSync() {
  if (chromeSyncFrame) {
    window.cancelAnimationFrame(chromeSyncFrame);
  }
  chromeSyncFrame = window.requestAnimationFrame(() => {
    chromeSyncFrame = 0;
    syncChromeOffsets();
  });
}

function scheduleViewportMetricSync() {
  if (viewportSyncFrame) {
    window.cancelAnimationFrame(viewportSyncFrame);
  }

  viewportSyncFrame = window.requestAnimationFrame(() => {
    viewportSyncFrame = 0;
    syncViewportMetrics();
    syncChromeOffsets();
  });
}

function bindChromeObservers() {
  if (!("ResizeObserver" in window) || chromeResizeObserver) {
    return;
  }

  chromeResizeObserver = new ResizeObserver(() => {
    scheduleChromeOffsetSync();
  });

  if (els.siteTopbar) {
    chromeResizeObserver.observe(els.siteTopbar);
  }
}

function bindViewportObservers() {
  if (!window.visualViewport) {
    return;
  }

  window.visualViewport.addEventListener("resize", scheduleViewportMetricSync, { passive: true });
  window.visualViewport.addEventListener("scroll", scheduleViewportMetricSync, { passive: true });
}

function buildHash(paramsObject = {}) {
  const params = new URLSearchParams();
  Object.entries(paramsObject).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    params.set(key, String(value));
  });
  return params.toString();
}

function setHash(paramsObject = {}) {
  const hash = buildHash(paramsObject);
  const nextUrl = `${window.location.pathname}${window.location.search}${hash ? `#${hash}` : ""}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (currentUrl === nextUrl) return;

  hashSyncSuspended = true;
  history.replaceState(null, "", nextUrl);
  window.setTimeout(() => {
    hashSyncSuspended = false;
  }, 0);
}

function getViewLabel(viewId) {
  return VIEW_OPTIONS.find((view) => view.id === viewId)?.label || "行程";
}

function getPhaseConfig(phaseId) {
  return phaseOptions.find((phase) => phase.id === phaseId) || phaseOptions[0];
}

function getPackingProgress() {
  const totalItems = packingGroups.reduce((sum, group) => sum + group.items.length, 0);
  const doneItems = Object.values(state.packing).filter(Boolean).length;
  return { doneItems, totalItems };
}

function renderViewMenu() {
  if (!els.viewMenu) return;
  els.viewMenu.innerHTML = `
    <div class="topbar-menu__head">
      <p class="eyebrow">View</p>
      <h2>切换浏览方式</h2>
    </div>
    <div class="topbar-menu__list">
      ${VIEW_OPTIONS
        .map((view) => {
          const isActive = view.id === state.currentView;
          return `
            <button
              class="menu-option ${isActive ? "is-active" : ""}"
              type="button"
              data-view="${escapeHtml(view.id)}"
            >
              <span class="menu-option__check" aria-hidden="true">${isActive ? "✓" : ""}</span>
              <span class="menu-option__copy">
                <strong>${escapeHtml(view.label)}</strong>
                <span>${escapeHtml(view.hint)}</span>
              </span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPhasePicker() {
  const isChecklist = state.currentView === "checklist";
  const phaseConfig = getPhaseConfig(state.phase);
  const { doneItems, totalItems } = getPackingProgress();

  if (els.phasePickerLabel) {
    els.phasePickerLabel.textContent = isChecklist ? getViewLabel("checklist") : phaseConfig.label;
  }

  if (els.phaseFilter) {
    if (isChecklist) {
      els.phaseFilter.innerHTML = CHECKLIST_TOPBAR_ITEMS
        .map((item) => {
          const isActive = state.activeSection === item.id;
          const isPacking = item.id === "packingSection";
          const isComplete = isPacking && doneItems === totalItems && totalItems > 0;
          return `
            <button
              class="menu-option ${isActive ? "is-active" : ""}"
              type="button"
              data-checklist-target="${escapeHtml(item.id)}"
            >
              <span class="menu-option__check" aria-hidden="true">${isActive || isComplete ? "✓" : ""}</span>
              <span class="menu-option__copy">
                <strong>${escapeHtml(item.label)}</strong>
                <span>${isPacking ? escapeHtml(`打包进度 ${doneItems}/${totalItems}`) : "点击后跳到对应清单分区"}</span>
              </span>
            </button>
          `;
        })
        .join("");
    } else {
      renderPhaseFilters();
    }
  }

  const menuEyebrow = isChecklist ? "Checklist" : "Phase Filter";
  const menuTitle = isChecklist ? "切换清单分区" : "切换当前范围";

  if (els.phaseMenu) {
    const eyebrow = els.phaseMenu.querySelector(".eyebrow");
    const title = els.phaseMenu.querySelector("h2");
    if (eyebrow) eyebrow.textContent = menuEyebrow;
    if (title) title.textContent = menuTitle;
    els.phaseMenu.hidden = !state.phaseMenuOpen;
  }

  if (els.phasePickerBtn) {
    els.phasePickerBtn.classList.remove("is-disabled");
    els.phasePickerBtn.setAttribute("aria-expanded", state.phaseMenuOpen ? "true" : "false");
  }
}

function syncTopbarMenus() {
  renderViewMenu();
  renderPhasePicker();

  if (els.openViewMenuBtn) {
    els.openViewMenuBtn.setAttribute("aria-expanded", state.viewMenuOpen ? "true" : "false");
  }

  renderPackingFloatingProgress();

  if (els.viewMenu) {
    els.viewMenu.hidden = !state.viewMenuOpen;
  }

  if (els.topbarMenuShell) {
    els.topbarMenuShell.hidden = !(state.viewMenuOpen || state.phaseMenuOpen);
  }
}

function closeTopbarMenus() {
  state.viewMenuOpen = false;
  state.phaseMenuOpen = false;
  syncTopbarMenus();
}

function updateViewNavigation() {
  els.viewPanels.forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== state.currentView;
  });

  syncTopbarMenus();
  scheduleChromeOffsetSync();
}

function switchView(viewId, options = {}) {
  if (!VIEW_OPTIONS.some((view) => view.id === viewId)) return;

  state.currentView = viewId;
  state.viewMenuOpen = false;
  state.phaseMenuOpen = false;
  if (!options.preserveSection) {
    state.activeSection = PRIMARY_VIEW_SECTION[viewId];
  }

  updateViewNavigation();

  if (!options.preserveScroll) {
    window.scrollTo({ top: 0, behavior: options.behavior || "auto" });
  }

  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function syncHashFromState() {
  if (state.lightboxOpen && state.lightboxDayId) {
    const images = getDayImageItems(state.lightboxDayId);
    const image = images[state.lightboxIndex];
    setHash({
      view: state.currentView,
      image: image ? `${state.lightboxDayId}:${image.sequence}` : state.lightboxDayId,
      tab: "gallery",
    });
    return;
  }

  if (state.detailOpen && state.detailDayId) {
    setHash({
      view: state.currentView,
      day: state.detailDayId,
      tab: state.detailTab,
      attraction: state.attractionId && state.currentView === "attractions" ? state.attractionId : "",
      source: state.detailTab === "source" && state.sourceFocusSequence ? state.sourceFocusSequence : "",
    });
    return;
  }

  const params = { view: state.currentView };
  if (state.currentView === "itinerary" && state.itineraryDayId) {
    params.day = state.itineraryDayId;
  }
  if (state.currentView === "attractions" && state.attractionId) {
    params.attraction = state.attractionId;
  }
  if (state.pitfallCategory !== "all") {
    params.tool = `pitfalls:${state.pitfallCategory}`;
  } else if (state.activeSection && state.activeSection !== PRIMARY_VIEW_SECTION[state.currentView]) {
    params.tool = state.activeSection;
  }
  setHash(params);
}

function scrollToSection(sectionId, options = {}) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const viewId = SECTION_TO_VIEW[sectionId];
  if (viewId) {
    switchView(viewId, { preserveSection: true, preserveScroll: true, skipHashSync: true });
  }

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: options.behavior || "smooth", block: "start" });
  });

  if (!options.skipHashSync) {
    state.activeSection = sectionId;
    syncHashFromState();
  }
}

function focusItineraryDay(dayId, options = {}) {
  if (!getDayById(dayId)) return;
  state.itineraryDayId = dayId;
  switchView("itinerary", { skipHashSync: true, preserveScroll: true });
  renderPhaseScopedSections();
  if (!options.skipScroll) {
    scrollToSection("daysSection", { skipHashSync: Boolean(options.skipHashSync) });
  } else if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function focusAttraction(attractionId, options = {}) {
  if (!getAttractionById(attractionId)) return;
  state.attractionId = attractionId;
  switchView("attractions", { skipHashSync: true, preserveScroll: true });
  renderPhaseScopedSections();
  if (!options.skipScroll) {
    scrollToSection("gallerySection", { skipHashSync: Boolean(options.skipHashSync) });
  } else if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function renderRouteStrip() {
  els.routeStrip.innerHTML = routeSpine
    .map(
      (stop, index) => `
        <article class="route-stop">
          <span class="route-stop__index">${index + 1}</span>
          <strong class="route-stop__name">${escapeHtml(stop.name)}</strong>
          <span class="route-stop__note">${escapeHtml(stop.note)}</span>
        </article>
      `,
    )
    .join("");
}

function renderHeroHighlights() {
  els.heroHighlights.innerHTML = heroHighlightCards
    .map(
      (card) => `
        <article class="hero-highlight-card">
          <p class="eyebrow">${escapeHtml(card.eyebrow)}</p>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.body)}</p>
        </article>
      `,
    )
    .join("");
}

function renderOverviewFacts() {
  const stats = sourceStore.stats;
  const facts = [
    { label: "行程长度", value: "11 天", detail: "昆明 → 丽江闭环" },
    { label: "路线跨度", value: `${routeStops.length} 站`, detail: routeStops.join(" · ") },
    { label: "高原起点", value: "Day 7", detail: "纳帕海与独克宗起步" },
    {
      label: "素材归档",
      value: stats ? `${stats.image_count} 图` : "48 图",
      detail: stats ? `${stats.paragraph_count} 段原文` : "原文已接入",
    },
  ];

  els.overviewFacts.innerHTML = facts
    .map(
      (fact) => `
        <article class="trip-fact-card">
          <p class="trip-fact-card__label">${escapeHtml(fact.label)}</p>
          <strong class="trip-fact-card__value">${escapeHtml(fact.value)}</strong>
          <span class="trip-fact-card__detail">${escapeHtml(fact.detail)}</span>
        </article>
      `,
    )
    .join("");
}

function renderHeroMedia() {
  if (!els.heroImage) return;
  const preferred = getMediaBySequence(45) || getMediaBySequence(40) || getMediaBySequence(20);
  if (!preferred?.src) return;
  els.heroImage.src = preferred.src;
}

function renderOverviewTools() {
  els.overviewTools.innerHTML = overviewCards
    .map(
      (card) => `
        <article class="overview-card">
          <p class="eyebrow">${escapeHtml(card.eyebrow)}</p>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.body)}</p>
          <button class="overview-card__action" type="button" data-scroll-target="${escapeHtml(card.target)}">
            ${escapeHtml(card.action)}
          </button>
        </article>
      `,
    )
    .join("");
}

function renderPhaseFilters() {
  if (!els.phaseFilter) return;
  els.phaseFilter.innerHTML = phaseOptions
    .map(
      (phase) => {
        const isActive = phase.id === state.phase;
        return `
          <button
            class="menu-option ${isActive ? "is-active" : ""}"
            type="button"
            data-phase="${escapeHtml(phase.id)}"
          >
            <span class="menu-option__check" aria-hidden="true">${isActive ? "✓" : ""}</span>
            <span class="menu-option__copy">
              <strong>${escapeHtml(phase.label)}</strong>
              <span>${escapeHtml(phase.hint)}</span>
            </span>
          </button>
        `;
      },
    )
    .join("");
}

function resolvePitfallQuote(template) {
  const daySource = getDaySource(template.dayId);
  if (daySource?.paragraphs?.length) {
    const match = daySource.paragraphs.find((paragraph) =>
      template.terms.some((term) => paragraph.includes(term)),
    );
    if (match) {
      return match;
    }
  }
  return template.fallback;
}

function getPitfallItems() {
  return uniqueBy(
    pitfallTemplates
      .filter((item) => state.pitfallCategory === "all" || item.category === state.pitfallCategory)
      .map((item) => ({
        ...item,
        quote: resolvePitfallQuote(item),
      })),
    (item) => [item.dayId, item.category, item.title, normalizeComparableText(item.quote)].join("::"),
  );
}

function renderPitfallFilters() {
  els.pitfallFilters.innerHTML = PITFALL_CATEGORIES.map((category) => {
    const label = category === "all" ? "全部坑位" : category;
    return `
      <button
        class="pitfall-filter ${category === state.pitfallCategory ? "is-active" : ""}"
        type="button"
        data-pitfall-category="${escapeHtml(category)}"
      >
        ${escapeHtml(label)}
      </button>
    `;
  }).join("");
  syncScrollableSelection(els.pitfallFilters);
}

function renderPitfalls() {
  const items = getPitfallItems();
  els.pitfallList.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <button class="pitfall-chip" type="button" data-open-day="${escapeHtml(item.dayId)}" data-open-tab="source">
              <strong>${escapeHtml(`${item.category} · ${item.title}`)}</strong>
              <span>${escapeHtml(trimText(item.quote, 104))}</span>
            </button>
          `,
        )
        .join("")
    : `<div class="empty-state">这个分类下暂时没有坑位提醒。</div>`;
}

function getVisibleAttractions(days) {
  const visibleDayIds = new Set(days.map((day) => day.id));
  return sourceStore.attractionOrder
    .map((attractionId) => getAttractionById(attractionId))
    .filter(Boolean)
    .filter((attraction) => attraction.day_ids.some((dayId) => visibleDayIds.has(dayId)));
}

function getAttractionCover(attraction) {
  return getMediaBySequence(attraction.cover_image_sequence)
    || getDayImageItems(attraction.primary_day_id || attraction.day_ids[0])[0]
    || null;
}

function getVisibleAttractionPool(days) {
  return getVisibleAttractions(days);
}

function ensureFocusedAttraction(days) {
  const attractions = getVisibleAttractionPool(days);
  if (!attractions.length) {
    state.attractionId = "";
    return null;
  }

  if (!attractions.some((attraction) => attraction.id === state.attractionId)) {
    state.attractionId = attractions[0].id;
  }

  return getAttractionById(state.attractionId) || attractions[0];
}

function collectAttractionParagraphs(attraction) {
  return uniqueBy(
    attraction.day_ids
      .flatMap((dayId) => getDaySource(dayId)?.paragraph_items || [])
      .filter((paragraph) => paragraph.attraction_ids?.includes(attraction.id)),
    (paragraph) => [paragraph.block_kind || "story", normalizeComparableText(paragraph.text)].join("::"),
  );
}

function collectAttractionImages(attraction) {
  return uniqueBy(
    attraction.image_sequences
      .map((sequence) => getMediaBySequence(sequence))
      .filter(Boolean),
    (image) => String(image.sequence),
  );
}

function matchesAttractionText(attraction, text) {
  const normalized = String(text || "");
  return attraction.aliases.some((alias) => normalized.includes(alias)) || normalized.includes(attraction.title);
}

function getAttractionPitfalls(attraction) {
  const exact = uniqueBy(
    pitfallTemplates
      .filter((item) => attraction.day_ids.includes(item.dayId))
      .map((item) => ({ ...item, quote: resolvePitfallQuote(item) }))
      .filter((item) => matchesAttractionText(attraction, `${item.title} ${item.quote}`)),
    (item) => [item.dayId, item.category, item.title, normalizeComparableText(item.quote)].join("::"),
  );

  if (exact.length) {
    return exact;
  }

  return uniqueBy(
    pitfallTemplates
      .filter((item) => attraction.day_ids.includes(item.dayId))
      .map((item) => ({ ...item, quote: resolvePitfallQuote(item) })),
    (item) => [item.dayId, item.category, item.title, normalizeComparableText(item.quote)].join("::"),
  ).slice(0, 3);
}

function getAttractionPriceNotes(attraction) {
  return collectAttractionParagraphs(attraction)
    .filter((paragraph) => /(\d+\s*元|门票|收费|票价|免门票)/.test(paragraph.text))
    .map((paragraph) => paragraph.text)
    .filter((text, index, array) => array.findIndex((candidate) => normalizeComparableText(candidate) === normalizeComparableText(text)) === index)
    .slice(0, 4);
}

function getAttractionBookingNotes(attraction) {
  return collectAttractionParagraphs(attraction)
    .filter((paragraph) => paragraph.block_kind === "booking" || paragraph.theme_ids?.includes("booking"))
    .map((paragraph) => paragraph.text)
    .filter((text, index, array) => array.findIndex((candidate) => normalizeComparableText(candidate) === normalizeComparableText(text)) === index)
    .slice(0, 3);
}

function getAttractionAdvice(attraction) {
  const paragraphs = collectAttractionParagraphs(attraction);
  const scenicAdvice = paragraphs.find((paragraph) =>
    /(建议|适合|推荐|最好|值|慢慢|提前|窗口|出片|看景|节奏)/.test(paragraph.text),
  );
  return scenicAdvice?.text || attraction.summary;
}

function renderFeaturedGallery(days) {
  if (!days.length) {
    els.featuredGallery.innerHTML = `<div class="empty-state">当前阶段没有可展示的图片入口。</div>`;
    if (els.attractionFocus) {
      els.attractionFocus.innerHTML = "";
    }
    return;
  }

  if (sourceStore.ready && sourceStore.attractionOrder.length) {
    const attractions = getVisibleAttractionPool(days);
    const activeAttraction = ensureFocusedAttraction(days);
    if (!attractions.length) {
      els.featuredGallery.innerHTML = `<div class="empty-state">当前阶段还没有整理出景点入口。</div>`;
      if (els.attractionFocus) {
        els.attractionFocus.innerHTML = "";
      }
      return;
    }

    els.featuredGallery.innerHTML = attractions
      .map((attraction) => {
        const cover = getAttractionCover(attraction);
        const primaryDay = getDayById(attraction.primary_day_id || attraction.day_ids[0]);
        const imageSequence = cover?.sequence || "";
        const dayLabels = attraction.day_ids
          .map((dayId) => getDayById(dayId)?.day)
          .filter(Boolean);
        const fallbackImage = primaryDay ? docImage(getDayEnhancement(primaryDay.id).images[0]) : docImage(1);
        const isActive = activeAttraction?.id === attraction.id;

        return `
          <button
            class="gallery-card attraction-card ${isActive ? "is-active" : ""}"
            type="button"
            data-focus-attraction="${escapeHtml(attraction.id)}"
          >
            <div class="gallery-card__media">
              <img src="${escapeHtml(cover?.src || fallbackImage)}" alt="${escapeHtml(attraction.title)}" loading="lazy" />
            </div>
            <div class="gallery-card__copy">
              <div class="gallery-card__topline">
                <span>${escapeHtml(attraction.region)}</span>
                <span>${escapeHtml(dayLabels.join(" · "))}</span>
              </div>
              <h3>${escapeHtml(attraction.title)}</h3>
              <p class="gallery-card__text">${escapeHtml(attraction.summary)}</p>
              ${renderMetaPills({ attractionIds: [attraction.id], themeIds: attraction.theme_ids, limit: 4 })}
              <p class="gallery-card__footer">
                ${escapeHtml(`${attraction.image_count} 张图片 · ${attraction.paragraph_count} 段原文`)}
              </p>
            </div>
          </button>
        `;
      })
      .join("");

    syncScrollableSelection(els.featuredGallery, ".attraction-card.is-active");
    renderAttractionFocus(days);
    return;
  }

  els.featuredGallery.innerHTML = days
    .map((day) => {
      const enhancement = getDayEnhancement(day.id);
      const [cover] = getDayImageItems(day.id);

      return `
        <button class="gallery-card" type="button" data-open-day="${escapeHtml(day.id)}">
          <div class="gallery-card__media">
            <img src="${escapeHtml(cover.src)}" alt="${escapeHtml(day.title)}" loading="lazy" />
          </div>
          <div class="gallery-card__copy">
            <div class="gallery-card__topline">
              <span>${escapeHtml(day.day)}</span>
              <span>${escapeHtml(day.city)}</span>
            </div>
            <h3>${escapeHtml(day.title)}</h3>
            <p class="gallery-card__text">${escapeHtml(getReferenceSnippet(cover) || enhancement.decision)}</p>
          </div>
        </button>
      `;
    })
    .join("");
  if (els.attractionFocus) {
    els.attractionFocus.innerHTML = "";
  }
}

function renderAttractionFocus(days) {
  if (!els.attractionFocus) return;
  const attraction = ensureFocusedAttraction(days);
  if (!attraction) {
    els.attractionFocus.innerHTML = "";
    return;
  }

  const cover = getAttractionCover(attraction);
  const relatedDays = uniqueBy(
    attraction.day_ids
      .map((dayId) => getDayById(dayId))
      .filter(Boolean),
    (day) => day.id,
  );
  const images = collectAttractionImages(attraction).slice(0, 6);
  const paragraphs = collectAttractionParagraphs(attraction).slice(0, 6);
  const pitfallItems = getAttractionPitfalls(attraction);
  const priceNotes = getAttractionPriceNotes(attraction);
  const bookingNotes = getAttractionBookingNotes(attraction);
  const advice = getAttractionAdvice(attraction);

  els.attractionFocus.innerHTML = `
    <article class="attraction-focus__hero">
      <div class="attraction-focus__media">
        <img src="${escapeHtml(cover?.src || docImage(1))}" alt="${escapeHtml(attraction.title)}" loading="lazy" />
        <div class="attraction-focus__wash" aria-hidden="true"></div>
      </div>
      <div class="attraction-focus__copy">
        <p class="eyebrow">Attraction Detail</p>
        <h3>${escapeHtml(attraction.title)}</h3>
        <p class="attraction-focus__region">${escapeHtml(attraction.region)}</p>
        <p class="attraction-focus__summary">${escapeHtml(attraction.summary)}</p>
        ${renderMetaPills({ attractionIds: [attraction.id], themeIds: attraction.theme_ids, limit: 5 })}
        <div class="chapter-inline-actions">
          <button type="button" data-open-day="${escapeHtml(attraction.primary_day_id || relatedDays[0]?.id || "")}" data-open-tab="route">
            从当天进入
          </button>
          <button type="button" data-view-switch="itinerary" data-focus-day="${escapeHtml(attraction.primary_day_id || relatedDays[0]?.id || "")}">
            跳到行程
          </button>
          <button type="button" data-view-switch="checklist" data-scroll-target="toolsSection">
            看预订
          </button>
        </div>
      </div>
    </article>

    <div class="attraction-facts">
      <article class="attraction-fact-card">
        <p class="eyebrow">Days</p>
        <strong>${escapeHtml(`${relatedDays.length} 天关联`)}</strong>
        <span>${escapeHtml(relatedDays.map((day) => day.day).join(" · "))}</span>
      </article>
      <article class="attraction-fact-card">
        <p class="eyebrow">Media</p>
        <strong>${escapeHtml(`${attraction.image_count} 张图`)}</strong>
        <span>${escapeHtml(`${attraction.paragraph_count} 段原文`)}</span>
      </article>
      <article class="attraction-fact-card">
        <p class="eyebrow">Advice</p>
        <strong>${escapeHtml(attraction.theme_ids.includes("booking") ? "先预约" : "先看天气")}</strong>
        <span>${escapeHtml(trimText(advice, 56))}</span>
      </article>
    </div>

    <div class="attraction-sections">
      <section class="attraction-panel">
        <div class="section-head section-head-compact">
          <div>
            <p class="eyebrow">Costs & Booking</p>
            <h2>费用与预约</h2>
          </div>
        </div>
        <div class="attraction-panel__split">
          <div>
            <h4>费用线索</h4>
            ${priceNotes.length ? buildList(priceNotes) : `<p class="chapter-panel__empty">当前没有单独抽出的费用段落，但景点相关原文仍完整保留。</p>`}
          </div>
          <div>
            <h4>预约提醒</h4>
            ${bookingNotes.length ? buildList(bookingNotes) : `<p class="chapter-panel__empty">这个景点没有额外预约要求，重点放在关联天数和现场节奏上。</p>`}
          </div>
        </div>
      </section>

      <section class="attraction-panel">
        <div class="section-head section-head-compact">
          <div>
            <p class="eyebrow">Related Days</p>
            <h2>关联天数</h2>
          </div>
        </div>
        <div class="attraction-day-grid">
          ${relatedDays
            .map(
              (day) => `
                <button class="attraction-day-card" type="button" data-view-switch="itinerary" data-focus-day="${escapeHtml(day.id)}">
                  <span>${escapeHtml(day.day)}</span>
                  <strong>${escapeHtml(day.city)}</strong>
                  <p>${escapeHtml(trimText(day.title, 48))}</p>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="attraction-panel">
        <div class="section-head section-head-compact">
          <div>
            <p class="eyebrow">Gallery</p>
            <h2>相关图片</h2>
          </div>
        </div>
        <div class="attraction-image-grid">
          ${images
            .map(
              (image) => `
                <article class="attraction-image-card">
                  <img src="${escapeHtml(image.src)}" alt="${escapeHtml(`${attraction.title} · 图 ${image.sequence}`)}" loading="lazy" />
                  <div class="attraction-image-card__copy">
                    <p>${escapeHtml(trimText(image.reference_excerpt || image.reference_after || image.reference_before, 80))}</p>
                    <div class="chapter-inline-actions">
                      <button type="button" data-inline-lightbox-day="${escapeHtml(image.day_id)}" data-inline-lightbox-seq="${image.sequence}">看大图</button>
                      <button type="button" data-open-day="${escapeHtml(image.day_id)}" data-open-tab="source" data-open-source-seq="${image.sequence}">看原文</button>
                    </div>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="attraction-panel">
        <div class="section-head section-head-compact">
          <div>
            <p class="eyebrow">Source</p>
            <h2>原文摘录</h2>
          </div>
        </div>
        <div class="attraction-source-list">
          ${paragraphs
            .map(
              (paragraph) => `
                <article class="attraction-source-card">
                  <div class="chapter-paragraph__meta">
                    <p class="eyebrow">${escapeHtml(SOURCE_KIND_LABELS[paragraph.block_kind] || "原文段落")}</p>
                    ${renderMetaPills({ attractionIds: paragraph.attraction_ids || [], themeIds: paragraph.theme_ids || [], limit: 4 })}
                  </div>
                  <p>${escapeHtml(paragraph.text)}</p>
                  <button type="button" data-open-day="${escapeHtml(paragraph.day_id)}" data-open-tab="source">
                    回到当天原文
                  </button>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="attraction-panel">
        <div class="section-head section-head-compact">
          <div>
            <p class="eyebrow">Pitfalls</p>
            <h2>避坑提醒</h2>
          </div>
        </div>
        <div class="pitfall-rail">
          ${pitfallItems.length
            ? pitfallItems
                .map(
                  (item) => `
                    <button class="pitfall-chip" type="button" data-open-day="${escapeHtml(item.dayId)}" data-open-tab="source">
                      <strong>${escapeHtml(`${item.category} · ${item.title}`)}</strong>
                      <span>${escapeHtml(trimText(item.quote, 104))}</span>
                    </button>
                  `,
                )
                .join("")
            : `<div class="empty-state">这个景点暂时没有单独抽出的坑位提醒。</div>`}
        </div>
      </section>
    </div>
  `;
}

function ensureFocusedItineraryDay(days) {
  if (!days.length) {
    state.itineraryDayId = "";
    return null;
  }

  if (!days.some((day) => day.id === state.itineraryDayId)) {
    state.itineraryDayId = days[0].id;
  }

  return getDayById(state.itineraryDayId) || days[0];
}

function renderDateRail(days) {
  const activeDay = ensureFocusedItineraryDay(days);
  if (!days.length) {
    els.dateRail.innerHTML = `<div class="empty-state">当前阶段没有可切换的日期。</div>`;
    return;
  }

  els.dateRail.innerHTML = days
    .map((day) => {
      const isActive = activeDay?.id === day.id;
      return `
        <button
          class="date-rail__item ${isActive ? "is-active" : ""}"
          type="button"
          data-focus-day="${escapeHtml(day.id)}"
        >
          <span class="date-rail__month">${escapeHtml(day.date.split(".")[0] || day.date)}</span>
          <strong class="date-rail__date">${escapeHtml(day.date.split(".")[1] || day.date)}</strong>
          <span class="date-rail__day">${escapeHtml(day.day)}</span>
          <span class="date-rail__city">${escapeHtml(day.city)}</span>
        </button>
      `;
    })
    .join("");
}

function getDayPitfallEntries(dayId) {
  return uniqueBy(
    pitfallTemplates
      .filter((item) => item.dayId === dayId)
      .map((item) => ({
        ...item,
        quote: resolvePitfallQuote(item),
      })),
    (item) => [item.category, item.title, normalizeComparableText(item.quote)].join("::"),
  );
}

function renderItineraryChapter(days) {
  const day = ensureFocusedItineraryDay(days);
  if (!day) {
    els.daysContainer.innerHTML = `<div class="empty-state">这个阶段还没有可展开的章节。切回“全部日程”或换一个阶段试试。</div>`;
    return;
  }

  const enhancement = getDayEnhancement(day.id);
  const daySource = getDaySource(day.id);
  const images = getDayImageItems(day.id);
  const [cover] = images;
  const dayIndex = days.findIndex((candidate) => candidate.id === day.id);
  const previousDay = dayIndex > 0 ? days[dayIndex - 1] : null;
  const nextDay = dayIndex < days.length - 1 ? days[dayIndex + 1] : null;
  const pitfallEntries = getDayPitfallEntries(day.id);
  const summaryNotes = uniqueBy(
    [
      ...day.tips,
      ...pitfallEntries.map((entry) => `${entry.category} · ${entry.title}`),
    ],
    (item) => normalizeComparableText(item),
  ).slice(0, 4);

  els.daysContainer.innerHTML = `
    <article class="chapter-card" data-phase="${escapeHtml(day.phase)}">
      <div class="chapter-hero">
        <div class="chapter-hero__media">
          <img src="${escapeHtml(cover?.src || docImage(getDayEnhancement(day.id).images[0]))}" alt="${escapeHtml(day.title)}" loading="lazy" />
        </div>
        <div class="chapter-hero__copy">
          <div class="chapter-hero__topline">
            <span class="status-chip">${escapeHtml(day.day)}</span>
            <span class="status-chip">${escapeHtml(day.city)}</span>
          </div>
          <p class="hero-kicker">${escapeHtml(`${day.date} · ${day.phaseLabel}`)}</p>
          <h3>${escapeHtml(day.title)}</h3>
          <p class="chapter-hero__decision">${escapeHtml(enhancement.decision)}</p>
          <p class="chapter-hero__summary">${escapeHtml(day.summary)}</p>
          <div class="detail-badges">
            ${getDayTags(day).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
            <span>${escapeHtml(`${images.length} 张图文`)}</span>
          </div>
          <button class="chapter-detail-button" type="button" data-open-day="${escapeHtml(day.id)}" data-open-tab="route">
            查看详情
          </button>
        </div>
      </div>

      <section class="chapter-brief">
        <div class="section-head section-head-compact">
          <div>
            <p class="eyebrow">Brief</p>
            <h2>简况</h2>
          </div>
        </div>
        <div class="chapter-summary-grid">
          <section class="chapter-panel">
            <p class="eyebrow">Route</p>
            <h4>今天怎么走</h4>
            <p>${escapeHtml(day.route)}</p>
          </section>
          <section class="chapter-panel">
            <p class="eyebrow">Logistics</p>
            <h4>交通与节奏</h4>
            <p>${escapeHtml(day.logistics)}</p>
          </section>
          <section class="chapter-panel">
            <p class="eyebrow">Highlights</p>
            <h4>值得留下来的点</h4>
            ${buildList(day.highlights)}
          </section>
          <section class="chapter-panel">
            <p class="eyebrow">Food & Stay</p>
            <h4>吃住安排</h4>
            ${buildList([...day.food.slice(0, 2), day.stay])}
          </section>
          <section class="chapter-panel">
            <p class="eyebrow">Notes</p>
            <h4>提醒</h4>
            ${buildList(summaryNotes.length ? summaryNotes : day.tips)}
          </section>
        </div>
      </section>

      <div class="chapter-pagination">
        <button type="button" ${previousDay ? `data-focus-day="${escapeHtml(previousDay.id)}"` : "disabled"}>
          ${escapeHtml(previousDay ? `上一天 · ${previousDay.day}` : "已经是第一天")}
        </button>
        <button type="button" ${nextDay ? `data-focus-day="${escapeHtml(nextDay.id)}"` : "disabled"}>
          ${escapeHtml(nextDay ? `下一天 · ${nextDay.day}` : "已经是最后一天")}
        </button>
      </div>
    </article>
  `;
}

function renderBookingTools() {
  els.bookingTools.innerHTML = bookingToolCards
    .map(
      (card) => `
        <article class="tool-card">
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.body)}</p>
          <div class="tool-card__meta">
            ${card.meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
          </div>
          <div class="tool-card__actions">
            ${card.actions
              .map(
                (action) => `
                  <button
                    type="button"
                    data-tool-kind="${escapeHtml(action.kind)}"
                    data-tool-target="${escapeHtml(action.target || "")}"
                    data-tool-day="${escapeHtml(action.dayId || "")}"
                    data-tool-tab="${escapeHtml(action.tab || "")}"
                    data-tool-phase="${escapeHtml(action.phase || "")}"
                    data-tool-category="${escapeHtml(action.category || "")}"
                  >
                    ${escapeHtml(action.label)}
                  </button>
                `,
              )
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");
  syncScrollableSelection(els.dateRail, ".date-rail__item.is-active");
}

function renderBooking() {
  els.bookingList.innerHTML = bookingTimeline
    .map(
      (item) => `
        <article class="timeline-item">
          <div class="timeline-item__dot">${escapeHtml(item.step)}</div>
          <div class="timeline-item__body">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.detail)}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderGlobalNotes() {
  els.globalNotes.innerHTML = globalNotes
    .map(
      (note) => `
        <article class="note-card">
          <h3>${escapeHtml(note.title)}</h3>
          <p>${escapeHtml(note.body)}</p>
        </article>
      `,
    )
    .join("");
}

function renderPackingActions() {
  els.packingActions.innerHTML = `
    <button type="button" data-pack-action="expand">全部展开</button>
    <button type="button" data-pack-action="collapse">全部收起</button>
    <button type="button" data-pack-action="reset">清空全部</button>
  `;
}

function renderPacking() {
  renderPackingActions();
  renderPackingFloatingProgress();
  els.packingList.innerHTML = packingGroups
    .map((group) => {
      const completeCount = group.items.filter((_, index) => state.packing[`${group.id}-${index}`]).length;
      const isOpen = state.packingOpenGroups[group.id] !== false;

      return `
        <section class="packing-card ${isOpen ? "" : "is-collapsed"}">
          <div class="packing-card__head">
            <h3>${escapeHtml(group.title)}</h3>
            <button type="button" data-toggle-pack-group="${escapeHtml(group.id)}">${isOpen ? "收起" : "展开"}</button>
          </div>
          <p class="packing-summary">已勾选 ${completeCount} / ${group.items.length}</p>
          <div class="packing-card__items">
            ${group.items
              .map((item, index) => {
                const key = `${group.id}-${index}`;
                const checked = Boolean(state.packing[key]);
                return `
                  <div class="packing-item">
                    <input id="${escapeHtml(key)}" type="checkbox" data-pack-key="${escapeHtml(key)}" ${checked ? "checked" : ""} />
                    <label for="${escapeHtml(key)}">
                      <span class="packing-item__box">✓</span>
                      <span class="packing-item__text">${escapeHtml(item)}</span>
                    </label>
                  </div>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function buildSearchResults() {
  const query = state.searchQuery.trim().toLowerCase();
  const groups = {
    days: [],
    attractions: [],
    tools: [],
    source: [],
    images: [],
  };

  if (!query) {
    dayData.forEach((day) => {
      groups.days.push({
        group: "days",
        typeLabel: "天数",
        dayId: day.id,
        targetKind: "day",
        title: day.title,
        excerpt: day.summary,
        tags: [day.day, day.city],
      });
    });

    (sourceStore.attractionOrder || []).slice(0, 6).forEach((attractionId) => {
      const attraction = getAttractionById(attractionId);
      if (!attraction) return;
      groups.attractions.push({
        group: "attractions",
        typeLabel: "景点",
        targetKind: "attraction",
        attractionId: attraction.id,
        title: attraction.title,
        excerpt: attraction.summary,
        tags: attraction.day_ids.map((dayId) => getDayById(dayId)?.day).filter(Boolean),
      });
    });
    return groups;
  }

  dayData.forEach((day) => {
    const daySource = getDaySource(day.id);

    if ((state.searchMode === "all" || state.searchMode === "days")
      && [day.day, day.date, day.city, day.title, day.summary, day.phaseLabel].some((value) => includesQuery(value, query))) {
      groups.days.push({
        group: "days",
        typeLabel: "天数",
        dayId: day.id,
        targetKind: "day",
        title: day.title,
        excerpt: day.summary,
        tags: [day.day, day.city],
      });
    }

    if ((state.searchMode === "all" || state.searchMode === "source")) {
      const paragraphMatch = (daySource?.paragraphs || []).find((value) => includesQuery(value, query));
      if (paragraphMatch) {
        groups.source.push({
          group: "source",
          typeLabel: "原文",
          dayId: day.id,
          targetKind: "source",
          tab: "source",
          title: `${day.day} · ${day.title}`,
          excerpt: paragraphMatch,
          tags: [day.day, day.city],
        });
      }
    }

    if ((state.searchMode === "all" || state.searchMode === "images")) {
      const imageMatch = (daySource?.images || []).find((image) =>
        [image.reference_excerpt, image.reference_before, image.reference_after].some((value) => includesQuery(value, query)),
      );
      if (imageMatch) {
        groups.images.push({
          group: "images",
          typeLabel: "图片",
          dayId: day.id,
          targetKind: "image",
          tab: "gallery",
          title: `${day.day} · ${day.title}`,
          excerpt: imageMatch.reference_excerpt || imageMatch.reference_after || imageMatch.reference_before,
          imageSequence: imageMatch.sequence,
          attractionId: imageMatch.attraction_ids?.[0] || "",
          tags: [day.day, day.city],
        });
      }
    }
  });

  if (state.searchMode === "all" || state.searchMode === "attractions") {
    (sourceStore.attractionOrder || []).forEach((attractionId) => {
      const attraction = getAttractionById(attractionId);
      if (!attraction) return;
      const searchBlob = [
        attraction.title,
        attraction.region,
        attraction.summary,
        ...(attraction.aliases || []),
        ...(attraction.theme_ids || []).map((themeId) => getThemeLabel(themeId)),
        ...collectAttractionParagraphs(attraction).slice(0, 8).map((paragraph) => paragraph.text),
      ].join(" ");

      if (!includesQuery(searchBlob, query)) return;

      groups.attractions.push({
        group: "attractions",
        typeLabel: "景点",
        targetKind: "attraction",
        attractionId: attraction.id,
        title: attraction.title,
        excerpt: attraction.summary,
        tags: [
          attraction.region,
          ...attraction.day_ids.map((dayId) => getDayById(dayId)?.day).filter(Boolean).slice(0, 2),
        ],
      });
    });
  }

  if (state.searchMode === "all" || state.searchMode === "tools") {
    bookingToolCards.forEach((card) => {
      const searchBlob = [card.title, card.body, ...(card.meta || [])].join(" ");
      if (!includesQuery(searchBlob, query)) return;
      groups.tools.push({
        group: "tools",
        typeLabel: "预订",
        targetKind: "tool",
        toolTarget: "toolsSection",
        title: card.title,
        excerpt: card.body,
        tags: card.meta || [],
      });
    });

    globalNotes.forEach((note) => {
      const searchBlob = `${note.title} ${note.body}`;
      if (!includesQuery(searchBlob, query)) return;
      groups.tools.push({
        group: "tools",
        typeLabel: "备忘",
        targetKind: "tool",
        toolTarget: "notesSection",
        title: note.title,
        excerpt: note.body,
        tags: ["统一注意事项"],
      });
    });

    packingGroups.forEach((group) => {
      const matchedItem = group.items.find((item) => includesQuery(item, query));
      if (!matchedItem && !includesQuery(group.title, query)) return;
      groups.tools.push({
        group: "tools",
        typeLabel: "打包",
        targetKind: "tool",
        toolTarget: "packingSection",
        title: group.title,
        excerpt: matchedItem || `${group.title} 分组清单`,
        tags: [`${group.items.length} 项`],
      });
    });

    pitfallTemplates.forEach((item) => {
      const quote = resolvePitfallQuote(item);
      const searchBlob = `${item.title} ${item.category} ${quote}`;
      if (!includesQuery(searchBlob, query)) return;
      groups.tools.push({
        group: "tools",
        typeLabel: "避坑",
        targetKind: "tool",
        toolTarget: "overviewSection",
        pitfallCategory: item.category,
        title: item.title,
        excerpt: quote,
        tags: [item.category, item.dayId],
      });
    });

    dayData.forEach((day) => {
      const toolMatch = [...day.food, day.stay].find((value) => includesQuery(value, query));
      if (!toolMatch) return;
      groups.tools.push({
        group: "tools",
        typeLabel: "吃住",
        targetKind: "day",
        dayId: day.id,
        tab: "stay",
        title: `${day.day} · ${day.city}`,
        excerpt: toolMatch,
        tags: [day.day, day.city],
      });
    });
  }

  return {
    days: uniqueBy(groups.days, (item) => item.dayId || item.title),
    attractions: uniqueBy(groups.attractions, (item) => item.attractionId || item.title),
    tools: uniqueBy(
      groups.tools,
      (item) => [
        item.targetKind || "",
        item.toolTarget || "",
        item.dayId || "",
        item.tab || "",
        item.pitfallCategory || "",
        normalizeComparableText(item.title),
        normalizeComparableText(item.excerpt),
      ].join("::"),
    ),
    source: uniqueBy(
      groups.source,
      (item) => [
        item.dayId || "",
        item.tab || "",
        normalizeComparableText(item.excerpt),
      ].join("::"),
    ),
    images: uniqueBy(
      groups.images,
      (item) => [
        item.dayId || "",
        item.imageSequence || "",
        normalizeComparableText(item.excerpt),
      ].join("::"),
    ),
  };
}

function renderSearchFilters() {
  els.searchFilters.innerHTML = SEARCH_FILTERS
    .map(
      (filter) => `
        <button
          class="search-filter ${filter.id === state.searchMode ? "is-active" : ""}"
          type="button"
          data-search-mode="${escapeHtml(filter.id)}"
        >
          ${escapeHtml(filter.label)}
        </button>
      `,
    )
    .join("");
  syncScrollableSelection(els.searchFilters, ".search-filter.is-active");
}

function renderSearchResults() {
  renderSearchFilters();
  if (els.searchResults) {
    els.searchResults.scrollTop = 0;
  }
  const groups = buildSearchResults();
  const groupOrder = state.searchMode === "all"
    ? SEARCH_FILTERS.filter((item) => item.id !== "all").map((item) => item.id)
    : [state.searchMode];
  const visibleGroups = groupOrder.filter((groupId) => (groups[groupId] || []).length);
  const total = visibleGroups.reduce((sum, groupId) => sum + groups[groupId].length, 0);

  if (!visibleGroups.length) {
    els.searchSummary.textContent = "没有搜到匹配结果。试试“泸沽湖”“独克宗”“蓝月谷”或“飞来寺”。";
    els.searchResults.innerHTML = `<div class="empty-state">没有搜到匹配结果。换个关键词，或者切到别的搜索类型试试。</div>`;
    return;
  }

  els.searchSummary.textContent = state.searchQuery.trim()
    ? `共找到 ${total} 条结果，覆盖 ${visibleGroups.length} 个分组。`
    : "未输入关键词时，先给你天数和景点作为快速入口。";

  els.searchResults.innerHTML = visibleGroups
    .map((groupId) => `
      <section class="search-group">
        <div class="search-group__head">
          <h3>${escapeHtml(SEARCH_GROUP_LABELS[groupId])}</h3>
          <span>${escapeHtml(`${groups[groupId].length} 条`)}</span>
        </div>
        ${groups[groupId]
          .map((result) => {
            const detailTags = getSearchResultTags(result);
            return `
              <button
                class="search-result"
                type="button"
                data-result-kind="${escapeHtml(result.targetKind || "")}"
                data-result-day="${escapeHtml(result.dayId || "")}"
                data-result-tab="${escapeHtml(result.tab || "route")}"
                data-result-image="${escapeHtml(result.imageSequence || "")}"
                data-result-attraction="${escapeHtml(result.attractionId || "")}"
                data-result-tool="${escapeHtml(result.toolTarget || "")}"
                data-result-pitfall="${escapeHtml(result.pitfallCategory || "")}"
              >
                <div class="detail-tags">
                  <span class="search-result__type">${escapeHtml(result.typeLabel)}</span>
                  ${detailTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
                </div>
                <h3>${highlightMatch(result.title, state.searchQuery.trim())}</h3>
                <p>${highlightMatch(result.excerpt || "", state.searchQuery.trim())}</p>
              </button>
            `;
          })
          .join("")}
      </section>
    `)
    .join("");
}

function renderDetailHero(day) {
  const images = getDayImageItems(day.id);
  const safeIndex = Math.min(state.detailImageIndex, Math.max(images.length - 1, 0));

  state.detailImageIndex = safeIndex;
  els.detailPhaseBadge.textContent = day.phaseLabel;
  els.detailPhaseBadge.dataset.phase = day.phase;
  els.detailLeadImage.src = images[safeIndex]?.src || "";
  els.detailLeadImage.alt = day.title;
  els.detailEyebrow.textContent = `${day.day} · ${day.date} · ${day.city}`;
  els.detailTitle.textContent = day.title;
  els.detailDecision.textContent = "";
  els.detailSummary.textContent = "";
  els.detailBadges.innerHTML = "";
  els.detailDecision.hidden = true;
  els.detailSummary.hidden = true;
  els.detailBadges.hidden = true;
}

function renderDetailGalleryRail(day) {
  const images = getDayImageItems(day.id);
  if (!images.length) {
    els.detailGalleryRail.innerHTML = "";
    return;
  }

  els.detailGalleryRail.innerHTML = images
    .map(
      (image, index) => `
        <button
          class="detail-gallery-rail__item ${index === state.detailImageIndex ? "is-active" : ""}"
          type="button"
          data-open-lightbox-index="${index}"
        >
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(`${day.title} · 图 ${index + 1}`)}" loading="lazy" />
          <div class="detail-gallery-rail__copy">
            <strong>${escapeHtml(`图 ${index + 1}`)}</strong>
          </div>
        </button>
      `,
    )
    .join("");
  syncScrollableSelection(els.detailGalleryRail, ".detail-gallery-rail__item.is-active");
}

function renderDetailTabs() {
  els.detailTabs.innerHTML = DETAIL_TABS
    .map(
      (tab) => `
        <button
          class="detail-tab ${tab.id === state.detailTab ? "is-active" : ""}"
          type="button"
          role="tab"
          aria-selected="${tab.id === state.detailTab ? "true" : "false"}"
          data-tab="${escapeHtml(tab.id)}"
        >
          ${escapeHtml(tab.label)}
        </button>
      `,
    )
    .join("");
  syncScrollableSelection(els.detailTabs, ".detail-tab.is-active");
}

function renderSourceTab(day) {
  const daySource = getDaySource(day.id);
  if (!daySource?.source_blocks?.length) {
    return `
      <section class="detail-block">
        <h3>原文模式尚未就绪</h3>
        <p>这一天的原文段落还没有接入成功。</p>
      </section>
    `;
  }

  const blocksHtml = daySource.source_blocks
    .map((block) => {
      if (block.type === "text") {
        const paragraphItems = block.paragraph_items?.length
          ? block.paragraph_items
          : [{
              id: block.id,
              text: block.text,
              block_kind: block.block_kind || "story",
              attraction_ids: block.attraction_ids || [],
              theme_ids: block.theme_ids || [],
            }];

        return `
          <article class="source-paragraph-group">
            ${paragraphItems
              .map(
                (paragraph) => `
                  <div class="source-paragraph">
                    <div class="source-paragraph__meta">
                      <p class="eyebrow source-paragraph__eyebrow">
                        ${escapeHtml(SOURCE_KIND_LABELS[paragraph.block_kind] || "原文段落")}
                      </p>
                      ${renderMetaPills({
                        attractionIds: paragraph.attraction_ids || [],
                        themeIds: paragraph.theme_ids || [],
                        limit: 4,
                      })}
                    </div>
                    <p>${escapeHtml(paragraph.text)}</p>
                  </div>
                `,
              )
              .join("")}
          </article>
        `;
      }

      const imageIndex = daySource.images.findIndex((image) => image.sequence === block.image_sequence);
      const image = daySource.images[imageIndex];
      if (!image) return "";

      const isFocused = state.sourceFocusSequence === image.sequence;
      const metaLines = [image.reference_before, image.reference_after]
        .filter(Boolean)
        .filter((line, index, array) => array.indexOf(line) === index)
        .map((line) => `<p>${escapeHtml(trimText(line, 180))}</p>`)
        .join("");

      return `
        <article class="source-image ${isFocused ? "is-focused" : ""}" data-source-seq="${image.sequence}">
          <img class="source-image__media" src="${escapeHtml(image.src)}" alt="${escapeHtml(`${day.title} · 图 ${imageIndex + 1}`)}" loading="lazy" />
          <div class="source-image__meta">
            <p class="eyebrow source-image__eyebrow">${escapeHtml(`图 ${imageIndex + 1} · 段落 ${image.paragraph_index || "-"}`)}</p>
            ${renderMetaPills({ attractionIds: image.attraction_ids || [], themeIds: image.theme_ids || [], limit: 4 })}
            ${metaLines}
            <div class="source-image__actions">
              <button type="button" data-open-lightbox-index="${imageIndex}">看大图</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="detail-block">
      <h3>原文模式</h3>
      <p>这里按文档原始阅读顺序，把文本段落和图片引用重新挂回来了。图和文可以相互跳转。</p>
    </section>
    <div class="source-flow">${blocksHtml}</div>
  `;
}

function renderStayTab(day) {
  const foodNotes = collectDayParagraphs(day.id, (paragraph) =>
    paragraph.block_kind === "food"
      || (paragraph.theme_ids || []).includes("dining")
      || /早餐|午餐|晚餐|推荐美食|推荐餐馆|米线|火锅|饭店|饭馆|小吃|烧烤|腊排骨|牦牛肉|土鸡/i.test(paragraph.text),
  );

  const stayNotes = collectDayParagraphs(day.id, (paragraph) =>
    paragraph.block_kind === "stay"
      || (paragraph.theme_ids || []).includes("lodging")
      || /住宿|住哪|住哪里|住在|酒店|民宿|客栈|别院|落脚|返回酒店|当天住宿/i.test(paragraph.text),
  );

  const reminderNotes = uniqueBy(
    [
      ...collectDayParagraphs(day.id, (paragraph) =>
        paragraph.block_kind === "booking"
          || paragraph.block_kind === "tip"
          || (paragraph.theme_ids || []).includes("booking")
          || (paragraph.theme_ids || []).includes("pricing_alert")
          || (paragraph.theme_ids || []).includes("plateau"),
      ),
      ...day.tips,
    ],
    (text) => normalizeComparableText(text),
  );

  return `
    <section class="detail-block">
      <h3>吃什么</h3>
      ${renderDetailNoteCards(foodNotes, day.food.join(" "))}
    </section>
    <section class="detail-block">
      <h3>住哪里</h3>
      ${renderDetailNoteCards(stayNotes, day.stay)}
    </section>
    <section class="detail-block">
      <h3>当天提醒</h3>
      ${renderDetailNoteCards(reminderNotes, day.tips.join(" "))}
    </section>
  `;
}

function renderDetailBody(day) {
  if (state.detailTab === "stay") {
    els.detailBody.innerHTML = renderStayTab(day);
    return;
  }

  if (state.detailTab === "source") {
    els.detailBody.innerHTML = renderSourceTab(day);
    return;
  }

  els.detailBody.innerHTML = `
    <section class="detail-block">
      <h3>当天路线</h3>
      <p>${escapeHtml(day.route)}</p>
    </section>
    <section class="detail-block">
      <h3>交通与节奏</h3>
      <p>${escapeHtml(day.logistics)}</p>
    </section>
    <section class="detail-block">
      <h3>今日亮点</h3>
      ${buildList(day.highlights)}
    </section>
    <section class="detail-block">
      <h3>避坑提醒</h3>
      ${buildList(day.tips)}
    </section>
  `;
}

function focusSourceReferenceIfNeeded() {
  if (state.detailTab !== "source" || !state.sourceFocusSequence) return;
  const target = els.detailBody.querySelector(`[data-source-seq="${state.sourceFocusSequence}"]`);
  if (!target) return;
  window.setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 60);
}

function renderDetail() {
  const day = getDayById(state.detailDayId);
  if (!day) return;
  state.detailTab = getSafeDetailTab(state.detailTab);
  renderDetailHero(day);
  renderDetailGalleryRail(day);
  renderDetailTabs();
  renderDetailBody(day);
  focusSourceReferenceIfNeeded();
}

function renderLightbox() {
  const day = getDayById(state.lightboxDayId);
  if (!day) return;

  const images = getDayImageItems(day.id);
  if (!images.length) return;

  const safeIndex = ((state.lightboxIndex % images.length) + images.length) % images.length;
  const image = images[safeIndex];
  state.lightboxIndex = safeIndex;
  state.detailImageIndex = safeIndex;

  els.lightboxImage.src = image.src;
  els.lightboxImage.alt = `${day.title} · 图 ${safeIndex + 1}`;
  els.lightboxCounter.textContent = `${day.day} · 图 ${safeIndex + 1} / ${images.length}`;
  els.lightboxCaption.textContent = image.reference_excerpt || `${day.title} · 图 ${safeIndex + 1}`;
  els.lightboxSource.textContent = [image.reference_before, image.reference_after]
    .filter(Boolean)
    .filter((line, index, array) => array.indexOf(line) === index)
    .join("\n");
}

function openSearch() {
  closeTopbarMenus();
  state.searchOpen = true;
  els.searchShell.hidden = false;
  syncBodyLock();
  renderSearchResults();
  window.setTimeout(() => {
    els.searchInput.focus();
    els.searchInput.select();
  }, 30);
}

function clearSearch() {
  state.searchQuery = "";
  state.searchMode = "all";
  if (els.searchInput) {
    els.searchInput.value = "";
    els.searchInput.focus();
  }
  renderSearchResults();
}

function closeSearch() {
  state.searchOpen = false;
  els.searchShell.hidden = true;
  syncBodyLock();
}

function openDayDetail(dayId, options = {}) {
  const day = getDayById(dayId);
  if (!day) return;

  closeTopbarMenus();
  state.itineraryDayId = day.id;
  state.detailDayId = day.id;
  state.detailTab = getSafeDetailTab(options.tab || "route");
  state.detailImageIndex = options.imageIndex ?? 0;
  state.sourceFocusSequence = options.sourceSeq ?? null;
  state.detailOpen = true;
  els.detailShell.hidden = false;
  if (els.detailSheet) {
    els.detailSheet.scrollTo({ top: 0, behavior: "auto" });
  }
  if (!options.preserveSearch) {
    closeSearch();
  }
  syncBodyLock();
  renderDetail();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function closeDetail(options = {}) {
  state.detailOpen = false;
  els.detailShell.hidden = true;
  if (!options.keepLightbox) {
    closeLightbox({ skipHashSync: true });
  }
  syncBodyLock();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function openLightbox(dayId, index, options = {}) {
  const images = getDayImageItems(dayId);
  if (!images.length) return;

  closeTopbarMenus();
  state.lightboxDayId = dayId;
  state.lightboxIndex = index;
  state.lightboxOpen = true;
  els.lightboxShell.hidden = false;
  lightboxTouchStartX = 0;
  lightboxTouchStartY = 0;
  syncBodyLock();
  renderLightbox();
  if (state.detailOpen) {
    renderDetail();
  }
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function closeLightbox(options = {}) {
  state.lightboxOpen = false;
  els.lightboxShell.hidden = true;
  syncBodyLock();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function navigateLightbox(delta) {
  if (!state.lightboxOpen) return;
  const images = getDayImageItems(state.lightboxDayId);
  if (!images.length) return;

  state.lightboxIndex = (state.lightboxIndex + delta + images.length) % images.length;
  renderLightbox();
  if (state.detailOpen) {
    renderDetail();
  }
  syncHashFromState();
}

function jumpToSource(sequence, options = {}) {
  state.detailTab = "source";
  state.sourceFocusSequence = sequence;
  closeLightbox({ skipHashSync: true });
  renderDetail();
  if (!options.skipHashSync) {
    syncHashFromState();
  }
}

function renderPhaseScopedSections() {
  const days = getPhaseDays();
  renderPhasePicker();
  renderPitfallFilters();
  renderPitfalls();
  renderFeaturedGallery(days);
  renderDateRail(days);
  renderItineraryChapter(days);
  if (state.detailOpen) {
    renderDetail();
  }
}

function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  els.scrollProgress.style.width = `${progress * 100}%`;
  syncChecklistSectionFromViewport();
}

function syncChecklistSectionFromViewport() {
  if (state.currentView !== "checklist") return;

  const anchor = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--chrome-top-offset"),
    10,
  ) || 88;

  let nextSectionId = CHECKLIST_TOPBAR_ITEMS[0]?.id || "packingSection";
  CHECKLIST_TOPBAR_ITEMS.forEach((item) => {
    const section = document.getElementById(item.id);
    if (!section) return;
    if (section.getBoundingClientRect().top - anchor <= 28) {
      nextSectionId = item.id;
    }
  });

  if (state.activeSection !== nextSectionId) {
    state.activeSection = nextSectionId;
  }
}

function renderPackingFloatingProgress() {
  if (!els.packingFloatingProgress) return;

  const { doneItems, totalItems } = getPackingProgress();
  const shouldShow = state.currentView === "checklist";
  els.packingFloatingProgress.hidden = !shouldShow;
  if (!shouldShow) return;

  els.packingFloatingProgress.textContent = `打包进度 ${doneItems}/${totalItems}`;
}

function handlePackingChange(input) {
  const key = input.dataset.packKey;
  if (!key) return;
  state.packing[key] = input.checked;
  saveJsonStorage(PACKING_STORAGE_KEY, state.packing);
  renderPacking();
}

function resetPackingGroup(groupId) {
  Object.keys(state.packing)
    .filter((key) => key.startsWith(`${groupId}-`))
    .forEach((key) => {
      delete state.packing[key];
    });
  saveJsonStorage(PACKING_STORAGE_KEY, state.packing);
  renderPacking();
}

function togglePackingGroup(groupId) {
  state.packingOpenGroups[groupId] = !state.packingOpenGroups[groupId];
  savePackingGroupState();
  renderPacking();
}

function setAllPackingGroups(open) {
  packingGroups.forEach((group) => {
    state.packingOpenGroups[group.id] = open;
  });
  savePackingGroupState();
  renderPacking();
}

function resetAllPacking() {
  state.packing = {};
  saveJsonStorage(PACKING_STORAGE_KEY, state.packing);
  renderPacking();
}

function hydrateDayEntry(day) {
  return {
    ...day,
    images: (day.images || []).map((image) => ({
      ...image,
      src: normalizeSourcePath(image.relative_path),
    })),
  };
}

function resetSourceStoreData() {
  sourceStore.trip = null;
  sourceStore.stats = null;
  sourceStore.byDayId = {};
  sourceStore.themesById = {};
  sourceStore.attractionsById = {};
  sourceStore.attractionOrder = [];
  sourceStore.mediaBySequence = {};
}

async function loadLegacyDayMap() {
  resetSourceStoreData();
  const response = await fetch(DAY_MAP_PATH, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load day map: ${response.status}`);
  }

  const payload = await response.json();
  sourceStore.byDayId = Object.fromEntries((payload.days || []).map((day) => [day.id, hydrateDayEntry(day)]));
  sourceStore.ready = true;
  sourceStore.mode = "legacy";
  sourceStore.loadError = "";
}

async function loadGuideBlueprint() {
  try {
    resetSourceStoreData();
    const response = await fetch(BLUEPRINT_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load blueprint: ${response.status}`);
    }

    const payload = await response.json();
    sourceStore.trip = payload.trip || null;
    sourceStore.stats = payload.stats || null;
    sourceStore.themesById = Object.fromEntries((payload.themes || []).map((theme) => [theme.id, theme]));
    sourceStore.attractionsById = Object.fromEntries(
      (payload.attractions || []).map((attraction) => [attraction.id, attraction]),
    );
    sourceStore.attractionOrder = (payload.attractions || []).map((attraction) => attraction.id);
    sourceStore.mediaBySequence = Object.fromEntries(
      (payload.media || []).map((image) => [
        Number(image.sequence),
        {
          ...image,
          src: normalizeSourcePath(image.relative_path),
        },
      ]),
    );
    sourceStore.byDayId = Object.fromEntries(
      (payload.days || []).map((day) => [
        day.id,
        hydrateDayEntry({
          ...day,
          images: (day.images || []).map((image) => ({
            ...(sourceStore.mediaBySequence[Number(image.sequence)] || image),
            ...image,
          })),
        }),
      ]),
    );
    sourceStore.ready = true;
    sourceStore.mode = "blueprint";
    sourceStore.loadError = "";
  } catch (error) {
    sourceStore.loadError = error instanceof Error ? error.message : "unknown error";
    await loadLegacyDayMap();
  }
}

function applyToolAction({ kind, target = "", dayId = "", tab = "", phase = "", category = "" }, options = {}) {
  if (kind === "scroll" && target) {
    scrollToSection(target === "toolsSection" ? "toolsSection" : target, options);
    return;
  }

  if (kind === "phase" && phase) {
    state.phase = phase;
    renderPhaseScopedSections();
    scrollToSection("daysSection", options);
    return;
  }

  if (kind === "pitfall" && category) {
    state.pitfallCategory = category;
    renderPitfallFilters();
    renderPitfalls();
    scrollToSection("overviewSection", options);
    if (!options.skipHashSync) {
      syncHashFromState();
    }
    return;
  }

  if (kind === "day" && dayId) {
    openDayDetail(dayId, { tab: tab || "route", skipHashSync: options.skipHashSync });
  }
}

function handleSearchResult(button) {
  const kind = button.dataset.resultKind || "";
  const dayId = button.dataset.resultDay;
  const tab = button.dataset.resultTab || "route";
  const imageSequence = button.dataset.resultImage;
  const attractionId = button.dataset.resultAttraction;
  const toolTarget = button.dataset.resultTool;
  const pitfallCategory = button.dataset.resultPitfall;

  if (kind === "attraction" && attractionId) {
    focusAttraction(attractionId);
    closeSearch();
    return;
  }

  if (kind === "tool" && toolTarget) {
    if (pitfallCategory) {
      state.pitfallCategory = pitfallCategory;
      renderPitfallFilters();
      renderPitfalls();
    }
    switchView(toolTarget === "overviewSection" ? "overview" : "checklist", { skipHashSync: true, preserveScroll: true });
    closeSearch();
    scrollToSection(toolTarget);
    return;
  }

  if (!dayId) return;

  if (imageSequence) {
    if (attractionId) {
      focusAttraction(attractionId, { skipScroll: true, skipHashSync: true });
    } else {
      switchView("attractions", { skipHashSync: true, preserveScroll: true });
    }
    const imageIndex = findImageIndexBySequence(dayId, Number(imageSequence));
    openDayDetail(dayId, { tab: "route", imageIndex, skipHashSync: true });
    openLightbox(dayId, Math.max(imageIndex, 0));
    closeSearch();
    return;
  }

  if (kind === "source") {
    focusItineraryDay(dayId, { skipScroll: true, skipHashSync: true });
    openDayDetail(dayId, { tab });
    return;
  }

  if (kind === "day") {
    focusItineraryDay(dayId);
    closeSearch();
    return;
  }

  focusItineraryDay(dayId, { skipScroll: true, skipHashSync: true });
  openDayDetail(dayId, { tab });
}

function parseHashAndApply() {
  if (hashSyncSuspended) return;

  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return;
  const params = new URLSearchParams(hash);
  const viewParam = params.get("view");

  if (viewParam) {
    switchView(viewParam, { skipHashSync: true, preserveScroll: true });
  }

  const attractionParam = params.get("attraction");

  if (attractionParam) {
    focusAttraction(attractionParam, { skipScroll: true, skipHashSync: true });
  }

  const imageParam = params.get("image");
  if (imageParam) {
    const [dayId, sequence] = imageParam.split(":");
    const imageIndex = sequence ? findImageIndexBySequence(dayId, Number(sequence)) : 0;
    switchView(viewParam || "attractions", { skipHashSync: true, preserveScroll: true });
    openDayDetail(dayId, { tab: "route", imageIndex: Math.max(imageIndex, 0), skipHashSync: true });
    openLightbox(dayId, Math.max(imageIndex, 0), { skipHashSync: true });
    return;
  }

  const dayParam = params.get("day");
  if (dayParam) {
    const requestedTab = params.get("tab") || "";
    const sourceSeq = params.get("source") ? Number(params.get("source")) : null;
    if (!requestedTab && !sourceSeq) {
      focusItineraryDay(dayParam, { skipScroll: true, skipHashSync: true });
      return;
    }

    switchView(viewParam || "itinerary", { skipHashSync: true, preserveScroll: true });
    openDayDetail(dayParam, {
      tab: requestedTab || "route",
      sourceSeq,
      skipHashSync: true,
    });
    return;
  }

  const toolParam = params.get("tool");
  if (toolParam?.startsWith("pitfalls:")) {
    state.pitfallCategory = toolParam.split(":")[1] || "all";
    renderPhaseScopedSections();
    switchView("overview", { skipHashSync: true, preserveScroll: true });
    scrollToSection("overviewSection", { skipHashSync: true });
    return;
  }

  if (toolParam) {
    scrollToSection(toolParam, { skipHashSync: true });
  }
}

function bindEvents() {
  els.openSearchBtn?.addEventListener("click", openSearch);

  els.openViewMenuBtn?.addEventListener("click", () => {
    state.viewMenuOpen = !state.viewMenuOpen;
    state.phaseMenuOpen = false;
    syncTopbarMenus();
  });

  els.phasePickerBtn?.addEventListener("click", () => {
    state.phaseMenuOpen = !state.phaseMenuOpen;
    state.viewMenuOpen = false;
    syncTopbarMenus();
  });

  els.topbarMenuBackdrop?.addEventListener("click", closeTopbarMenus);

  els.viewMenu?.addEventListener("click", (event) => {
    const viewId = event.target.closest("[data-view]")?.dataset.view;
    if (!viewId) return;
    switchView(viewId);
  });

  els.heroActions.addEventListener("click", (event) => {
    const amapTest = event.target.closest("[data-amap-test]")?.dataset.amapTest;
    if (amapTest) {
      openAmapTestRoute(amapTest);
      return;
    }

    const button = event.target.closest("[data-view-switch]");
    if (!button) return;
    const viewId = button.dataset.viewSwitch;
    const target = button.dataset.scrollTarget;
    if (!viewId) return;
    switchView(viewId, { skipHashSync: Boolean(target) });
    if (target) {
      scrollToSection(target);
    }
  });

  els.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value || "";
    renderSearchResults();
  });

  els.searchClearBtn?.addEventListener("click", clearSearch);

  els.searchFilters.addEventListener("click", (event) => {
    const mode = event.target.closest("[data-search-mode]")?.dataset.searchMode;
    if (!mode || mode === state.searchMode) return;
    state.searchMode = mode;
    renderSearchResults();
  });

  els.searchShell.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-search]")) {
      closeSearch();
    }
  });

  els.detailShell.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-detail]")) {
      closeDetail();
    }
  });

  els.overviewTools.addEventListener("click", (event) => {
    const target = event.target.closest("[data-scroll-target]")?.dataset.scrollTarget;
    if (!target) return;
    scrollToSection(target);
  });

  els.phaseFilter?.addEventListener("click", (event) => {
    const nextPhase = event.target.closest("[data-phase]")?.dataset.phase;
    const checklistTarget = event.target.closest("[data-checklist-target]")?.dataset.checklistTarget;
    if (checklistTarget) {
      closeTopbarMenus();
      scrollToSection(checklistTarget);
      return;
    }
    if (!nextPhase || nextPhase === state.phase) return;
    state.phase = nextPhase;
    closeTopbarMenus();
    renderPhaseScopedSections();
  });

  els.dateRail.addEventListener("click", (event) => {
    const nextDayId = event.target.closest("[data-focus-day]")?.dataset.focusDay;
    if (!nextDayId || nextDayId === state.itineraryDayId) return;
    state.itineraryDayId = nextDayId;
    renderPhaseScopedSections();
    syncHashFromState();
  });

  els.pitfallFilters.addEventListener("click", (event) => {
    const category = event.target.closest("[data-pitfall-category]")?.dataset.pitfallCategory;
    if (!category || category === state.pitfallCategory) return;
    state.pitfallCategory = category;
    renderPitfallFilters();
    renderPitfalls();
    syncHashFromState();
  });

  els.pitfallList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-day]");
    const dayId = button?.dataset.openDay;
    if (!dayId) return;
    openDayDetail(dayId, { tab: button.dataset.openTab || "route" });
  });

  els.featuredGallery.addEventListener("click", (event) => {
    const attractionId = event.target.closest("[data-focus-attraction]")?.dataset.focusAttraction;
    if (attractionId) {
      focusAttraction(attractionId, { skipScroll: true });
      return;
    }

    const button = event.target.closest("[data-open-day]");
    const dayId = button?.dataset.openDay;
    if (!dayId) return;
    const tab = button.dataset.openTab || "route";
    const imageSequence = button.dataset.openImageSeq;
    const imageIndex = imageSequence ? Math.max(findImageIndexBySequence(dayId, Number(imageSequence)), 0) : 0;
    openDayDetail(dayId, { tab, imageIndex });
  });

  els.attractionFocus?.addEventListener("click", (event) => {
    const attractionId = event.target.closest("[data-open-attraction]")?.dataset.openAttraction;
    if (attractionId) {
      focusAttraction(attractionId);
      return;
    }

    const focusDay = event.target.closest("[data-focus-day]")?.dataset.focusDay;
    if (focusDay) {
      focusItineraryDay(focusDay);
      return;
    }

    const switchButton = event.target.closest("[data-view-switch]");
    if (switchButton) {
      const viewId = switchButton.dataset.viewSwitch;
      const target = switchButton.dataset.scrollTarget;
      const dayId = switchButton.dataset.focusDay;
      if (dayId && viewId === "itinerary") {
        focusItineraryDay(dayId);
        return;
      }
      if (!viewId) return;
      switchView(viewId, { skipHashSync: Boolean(target) });
      if (target) {
        scrollToSection(target);
      }
      return;
    }

    const explicitLightboxDay = event.target.closest("[data-inline-lightbox-day]")?.dataset.inlineLightboxDay;
    const explicitLightboxSeq = event.target.closest("[data-inline-lightbox-seq]")?.dataset.inlineLightboxSeq;
    if (explicitLightboxDay && explicitLightboxSeq) {
      const imageIndex = Math.max(findImageIndexBySequence(explicitLightboxDay, Number(explicitLightboxSeq)), 0);
      openLightbox(explicitLightboxDay, imageIndex);
      return;
    }

    const button = event.target.closest("[data-open-day]");
    const dayId = button?.dataset.openDay;
    if (!dayId) return;
    const tab = button.dataset.openTab || "route";
    const sourceSeq = button.dataset.openSourceSeq ? Number(button.dataset.openSourceSeq) : null;
    openDayDetail(dayId, { tab, sourceSeq });
  });

  els.daysContainer.addEventListener("click", (event) => {
    const focusDay = event.target.closest("[data-focus-day]")?.dataset.focusDay;
    if (focusDay) {
      state.itineraryDayId = focusDay;
      renderPhaseScopedSections();
      syncHashFromState();
      return;
    }

    const inlineLightboxSequence = event.target.closest("[data-inline-lightbox-seq]")?.dataset.inlineLightboxSeq;
    if (inlineLightboxSequence && state.itineraryDayId) {
      const imageIndex = Math.max(findImageIndexBySequence(state.itineraryDayId, Number(inlineLightboxSequence)), 0);
      openLightbox(state.itineraryDayId, imageIndex);
      return;
    }

    const switchButton = event.target.closest("[data-view-switch]");
    if (switchButton) {
      const viewId = switchButton.dataset.viewSwitch;
      const target = switchButton.dataset.scrollTarget;
      if (!viewId) return;
      switchView(viewId, { skipHashSync: Boolean(target) });
      if (target) {
        scrollToSection(target);
      }
      return;
    }

    const attractionId = event.target.closest("[data-open-attraction]")?.dataset.openAttraction;
    if (attractionId) {
      focusAttraction(attractionId);
      return;
    }

    const button = event.target.closest("[data-open-day]");
    const dayId = button?.dataset.openDay;
    if (!dayId) return;
    const tab = button.dataset.openTab || "route";
    const sourceSeq = button.dataset.openSourceSeq ? Number(button.dataset.openSourceSeq) : null;
    openDayDetail(dayId, { tab, sourceSeq });
  });

  els.bookingTools.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tool-kind]");
    if (!button) return;
    applyToolAction({
      kind: button.dataset.toolKind || "",
      target: button.dataset.toolTarget || "",
      dayId: button.dataset.toolDay || "",
      tab: button.dataset.toolTab || "",
      phase: button.dataset.toolPhase || "",
      category: button.dataset.toolCategory || "",
    });
  });

  els.searchResults.addEventListener("click", (event) => {
    const button = event.target.closest("[data-result-kind]");
    if (!button) return;
    handleSearchResult(button);
  });

  els.detailLeadImage.addEventListener("click", () => {
    if (!state.detailDayId) return;
    openLightbox(state.detailDayId, state.detailImageIndex);
  });

  els.detailGalleryRail.addEventListener("click", (event) => {
    const index = event.target.closest("[data-open-lightbox-index]")?.dataset.openLightboxIndex;
    if (index === undefined || !state.detailDayId) return;
    openLightbox(state.detailDayId, Number(index) || 0);
  });

  els.detailTabs.addEventListener("click", (event) => {
    const nextTab = event.target.closest("[data-tab]")?.dataset.tab;
    if (!nextTab || nextTab === state.detailTab) return;
    state.detailTab = getSafeDetailTab(nextTab);
    state.sourceFocusSequence = null;
    renderDetail();
    if (els.detailSheet) {
      els.detailSheet.scrollTo({ top: 0, behavior: "smooth" });
    }
    syncHashFromState();
  });

  els.detailBody.addEventListener("click", (event) => {
    const lightboxIndex = event.target.closest("[data-open-lightbox-index]")?.dataset.openLightboxIndex;
    if (lightboxIndex !== undefined) {
      openLightbox(state.detailDayId, Number(lightboxIndex) || 0);
      return;
    }

    const sourceSeq = event.target.closest("[data-jump-source-seq]")?.dataset.jumpSourceSeq;
    if (sourceSeq) {
      jumpToSource(Number(sourceSeq));
    }
  });

  els.lightboxShell.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-lightbox]")) {
      closeLightbox();
      return;
    }

    const direction = event.target.closest("[data-lightbox-nav]")?.dataset.lightboxNav;
    if (direction === "prev") {
      navigateLightbox(-1);
    } else if (direction === "next") {
      navigateLightbox(1);
    }
  });

  els.lightboxFrame?.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    lightboxTouchStartX = event.touches[0].clientX;
    lightboxTouchStartY = event.touches[0].clientY;
  }, { passive: true });

  els.lightboxFrame?.addEventListener("touchend", (event) => {
    if (!lightboxTouchStartX || !lightboxTouchStartY || event.changedTouches.length !== 1) return;
    const deltaX = event.changedTouches[0].clientX - lightboxTouchStartX;
    const deltaY = event.changedTouches[0].clientY - lightboxTouchStartY;
    lightboxTouchStartX = 0;
    lightboxTouchStartY = 0;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    navigateLightbox(deltaX < 0 ? 1 : -1);
  }, { passive: true });

  els.lightboxSourceBtn.addEventListener("click", () => {
    const daySource = getDaySource(state.lightboxDayId);
    const image = daySource?.images?.[state.lightboxIndex];
    if (!image) return;
    jumpToSource(image.sequence);
  });

  els.packingActions.addEventListener("click", (event) => {
    const action = event.target.closest("[data-pack-action]")?.dataset.packAction;
    if (!action) return;
    if (action === "expand") setAllPackingGroups(true);
    if (action === "collapse") setAllPackingGroups(false);
    if (action === "reset") resetAllPacking();
  });

  els.packingList.addEventListener("change", (event) => {
    const input = event.target.closest("[data-pack-key]");
    if (!(input instanceof HTMLInputElement)) return;
    handlePackingChange(input);
  });

  els.packingList.addEventListener("click", (event) => {
    const groupToggle = event.target.closest("[data-toggle-pack-group]")?.dataset.togglePackGroup;
    if (groupToggle) {
      togglePackingGroup(groupToggle);
      return;
    }

    const groupReset = event.target.closest("[data-reset-pack]")?.dataset.resetPack;
    if (groupReset) {
      resetPackingGroup(groupReset);
    }
  });

  els.packingFloatingProgress?.addEventListener("click", () => {
    scrollToSection("packingSection");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (state.viewMenuOpen || state.phaseMenuOpen) {
        closeTopbarMenus();
        return;
      }
      if (state.lightboxOpen) {
        closeLightbox();
        return;
      }
      if (state.detailOpen) {
        closeDetail();
        return;
      }
      if (state.searchOpen) {
        closeSearch();
      }
      return;
    }

    if (state.lightboxOpen && event.key === "ArrowLeft") {
      navigateLightbox(-1);
    }

    if (state.lightboxOpen && event.key === "ArrowRight") {
      navigateLightbox(1);
    }
  });

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", scheduleViewportMetricSync, { passive: true });
  window.addEventListener("orientationchange", scheduleViewportMetricSync, { passive: true });
  window.addEventListener("hashchange", parseHashAndApply);
}

async function init() {
  renderHeroHighlights();
  renderRouteStrip();
  renderOverviewFacts();
  renderOverviewTools();
  renderBookingTools();
  renderBooking();
  renderGlobalNotes();
  renderPacking();
  renderPhaseScopedSections();
  renderSearchResults();
  updateViewNavigation();
  bindEvents();
  bindChromeObservers();
  bindViewportObservers();
  scheduleViewportMetricSync();
  updateScrollProgress();

  await loadGuideBlueprint();
  renderHeroMedia();
  renderOverviewFacts();
  renderPhaseScopedSections();
  renderSearchResults();
  updateViewNavigation();
  scheduleViewportMetricSync();
  if (state.detailOpen) {
    renderDetail();
  }
  parseHashAndApply();
}

void init();
