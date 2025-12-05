import { 
  Car, 
  Utensils, 
  MapPin, 
  BedDouble, 
  Footprints, 
  Waves, 
  Mountain, 
  Coffee, 
  Clock,
  Droplets, 
  Shirt, 
  CloudRain, 
  BatteryCharging, 
  Sandwich, 
  Briefcase, 
  Ticket, 
  CreditCard, 
  Umbrella, 
  Smartphone 
} from "lucide-react";
import { ScheduleItem, HikingGuideData, ChecklistCategory } from "./types";

// --- CONFIGURATION ---
// Environment Variables Management
// 這些變數將由 GitHub Secrets 在打包時注入，或在本地開發時由 .env 檔案提供
const env = (import.meta as any).env || {};
export const GOOGLE_SCRIPT_URL = env.VITE_GOOGLE_SCRIPT_URL || ""; 
export const SCHEDULE_CSV_URL = env.VITE_SCHEDULE_CSV_URL || "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJNXk6dMtNNxWFxFYBL23Na02nVCCvTgexTEyMwt21CgWmZdL4QD7PhH-2xZIw4_RigheDC05-ye53/pub?gid=0&single=true&output=csv";
export const CANDIDATES_CSV_URL = env.VITE_CANDIDATES_CSV_URL || ""; 

// --- Types for Data Structure ---
export interface TripData {
  tripInfo: typeof TRIP_INFO_ZH;
  day1: ScheduleItem[];
  day2: ScheduleItem[];
  hikingGuide: HikingGuideData;
  checklist: ChecklistCategory[];
  prepIcons: { icon: any, label: string }[];
}

export interface UILabels {
  tabInfo: string;
  tabSchedule: string;
  tabExpenses: string;
  tabPrep: string;
  tabCandidates: string; // New Tab Label
  day1Label: string;
  day2Label: string;
  day1Header: string;
  day2Header: string;
  tripOverview: string;
  dateLabel: string;
  pickupLabel: string;
  stayLabel: string;
  returnReminderTitle: string;
  returnReminderText: (date: string) => string;
  optionLabel: string;
  recommendedLabel: string;
  hikingStatsTitle: string;
  statUp: string;
  statDown: string;
  statTotal: string;
  hikingPrepTitle: string;
  hikingScheduleTitle: string;
  prepListTitle: string;
  prepListDesc: string;
  checklistProgress: (current: number, total: number) => string;
  
  // Expense Calculator Labels
  expenseTitle: string;
  expenseMembersTitle: string;
  expenseAddMemberBtn: string;
  expenseMemberPlaceholder: string;
  expenseAddBtn: string;
  expenseTotal: string;
  expensePerPerson: string;
  expenseInputTitle: string;
  expenseInputAmount: string;
  expenseInputPayer: string;
  expenseSettlement: string;
  expenseEmpty: string;
  expenseCurrency: string;
  expenseOwes: string;
  expenseTo: string;

  // Candidates Labels
  candidatesTitle: string;
  candidatesDesc: string;
  candidatesFilterAll: string;
  candidatesFilterFood: string;
  candidatesFilterFun: string;
  candidatesEmpty: string;
}

// --- SHARED DATA ---
const LINKS = {
  pickup: "https://maps.app.goo.gl/JutsYKq1rDoCCRj67",
  stay: "https://maps.app.goo.gl/ESh66w7VmBcR77sj9"
};

// --- CHINESE DATA (ZH) ---

const TRIP_INFO_ZH = {
  dates: "12/6（六）－ 12/7（日）",
  pickup: {
    location: "台北市大同區 IWS 承德店",
    time: "09:30 取車",
    link: LINKS.pickup
  },
  stay: {
    location: "Sasa Youth Hostel 山杉青旅",
    sub: "礁溪／十六結路",
    link: LINKS.stay
  },
  return: {
    time: "12/7 20:00 前",
    location: "回到台北還車"
  }
};

const DAY_1_SCHEDULE_ZH: ScheduleItem[] = [
  {
    time: "09:30",
    title: "取車出發",
    location: "IWS 承德店",
    mapLink: LINKS.pickup,
    icon: Car,
    type: "transport",
    description: "準時取車，檢查車況後出發前往宜蘭。"
  },
  {
    time: "11:00",
    title: "宜蘭午餐",
    location: "礁溪周邊",
    icon: Utensils,
    type: "food",
    options: [
      {
        id: "A",
        title: "柯氏蔥油餅",
        subtitle: "",
        tags: ["排隊名店", "小吃"],
        description: ["步行或開車都方便，但人潮多。"],
        mapLink: "https://maps.app.goo.gl/1W3fvzDJLSNs36ZC8"
      },
      {
        id: "B",
        title: "白雲山鹿",
        subtitle: "台式早餐店",
        tags: ["早餐", "蛋餅"],
        description: ["人氣台式早餐，蛋餅與油飯受歡迎"],
        mapLink: "https://maps.app.goo.gl/GUDhN66Fqe9L6UyD7"
      },
      {
        id: "C",
        title: "蘭揚蘆花雞餐廳",
        subtitle: "台式合菜",
        tags: ["烤雞"],
        description: ["適合多人聚餐，招牌烤雞"],
        mapLink: "https://maps.app.goo.gl/33MB2iKNqDM17eE87"
      }
    ]
  },
  {
    time: "12:30",
    title: "下午行程",
    icon: MapPin,
    type: "activity",
    options: [
      {
        id: "A",
        title: "宜蘭傳統藝術中心",
        tags: ["手作", "拍照"],
        description: ["手作體驗、懷舊街道，非常好拍"],
        mapLink: "https://maps.app.goo.gl/ZWQb8e5DfSGkqyXm7"
      },
      {
        id: "B",
        title: "幾米公園 + 宜蘭酒廠",
        tags: ["拍照", "散步"],
        description: ["幾米兔、大象彩繪裝置 → 走走拍拍", "酒廠可試飲、買伴手禮、逛逛展區"]
      }
    ]
  },
  {
    time: "16:30",
    title: "入住 Check-in",
    location: "Sasa Youth Hostel",
    mapLink: LINKS.stay,
    icon: BedDouble,
    type: "rest",
    description: "放行李、休息補充水分，準備晚間行程。"
  },
  {
    time: "17:30",
    title: "礁溪溫泉公園",
    location: "礁溪市區",
    icon: Footprints,
    type: "activity",
    description: "體驗免費腳湯，市區散步感受氛圍。"
  },
  {
    time: "18:30",
    title: "晚餐時光",
    location: "十六結路周邊",
    icon: Utensils,
    type: "food",
    description: "住宿位置靠近市區邊緣，推薦以下好停車且評價高的選擇：",
    options: [
      {
        id: "A",
        title: "空ㄟ農場",
        subtitle: "夜景農場",
        tags: ["夜景"],
        description: ["需搭乘接駁車上山，披薩與夜景非常著名"],
        mapLink: "https://maps.app.goo.gl/WAvEJF9xNMUdb8Nq6"
      }
    ]
  },
  {
    time: "19:00",
    title: "泡湯 / 休息",
    icon: Waves,
    type: "rest",
    description: "隔天要爬抹茶山，建議早休息。"
  }
];

const DAY_2_SCHEDULE_ZH: ScheduleItem[] = [
  {
    time: "06:30",
    title: "前往登山口",
    location: "五峰旗停車場",
    icon: Car,
    type: "transport",
    description: "開車約 10 分鐘，建議準時出發。"
  },
  {
    time: "06:45",
    title: "抹茶山挑戰",
    location: "聖母登山步道",
    icon: Mountain,
    type: "activity",
    specialContent: 'hiking_guide',
    description: "詳細裝備與時程請參考下方「登山指南」。"
  },
  {
    time: "13:30",
    title: "下山完成",
    icon: Footprints,
    type: "default",
    description: "預計行程結束時間 (±30 分鐘)"
  },
  {
    time: "14:00",
    title: "午餐 (彈性)",
    icon: Utensils,
    type: "food",
    description: "建議選項：清水地熱區附近、礁溪小吃 (柯氏蔥油餅 / 八寶冬粉) 或 海景咖啡廳。",
    options: [
        {
            id: "A",
            title: "拾松辦桌小吃",
            subtitle: "合菜",
            tags: ["台式", "合菜"],
            description: ["宜蘭特色手路菜，西魯肉、糕渣"],
            mapLink: "https://maps.app.goo.gl/9XgKME1uLHLU6YBZ9"
        },
        {
            id: "B",
            title: "玉仁八寶冬粉",
            subtitle: "在地名店",
            tags: ["冬粉", "熱湯"],
            description: ["礁溪必吃美食之一，湯頭鮮美"],
            mapLink: "https://maps.app.goo.gl/qRvosmNQAva8LNg6A"
        }
    ]
  },
  {
    time: "17:00",
    title: "返回台北",
    icon: Car,
    type: "transport",
    description: "預估車程 1.5–2 小時。"
  },
  {
    time: "19:00",
    title: "抵達台北",
    icon: MapPin,
    type: "default",
    description: "遇尖峰或雨天可能稍晚。"
  },
  {
    time: "20:00",
    title: "還車截止",
    icon: Clock,
    type: "default",
    description: "確認還車完成。"
  }
];

const HIKING_GUIDE_ZH: HikingGuideData = {
  prepList: [], // Now handled by checklist data mostly, but kept for legacy if needed
  stats: {
    upTime: "3.5 小時",
    restTime: "40 分鐘",
    downTime: "3 小時",
    totalTime: "6~7 小時"
  },
  milestones: [
    { time: "06:30", event: "五峰旗停車場 出發" },
    { time: "06:45", event: "抵達 天母教堂" },
    { time: "07:45", event: "抵達 通天橋", note: "聖母山莊登山口" },
    { time: "09:00", event: "抵達 聖母山莊", note: "大休 54 分鐘 + 拍照" },
    { time: "10:38", event: "回到 通天橋登山口" },
    { time: "11:10", event: "回到 天母教堂", note: "小休 10 分鐘" },
    { time: "11:40", event: "回到 五峰旗停車場", note: "行程結束" },
  ]
};

const CHECKLIST_DATA_ZH: ChecklistCategory[] = [
  {
    id: "hiking",
    title: "⛰️ 抹茶山登山裝備",
    items: [
       { id: "h1", label: "水 1.5L - 2L", icon: Droplets },
       { id: "h2", label: "行動糧（堅果、麵包）", icon: Sandwich },
       { id: "h3", label: "保暖外套", icon: Shirt },
       { id: "h4", label: "雨具（雨衣/傘）", icon: CloudRain },
       { id: "h5", label: "行動電源", icon: BatteryCharging },
       { id: "h6", label: "早餐（前一晚買好）", icon: Coffee },
    ]
  },
  {
    id: "general",
    title: "🎒 一般行李",
    items: [
      { id: "g1", label: "換洗衣物 (2天1夜)", icon: Shirt },
      { id: "g2", label: "睡衣 / 輕便服裝" },
      { id: "g3", label: "盥洗用品 / 化妝包", icon: Briefcase },
      { id: "g4", label: "個人藥品" },
      { id: "g5", label: "充電器 / 線材", icon: Smartphone },
    ]
  },
  {
    id: "docs",
    title: "🪪 重要證件 & 錢包",
    items: [
      { id: "d1", label: "身分證 / 健保卡", icon: Ticket },
      { id: "d2", label: "駕照 (租車駕駛必備)" },
      { id: "d3", label: "現金 (部分小吃/停車)", icon: CreditCard },
    ]
  },
  {
      id: "fun",
      title: "♨️ 溫泉 & 其他",
      items: [
          { id: "f1", label: "泳衣/泳帽 (若泡大眾池)", icon: Waves },
          { id: "f2", label: "拖鞋" },
          { id: "f3", label: "塑膠袋 (裝濕衣物)" },
          { id: "f4", label: "折疊傘 (平地備用)", icon: Umbrella }
      ]
  }
];

const PREP_ICONS_ZH = [
    { icon: Droplets, label: "水 1.5L+" },
    { icon: Sandwich, label: "行動糧" },
    { icon: Shirt, label: "保暖衣物" },
    { icon: CloudRain, label: "雨具" },
    { icon: BatteryCharging, label: "行動電源" },
    { icon: Coffee, label: "早餐" },
];

const LABELS_ZH: UILabels = {
  tabInfo: "資訊",
  tabSchedule: "行程",
  tabExpenses: "分帳",
  tabPrep: "準備",
  tabCandidates: "候選",
  day1Label: "Day 1 (六)",
  day2Label: "Day 2 (日)",
  day1Header: "Day 1 • 輕鬆走走與溫泉",
  day2Header: "Day 2 • 挑戰聖母山莊",
  tripOverview: "行程概覽",
  dateLabel: "日期",
  pickupLabel: "出發 & 取車",
  stayLabel: "住宿",
  returnReminderTitle: "還車提醒",
  returnReminderText: (date) => `請於 ${date} 前 回到台北還車。`,
  optionLabel: "選項",
  recommendedLabel: "推薦",
  hikingStatsTitle: "預估時間 (體力較弱版)",
  statUp: "上山",
  statDown: "下山",
  statTotal: "全程合計",
  hikingPrepTitle: "行前準備",
  hikingScheduleTitle: "參考時程",
  prepListTitle: "行前準備清單",
  prepListDesc: "出發前請逐一檢查，確認裝備齊全。\n系統會自動儲存您的勾選進度。",
  checklistProgress: (current, total) => `${current}/${total}`,
  
  expenseTitle: "分帳計算機",
  expenseMembersTitle: "分帳成員",
  expenseAddMemberBtn: "新增",
  expenseMemberPlaceholder: "成員姓名",
  expenseAddBtn: "新增項目",
  expenseTotal: "總支出",
  expensePerPerson: "每人應付",
  expenseInputTitle: "項目名稱",
  expenseInputAmount: "金額",
  expenseInputPayer: "付款人",
  expenseSettlement: "結算方案",
  expenseEmpty: "目前沒有支出記錄",
  expenseCurrency: "NT$",
  expenseOwes: "應給",
  expenseTo: "->",

  candidatesTitle: "口袋名單",
  candidatesDesc: "這裡列出了更多有趣的餐廳與景點，\n行程有變動時可以參考。",
  candidatesFilterAll: "全部",
  candidatesFilterFood: "美食",
  candidatesFilterFun: "景點",
  candidatesEmpty: "目前沒有候選資料",
};

// --- ENGLISH DATA (EN) ---

const TRIP_INFO_EN = {
  dates: "Dec 6 (Sat) - Dec 7 (Sun)",
  pickup: {
    location: "IWS Chengde Branch, Taipei",
    time: "09:30 Pickup",
    link: LINKS.pickup
  },
  stay: {
    location: "Sasa Youth Hostel",
    sub: "Jiaoxi / Shiliujie Rd",
    link: LINKS.stay
  },
  return: {
    time: "Before Dec 7 20:00",
    location: "Return car in Taipei"
  }
};

const DAY_1_SCHEDULE_EN: ScheduleItem[] = [
  {
    time: "09:30",
    title: "Pick up Car & Depart",
    location: "IWS Chengde Branch",
    mapLink: LINKS.pickup,
    icon: Car,
    type: "transport",
    description: "Pick up the car on time, check condition, and head to Yilan."
  },
  {
    time: "11:00",
    title: "Yilan Lunch",
    location: "Near Jiaoxi",
    icon: Utensils,
    type: "food",
    options: [
      {
        id: "A",
        title: "Ke's Scallion Pancake",
        subtitle: "Jiaoxi Must-Eat",
        tags: ["Famous", "Street Food"],
        description: ["Walking or driving is convenient, but expect queues."],
        mapLink: "https://maps.app.goo.gl/1W3fvzDJLSNs36ZC8"
      },
      {
        id: "B",
        title: "White Cloud Deer",
        subtitle: "Taiwanese Breakfast",
        tags: ["Breakfast", "Omelet"],
        description: ["Popular local spot, try the omelet and sticky rice."],
        mapLink: "https://maps.app.goo.gl/GUDhN66Fqe9L6UyD7"
      },
      {
        id: "C",
        title: "Lanyang Luhua Chicken",
        subtitle: "Group Meal",
        tags: ["Roast Chicken"],
        description: ["Great for groups, famous for roast chicken."],
        mapLink: "https://maps.app.goo.gl/33MB2iKNqDM17eE87"
      }
    ]
  },
  {
    time: "12:30",
    title: "Afternoon Activity",
    icon: MapPin,
    type: "activity",
    options: [
      {
        id: "A",
        title: "NCFTA",
        subtitle: "National Center for Traditional Arts",
        tags: ["Crafts", "Photos"],
        description: ["DIY crafts, old streets, great for photography."],
        mapLink: "https://maps.app.goo.gl/ZWQb8e5DfSGkqyXm7"
      },
      {
        id: "B",
        title: "Jimmy Park + Distillery",
        tags: ["Photos", "Walk"],
        description: ["Jimmy bunny & elephant art -> Sightseeing", "Distillery tasting & souvenirs"]
      }
    ]
  },
  {
    time: "16:30",
    title: "Check-in",
    location: "Sasa Youth Hostel",
    mapLink: LINKS.stay,
    icon: BedDouble,
    type: "rest",
    description: "Drop luggage, rest, hydrate, prepare for evening."
  },
  {
    time: "17:30",
    title: "Jiaoxi Hot Spring Park",
    location: "Jiaoxi City",
    icon: Footprints,
    type: "activity",
    description: "Experience free foot bath, walk around the city."
  },
  {
    time: "18:30",
    title: "Dinner Time",
    location: "Near Shiliujie Rd",
    icon: Utensils,
    type: "food",
    description: "Accommodation is near city edge. Recommended:",
    options: [
      {
        id: "A",
        title: "Kong Ei Farm",
        subtitle: "Night View",
        tags: ["Night View", "Pizza"],
        description: ["Shuttle required. Famous for pizza and night views."],
        mapLink: "https://maps.app.goo.gl/WAvEJF9xNMUdb8Nq6"
      }
    ]
  },
  {
    time: "19:00",
    title: "Hot Spring / Rest",
    icon: Waves,
    type: "rest",
    description: "Climbing Matcha Mountain tomorrow, rest early."
  }
];

const DAY_2_SCHEDULE_EN: ScheduleItem[] = [
  {
    time: "06:30",
    title: "Head to Trailhead",
    location: "Wufengqi Parking",
    icon: Car,
    type: "transport",
    description: "10 min drive. Depart on time."
  },
  {
    time: "06:45",
    title: "Matcha Mountain Challenge",
    location: "Marian Hiking Trail",
    icon: Mountain,
    type: "activity",
    specialContent: 'hiking_guide',
    description: "See 'Hiking Guide' below for gear & schedule."
  },
  {
    time: "13:30",
    title: "Descent Complete",
    icon: Footprints,
    type: "default",
    description: "Estimated end time (±30 mins)"
  },
  {
    time: "14:00",
    title: "Lunch (Flexible)",
    icon: Utensils,
    type: "food",
    description: "Options: Near Qingshui Geothermal, Jiaoxi Snacks, or Seaview Cafe.",
    options: [
        {
            id: "A",
            title: "Shi Song Traditional Food",
            subtitle: "Taiwanese",
            tags: ["Table Dishes"],
            description: ["Yilan specialties: Xilu meat, Gaozha."],
            mapLink: "https://maps.app.goo.gl/9XgKME1uLHLU6YBZ9"
        },
        {
            id: "B",
            title: "Yu Ren Vermicelli",
            subtitle: "Local Famous",
            tags: ["Vermicelli", "Soup"],
            description: ["Must-eat in Jiaoxi, delicious soup."],
            mapLink: "https://maps.app.goo.gl/qRvosmNQAva8LNg6A"
        }
    ]
  },
  {
    time: "17:00",
    title: "Return to Taipei",
    icon: Car,
    type: "transport",
    description: "Est. 1.5–2 hours drive."
  },
  {
    time: "19:00",
    title: "Arrive in Taipei",
    icon: MapPin,
    type: "default",
    description: "May be later if raining or traffic."
  },
  {
    time: "20:00",
    title: "Return Car Deadline",
    icon: Clock,
    type: "default",
    description: "Ensure car is returned."
  }
];

const HIKING_GUIDE_EN: HikingGuideData = {
  prepList: [],
  stats: {
    upTime: "3.5 Hours",
    restTime: "40 Mins",
    downTime: "3 Hours",
    totalTime: "6~7 Hours"
  },
  milestones: [
    { time: "06:30", event: "Depart Wufengqi Parking" },
    { time: "06:45", event: "Arrive Catholic Church" },
    { time: "07:45", event: "Arrive Tongtian Bridge", note: "Trail Start" },
    { time: "09:00", event: "Arrive Summit", note: "Rest 54m + Photos" },
    { time: "10:38", event: "Back to Tongtian Bridge" },
    { time: "11:10", event: "Back to Church", note: "Rest 10m" },
    { time: "11:40", event: "Back to Parking", note: "End" },
  ]
};

const CHECKLIST_DATA_EN: ChecklistCategory[] = [
  {
    id: "hiking",
    title: "⛰️ Matcha Mtn Gear",
    items: [
       { id: "h1", label: "Water 1.5L - 2L", icon: Droplets },
       { id: "h2", label: "Snacks (Nuts, Bread)", icon: Sandwich },
       { id: "h3", label: "Warm Jacket", icon: Shirt },
       { id: "h4", label: "Rain Gear (Coat/Umbrella)", icon: CloudRain },
       { id: "h5", label: "Power Bank", icon: BatteryCharging },
       { id: "h6", label: "Breakfast (Buy night before)", icon: Coffee },
    ]
  },
  {
    id: "general",
    title: "🎒 Luggage",
    items: [
      { id: "g1", label: "Clothes (2D1N)", icon: Shirt },
      { id: "g2", label: "Pajamas / Light wear" },
      { id: "g3", label: "Toiletries / Makeup", icon: Briefcase },
      { id: "g4", label: "Personal Meds" },
      { id: "g5", label: "Chargers / Cables", icon: Smartphone },
    ]
  },
  {
    id: "docs",
    title: "🪪 Docs & Wallet",
    items: [
      { id: "d1", label: "ID / Health Card", icon: Ticket },
      { id: "d2", label: "Driver's License", description: ["Required for rental"] },
      { id: "d3", label: "Cash (Snacks/Parking)", icon: CreditCard },
    ]
  },
  {
      id: "fun",
      title: "♨️ Hot Spring & Misc",
      items: [
          { id: "f1", label: "Swimsuit/Cap (Public pool)", icon: Waves },
          { id: "f2", label: "Slippers" },
          { id: "f3", label: "Plastic Bags (Wet clothes)" },
          { id: "f4", label: "Folding Umbrella", icon: Umbrella }
      ]
  }
];

const PREP_ICONS_EN = [
    { icon: Droplets, label: "Water 1.5L+" },
    { icon: Sandwich, label: "Snacks" },
    { icon: Shirt, label: "Warm Coat" },
    { icon: CloudRain, label: "Rain Gear" },
    { icon: BatteryCharging, label: "Power Bank" },
    { icon: Coffee, label: "Breakfast" },
];

const LABELS_EN: UILabels = {
  tabInfo: "Info",
  tabSchedule: "Schedule",
  tabExpenses: "Expenses",
  tabPrep: "Prep",
  tabCandidates: "List",
  day1Label: "Day 1 (Sat)",
  day2Label: "Day 2 (Sun)",
  day1Header: "Day 1 • Relax & Hot Spring",
  day2Header: "Day 2 • Matcha Mtn Challenge",
  tripOverview: "Trip Overview",
  dateLabel: "Date",
  pickupLabel: "Depart & Pickup",
  stayLabel: "Stay",
  returnReminderTitle: "Return Reminder",
  returnReminderText: (date) => `Return car in Taipei before ${date}.`,
  optionLabel: "Option",
  recommendedLabel: "Recommended",
  hikingStatsTitle: "Est. Time (Relaxed Pace)",
  statUp: "Ascend",
  statDown: "Descend",
  statTotal: "Total",
  hikingPrepTitle: "Prep",
  hikingScheduleTitle: "Schedule",
  prepListTitle: "Packing Checklist",
  prepListDesc: "Check items before departure.\nProgress is saved automatically.",
  checklistProgress: (current, total) => `${current}/${total}`,

  expenseTitle: "Split Costs",
  expenseMembersTitle: "Members",
  expenseAddMemberBtn: "Add",
  expenseMemberPlaceholder: "Name",
  expenseAddBtn: "Add Expense",
  expenseTotal: "Total",
  expensePerPerson: "Per Person",
  expenseInputTitle: "Item Name",
  expenseInputAmount: "Amount",
  expenseInputPayer: "Payer",
  expenseSettlement: "Settlement",
  expenseEmpty: "No expenses recorded yet.",
  expenseCurrency: "$",
  expenseOwes: "owes",
  expenseTo: "->",

  candidatesTitle: "Candidates",
  candidatesDesc: "More dining & attraction options just in case.",
  candidatesFilterAll: "All",
  candidatesFilterFood: "Food",
  candidatesFilterFun: "Spots",
  candidatesEmpty: "No candidates found",
};

export const APP_DATA: Record<'zh' | 'en', TripData> = {
  zh: {
    tripInfo: TRIP_INFO_ZH,
    day1: DAY_1_SCHEDULE_ZH,
    day2: DAY_2_SCHEDULE_ZH,
    hikingGuide: HIKING_GUIDE_ZH,
    checklist: CHECKLIST_DATA_ZH,
    prepIcons: PREP_ICONS_ZH
  },
  en: {
    tripInfo: TRIP_INFO_EN,
    day1: DAY_1_SCHEDULE_EN,
    day2: DAY_2_SCHEDULE_EN,
    hikingGuide: HIKING_GUIDE_EN,
    checklist: CHECKLIST_DATA_EN,
    prepIcons: PREP_ICONS_EN
  }
};

export const UI_LABELS: Record<'zh' | 'en', UILabels> = {
  zh: LABELS_ZH,
  en: LABELS_EN
};