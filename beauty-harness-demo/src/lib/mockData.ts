import { Customer } from './types'

export const customers: Customer[] = [
  {
    id: '1',
    name: '田中さくら',
    treatment: 'ネイル',
    source: 'hpb',
    visitIntervalDays: 35,
    cancelCount: 0,
    lastVisit: '2026-02-23',
    nextPredicted: '2026-03-30',
  },
  {
    id: '2',
    name: '鈴木あおい',
    treatment: 'カラー',
    source: 'hpb',
    visitIntervalDays: 28,
    cancelCount: 2,
    lastVisit: '2026-03-02',
    nextPredicted: '2026-03-30',
  },
  {
    id: '3',
    name: '山田ゆい',
    treatment: 'トリートメント',
    source: 'own',
    visitIntervalDays: 42,
    cancelCount: 0,
    lastVisit: '2026-02-16',
    nextPredicted: '2026-03-30',
  },
  {
    id: '4',
    name: '佐藤みな',
    treatment: 'ハイライト',
    source: 'hpb',
    visitIntervalDays: 21,
    cancelCount: 0,
    lastVisit: '2026-03-09',
    nextPredicted: '2026-03-30',
  },
]

export const todayBookings = [
  {
    id: 'b1',
    customer: customers[0],
    time: '10:00',
    treatment: 'ネイル（ジェル）',
    price: 8800,
    status: 'waiting' as const,
  },
  {
    id: 'b2',
    customer: customers[1],
    time: '11:30',
    treatment: 'カラー（フルカラー）',
    price: 12000,
    status: 'waiting' as const,
  },
  {
    id: 'b3',
    customer: customers[2],
    time: '14:00',
    treatment: 'トリートメント',
    price: 6500,
    status: 'waiting' as const,
  },
  {
    id: 'b4',
    customer: customers[3],
    time: '16:00',
    treatment: 'ハイライト＋カット',
    price: 15000,
    status: 'waiting' as const,
  },
]

export const automationLogs = [
  {
    id: 'log1',
    customerName: '高橋れい',
    action: 'お礼LINE送信',
    timestamp: '09:45',
    status: 'success' as const,
  },
  {
    id: 'log2',
    customerName: '高橋れい',
    action: 'リマインド設定（4/15）',
    timestamp: '09:45',
    status: 'success' as const,
  },
  {
    id: 'log3',
    customerName: '中村ひな',
    action: 'HPB→自社誘導LINE送信',
    timestamp: '09:30',
    status: 'success' as const,
  },
]

// HPB手数料は1件あたり約2,000円として計算
export const HPB_FEE_PER_BOOKING = 2000

export const monthlyStats = {
  revenue: 892000,
  bookingCount: 68,
  repeatRate: 72,
  hpbCount: 41,
  ownCount: 27,
  hpbFeeTotal: 41 * HPB_FEE_PER_BOOKING,
}

// ギャラリー用スタイルデータ
export const galleryPosts = [
  {
    id: 'g1',
    imageGradient: 'from-pink-300 via-rose-200 to-amber-200',
    styleName: 'ミルクティーベージュ',
    stylist: 'Yuki',
    likes: 234,
    comments: 18,
    tags: ['#ミルクティーベージュ', '#透明感カラー', '#ブリーチカラー'],
    description: '透明感たっぷりのミルクティーベージュ✨ ブリーチ1回でこの仕上がり！',
    treatment: 'カラー',
    price: 12000,
    duration: '120分',
  },
  {
    id: 'g2',
    imageGradient: 'from-violet-300 via-purple-200 to-pink-200',
    styleName: 'ラベンダーアッシュ',
    stylist: 'Miki',
    likes: 189,
    comments: 12,
    tags: ['#ラベンダーアッシュ', '#韓国ヘア', '#ハイトーン'],
    description: '韓国風ラベンダーアッシュ💜 儚げな雰囲気が人気です',
    treatment: 'カラー＋トリートメント',
    price: 15000,
    duration: '150分',
  },
  {
    id: 'g3',
    imageGradient: 'from-amber-200 via-orange-200 to-rose-200',
    styleName: 'くびれミディ',
    stylist: 'Yuki',
    likes: 312,
    comments: 25,
    tags: ['#くびれミディ', '#レイヤーカット', '#小顔カット'],
    description: '顔まわりのレイヤーで小顔効果抜群🌸 誰でも似合うくびれミディ',
    treatment: 'カット',
    price: 6500,
    duration: '60分',
  },
  {
    id: 'g4',
    imageGradient: 'from-emerald-200 via-teal-200 to-cyan-200',
    styleName: 'オリーブベージュ',
    stylist: 'Rina',
    likes: 156,
    comments: 9,
    tags: ['#オリーブベージュ', '#暗髪カラー', '#艶カラー'],
    description: 'ブリーチなしでこの透明感！オフィスでもOKなオリーブベージュ🍃',
    treatment: 'カラー',
    price: 9800,
    duration: '90分',
  },
  {
    id: 'g5',
    imageGradient: 'from-sky-200 via-blue-200 to-indigo-200',
    styleName: 'インナーカラー ブルー',
    stylist: 'Miki',
    likes: 278,
    comments: 22,
    tags: ['#インナーカラー', '#ブルー', '#デザインカラー'],
    description: '耳にかけた時にチラッと見えるブルーがポイント💙',
    treatment: 'インナーカラー',
    price: 11000,
    duration: '120分',
  },
  {
    id: 'g6',
    imageGradient: 'from-rose-300 via-pink-200 to-fuchsia-200',
    styleName: 'ピンクブラウン',
    stylist: 'Yuki',
    likes: 198,
    comments: 15,
    tags: ['#ピンクブラウン', '#モテカラー', '#春カラー'],
    description: '春にぴったりのピンクブラウン🌷 ツヤ感がすごい！',
    treatment: 'カラー＋トリートメント',
    price: 14000,
    duration: '120分',
  },
]

// スタイリストデータ
export const stylists = [
  { id: 's1', name: 'Yuki', title: 'トップスタイリスト', rating: 4.9, reviewCount: 128, speciality: 'カラー・ハイライト' },
  { id: 's2', name: 'Miki', title: 'スタイリスト', rating: 4.8, reviewCount: 89, speciality: 'デザインカラー・韓国ヘア' },
  { id: 's3', name: 'Rina', title: 'スタイリスト', rating: 4.7, reviewCount: 64, speciality: 'カット・パーマ' },
]

// 予約可能時間スロット
export const availableSlots = [
  { time: '10:00', available: true },
  { time: '10:30', available: false },
  { time: '11:00', available: true },
  { time: '11:30', available: true },
  { time: '12:00', available: false },
  { time: '13:00', available: true },
  { time: '13:30', available: false },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: false },
  { time: '16:00', available: true },
  { time: '16:30', available: false },
  { time: '17:00', available: true },
]

// ユーザーのマイページ用データ
export const userProfile = {
  name: '田中さくら',
  points: 1200,
  rank: 'ゴールド',
  totalVisits: 12,
  memberSince: '2025-04',
  nextReward: 'トリートメント無料',
  pointsToNextReward: 300,
}

export const visitHistory = [
  { date: '2026-03-30', treatment: 'ネイル（ジェル）', stylist: 'Yuki', price: 8800, reviewed: true },
  { date: '2026-02-23', treatment: 'ネイル（ジェル）', stylist: 'Yuki', price: 8800, reviewed: true },
  { date: '2026-01-18', treatment: 'ネイル＋ハンドケア', stylist: 'Yuki', price: 11000, reviewed: false },
  { date: '2025-12-14', treatment: 'ネイル（ジェル）', stylist: 'Miki', price: 8800, reviewed: true },
  { date: '2025-11-09', treatment: 'ネイル（ジェル）', stylist: 'Yuki', price: 8800, reviewed: false },
]

export const userCoupons = [
  { id: 'c1', title: 'LINE予約限定 500円OFF', expires: '2026-04-30', used: false },
  { id: 'c2', title: 'お誕生日クーポン 20%OFF', expires: '2026-05-15', used: false },
  { id: 'c3', title: 'トリートメント無料', expires: '2026-03-31', used: true },
]

// 月間売上推移データ（分析画面用）
export const monthlyRevenue = [
  { month: '10月', revenue: 720000, hpbCount: 38, ownCount: 18 },
  { month: '11月', revenue: 780000, hpbCount: 40, ownCount: 20 },
  { month: '12月', revenue: 950000, hpbCount: 45, ownCount: 28 },
  { month: '1月', revenue: 680000, hpbCount: 35, ownCount: 19 },
  { month: '2月', revenue: 810000, hpbCount: 39, ownCount: 24 },
  { month: '3月', revenue: 892000, hpbCount: 41, ownCount: 27 },
]
