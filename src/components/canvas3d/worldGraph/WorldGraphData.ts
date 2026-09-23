// src/components/canvas3d/worldGraph/WorldGraphData.ts
// NIHOMI WORLD™ — COMPREHENSIVE WORLD GRAPH DATA TREE
// Real Japan Scale: Regions, Cities, Districts, Nodes, POIs, and Inter-District Transportation Routes

import {
  WorldRegion,
  WorldCity,
  WorldDistrict,
  WorldGraphNode
} from './WorldGraphTypes';

export const JAPAN_REGIONS: Record<string, WorldRegion> = {
  kanto: {
    id: 'kanto',
    nameJa: '関東地方',
    nameRomaji: 'Kantou Chihou',
    nameEn: 'Kanto Region (Greater Tokyo)',
    nameBn: 'কান্তো অঞ্চল (বৃহত্তর টোকিও)',
    descriptionJa: '日本の政治・経済・文化の中心地。東京、神奈川、千葉、埼玉などを含む大都市圏。',
    descriptionEn: 'The political, financial, and cultural heart of Japan, home to Tokyo, Chiba, Kanagawa, and Narita.'
  },
  kansai: {
    id: 'kansai',
    nameJa: '関西地方',
    nameRomaji: 'Kansai Chihou',
    nameEn: 'Kansai Region (Kyoto & Osaka)',
    nameBn: 'কানসাই অঞ্চল (কিয়োটো এবং ওসাকা)',
    descriptionJa: '千年の古都京都や商業と食の都大阪を擁する、日本の伝統と活気の中心地。',
    descriptionEn: 'Historic heartland of Japan featuring the ancient capital of Kyoto and merchant metropolis Osaka.'
  }
};

export const JAPAN_CITIES: Record<string, WorldCity> = {
  narita: {
    id: 'narita',
    regionId: 'kanto',
    nameJa: '成田市',
    nameRomaji: 'Narita-shi',
    nameEn: 'Narita City (Chiba)',
    nameBn: 'নারিতা শহর',
    climateZone: 'Humid Subtropical',
    prefectureJa: '千葉県'
  },
  tokyo: {
    id: 'tokyo',
    regionId: 'kanto',
    nameJa: '東京都',
    nameRomaji: 'Toukyou-to',
    nameEn: 'Tokyo Metropolis',
    nameBn: 'টোকিও মহানগর',
    climateZone: 'Humid Subtropical',
    prefectureJa: '東京都'
  },
  kyoto: {
    id: 'kyoto',
    regionId: 'kansai',
    nameJa: '京都市',
    nameRomaji: 'Kyouto-shi',
    nameEn: 'Kyoto City',
    nameBn: 'কিয়োটো শহর',
    climateZone: 'Inland Basin',
    prefectureJa: '京都府'
  },
  osaka: {
    id: 'osaka',
    regionId: 'kansai',
    nameJa: '大阪市',
    nameRomaji: 'Oosaka-shi',
    nameEn: 'Osaka City',
    nameBn: 'ওসাকা শহর',
    climateZone: 'Coastal Urban',
    prefectureJa: '大阪府'
  }
};

export const JAPAN_DISTRICTS: Record<string, WorldDistrict> = {
  narita_airport: {
    id: 'narita_airport',
    cityId: 'narita',
    nameJa: '成田国際空港',
    nameRomaji: 'Narita Kokusai Kuukou',
    nameEn: 'Narita International Airport (NRT)',
    nameBn: 'নারিতা আন্তর্জাতিক বিমানবন্দর',
    centerCoordinates: {
      latitude: 35.7720,
      longitude: 140.3929,
      altitude: 43.0
    },
    urbanDensity: 'high',
    atmosphereSummary: 'Primary gateway to Japan. International arrivals, immigration inspection, customs, foreign exchange, and railway access.'
  },
  shibuya: {
    id: 'shibuya',
    cityId: 'tokyo',
    nameJa: '渋谷区',
    nameRomaji: 'Shibuya-ku',
    nameEn: 'Shibuya District',
    nameBn: 'শিবুয়া জেলা',
    centerCoordinates: {
      latitude: 35.6595,
      longitude: 139.7004,
      altitude: 16.0
    },
    urbanDensity: 'high',
    atmosphereSummary: 'Global youth and fashion capital featuring the world-famous scramble crossing, JR Shibuya Station, and 24/7 retail life.'
  },
  shinjuku: {
    id: 'shinjuku',
    cityId: 'tokyo',
    nameJa: '新宿区',
    nameRomaji: 'Shinjuku-ku',
    nameEn: 'Shinjuku District',
    nameBn: 'শিনজুকু জেলা',
    centerCoordinates: {
      latitude: 35.6909,
      longitude: 139.7003,
      altitude: 38.0
    },
    urbanDensity: 'high',
    atmosphereSummary: 'Busiest railway station in the world, Tokyo Metropolitan Government skyscraper complex, and neon-lit commercial districts.'
  },
  kyoto_gion: {
    id: 'kyoto_gion',
    cityId: 'kyoto',
    nameJa: '祇園・東山',
    nameRomaji: 'Gion / Higashiyama',
    nameEn: 'Gion Historic District',
    nameBn: 'গিয়ন ঐতিহাসিক জেলা',
    centerCoordinates: {
      latitude: 35.0037,
      longitude: 135.7772,
      altitude: 50.0
    },
    urbanDensity: 'historic',
    atmosphereSummary: 'Traditional geisha district preserved with historic wooden machiya architecture, tea houses, and lantern-lit stone alleys.'
  },
  osaka_dotonbori: {
    id: 'osaka_dotonbori',
    cityId: 'osaka',
    nameJa: '道頓堀・難波',
    nameRomaji: 'Doutonbori / Namba',
    nameEn: 'Dotonbori & Namba',
    nameBn: 'দোতনবোরি ও নাম্বা',
    centerCoordinates: {
      latitude: 34.6687,
      longitude: 135.5013,
      altitude: 5.0
    },
    urbanDensity: 'high',
    atmosphereSummary: 'The kitchen of Japan with canal vistas, illuminated Glico signs, street food stalls (Takoyaki), and lively Kansai dialect.'
  }
};

export const WORLD_NODES: Record<string, WorldGraphNode> = {
  // 1. NARITA AIRPORT TERMINAL 1 (ARRIVAL & IMMIGRATION GATEWAY)
  node_narita_airport_t1: {
    id: 'node_narita_airport_t1',
    districtId: 'narita_airport',
    nameJa: '成田国際空港 第1ターミナル 到着ロビー',
    nameRomaji: 'Narita Kokusai Kuukou Dai-1 Taaminaru Touchaku Robii',
    nameEn: 'Narita Airport Terminal 1 — Arrival Concourse & Immigration',
    nameBn: 'নারিতা বিমানবন্দর টার্মিনাল ১ — আগমন এবং অভিবাসন',
    nodeType: 'airport_terminal',
    geoCoordinates: {
      latitude: 35.7653,
      longitude: 140.3855,
      altitude: 41.0
    },
    hasGoogle3DTilesSupport: true,
    pois: [
      {
        id: 'poi_narita_immigration',
        nameJa: '入国審査・税関検査',
        nameRomaji: 'Nyuukoku Shinsa / Zeikan Kensa',
        nameEn: 'Immigration Inspection & Customs',
        nameBn: 'অভিবাসন পরিদর্শন ও শুল্ক',
        category: 'government',
        jlptLevel: 'N5',
        npcId: 'npc_officer_takahashi',
        localCoordinates: [0, 0, -8],
        readinessObjective: 'Master authentic border control answers: Entry purpose, duration, and accommodation.',
        promptText: 'Talk to Immigration Officer Takahashi (入国審査を受ける)'
      },
      {
        id: 'poi_narita_ic_counter',
        nameJa: 'JR東日本 トラベルサービスセンター (Suica / N\'EX)',
        nameRomaji: 'JR Higashi-Nihon Toraberu Saabisu Sentaa',
        nameEn: 'JR East Travel Service Center (Suica & Narita Express)',
        nameBn: 'জেআর ট্রাভেল সার্ভিস সেন্টার (সুইকা ও নারিতা এক্সপ্রেস)',
        category: 'transport',
        jlptLevel: 'N5',
        npcId: 'npc_clerk_narita',
        localCoordinates: [12, 0, 4],
        readinessObjective: 'Acquire Welcome Suica card and reserve Narita Express seat to Tokyo/Shibuya.',
        promptText: 'Open Ticket & IC Card Counter (切符・ICカード購入)'
      },
      {
        id: 'poi_narita_forex',
        nameJa: '外貨両替所 (Travelex Currency Exchange)',
        nameRomaji: 'Gaika Ryougaesho',
        nameEn: 'Currency Exchange Counter',
        nameBn: 'মুদ্রা বিনিময় কেন্দ্র',
        category: 'finance',
        jlptLevel: 'N5',
        localCoordinates: [-10, 0, 5],
        readinessObjective: 'Practice currency conversion phrases (両替をお願いします).',
        promptText: 'Approach Exchange Counter (両替をする)'
      }
    ],
    transitRoutes: [
      {
        id: 'route_nex_to_shibuya',
        targetNodeId: 'node_train_interior_nex',
        transitMode: 'train_express',
        routeLineNameJa: 'JR 成田エクスプレス (N\'EX)',
        routeLineNameRomaji: 'JR Narita Ekusupuresu',
        routeLineNameEn: 'JR Narita Express (Direct to Shibuya)',
        routeLineNameBn: 'জেআর নারিতা এক্সপ্রেস (শিবুয়া সরাসরি)',
        departureStationNameJa: '成田空港駅',
        arrivalStationNameJa: '渋谷駅',
        fareYen: 3250,
        travelTimeMinutes: 76,
        requiresICCardOrTicket: true,
        description: 'Direct high-speed airport express connecting Narita Airport to Shibuya Station.'
      }
    ]
  },

  // 2. NARITA EXPRESS IN-TRANSIT TRAIN INTERIOR
  node_train_interior_nex: {
    id: 'node_train_interior_nex',
    districtId: 'narita_airport',
    nameJa: 'JR 成田エクスプレス 車内 (移動中)',
    nameRomaji: 'JR Narita Ekusupuresu Shanai',
    nameEn: 'Inside Narita Express Train (In Transit to Tokyo/Shibuya)',
    nameBn: 'নারিতা এক্সপ্রেস ট্রেনের ভেতরে (শিবুয়ার পথে)',
    nodeType: 'train_interior',
    geoCoordinates: {
      latitude: 35.7100,
      longitude: 140.1000,
      altitude: 20.0
    },
    hasGoogle3DTilesSupport: false,
    pois: [
      {
        id: 'poi_train_conductor',
        nameJa: '車掌のアナウンス・乗車マナー',
        nameRomaji: 'Shashou no Anaunsu',
        nameEn: 'Conductor Announcement & Train Etiquette',
        nameBn: 'ট্রেনের কন্ডাক্টর ঘোষণা এবং আদব-কায়দা',
        category: 'transport',
        jlptLevel: 'N4',
        npcId: 'npc_conductor_kato',
        localCoordinates: [0, 0, -3],
        readinessObjective: 'Listen and decipher Japanese train broadcast announcements and priority seating etiquette.',
        promptText: 'Listen to In-Train Announcement (車内アナウンスを聞く)'
      }
    ],
    transitRoutes: [
      {
        id: 'route_nex_arrive_shibuya',
        targetNodeId: 'node_shibuya_scramble',
        transitMode: 'train_express',
        routeLineNameJa: '渋谷駅到着',
        routeLineNameRomaji: 'Shibuya-eki Touchaku',
        routeLineNameEn: 'Disembark at JR Shibuya Station Platform',
        routeLineNameBn: 'শিবুয়া স্টেশনে নামুন',
        departureStationNameJa: '成田空港駅',
        arrivalStationNameJa: '渋谷駅',
        fareYen: 0,
        travelTimeMinutes: 2,
        requiresICCardOrTicket: false,
        description: 'Arrive at JR Shibuya Station platform and exit through ticket gates to the Scramble Crossing.'
      }
    ]
  },

  // 3. SHIBUYA SCRAMBLE CROSSING (FLAGSHIP OUTDOOR REALITY WORLD)
  node_shibuya_scramble: {
    id: 'node_shibuya_scramble',
    districtId: 'shibuya',
    nameJa: '渋谷スクランブル交差点・ハチ公前広場',
    nameRomaji: 'Shibuya Sukuranburu Kousaten / Hachikou-mae Hiroba',
    nameEn: 'Shibuya Scramble Crossing & Hachiko Square',
    nameBn: 'শিবুয়া স্ক্র্যাম্বল ক্রসিং এবং হাচিকো চত্বর',
    nodeType: 'district_outdoor',
    geoCoordinates: {
      latitude: 35.6595,
      longitude: 139.7004,
      altitude: 16.0
    },
    hasGoogle3DTilesSupport: true,
    backgroundTextureFallback: '/assets/shibuya-crossing.jpg',
    pois: [
      {
        id: 'poi_shibuya_station',
        nameJa: 'JR 渋谷駅 (ハチ公改札口)',
        nameRomaji: 'JR Shibuya-eki (Hachikou Kaisatsuguchi)',
        nameEn: 'JR Shibuya Station (Hachiko Ticket Gate)',
        nameBn: 'জেআর শিবুয়া স্টেশন (হাচিকো গেট)',
        category: 'transport',
        jlptLevel: 'N5',
        npcId: 'npc_station_master_sato',
        localCoordinates: [18, 0, -12],
        readinessObjective: 'Use Ticket Vending Machine, recharge Suica card, and navigate Yamanote Line platforms.',
        promptText: 'Enter JR Shibuya Station (駅に入る・切符購入)',
        interiorNodeId: 'node_shibuya_station_platform'
      },
      {
        id: 'poi_shibuya_conbini',
        nameJa: 'セブン-イレブン 渋谷道玄坂店',
        nameRomaji: 'Sebun-Irebun Shibuya Dougenzaka-ten',
        nameEn: '7-Eleven Convenience Store (Dogenzaka)',
        nameBn: 'সেভেন-ইলেভেন কনভেনিয়েন্স স্টোর (দোগেনজাকা)',
        category: 'retail',
        jlptLevel: 'N5',
        npcId: 'npc_tanaka_manager',
        localCoordinates: [-22, 0, -8],
        readinessObjective: 'Master cashier dialogues (bags, heated bento, point cards, receipts) & Part-time job Keigo.',
        promptText: 'Talk to Store Manager Tanaka (店長田中と会話する)'
      },
      {
        id: 'poi_shibuya_kuyakusho',
        nameJa: '渋谷区役所 (総合案内窓口)',
        nameRomaji: 'Shibuya Kuyakusho (Sougou Annai)',
        nameEn: 'Shibuya City Hall / Ward Office (Resident Registration)',
        nameBn: 'শিবুয়া সিটি হল (বাসিন্দাদের নিবন্ধন)',
        category: 'government',
        jlptLevel: 'N4',
        npcId: 'npc_clerk_suzuki',
        localCoordinates: [-18, 0, 24],
        readinessObjective: 'Submit Resident Registration (住民票 Juminhyo) and My Number application upon moving in.',
        promptText: 'Inquire at City Hall Counter (区役所で住民票手続き)'
      },
      {
        id: 'poi_shibuya_yucho_bank',
        nameJa: 'ゆうちょ銀行 渋谷店 (口座開設窓口)',
        nameRomaji: 'Yuucho Ginkou Shibuya-ten',
        nameEn: 'Japan Post Bank (Yucho Ginko — Account Opening)',
        nameBn: 'ইউচো ব্যাংক (অ্যাকাউন্ট খোলার কাউন্টার)',
        category: 'finance',
        jlptLevel: 'N4',
        npcId: 'npc_bank_yamada',
        localCoordinates: [24, 0, 16],
        readinessObjective: 'Open a Japanese bank account with Residence Card (在留カード) & Personal Seal (印鑑).',
        promptText: 'Open Bank Account (銀行口座を開設する)'
      },
      {
        id: 'poi_shibuya_ichiran',
        nameJa: '一蘭 渋谷店 (天然とんこつラーメン)',
        nameRomaji: 'Ichiran Shibuya-ten',
        nameEn: 'Ichiran Ramen Shibuya',
        nameBn: 'ইচিরান রামেন শিবুয়া',
        category: 'dining',
        jlptLevel: 'N5',
        localCoordinates: [8, 0, 22],
        readinessObjective: 'Order via food ticket machine, customize noodle firmness, and request Kaedama (extra noodles).',
        promptText: 'Order Ramen at Ichiran (ラーメンを注文する)'
      },
      {
        id: 'poi_shibuya_torikizoku',
        nameJa: '鳥貴族 渋谷センター街店',
        nameRomaji: 'Torikizoku Shibuya Sentaa-gai-ten',
        nameEn: 'Izakaya Torikizoku (Center Gai)',
        nameBn: 'ইজাকায়া তোরিকিজোকু (সেন্টার গাই)',
        category: 'dining',
        jlptLevel: 'N4',
        localCoordinates: [-10, 0, -26],
        readinessObjective: 'Practice after-work social dining, drink ordering, toasts (乾杯), and splitting the bill (割り勘).',
        promptText: 'Enter Izakaya (居酒屋に入る)'
      }
    ],
    transitRoutes: [
      {
        id: 'route_yamanote_to_shinjuku',
        targetNodeId: 'node_shinjuku_south',
        transitMode: 'train_local',
        routeLineNameJa: 'JR 山手線 (外回り・新宿・池袋方面)',
        routeLineNameRomaji: 'JR Yamanote-sen',
        routeLineNameEn: 'JR Yamanote Line (Outer Loop to Shinjuku)',
        routeLineNameBn: 'জেআর ইয়ামানোট লাইন (শিনজুকুর দিকে)',
        departureStationNameJa: '渋谷駅',
        arrivalStationNameJa: '新宿駅',
        fareYen: 170,
        travelTimeMinutes: 7,
        requiresICCardOrTicket: true,
        description: 'Take the iconic green Yamanote loop train north to Shinjuku Station.'
      },
      {
        id: 'route_shibuya_taxi',
        targetNodeId: 'node_shinjuku_south',
        transitMode: 'taxi',
        routeLineNameJa: '東京タクシー (都道305号経由)',
        routeLineNameRomaji: 'Toukyou Takushii',
        routeLineNameEn: 'Tokyo Green Cab Taxi to Shinjuku',
        routeLineNameBn: 'টোকিও গ্রিন ক্যাব ট্যাক্সি',
        departureStationNameJa: '渋谷スクランブルタクシー乗り場',
        arrivalStationNameJa: '新宿駅南口',
        fareYen: 1800,
        travelTimeMinutes: 12,
        requiresICCardOrTicket: false,
        description: 'Hail a classic Toyota Crown Comfort green cab with automated door and polite driver communication.'
      },
      {
        id: 'route_return_to_narita',
        targetNodeId: 'node_narita_airport_t1',
        transitMode: 'train_express',
        routeLineNameJa: 'JR 成田エクスプレス (成田空港行)',
        routeLineNameRomaji: 'JR Narita Ekusupuresu',
        routeLineNameEn: 'JR Narita Express (To Narita Airport)',
        routeLineNameBn: 'জেআর নারিতা এক্সপ্রেস (নারিতা বিমানবন্দরের দিকে)',
        departureStationNameJa: '渋谷駅',
        arrivalStationNameJa: '成田空港駅',
        fareYen: 3250,
        travelTimeMinutes: 76,
        requiresICCardOrTicket: true,
        description: 'Board the Narita Express heading back to Narita International Airport.'
      }
    ]
  },

  // 4. SHIBUYA STATION PLATFORM & TICKET GATES
  node_shibuya_station_platform: {
    id: 'node_shibuya_station_platform',
    districtId: 'shibuya',
    nameJa: 'JR 渋谷駅 山手線 2番線ホーム (外回り)',
    nameRomaji: 'JR Shibuya-eki Yamanote-sen 2-bansen Houmu',
    nameEn: 'JR Shibuya Station — Yamanote Line Platform 2',
    nameBn: 'জেআর শিবুয়া স্টেশন — প্ল্যাটফর্ম ২',
    nodeType: 'station_platform',
    geoCoordinates: {
      latitude: 35.6580,
      longitude: 139.7016,
      altitude: 14.0
    },
    hasGoogle3DTilesSupport: false,
    pois: [
      {
        id: 'poi_ticket_machine',
        nameJa: '多機能券売機 (Suica チャージ・切符購入)',
        nameRomaji: 'Takinou Kenbaiki',
        nameEn: 'Multi-Function Ticket Vending Machine',
        nameBn: 'মাল্টি-ফাংশন টিকিট ভেন্ডিং মেশিন',
        category: 'transport',
        jlptLevel: 'N5',
        localCoordinates: [-4, 0, 2],
        readinessObjective: 'Interact with Japanese touchscreen to check fares, charge IC card (1000¥/2000¥/5000¥), and select English/Japanese.',
        promptText: 'Operate Ticket Machine (券売機を使う)'
      },
      {
        id: 'poi_ticket_gates',
        nameJa: '自動改札機 (ICカードタッチ)',
        nameRomaji: 'Jidou Kaisatsuki',
        nameEn: 'Automatic Ticket Gate (IC Card Tap)',
        nameBn: 'স্বয়ংক্রিয় টিকিট গেট (আইসি কার্ড স্পর্শ)',
        category: 'transport',
        jlptLevel: 'N5',
        localCoordinates: [0, 0, 5],
        readinessObjective: 'Practice tapping Suica/Pasmo with audio chime (ピッ！) and viewing LED balance.',
        promptText: 'Tap IC Card at Gate (改札を通る)'
      },
      {
        id: 'poi_station_kiosk',
        nameJa: '駅ナカ キヨスク (NewDays)',
        nameRomaji: 'NewDays Ekinaka Kiosuku',
        nameEn: 'NewDays Station Concourse Kiosk',
        nameBn: 'নিউডেস স্টেশন কিয়স্ক',
        category: 'retail',
        jlptLevel: 'N5',
        localCoordinates: [6, 0, -2],
        readinessObjective: 'Fast train snack purchase (Onigiri & green tea) with IC card payment.',
        promptText: 'Buy Snack at Kiosk (キヨスクで買い物)'
      }
    ],
    transitRoutes: [
      {
        id: 'route_exit_to_scramble',
        targetNodeId: 'node_shibuya_scramble',
        transitMode: 'walk',
        routeLineNameJa: 'ハチ公口出口',
        routeLineNameRomaji: 'Hachikou-guchi Deguchi',
        routeLineNameEn: 'Walk Out to Hachiko Exit & Scramble',
        routeLineNameBn: 'হাচিকো এক্সিটের দিকে হাঁটুন',
        departureStationNameJa: '渋谷駅改札',
        arrivalStationNameJa: '渋谷スクランブル交差点',
        fareYen: 0,
        travelTimeMinutes: 1,
        requiresICCardOrTicket: false,
        description: 'Exit through the ticket barriers into the lively Shibuya Scramble Crossing.'
      },
      {
        id: 'route_platform_board_yamanote',
        targetNodeId: 'node_shinjuku_south',
        transitMode: 'train_local',
        routeLineNameJa: '山手線 新宿行',
        routeLineNameRomaji: 'Yamanote-sen Shinjuku-yuki',
        routeLineNameEn: 'Board Yamanote Train to Shinjuku',
        routeLineNameBn: 'শিনজুকুর ট্রেনের ভেতর প্রবেশ করুন',
        departureStationNameJa: '渋谷駅2番線',
        arrivalStationNameJa: '新宿駅',
        fareYen: 170,
        travelTimeMinutes: 7,
        requiresICCardOrTicket: true,
        description: 'Step onto the Yamanote Line train as safety barrier doors close.'
      }
    ]
  },

  // 5. SHINJUKU DISTRICT (TOKYO SKYLINE & GOVERNMENT HUBS)
  node_shinjuku_south: {
    id: 'node_shinjuku_south',
    districtId: 'shinjuku',
    nameJa: '新宿駅南口・東京都庁前',
    nameRomaji: 'Shinjuku-eki Minamiguchi / Toukyou Tochou-mae',
    nameEn: 'Shinjuku Station South & Tokyo Metropolitan Government',
    nameBn: 'শিনজুকু স্টেশন দক্ষিণ এবং টোকিও মেট্রোপলিটন সরকার ভবন',
    nodeType: 'district_outdoor',
    geoCoordinates: {
      latitude: 35.6896,
      longitude: 139.7006,
      altitude: 38.0
    },
    hasGoogle3DTilesSupport: true,
    pois: [
      {
        id: 'poi_shinjuku_station_master',
        nameJa: 'JR 新宿駅 案内窓口 (みどりの窓口)',
        nameRomaji: 'Midori no Madoguchi',
        nameEn: 'JR Shinjuku Ticket Office (Midori no Madoguchi)',
        nameBn: 'জেআর শিনজুকু টিকিট অফিস',
        category: 'transport',
        jlptLevel: 'N4',
        npcId: 'npc_midori_officer',
        localCoordinates: [10, 0, -8],
        readinessObjective: 'Purchase Shinkansen bullet train tickets and commuter passes (定期券 Teikiken).',
        promptText: 'Talk to Station Agent at Midori no Madoguchi (みどりの窓口)'
      },
      {
        id: 'poi_shinjuku_tochou',
        nameJa: '東京都庁 展望室 (45階 展望デッキ)',
        nameRomaji: 'Toukyou Tochou Tenboushitsu',
        nameEn: 'Tokyo Metropolitan Government Building Observatory',
        nameBn: 'টোকিও মেট্রোপলিটন গভর্নমেন্ট ভবন মানমন্দির',
        category: 'government',
        jlptLevel: 'N3',
        localCoordinates: [-20, 0, 15],
        readinessObjective: 'Understand Tokyo governance and ask security guards for elevator directions in Keigo.',
        promptText: 'Visit Tokyo Observatory (都庁展望室に行く)'
      }
    ],
    transitRoutes: [
      {
        id: 'route_yamanote_back_to_shibuya',
        targetNodeId: 'node_shibuya_scramble',
        transitMode: 'train_local',
        routeLineNameJa: 'JR 山手線 (内回り・渋谷・品川方面)',
        routeLineNameRomaji: 'JR Yamanote-sen',
        routeLineNameEn: 'JR Yamanote Line (Inner Loop to Shibuya)',
        routeLineNameBn: 'জেআর ইয়ামানোট লাইন (শিবুয়ার দিকে)',
        departureStationNameJa: '新宿駅',
        arrivalStationNameJa: '渋谷駅',
        fareYen: 170,
        travelTimeMinutes: 7,
        requiresICCardOrTicket: true,
        description: 'Take the Yamanote Line south back to Shibuya Crossing.'
      }
    ]
  }
};
