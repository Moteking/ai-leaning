import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ========================================
  // カテゴリ
  // ========================================
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        slug: "gift",
        name: "贈り物",
        emoji: "🎁",
        description: "食べ物・お花・健康グッズなど、気持ちが伝わるギフト",
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        slug: "travel",
        name: "旅行・体験",
        emoji: "✈️",
        description: "温泉旅行・日帰りツアー・食事体験など",
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        slug: "home",
        name: "住まい・リフォーム",
        emoji: "🏠",
        description: "バリアフリー改修・水回り・防犯など実家を快適に",
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        slug: "daily",
        name: "食事・日常サポート",
        emoji: "🍽️",
        description: "食事宅配・家事代行・買い物代行など日常のお手伝い",
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        slug: "health",
        name: "健康・医療",
        emoji: "💊",
        description: "人間ドック・マッサージ・運動プログラムなど",
        sortOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        slug: "watch",
        name: "見守り・安心",
        emoji: "👁️",
        description: "見守りセンサー・定期訪問・緊急通報システム",
        sortOrder: 6,
      },
    }),
    prisma.category.create({
      data: {
        slug: "endoflife",
        name: "終活・将来の備え",
        emoji: "📋",
        description: "エンディングノート・遺影撮影・相続相談など",
        sortOrder: 7,
      },
    }),
  ]);

  const catMap: Record<string, string> = {};
  for (const c of categories) catMap[c.slug] = c.id;

  // ========================================
  // 商品（50品）
  // ========================================
  const products = [
    // --- 贈り物（10品） ---
    { categorySlug: "gift", name: "愛媛みかん詰め合わせ 3kg", description: "愛媛県産の甘〜いみかんを産地直送", longDescription: "愛媛県宇和島の農家から直送。糖度12度以上の厳選みかんを3kgお届けします。ご両親の健康を願うビタミンCたっぷりのギフトです。", price: 3800, image: "/images/products/mikan.jpg", tags: '["人気","冬ギフト","健康"]', targetAge: "65-74", targetGender: "both", popularity: 95, isNew: false },
    { categorySlug: "gift", name: "宇治抹茶スイーツセット", description: "京都老舗茶舗の上質な抹茶を使った和スイーツ", longDescription: "創業200年の京都宇治茶舗が厳選した抹茶を使用。抹茶ロールケーキ、抹茶大福、抹茶わらび餅の3種セットです。", price: 4200, image: "/images/products/matcha.jpg", tags: '["和菓子","人気","お茶好き"]', targetAge: "65-74", targetGender: "mother", popularity: 88, isNew: false },
    { categorySlug: "gift", name: "プリザーブドフラワー 和モダン", description: "枯れない花で長く楽しめる。和テイストのアレンジメント", longDescription: "プリザーブドフラワーなので水やり不要、2〜3年美しさが続きます。和室にも洋室にも合う上品なデザインです。", price: 5500, image: "/images/products/flower.jpg", tags: '["母の日","誕生日","花"]', targetAge: "65-74", targetGender: "mother", popularity: 92, isNew: false },
    { categorySlug: "gift", name: "獺祭 純米大吟醸 磨き三割九分", description: "日本を代表する銘酒。特別な日にふさわしい逸品", longDescription: "山口県の旭酒造が醸す獺祭。精米歩合39%まで磨き上げた純米大吟醸は、華やかな香りとクリアな味わいが特徴です。", price: 5400, image: "/images/products/dassai.jpg", tags: '["父の日","お酒","特別"]', targetAge: "65-74", targetGender: "father", popularity: 85, isNew: false },
    { categorySlug: "gift", name: "今治タオル プレミアムセット", description: "世界が認めた肌触り。毎日使うものだからこそ良いものを", longDescription: "今治タオルブランド認定。バスタオル2枚、フェイスタオル4枚のセット。オーガニックコットン100%使用。", price: 8800, image: "/images/products/towel.jpg", tags: '["実用的","日用品","人気"]', targetAge: "75-84", targetGender: "both", popularity: 78, isNew: false },
    { categorySlug: "gift", name: "カタログギフト 「やさしい時間」", description: "迷ったらこれ。親が自分で好きなものを選べるカタログ", longDescription: "食品・雑貨・体験から選べるシニア向けカタログギフト。文字が大きく見やすいデザイン。約300点から選択可能。", price: 10000, image: "/images/products/catalog.jpg", tags: '["迷ったらこれ","万能","人気"]', targetAge: "65-74", targetGender: "both", popularity: 90, isNew: false },
    { categorySlug: "gift", name: "有田焼 夫婦湯呑みセット", description: "400年の伝統。毎日のお茶の時間を彩る逸品", longDescription: "佐賀県有田の窯元による手作りの湯呑みセット。桜の絵付けが美しい、夫婦おそろいのペアセットです。", price: 6600, image: "/images/products/yunomi.jpg", tags: '["伝統工芸","ペア","お茶好き"]', targetAge: "65-74", targetGender: "both", popularity: 72, isNew: true },
    { categorySlug: "gift", name: "松坂牛 すき焼き用 500g", description: "最高級A5ランクの松坂牛をご自宅で", longDescription: "三重県産A5ランク松坂牛のロース肉500g。とろけるような霜降りで、ご家庭ですき焼きが楽しめます。", price: 12000, image: "/images/products/matsuzaka.jpg", tags: '["グルメ","特別","冬ギフト"]', targetAge: "65-74", targetGender: "both", popularity: 82, isNew: false },
    { categorySlug: "gift", name: "ガーデニングツールセット", description: "園芸好きのお母さんに。プロ仕様の軽量ツール", longDescription: "アルミ製で軽量なのに丈夫。剪定ばさみ、スコップ、くまで、じょうろ、手袋の5点セット。グリップが太く握りやすい設計。", price: 7800, image: "/images/products/garden.jpg", tags: '["園芸","趣味","実用的"]', targetAge: "65-74", targetGender: "mother", popularity: 68, isNew: true },
    { categorySlug: "gift", name: "デジタルフォトフレーム Wi-Fi対応", description: "離れていても写真を送れる。孫の写真がリアルタイムで届く", longDescription: "10インチ高画質ディスプレイ。スマホから写真を送るだけで、実家のフォトフレームに自動表示。孫の成長を毎日届けられます。", price: 15000, image: "/images/products/photoframe.jpg", tags: '["テクノロジー","孫","人気"]', targetAge: "65-74", targetGender: "both", popularity: 87, isNew: true },

    // --- 旅行・体験（8品） ---
    { categorySlug: "travel", name: "箱根温泉 日帰りプラン", description: "都心から90分。日帰りで楽しめる贅沢温泉", longDescription: "箱根湯本の老舗旅館で日帰り温泉と懐石料理を堪能。送迎バス付きで移動も安心。バリアフリー対応。", price: 12000, image: "/images/products/hakone.jpg", tags: '["温泉","日帰り","人気"]', targetAge: "65-74", targetGender: "both", popularity: 91, isNew: false },
    { categorySlug: "travel", name: "伊豆・修善寺温泉 1泊2日", description: "自然豊かな修善寺で心と体をリフレッシュ", longDescription: "修善寺温泉の名旅館で1泊2日。部屋食対応、貸切風呂あり。膝が悪い方も安心のバリアフリー客室をご用意。", price: 28000, image: "/images/products/shuzenji.jpg", tags: '["温泉","1泊","バリアフリー"]', targetAge: "65-74", targetGender: "both", healthNote: "バリアフリー対応。膝が悪い方も安心の貸切風呂あり", popularity: 89, isNew: false },
    { categorySlug: "travel", name: "京都 日帰りバスツアー", description: "名所を効率よく巡る。ガイド付きで安心", longDescription: "金閣寺→嵐山→清水寺を1日で巡るバスツアー。昼食は京料理。全行程ガイド付き、座席指定で楽々。", price: 8900, image: "/images/products/kyoto.jpg", tags: '["京都","日帰り","バスツアー"]', targetAge: "65-74", targetGender: "both", popularity: 76, isNew: false },
    { categorySlug: "travel", name: "高級レストラン ペアディナー券", description: "ミシュラン星付きレストランで特別な食事体験", longDescription: "東京・銀座のミシュラン一つ星フレンチレストランのペアディナー券。前菜からデザートまでフルコース。記念日にぴったり。", price: 35000, image: "/images/products/dinner.jpg", tags: '["食事","特別","記念日"]', targetAge: "65-74", targetGender: "both", popularity: 74, isNew: false },
    { categorySlug: "travel", name: "陶芸体験 親子ペアプラン", description: "一緒に作る思い出。世界にひとつの器を", longDescription: "プロの陶芸家が丁寧に指導。親子で一緒に湯呑みやお皿を作れます。焼き上がりは約1ヶ月後にお届け。", price: 8500, image: "/images/products/pottery.jpg", tags: '["体験","親子","ものづくり"]', targetAge: "65-74", targetGender: "both", popularity: 65, isNew: true },
    { categorySlug: "travel", name: "屋形船 東京湾クルーズ", description: "東京湾の夜景を眺めながら江戸前料理を堪能", longDescription: "お台場発の屋形船クルーズ。2時間のコースで天ぷらやお刺身を楽しみながら、レインボーブリッジの夜景を満喫。", price: 12000, image: "/images/products/yakatabune.jpg", tags: '["クルーズ","食事","東京"]', targetAge: "65-74", targetGender: "both", popularity: 70, isNew: false },
    { categorySlug: "travel", name: "写真撮影 家族フォトプラン", description: "プロカメラマンによる出張撮影。一生の思い出に", longDescription: "ご自宅や公園など好きな場所でプロが撮影。家族全員の集合写真から自然な表情のスナップまで約100カット。データとアルバム付き。", price: 25000, image: "/images/products/photo.jpg", tags: '["写真","家族","思い出"]', targetAge: "65-74", targetGender: "both", popularity: 83, isNew: false },
    { categorySlug: "travel", name: "フラワーアレンジメント教室 体験", description: "お花好きのお母さんに。プロに教わる華やかな時間", longDescription: "花屋のプロが教えるフラワーアレンジメント体験。約2時間で素敵な作品が完成。作品はそのまま持ち帰れます。", price: 5500, image: "/images/products/flower_class.jpg", tags: '["体験","花","お母さん向け"]', targetAge: "65-74", targetGender: "mother", popularity: 62, isNew: true },

    // --- 住まい・リフォーム（7品） ---
    { categorySlug: "home", name: "玄関手すり設置工事", description: "転倒予防の第一歩。プロが安全に施工", longDescription: "玄関の上がり框に手すりを設置。介護保険の住宅改修費で最大20万円まで補助が受けられます。施工時間約2時間。", price: 45000, image: "/images/products/handrail.jpg", tags: '["バリアフリー","安全","補助金対象"]', targetAge: "75-84", targetGender: "both", healthNote: "介護保険の住宅改修費で最大9割補助", popularity: 80, isNew: false },
    { categorySlug: "home", name: "浴室リフォーム（滑り止め+手すり）", description: "ヒートショック対策と転倒防止を同時に実現", longDescription: "浴室の床を滑りにくい素材に変更し、手すりを設置。暖房乾燥機も追加可能。工期約3日。", price: 350000, image: "/images/products/bathroom.jpg", tags: '["リフォーム","安全","ヒートショック対策"]', targetAge: "75-84", targetGender: "both", healthNote: "ヒートショック対策に。断熱改修も対応可", popularity: 75, isNew: false },
    { categorySlug: "home", name: "トイレ洋式化リフォーム", description: "和式から洋式へ。膝の負担を大幅に軽減", longDescription: "和式トイレを洋式に全面改修。ウォシュレット付き、手すり設置込み。工期約2日。介護保険補助対象。", price: 280000, image: "/images/products/toilet.jpg", tags: '["リフォーム","バリアフリー","補助金対象"]', targetAge: "75-84", targetGender: "both", healthNote: "膝や腰が悪い方に。立ち座りの負担を大幅軽減", popularity: 73, isNew: false },
    { categorySlug: "home", name: "庭木の剪定・お手入れ", description: "放置気味のお庭をプロがすっきりキレイに", longDescription: "庭師が訪問し、庭木の剪定・草刈り・落ち葉清掃を行います。年2回の定期プランもあり。", price: 25000, image: "/images/products/garden_care.jpg", tags: '["庭","お手入れ","定期"]', targetAge: "75-84", targetGender: "both", popularity: 67, isNew: false },
    { categorySlug: "home", name: "家の片付け・整理収納サービス", description: "プロの整理収納アドバイザーが実家を快適に", longDescription: "整理収納アドバイザーが訪問し、ご両親と一緒に片付け。不用品の処分手配もお任せ。1日（6時間）コース。", price: 48000, image: "/images/products/organize.jpg", tags: '["片付け","整理","安全"]', targetAge: "75-84", targetGender: "both", popularity: 64, isNew: true },
    { categorySlug: "home", name: "防犯カメラ設置（玄関+裏口）", description: "ご両親の安全を見守る。スマホで映像確認可能", longDescription: "玄関と裏口にHD防犯カメラを設置。子供のスマホからリアルタイムで確認可能。録画機能付き、工事費込み。", price: 85000, image: "/images/products/security_cam.jpg", tags: '["防犯","安心","テクノロジー"]', targetAge: "75-84", targetGender: "both", popularity: 71, isNew: false },
    { categorySlug: "home", name: "外壁塗装・メンテナンスパック", description: "築30年以上のお家を長持ちさせる外壁ケア", longDescription: "外壁の劣化診断→洗浄→塗装をパックで。10年保証付き。足場代込みの明朗会計。", price: 680000, image: "/images/products/wall.jpg", tags: '["メンテナンス","長持ち","外壁"]', targetAge: "75-84", targetGender: "both", popularity: 58, isNew: false },

    // --- 食事・日常サポート（6品） ---
    { categorySlug: "daily", name: "有機野菜の定期便（月1回）", description: "毎月届く新鮮な有機野菜。料理好きのお母さんに", longDescription: "全国の有機農家から厳選した旬の野菜を毎月お届け。8〜10品目入り。レシピカード付きで料理の幅が広がります。", price: 3980, image: "/images/products/vegetables.jpg", tags: '["定期便","健康","料理好き"]', targetAge: "65-74", targetGender: "mother", popularity: 79, isNew: false },
    { categorySlug: "daily", name: "管理栄養士監修 冷凍弁当 14食", description: "栄養バランス完璧。レンジで3分の簡単食事", longDescription: "管理栄養士が設計した冷凍弁当14食セット。塩分2g以下、カロリー400kcal以下。和食中心で飽きない味わい。", price: 8400, image: "/images/products/bento.jpg", tags: '["食事","健康","簡単"]', targetAge: "75-84", targetGender: "both", healthNote: "塩分控えめ、カロリー計算済み。生活習慣病の方にも", popularity: 84, isNew: false },
    { categorySlug: "daily", name: "家事代行サービス（月2回×3時間）", description: "掃除・洗濯・買い物をプロにお任せ", longDescription: "月2回、3時間ずつプロの家事スタッフが訪問。掃除、洗濯、買い物代行、料理の作り置きなど。", price: 19800, image: "/images/products/housekeeping.jpg", tags: '["家事代行","定期","便利"]', targetAge: "75-84", targetGender: "both", popularity: 77, isNew: false },
    { categorySlug: "daily", name: "買い物代行サービス（月4回）", description: "スーパーへの買い物をスタッフが代行", longDescription: "週1回、近所のスーパーで食料品・日用品の買い物を代行。事前に電話で注文を聞いて購入し、ご自宅にお届け。", price: 12000, image: "/images/products/shopping.jpg", tags: '["買い物","日常","定期"]', targetAge: "85+", targetGender: "both", popularity: 69, isNew: false },
    { categorySlug: "daily", name: "お取り寄せグルメ定期便", description: "毎月届く全国の名産品。届く日が楽しみになる", longDescription: "毎月、全国各地の名産グルメを1品お届け。1月:北海道カニ、2月:博多明太子、3月:京都漬物…と季節の味が楽しめます。", price: 5500, image: "/images/products/gourmet.jpg", tags: '["グルメ","定期便","全国"]', targetAge: "65-74", targetGender: "both", popularity: 81, isNew: true },
    { categorySlug: "daily", name: "庭の草刈り・除草サービス", description: "伸び放題の雑草をプロがキレイに", longDescription: "庭の雑草を根こそぎ除去。除草剤を使わない安全な方法で。1回のサービスで約30坪まで対応。", price: 15000, image: "/images/products/weeding.jpg", tags: '["庭","お手入れ","季節"]', targetAge: "75-84", targetGender: "both", popularity: 63, isNew: false },

    // --- 健康・医療（7品） ---
    { categorySlug: "health", name: "人間ドック ギフトチケット", description: "健康が一番の親孝行。年に一度の安心を贈る", longDescription: "全国200以上の医療機関で使える人間ドックギフトチケット。基本コース（胃カメラ含む）が受けられます。有効期限1年。", price: 38000, image: "/images/products/dock.jpg", tags: '["健康","検診","人気"]', targetAge: "65-74", targetGender: "both", popularity: 86, isNew: false },
    { categorySlug: "health", name: "訪問マッサージ 5回チケット", description: "ご自宅で受けられる本格マッサージ", longDescription: "国家資格を持つマッサージ師がご自宅に訪問。1回60分×5回のチケット。肩こり・腰痛・膝痛に対応。", price: 25000, image: "/images/products/massage.jpg", tags: '["マッサージ","健康","リラックス"]', targetAge: "75-84", targetGender: "both", healthNote: "膝や腰が痛い方に。自宅で受けられるので通院不要", popularity: 73, isNew: false },
    { categorySlug: "health", name: "シニアヨガ 3ヶ月プログラム", description: "無理のない動きで体を整える。週1回のオンラインレッスン", longDescription: "シニア専門のヨガインストラクターによるオンラインレッスン。椅子に座ったままでもOK。週1回×12回のプログラム。", price: 18000, image: "/images/products/yoga.jpg", tags: '["運動","オンライン","健康"]', targetAge: "65-74", targetGender: "both", healthNote: "椅子ヨガ対応。膝や腰に不安がある方も参加可能", popularity: 66, isNew: true },
    { categorySlug: "health", name: "サプリメント定期便（マルチビタミン）", description: "管理栄養士が選んだ、シニアに必要な栄養素", longDescription: "60歳以上に不足しがちなビタミンD、B12、カルシウム、亜鉛を配合。1日2粒で手軽に栄養補給。毎月届く定期便。", price: 3200, image: "/images/products/supplement.jpg", tags: '["サプリ","定期便","栄養"]', targetAge: "65-74", targetGender: "both", popularity: 61, isNew: false },
    { categorySlug: "health", name: "ウォーキングシューズ ギフト", description: "足の専門家が設計。毎日の散歩が楽しくなる靴", longDescription: "シニアの足に合わせた幅広設計。軽量200g、滑りにくいソール。つまずき防止のつま先形状。サイズ交換無料。", price: 12800, image: "/images/products/shoes.jpg", tags: '["靴","散歩","実用的"]', targetAge: "65-74", targetGender: "both", healthNote: "つまずきにくい設計。膝への負担を軽減するクッション付き", popularity: 75, isNew: false },
    { categorySlug: "health", name: "血圧計＋健康管理アプリセット", description: "毎日の血圧測定データをスマホで家族が確認", longDescription: "Bluetooth対応の上腕式血圧計。測定データが自動でアプリに記録され、離れた子供のスマホからも確認可能。", price: 9800, image: "/images/products/bp_monitor.jpg", tags: '["健康管理","テクノロジー","見守り"]', targetAge: "65-74", targetGender: "both", popularity: 78, isNew: true },
    { categorySlug: "health", name: "オーダーメイド枕", description: "首と肩に合わせた完璧な枕。睡眠の質を劇的改善", longDescription: "専門店で首のカーブを測定し、ぴったりの枕をオーダーメイド。素材・高さ・硬さを細かく調整。1年間の無料調整付き。", price: 22000, image: "/images/products/pillow.jpg", tags: '["睡眠","オーダーメイド","健康"]', targetAge: "65-74", targetGender: "both", popularity: 80, isNew: false },

    // --- 見守り・安心（6品） ---
    { categorySlug: "watch", name: "見守りセンサー（リビング設置型）", description: "カメラなしで生活リズムを見守る。プライバシーに配慮", longDescription: "リビングに設置するだけ。人感センサーで活動を検知し、いつもと違う動きがあればお子さんのスマホに通知。カメラ不使用でプライバシー安心。", price: 15000, image: "/images/products/sensor.jpg", tags: '["見守り","プライバシー配慮","人気"]', targetAge: "75-84", targetGender: "both", popularity: 82, isNew: false },
    { categorySlug: "watch", name: "定期訪問＆電話サービス（月4回）", description: "週1回の電話と月1回の訪問で安否確認", longDescription: "週1回の電話（15分）と月1回の訪問（30分）で近況確認。会話内容のサマリーをお子さんにメールで報告。", price: 8000, image: "/images/products/visit.jpg", tags: '["見守り","電話","訪問"]', targetAge: "85+", targetGender: "both", popularity: 70, isNew: false },
    { categorySlug: "watch", name: "GPS付きキーホルダー", description: "お出かけ時の位置情報を家族が確認。迷子防止に", longDescription: "軽量30gのキーホルダー型GPS。充電は月1回でOK。スマホアプリで現在地を確認。SOS ボタン付き。", price: 6800, image: "/images/products/gps.jpg", tags: '["GPS","外出","安心"]', targetAge: "75-84", targetGender: "both", popularity: 68, isNew: false },
    { categorySlug: "watch", name: "服薬管理ロボット", description: "決まった時間にお薬を自動でお知らせ", longDescription: "1週間分の薬をセットすると、決まった時間に音声でお知らせ。飲み忘れは家族のスマホに通知。", price: 25000, image: "/images/products/medicine_robot.jpg", tags: '["服薬","テクノロジー","介護"]', targetAge: "85+", targetGender: "both", healthNote: "お薬の飲み忘れが多い方に。認知症の初期段階の方にも", popularity: 72, isNew: true },
    { categorySlug: "watch", name: "緊急通報ペンダント", description: "ボタンひとつで家族と消防に同時通報", longDescription: "首からかけるペンダント型の緊急通報装置。ボタンを押すと家族のスマホと消防署に同時に通報。防水仕様で入浴時もOK。", price: 12000, image: "/images/products/emergency.jpg", tags: '["緊急","安心","防水"]', targetAge: "85+", targetGender: "both", popularity: 76, isNew: false },
    { categorySlug: "watch", name: "スマートスピーカー 見守りセット", description: "話しかけるだけで家族に連絡。テレビ電話も簡単", longDescription: "画面付きスマートスピーカーの初期設定済みモデル。「もしもし」と話しかけるだけで子供に電話。写真の受信・表示も自動。", price: 18000, image: "/images/products/smart_speaker.jpg", tags: '["テクノロジー","コミュニケーション","人気"]', targetAge: "75-84", targetGender: "both", popularity: 81, isNew: true },

    // --- 終活・将来の備え（6品） ---
    { categorySlug: "endoflife", name: "エンディングノート作成サポート", description: "専門スタッフと一緒に。想いをカタチに残す", longDescription: "終活カウンセラーがご自宅を訪問し、エンディングノートの記入をサポート。2回の訪問（各2時間）で完成まで導きます。", price: 35000, image: "/images/products/ending_note.jpg", tags: '["終活","ノート","サポート"]', targetAge: "75-84", targetGender: "both", popularity: 65, isNew: false },
    { categorySlug: "endoflife", name: "遺影写真 プロ撮影プラン", description: "笑顔の遺影を生前に。自然な表情をプロが撮影", longDescription: "プロカメラマンがスタジオまたは出張で撮影。ヘアメイク付き。10カット以上から選べます。額装込み。", price: 28000, image: "/images/products/portrait.jpg", tags: '["遺影","写真","プロ"]', targetAge: "75-84", targetGender: "both", popularity: 60, isNew: false },
    { categorySlug: "endoflife", name: "相続相談 初回パック（税理士+弁護士）", description: "相続の不安を解消。専門家がわかりやすく解説", longDescription: "税理士と弁護士がペアで相続の基本を説明。ご家族の資産状況に合わせた相続プランを提案。初回90分。", price: 15000, image: "/images/products/inheritance.jpg", tags: '["相続","専門家","安心"]', targetAge: "75-84", targetGender: "both", popularity: 62, isNew: false },
    { categorySlug: "endoflife", name: "生前整理サービス（1部屋）", description: "プロの片付けスタッフが一緒に整理", longDescription: "整理収納のプロが訪問し、1部屋の生前整理をサポート。不用品の仕分け、処分手配まで。思い出の品の整理も丁寧に。", price: 55000, image: "/images/products/seizen.jpg", tags: '["片付け","生前整理","プロ"]', targetAge: "75-84", targetGender: "both", popularity: 57, isNew: false },
    { categorySlug: "endoflife", name: "お墓の清掃代行サービス", description: "遠方で行けないお墓をプロがキレイに", longDescription: "お墓の清掃、雑草除去、お花のお供えを代行。清掃後の写真をメールで報告。お盆・お彼岸前の利用が人気。", price: 12000, image: "/images/products/grave.jpg", tags: '["お墓","代行","季節"]', targetAge: "75-84", targetGender: "both", popularity: 66, isNew: false },
    { categorySlug: "endoflife", name: "家族史ムービー制作", description: "ご両親の人生を映像作品に。最高の贈り物", longDescription: "プロの映像作家がご両親にインタビューし、写真・動画を組み合わせて15分のドキュメンタリーを制作。家族の宝物になります。", price: 150000, image: "/images/products/movie.jpg", tags: '["映像","思い出","特別"]', targetAge: "75-84", targetGender: "both", popularity: 59, isNew: true },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        categoryId: catMap[p.categorySlug],
        name: p.name,
        description: p.description,
        longDescription: p.longDescription || null,
        price: p.price,
        image: p.image,
        tags: p.tags,
        targetAge: p.targetAge,
        targetGender: p.targetGender,
        healthNote: p.healthNote || null,
        popularity: p.popularity,
        isNew: p.isNew,
      },
    });
  }

  // ========================================
  // レビュー（一部商品に）
  // ========================================
  const allProducts = await prisma.product.findMany();
  const reviewData = [
    { productName: "愛媛みかん詰め合わせ 3kg", author: "東京在住 42歳 女性", age: 42, rating: 5, comment: "母の誕生日に贈りました。「甘くて美味しい！」と電話で大喜びでした。" },
    { productName: "愛媛みかん詰め合わせ 3kg", author: "大阪在住 38歳 男性", age: 38, rating: 4, comment: "実家の両親に送りました。段ボールいっぱいのみかんに驚いていました。" },
    { productName: "プリザーブドフラワー 和モダン", author: "横浜在住 45歳 女性", age: 45, rating: 5, comment: "母の日に贈りました。枯れないのが嬉しいと、テレビの横に飾ってくれています。" },
    { productName: "伊豆・修善寺温泉 1泊2日", author: "東京在住 48歳 女性", age: 48, rating: 5, comment: "75歳の両親に贈りました。部屋食で気兼ねなく食事ができて、母がとても喜んでいました。" },
    { productName: "箱根温泉 日帰りプラン", author: "埼玉在住 40歳 男性", age: 40, rating: 5, comment: "父の日に贈りました。「いい湯だった」と珍しく上機嫌でした。" },
    { productName: "管理栄養士監修 冷凍弁当 14食", author: "北海道在住 52歳 女性", age: 52, rating: 4, comment: "一人暮らしの母に。「味が優しくて毎日のお昼が楽になった」と喜んでいます。" },
    { productName: "デジタルフォトフレーム Wi-Fi対応", author: "福岡在住 35歳 男性", age: 35, rating: 5, comment: "孫の写真を毎日送っています。両親が「今日はどんな写真かな」と毎日楽しみにしているそうです。" },
    { productName: "見守りセンサー（リビング設置型）", author: "名古屋在住 50歳 女性", age: 50, rating: 4, comment: "カメラじゃないので父も抵抗なく受け入れてくれました。毎日の動きが見えて安心です。" },
    { productName: "人間ドック ギフトチケット", author: "千葉在住 43歳 男性", age: 43, rating: 5, comment: "なかなか検診に行かない父に贈りました。「チケットもらったから行くか」と腰が上がりました。" },
    { productName: "写真撮影 家族フォトプラン", author: "東京在住 39歳 女性", age: 39, rating: 5, comment: "両親の金婚式で家族写真を撮りました。母は泣きながら「宝物」と言ってくれました。" },
    { productName: "カタログギフト 「やさしい時間」", author: "静岡在住 46歳 男性", age: 46, rating: 4, comment: "何を贈ればいいかわからず。でも母は「選ぶのが楽しい」と喜んでくれました。" },
    { categorySlug: "home", productName: "玄関手すり設置工事", author: "神奈川在住 55歳 女性", age: 55, rating: 5, comment: "父が玄関で転んだのがきっかけ。補助金で半額になり、今は安心して出入りしています。" },
  ];

  for (const r of reviewData) {
    const product = allProducts.find((p) => p.name === r.productName);
    if (product) {
      await prisma.review.create({
        data: {
          productId: product.id,
          author: r.author,
          age: r.age,
          rating: r.rating,
          comment: r.comment,
        },
      });
    }
  }

  // ========================================
  // デモユーザー
  // ========================================
  const user = await prisma.user.create({
    data: {
      email: "demo@oyatsu.jp",
      name: "田中太郎",
    },
  });

  // 親プロフィール
  await prisma.parent.create({
    data: {
      userId: user.id,
      relation: "mother",
      name: "田中花子",
      age: 72,
      livingAlone: false,
      healthStatus: "healthy",
      hobbies: '["園芸","料理","散歩"]',
      region: "静岡県",
      birthday: "03-15",
    },
  });

  await prisma.parent.create({
    data: {
      userId: user.id,
      relation: "father",
      name: "田中一郎",
      age: 75,
      livingAlone: false,
      healthStatus: "somewhat",
      hobbies: '["釣り","囲碁","テレビ"]',
      region: "静岡県",
      birthday: "10-20",
      notes: "膝が悪い",
    },
  });

  // カレンダーイベント
  const events = [
    { title: "お母さんの誕生日", date: "03-15", type: "birthday", parentRelation: "mother", reminderDays: 14 },
    { title: "お父さんの誕生日", date: "10-20", type: "birthday", parentRelation: "father", reminderDays: 14 },
    { title: "母の日", date: "05-11", type: "mothers_day", parentRelation: "mother", reminderDays: 14 },
    { title: "父の日", date: "06-15", type: "fathers_day", parentRelation: "father", reminderDays: 14 },
    { title: "敬老の日", date: "09-15", type: "respect_for_aged", parentRelation: "both", reminderDays: 14 },
    { title: "お中元", date: "07-01", type: "chugen", parentRelation: "both", reminderDays: 21 },
    { title: "お歳暮", date: "12-01", type: "seibo", parentRelation: "both", reminderDays: 21 },
    { title: "お正月", date: "01-01", type: "new_year", parentRelation: "both", reminderDays: 14 },
  ];

  for (const e of events) {
    await prisma.calendarEvent.create({
      data: {
        userId: user.id,
        title: e.title,
        date: e.date,
        type: e.type,
        parentRelation: e.parentRelation,
        reminderDays: e.reminderDays,
      },
    });
  }

  console.log("✅ Seed completed!");
  console.log(`  - ${categories.length} categories`);
  console.log(`  - ${products.length} products`);
  console.log(`  - ${reviewData.length} reviews`);
  console.log(`  - 1 demo user with 2 parents`);
  console.log(`  - ${events.length} calendar events`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
