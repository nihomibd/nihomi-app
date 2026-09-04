import {
  AdaptiveDrillRecommendation,
  AdaptiveRecommendedPair,
  AdaptiveWeaknessType,
  TokyoPitchDrill,
  DynamicDrillGenerationInput,
  TokyoPitchAccentAssessment
} from '../types.js';
import { db } from '../db.js';
import { DrillSeedGeneratorService } from './drillSeedGeneratorService.js';

interface RemediationPairBlueprint {
  contrastGroup: string;
  targetRemediation: string;
  remediationRationaleBn: string;
  remediationRationaleEn: string;
  items: DynamicDrillGenerationInput[];
}

// Curated targeted remediation blueprints for every specific acoustic failure mode
const REMEDIATION_BLUEPRINTS: Record<AdaptiveWeaknessType, RemediationPairBlueprint[]> = {
  dynamic_stress: [
    {
      contrastGroup: 'hashi_contrast',
      targetRemediation: 'Pitch Elevation without Volume Spike (箸 vs 橋)',
      remediationRationaleBn: 'বাংলা স্বভাবের কারণে সুর উঁচু করার সাথে সাথে গলার জোর বা ভলিউম বেড়ে যায়। 箸 (হা-শি ①: চপস্টিক) এ প্রথম সিলেবলে সুর উঁচু কিন্তু ভলিউম সমান রাখুন, আর 橋 (হা-শি ②: ব্রিজ) এ দ্বিতীয় সিলেবলে সুর তুলুন কোনো চিৎকার ছাড়া।',
      remediationRationaleEn: 'Dissociate pitch frequency (Hz) from acoustic loudness (dB). Do not yell when raising pitch.',
      items: [
        {
          word: '箸',
          readingKana: 'はし',
          meaningEn: 'Chopsticks',
          meaningBn: 'চপস্টিক',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'hashi_contrast',
          contextNote: 'Atamadaka ①: Ha is HIGH, shi is LOW. Keep volume constant.'
        },
        {
          word: '橋',
          readingKana: 'はし',
          meaningEn: 'Bridge',
          meaningBn: 'সেতু / ব্রিজ',
          overridePattern: 'odaka',
          overrideDownstepMora: 2,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'hashi_contrast',
          contextNote: 'Odaka ②: Ha is LOW, shi is HIGH. Drop on particle.'
        }
      ]
    },
    {
      contrastGroup: 'ame_contrast',
      targetRemediation: 'Head-High Pitch Drop vs Flat Rise (雨 vs 飴)',
      remediationRationaleBn: '雨 (আ-মে ①: বৃষ্টি) এ "আ" উঁচু স্বরে শুরু হয়ে সাথে সাথে "মে" তে সুর নেমে যায়। ভলিউমে জোর না দিয়ে কেবল বাঁশির সুরের মতো পিচ নামান। 飴 (আ-মে ⓪: ক্যান্ডি) এ সুর ফ্ল্যাট থাকবে।',
      remediationRationaleEn: 'Practice melodic stepping without stress accents on the initial mora.',
      items: [
        {
          word: '雨',
          readingKana: 'あめ',
          meaningEn: 'Rain',
          meaningBn: 'বৃষ্টি',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'ame_contrast',
          contextNote: 'Atamadaka ①: High A, Low ME.'
        },
        {
          word: '飴',
          readingKana: 'あめ',
          meaningEn: 'Candy',
          meaningBn: 'ক্যান্ডি / মিষ্টি',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'ame_contrast',
          contextNote: 'Heiban ⓪: Low A, High ME, stays elevated.'
        }
      ]
    },
    {
      contrastGroup: 'hana_contrast',
      targetRemediation: 'Final Mora Pitch Rise vs Particle Continuity (花 vs 鼻)',
      remediationRationaleBn: '花 (হা-না ②: ফুল) একটি ওদাকা শব্দ, যেখানে পার্টিকেলে সুর নামবে। 鼻 (হা-না ⓪: নাক) একটি হেইবান শব্দ যেখানে সুর উপরেই থাকে। তীব্রতার কোনো পরিবর্তন করবেন না।',
      remediationRationaleEn: 'Maintain identical breath pressure across morae while shifting pitch.',
      items: [
        {
          word: '花',
          readingKana: 'はな',
          meaningEn: 'Flower',
          meaningBn: 'ফুল',
          overridePattern: 'odaka',
          overrideDownstepMora: 2,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'hana_contrast',
          contextNote: 'Odaka ②: L-H, drops on particle ga (L).'
        },
        {
          word: '鼻',
          readingKana: 'はな',
          meaningEn: 'Nose',
          meaningBn: 'নাক',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'hana_contrast',
          contextNote: 'Heiban ⓪: L-H, stays high through particle ga (H).'
        }
      ]
    }
  ],

  mora_flattening: [
    {
      contrastGroup: 'neko_inu_contrast',
      targetRemediation: 'Mora Downstep Contrast (猫 vs 犬)',
      remediationRationaleBn: 'আপনার কণ্ঠে মোরা ফ্ল্যাটেনিং বা একঘেয়ে সুরের প্রবণতা রয়েছে। 猫 (নেকো ①) এ প্রথম সিলেবলে উঁচু হয়ে দ্বিতীয় সিলেবলে স্পষ্ট নিচে নামাতে হবে; 犬 (ইনু ②) এ নিচু থেকে উঁচু হতে হবে।',
      remediationRationaleEn: 'Produce distinct high-low downsteps instead of monotonous flat intonation.',
      items: [
        {
          word: '猫',
          readingKana: 'ねこ',
          meaningEn: 'Cat',
          meaningBn: 'বিড়াল',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'neko_inu_contrast',
          contextNote: 'Atamadaka ①: Sharp drop from NE (H) to KO (L).'
        },
        {
          word: '犬',
          readingKana: 'いぬ',
          meaningEn: 'Dog',
          meaningBn: 'কুকুর',
          overridePattern: 'odaka',
          overrideDownstepMora: 2,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'neko_inu_contrast',
          contextNote: 'Odaka ②: Step up from I (L) to NU (H).'
        }
      ]
    },
    {
      contrastGroup: 'hon_pen_contrast',
      targetRemediation: 'Mora Nasal Boundary & Step Drop (本 vs ペン)',
      remediationRationaleBn: 'নাসিক্য মোরা ん (n) এর ক্ষেত্রে বাঙালি শিক্ষার্থীরা সুর ফ্ল্যাট করে ফেলে। 本 (হো-ন ①) এ "হো" তে উঁচু হয়ে "ন" তে সুর নামান। ペン (পে-ন ⓪) এ সমানভাবে উঁচু রাখুন।',
      remediationRationaleEn: 'Ensure moraic nasal ん carries proper low or high pitch register without flattening.',
      items: [
        {
          word: '本',
          readingKana: 'ほん',
          meaningEn: 'Book',
          meaningBn: 'বই',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'hon_pen_contrast',
          contextNote: 'Atamadaka ①: HO is High, N is Low.'
        },
        {
          word: 'ペン',
          readingKana: 'ぺん',
          meaningEn: 'Pen',
          meaningBn: 'কলম',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'hon_pen_contrast',
          contextNote: 'Heiban ⓪: PE is Low, N is High.'
        }
      ]
    },
    {
      contrastGroup: 'tamago_sakana_contrast',
      targetRemediation: '3-Mora Nakadaka vs Heiban Stepping (卵 vs 魚)',
      remediationRationaleBn: '৩ মোরার শব্দে সুর মাঝখানে নামানো (Nakadaka) বনাম সমান্তরাল রাখা (Heiban) এর পার্থক্য তৈরি করুন। 卵 (তা-মা-গো ②) এ "মা" তে চূড়া ছুঁয়ে "গো" তে নামবে। 魚 (সা-কা-না ⓪) এ "সা" নিচু থেকে বাকিগুলো উঁচু থাকবে।',
      remediationRationaleEn: 'Differentiate mid-word peak downstep from continuous heiban plateau.',
      items: [
        {
          word: '卵',
          readingKana: 'たまご',
          meaningEn: 'Egg',
          meaningBn: 'ডিম',
          overridePattern: 'nakadaka',
          overrideDownstepMora: 2,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'tamago_sakana_contrast',
          contextNote: 'Nakadaka ②: L-H-L downstep after MA.'
        },
        {
          word: '魚',
          readingKana: 'さかな',
          meaningEn: 'Fish',
          meaningBn: 'মাছ',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'tamago_sakana_contrast',
          contextNote: 'Heiban ⓪: L-H-H plateau.'
        }
      ]
    }
  ],

  choon_shortening: [
    {
      contrastGroup: 'obasan_obaasan_contrast',
      targetRemediation: 'Long Vowel Mora Duration (おばさん vs おばあさん)',
      remediationRationaleBn: 'বাঙালি শিক্ষার্থীরা দীর্ঘ স্বর (Chōon) ছোট করে ফেলে। おばさん (মাসি/খালা - ৪ মোরা) এবং おばあさん (দাদি/নানি - ৫ মোরা) এর মধ্যে ১ পূর্ণ মোরা সময়ের ফারাক থাকে। ঘড়ির টিকটিক শব্দের মতো "আ" অংশকে পূর্ণ ১টি মোরা সময় ধরে রাখুন।',
      remediationRationaleEn: 'Hold long vowel for a full additional mora beat to avoid embarrassing semantic confusion.',
      items: [
        {
          word: '叔母さん',
          readingKana: 'おばさん',
          meaningEn: 'Aunt',
          meaningBn: 'খালা / ফুফু / মাসি',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'obasan_obaasan_contrast',
          contextNote: '4 morae: o-ba-sa-n (L-H-H-H). Short ba.'
        },
        {
          word: 'お祖母さん',
          readingKana: 'おばあさん',
          meaningEn: 'Grandmother',
          meaningBn: 'দাদি / নানি',
          overridePattern: 'nakadaka',
          overrideDownstepMora: 2,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'obasan_obaasan_contrast',
          contextNote: '5 morae: o-ba-a-sa-n (L-H-L-L-L). Hold long "a" for a full beat.'
        }
      ]
    },
    {
      contrastGroup: 'ojisan_ojiisan_contrast',
      targetRemediation: 'Long Vowel Duration (おじさん vs おじいさん)',
      remediationRationaleBn: 'おじさん (মামা/চাচা - ৪ মোরা) বনাম おじいさん (দাদু/নানা - ৫ মোরা)। "জি" এর পর "ই" কে আলাদা ১ মোরা সময় না দিলে ভুল অর্থ প্রকাশ পায়। সমান তাল বজায় রাখুন।',
      remediationRationaleEn: 'Distinguish uncle (4 morae) from grandfather (5 morae) with exact isochronous pacing.',
      items: [
        {
          word: '叔父さん',
          readingKana: 'おじさん',
          meaningEn: 'Uncle',
          meaningBn: 'চাচা / মামা',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'ojisan_ojiisan_contrast',
          contextNote: '4 morae: o-ji-sa-n (L-H-H-H).'
        },
        {
          word: 'お祖父さん',
          readingKana: 'おじいさん',
          meaningEn: 'Grandfather',
          meaningBn: 'দাদা / নানা',
          overridePattern: 'nakadaka',
          overrideDownstepMora: 2,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'ojisan_ojiisan_contrast',
          contextNote: '5 morae: o-ji-i-sa-n (L-H-L-L-L). Hold the long "i" mora.'
        }
      ]
    },
    {
      contrastGroup: 'yuki_yuuki_contrast',
      targetRemediation: 'Initial Long Vowel vs Short Vowel (雪 vs 勇気)',
      remediationRationaleBn: 'শব্দের শুরুতে দীর্ঘ স্বর রক্ষা করুন। 雪 (ইউকি: তুষার - ২ মোরা) এ দ্রুত শেষ হয়, কিন্তু 勇気 (ইউউকি: সাহস - ৩ মোরা) এ "ইউ" দ্বিগুণ দীর্ঘ সময় নিতে হবে।',
      remediationRationaleEn: 'Keep 2 vs 3 mora duration precise at word start (snow vs courage).',
      items: [
        {
          word: '雪',
          readingKana: 'ゆき',
          meaningEn: 'Snow',
          meaningBn: 'তুষার / বরফ',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'yuki_yuuki_contrast',
          contextNote: '2 morae: yu-ki (H-L). Short mora.'
        },
        {
          word: '勇気',
          readingKana: 'ゆうき',
          meaningEn: 'Courage',
          meaningBn: 'সাহস',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'minimal_pair',
          jlptLevel: 'N4',
          contrastGroup: 'yuki_yuuki_contrast',
          contextNote: '3 morae: yu-u-ki (H-L-L). Hold "u" mora.'
        }
      ]
    }
  ],

  sokuon_rushed: [
    {
      contrastGroup: 'kako_kakko_contrast',
      targetRemediation: 'Sokuon Silent Beat Pause (過去 vs 括弧)',
      remediationRationaleBn: 'বাঙালি শিক্ষার্থীরা ক্ষুদ্র 促音 (っ) এ বিরতি না দিয়ে তাড়াহুড়ো করে। 過去 (কাকো: অতীত - ২ মোরা) এ কোনো বিরতি নেই, কিন্তু 括弧 (কা-ক্কো: বন্ধনী - ৩ মোরা) এ "কা" বলার পর ঠিক ১ মোরা পরিমাণ নিঃশব্দ বিরতি দিতে হবে।',
      remediationRationaleEn: 'Do not rush double consonant stop. Hold a 1-mora silent pause.',
      items: [
        {
          word: '過去',
          readingKana: 'かこ',
          meaningEn: 'Past',
          meaningBn: 'অতীত',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'minimal_pair',
          jlptLevel: 'N4',
          contrastGroup: 'kako_kakko_contrast',
          contextNote: '2 morae: ka-ko (L-H).'
        },
        {
          word: '括弧',
          readingKana: 'かっこ',
          meaningEn: 'Parenthesis / Bracket',
          meaningBn: 'বন্ধনী',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'minimal_pair',
          jlptLevel: 'N3',
          contrastGroup: 'kako_kakko_contrast',
          contextNote: '3 morae: ka-q-ko (H-L-L). Hold silent pause on mora 2.'
        }
      ]
    },
    {
      contrastGroup: 'kite_kitte_contrast',
      targetRemediation: 'Sokuon Semantic Contrast (来て vs 切手)',
      remediationRationaleBn: '来て (কিতে: এসো - ২ মোরা) বনাম 切手 (কি-ত্তে: ডাকটিকিট - ৩ মোরা)। "কি" বলার পর মুখ বন্ধ করে ১ মোরা নিঃশ্বাস থামিয়ে তারপর "তে" উচ্চারণ করুন।',
      remediationRationaleEn: 'Ensure the glottal closure in "kitte" consumes a full mora interval.',
      items: [
        {
          word: '来て',
          readingKana: 'きて',
          meaningEn: 'Come (imperative/te-form)',
          meaningBn: 'এসো (অনুরোধ)',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'kite_kitte_contrast',
          contextNote: '2 morae: ki-te (L-H).'
        },
        {
          word: '切手',
          readingKana: 'きって',
          meaningEn: 'Postage Stamp',
          meaningBn: 'ডাকটিকিট',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'kite_kitte_contrast',
          contextNote: '3 morae: ki-q-te (L-H-H). Insert full beat pause.'
        }
      ]
    },
    {
      contrastGroup: 'oto_otto_contrast',
      targetRemediation: 'Sokuon Beat Pause (音 vs 夫)',
      remediationRationaleBn: '音 (অতো: শব্দ - ২ মোরা) বনাম 夫 (অ-ত্তো: স্বামী - ৩ মোরা)। তাড়াহুড়ো করলে স্বামী ও শব্দ গুলিয়ে যায়। ১ মোরা নিঃশব্দ বিরতি দিন।',
      remediationRationaleEn: 'Insert complete silent closure between morae in "otto".',
      items: [
        {
          word: '音',
          readingKana: 'おと',
          meaningEn: 'Sound',
          meaningBn: 'শব্দ / আওয়াজ',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'oto_otto_contrast',
          contextNote: '2 morae: o-to (L-H).'
        },
        {
          word: '夫',
          readingKana: 'おっと',
          meaningEn: 'Husband',
          meaningBn: 'স্বামী',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'minimal_pair',
          jlptLevel: 'N4',
          contrastGroup: 'oto_otto_contrast',
          contextNote: '3 morae: o-q-to (L-H-H).'
        }
      ]
    }
  ],

  atamadaka_downstep: [
    {
      contrastGroup: 'asa_hiru_contrast',
      targetRemediation: 'Mora 1 Downstep vs Heiban Rise (朝 vs 昼)',
      remediationRationaleBn: 'আতামাদাকা (Atamadaka ①) তে প্রথম সিলেবলে সুর সবচেয়ে উপরে থাকে এবং দ্বিতীয় সিলেবলে তীব্রভাবে নিচে নামে। 朝 (আ-সা ①) এ "আ" উঁচু এবং "সা" নিচু। 昼 (হি-রু ⓪) এ সুর উপরে উঠে থাকে।',
      remediationRationaleEn: 'Produce sharp initial drop on mora 1 downstep.',
      items: [
        {
          word: '朝',
          readingKana: 'あさ',
          meaningEn: 'Morning',
          meaningBn: 'সকাল',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'asa_hiru_contrast',
          contextNote: 'Atamadaka ①: A is High, sa is Low.'
        },
        {
          word: '昼',
          readingKana: 'ひる',
          meaningEn: 'Noon / Daytime',
          meaningBn: 'দুপুর / দিন',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'asa_hiru_contrast',
          contextNote: 'Heiban ⓪: Hi is Low, ru is High.'
        }
      ]
    },
    {
      contrastGroup: 'haru_aki_contrast',
      targetRemediation: 'Atamadaka vs Odaka Seasonal Pair (春 vs 秋)',
      remediationRationaleBn: '春 (হা-রু ①: বসন্ত) এ প্রথম মোরায় সুর উঁচু; 秋 (আ-কি ②: শরৎ) এ দ্বিতীয় মোরায় সুর উঁচু। প্রথম মোরায় সুর নামিয়ে ফেলার অভ্যাস থাকলে এটি সংশোধন করুন।',
      remediationRationaleEn: 'Contrast initial-high with final-high pitch patterns.',
      items: [
        {
          word: '春',
          readingKana: 'はる',
          meaningEn: 'Spring season',
          meaningBn: 'বসন্তকাল',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'haru_aki_contrast',
          contextNote: 'Atamadaka ①: HA is High, ru is Low.'
        },
        {
          word: '秋',
          readingKana: 'あき',
          meaningEn: 'Autumn season',
          meaningBn: 'শরৎকাল',
          overridePattern: 'odaka',
          overrideDownstepMora: 2,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'haru_aki_contrast',
          contextNote: 'Odaka ②: A is Low, ki is High.'
        }
      ]
    },
    {
      contrastGroup: 'mado_doa_contrast',
      targetRemediation: 'Atamadaka Household Pair (窓 vs ドア)',
      remediationRationaleBn: '窓 (মা-দো ①) এবং ドア (দো-আ ①) উভয়েই আতামাদাকা প্যাটার্ন। প্রথম সিলেবলকে পরিষ্কারভাবে উঁচু করে দ্বিতীয় সিলেবলে নামিয়ে দিন।',
      remediationRationaleEn: 'Reinforce consistent initial pitch elevation without delay.',
      items: [
        {
          word: '窓',
          readingKana: 'まど',
          meaningEn: 'Window',
          meaningBn: 'জানালা',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'mado_doa_contrast',
          contextNote: 'Atamadaka ①: MA (H) - DO (L).'
        },
        {
          word: 'ドア',
          readingKana: 'どあ',
          meaningEn: 'Door',
          meaningBn: 'দরজা',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'mado_doa_contrast',
          contextNote: 'Atamadaka ①: DO (H) - A (L).'
        }
      ]
    }
  ],

  nakadaka_timing: [
    {
      contrastGroup: 'tamago_sakana_contrast',
      targetRemediation: 'Mid-Word Downstep (卵 vs 魚)',
      remediationRationaleBn: 'নাকাদাকা (Nakadaka) প্যাটার্নে সুর শব্দের মাঝে চূড়ায় পৌঁছে নেমে যায়। 卵 (তা-মা-গো ②) এ "মা" তে সুর উঠবে এবং "গো" তে নামবে।',
      remediationRationaleEn: 'Target exact mora 2 peak and downstep before final mora.',
      items: [
        {
          word: '卵',
          readingKana: 'たまご',
          meaningEn: 'Egg',
          meaningBn: 'ডিম',
          overridePattern: 'nakadaka',
          overrideDownstepMora: 2,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'tamago_sakana_contrast',
          contextNote: 'Nakadaka ②: ta(L)-ma(H)-go(L).'
        },
        {
          word: '魚',
          readingKana: 'さかな',
          meaningEn: 'Fish',
          meaningBn: 'মাছ',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'tamago_sakana_contrast',
          contextNote: 'Heiban ⓪: sa(L)-ka(H)-na(H).'
        }
      ]
    },
    {
      contrastGroup: 'kokoro_atama_contrast',
      targetRemediation: 'Nakadaka Locus 2 vs 3 (心 vs 頭)',
      remediationRationaleBn: '心 (কো-কো-রো ②) এ দ্বিতীয় মোরায় ডাউনস্টেপ, কিন্তু 頭 (আ-তা-মা ③) এ তৃতীয় মোরায় ডাউনস্টেপ। শব্দের ঠিক কোথায় সুর নামবে তা লক্ষ্য করুন।',
      remediationRationaleEn: 'Differentiate mora 2 vs mora 3 downstep timing.',
      items: [
        {
          word: '心',
          readingKana: 'こころ',
          meaningEn: 'Heart / Mind',
          meaningBn: 'মন / হৃদয়',
          overridePattern: 'nakadaka',
          overrideDownstepMora: 2,
          category: 'n4_conversation',
          jlptLevel: 'N4',
          contrastGroup: 'kokoro_atama_contrast',
          contextNote: 'Nakadaka ②: ko(L)-ko(H)-ro(L).'
        },
        {
          word: '頭',
          readingKana: 'あたま',
          meaningEn: 'Head',
          meaningBn: 'মাথা',
          overridePattern: 'nakadaka',
          overrideDownstepMora: 3,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'kokoro_atama_contrast',
          contextNote: 'Nakadaka ③: a(L)-ta(H)-ma(H), drops on particle.'
        }
      ]
    },
    {
      contrastGroup: 'hikouki_densha_contrast',
      targetRemediation: '4-Mora Nakadaka vs Heiban (飛行機 vs 電車)',
      remediationRationaleBn: '飛行機 (হি-কো-উ-কি ②) এ দ্বিতীয় মোরায় ডাউনস্টেপ ঘটে বাকি অংশ নেমে যায়। 電車 (দে-ন-শা ⓪) এ সুর ফ্ল্যাট উঁচু থাকে।',
      remediationRationaleEn: 'Control downstep position in 4-mora compound nouns.',
      items: [
        {
          word: '飛行機',
          readingKana: 'ひこうき',
          meaningEn: 'Airplane',
          meaningBn: 'উড়োজাহাজ',
          overridePattern: 'nakadaka',
          overrideDownstepMora: 2,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'hikouki_densha_contrast',
          contextNote: 'Nakadaka ②: hi(L)-ko(H)-u(L)-ki(L).'
        },
        {
          word: '電車',
          readingKana: 'でんしゃ',
          meaningEn: 'Electric Train',
          meaningBn: 'ট্রেন',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'hikouki_densha_contrast',
          contextNote: 'Heiban ⓪: de(L)-n(H)-sha(H).'
        }
      ]
    }
  ],

  heiban_elevation: [
    {
      contrastGroup: 'sakana_neko_contrast',
      targetRemediation: 'Heiban Plateau vs Atamadaka Drop (魚 vs 猫)',
      remediationRationaleBn: 'হেইবান শব্দে প্রথম মোরা নিচু হওয়ার পর পরবর্তী সব মোরায় সুর উঁচু থাকে এবং কখনো পড়ে না। 魚 (সা-কা-না ⓪) এ সুর সমান্তরাল উঁচু রাখুন, 猫 (নেকো ①) এর মতো নামিয়ে ফেলবেন না।',
      remediationRationaleEn: 'Maintain high plateau across morae in Heiban words without premature drop.',
      items: [
        {
          word: '魚',
          readingKana: 'さかな',
          meaningEn: 'Fish',
          meaningBn: 'মাছ',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'sakana_neko_contrast',
          contextNote: 'Heiban ⓪: sa(L)-ka(H)-na(H).'
        },
        {
          word: '猫',
          readingKana: 'ねこ',
          meaningEn: 'Cat',
          meaningBn: 'বিড়াল',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'sakana_neko_contrast',
          contextNote: 'Atamadaka ①: ne(H)-ko(L).'
        }
      ]
    },
    {
      contrastGroup: 'nihon_ame_contrast',
      targetRemediation: 'Heiban Nation Word vs Initial Drop (日本 vs 雨)',
      remediationRationaleBn: '日本 (নি-হো-ন ⓪) এ "হো" থেকে সুর উপরে উঠে শেষ পর্যন্ত সমান থাকে। বৃষ্টির শব্দ 雨 (আ-মে ①) এর সাথে তুলনা করে হেইবানের স্থিরতা বজায় রাখুন।',
      remediationRationaleEn: 'Hold Heiban plateau across nasal codas.',
      items: [
        {
          word: '日本',
          readingKana: 'にほん',
          meaningEn: 'Japan',
          meaningBn: 'জাপান',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'nihon_ame_contrast',
          contextNote: 'Heiban ⓪: ni(L)-ho(H)-n(H).'
        },
        {
          word: '雨',
          readingKana: 'あめ',
          meaningEn: 'Rain',
          meaningBn: 'বৃষ্টি',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'nihon_ame_contrast',
          contextNote: 'Atamadaka ①: a(H)-me(L).'
        }
      ]
    },
    {
      contrastGroup: 'sensei_gakusei_contrast',
      targetRemediation: 'Classroom Contrast (学生 vs 先生)',
      remediationRationaleBn: '学生 (গা-কু-সেই ⓪) একটি খাঁটি হেইবান শব্দ যা অনুস্বর্গ পর্যন্ত উঁচু থাকে। 先生 (সে-ন-সে-ই ③) এ তৃতীয় মোরায় ডাউনস্টেপ ঘটে। দুটির পার্থক্য স্পষ্ট করুন।',
      remediationRationaleEn: 'Contrast pure flat student plateau with teacher downstep.',
      items: [
        {
          word: '学生',
          readingKana: 'がくせい',
          meaningEn: 'Student',
          meaningBn: 'শিক্ষার্থী / ছাত্র',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'sensei_gakusei_contrast',
          contextNote: 'Heiban ⓪: ga(L)-ku(H)-se(H)-i(H).'
        },
        {
          word: '先生',
          readingKana: 'せんせい',
          meaningEn: 'Teacher / Master',
          meaningBn: 'শিক্ষক / ওস্তাদ',
          overridePattern: 'nakadaka',
          overrideDownstepMora: 3,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'sensei_gakusei_contrast',
          contextNote: 'Nakadaka ③: se(L)-n(H)-se(H)-i(L).'
        }
      ]
    }
  ],

  general_intonation: [
    {
      contrastGroup: 'hashi_contrast',
      targetRemediation: 'Core Minimal Pair Contrast (箸 vs 橋)',
      remediationRationaleBn: 'টোকিও পিচ অ্যাকসেন্টের সবচেয়ে মৌলিক কন্ট্রাস্ট পেয়ার। 箸 (হা-শি ①: চপস্টিক) আতামাদাকা এবং 橋 (হা-শি ②: ব্রিজ) ওদাকা প্যাটার্ন।',
      remediationRationaleEn: 'Master the classic chopsticks vs bridge pitch contrast.',
      items: [
        {
          word: '箸',
          readingKana: 'はし',
          meaningEn: 'Chopsticks',
          meaningBn: 'চপস্টিক',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'hashi_contrast',
          contextNote: 'Atamadaka ①: Ha(H)-shi(L).'
        },
        {
          word: '橋',
          readingKana: 'はし',
          meaningEn: 'Bridge',
          meaningBn: 'সেতু',
          overridePattern: 'odaka',
          overrideDownstepMora: 2,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'hashi_contrast',
          contextNote: 'Odaka ②: Ha(L)-shi(H).'
        }
      ]
    },
    {
      contrastGroup: 'ame_contrast',
      targetRemediation: 'Head-High vs Flat Contrast (雨 vs 飴)',
      remediationRationaleBn: '雨 (বৃষ্টি ①) আতামাদাকা এবং 飴 (ক্যান্ডি ⓪) হেইবান প্যাটার্ন। এই দুটি চর্চা করে সুরের ওঠা ও নামা আয়ত্ত করুন।',
      remediationRationaleEn: 'Contrast initial high fall with flat rise.',
      items: [
        {
          word: '雨',
          readingKana: 'あめ',
          meaningEn: 'Rain',
          meaningBn: 'বৃষ্টি',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'ame_contrast',
          contextNote: 'Atamadaka ①: A(H)-me(L).'
        },
        {
          word: '飴',
          readingKana: 'あめ',
          meaningEn: 'Candy',
          meaningBn: 'মিষ্টি / ক্যান্ডি',
          overridePattern: 'heiban',
          overrideDownstepMora: 0,
          category: 'minimal_pair',
          jlptLevel: 'N5',
          contrastGroup: 'ame_contrast',
          contextNote: 'Heiban ⓪: A(L)-me(H).'
        }
      ]
    },
    {
      contrastGroup: 'neko_inu_contrast',
      targetRemediation: 'Essential Animal Pitch Contrast (猫 vs 犬)',
      remediationRationaleBn: '猫 (বিড়াল ①) আতামাদাকা এবং 犬 (কুকুর ②) ওদাকা প্যাটার্ন। দৈনন্দিন প্রয়োজনীয় শব্দের নিখুঁত টোকিও সুর তৈরি করুন।',
      remediationRationaleEn: 'Build stable intuitive pitch contours on standard vocabulary.',
      items: [
        {
          word: '猫',
          readingKana: 'ねこ',
          meaningEn: 'Cat',
          meaningBn: 'বিড়াল',
          overridePattern: 'atamadaka',
          overrideDownstepMora: 1,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'neko_inu_contrast',
          contextNote: 'Atamadaka ①: Ne(H)-ko(L).'
        },
        {
          word: '犬',
          readingKana: 'いぬ',
          meaningEn: 'Dog',
          meaningBn: 'কুকুর',
          overridePattern: 'odaka',
          overrideDownstepMora: 2,
          category: 'n5_essential',
          jlptLevel: 'N5',
          contrastGroup: 'neko_inu_contrast',
          contextNote: 'Odaka ②: I(L)-nu(H).'
        }
      ]
    }
  ]
};

export class AdaptiveDrillService {
  /**
   * Evaluates student's recent voice telemetry and dynamically synthesizes
   * 3 targeted remediation drill pairs tailored to their exact acoustic failure mode.
   */
  public static async getAdaptiveRecommendations(userId: string): Promise<AdaptiveDrillRecommendation> {
    const assessments = db.getVoiceAssessments(userId, 30);

    let dynamicStressCount = 0;
    let moraFlatteningCount = 0;
    let choonShorteningCount = 0;
    let sokuonRushedCount = 0;
    const patternFailures: Record<string, number> = {
      atamadaka: 0,
      nakadaka: 0,
      heiban: 0,
      odaka: 0
    };

    for (const a of assessments) {
      const bAnalysis = a.bengaliAcousticAnalysis;
      if (bAnalysis) {
        if (bAnalysis.hasDynamicStressError || (bAnalysis.pitchVsIntensityCorrelation && bAnalysis.pitchVsIntensityCorrelation > 0.35)) {
          dynamicStressCount++;
        }
        if (bAnalysis.hasMoraFlattening) {
          moraFlatteningCount++;
        }
        if (bAnalysis.hasVowelLengthMismatch) {
          choonShorteningCount++;
        }
        if (bAnalysis.hasSokuonRushedError) {
          sokuonRushedCount++;
        }
      }

      if (!a.patternMatch && a.targetPattern) {
        const pattern = a.targetPattern.toLowerCase();
        patternFailures[pattern] = (patternFailures[pattern] || 0) + 1;
      }
    }

    // Determine primary weakness using weighted acoustic severity
    let primaryWeakness: AdaptiveWeaknessType = 'dynamic_stress';
    let secondaryWeakness: AdaptiveWeaknessType | undefined;

    const scores: Array<{ type: AdaptiveWeaknessType; count: number }> = [
      { type: 'dynamic_stress', count: dynamicStressCount * 1.3 },
      { type: 'choon_shortening', count: choonShorteningCount * 1.25 },
      { type: 'sokuon_rushed', count: sokuonRushedCount * 1.2 },
      { type: 'mora_flattening', count: moraFlatteningCount * 1.1 },
      { type: 'atamadaka_downstep', count: (patternFailures.atamadaka || 0) * 1.0 },
      { type: 'nakadaka_timing', count: (patternFailures.nakadaka || 0) * 1.0 },
      { type: 'heiban_elevation', count: (patternFailures.heiban || 0) * 1.0 }
    ];

    scores.sort((a, b) => b.count - a.count);

    if (assessments.length > 0 && scores[0].count > 0) {
      primaryWeakness = scores[0].type;
      if (scores.length > 1 && scores[1].count > 0) {
        secondaryWeakness = scores[1].type;
      }
    } else {
      // Default for new learners without prior assessment errors
      primaryWeakness = 'dynamic_stress';
    }

    // Retrieve the 3 remediation blueprints for this primary weakness
    const blueprints = REMEDIATION_BLUEPRINTS[primaryWeakness] || REMEDIATION_BLUEPRINTS.dynamic_stress;

    // Resolve or dynamically synthesize the drills for each pair
    const recommendedPairs: AdaptiveRecommendedPair[] = [];
    let synthesizedCount = 0;

    for (const bp of blueprints) {
      const pairDrills: TokyoPitchDrill[] = [];

      for (const itemInput of bp.items) {
        // Check if drill exists in database by kanji and readingKana
        const existing = db.getPitchDrills({ search: itemInput.word }).find(
          (d) => d.kanji === itemInput.word && d.readingKana === itemInput.readingKana
        );

        if (existing) {
          pairDrills.push(existing);
        } else {
          // Synthesize on the fly with complete F0 contour, intensity curves, and mora boundaries
          const synthesized = DrillSeedGeneratorService.generateSingleDrill(itemInput);
          db.bulkUpsertPitchDrills([synthesized]);
          pairDrills.push(synthesized);
          synthesizedCount++;
        }
      }

      recommendedPairs.push({
        contrastGroup: bp.contrastGroup,
        targetRemediation: bp.targetRemediation,
        remediationRationaleBn: bp.remediationRationaleBn,
        remediationRationaleEn: bp.remediationRationaleEn,
        drills: pairDrills
      });
    }

    // Build comprehensive Bengali diagnostic summary
    let diagnosticSummaryBn = '';
    let diagnosticSummaryEn = '';

    switch (primaryWeakness) {
      case 'dynamic_stress':
        diagnosticSummaryBn =
          'আপনার উচ্চারণে বাংলা ভাষার ডাইনামিক স্ট্রেস (ভলিউম বাড়িয়ে জোর দেওয়া) ধরা পড়েছে। জাপানি টোকিও পিচ অ্যাকসেন্টে শব্দের প্রতিটি সিলেবলে ভলিউম সমতল রেখে কেবল গলার সুর (Pitch / Hz) ওঠানামা করাতে হয়। এই দুর্বলতা কাটাতে ৩ জোড়া কন্ট্রাস্ট ড্রিল অনুশীলন করুন।';
        diagnosticSummaryEn =
          'Identified Dynamic Stress transfer: intensity spikes concurrently with pitch elevation. Practice maintaining flat volume while varying fundamental frequency.';
        break;
      case 'choon_shortening':
        diagnosticSummaryBn =
          'দীর্ঘ স্বর (Chōon / 長音) নির্ধারিত সময়ের চেয়ে ছোট করে ফেলার প্রবণতা ধরা পড়েছে। ১ মোরা সময় কম বা বেশি হলে সম্পূর্ণ ভিন্ন অর্থ প্রকাশ পায় (যেমন: おばさん খালা বনাম おばあさん দাদি)। সমান তালের মেট্রোনম ড্রিল দিয়ে দীর্ঘ স্বর ধরে রাখুন।';
        diagnosticSummaryEn =
          'Detected Chōon shortening. Long vowels must hold for a full additional mora interval.';
        break;
      case 'sokuon_rushed':
        diagnosticSummaryBn =
          'ক্ষুদ্র "ৎসু" (Sokuon / 促音) এ প্রয়োজনীয় নিঃশব্দ বিরতি না দিয়ে তাড়াহুড়ো করার ত্রুটি ধরা পড়েছে। জাপানি ভাষায় っ একটি পূর্ণ মোরা বিরতি দাবি করে (যেমন: かこ অতীত বনাম かっこ বন্ধনী)। ঠিক ১ মোরা স্তব্ধ থাকুন।';
        diagnosticSummaryEn =
          'Detected rushed geminate stops (Sokuon). Ensure full 1-mora glottal closure pause.';
        break;
      case 'mora_flattening':
        diagnosticSummaryBn =
          'আপনার উচ্চারণে মোরা ফ্ল্যাটেনিং বা একঘেয়ে সুরের প্রবণতা রয়েছে। টোকিও অ্যাকসেন্টে ডাউনস্টেপ যেখানে ঘটবে সেখানে সুর স্পষ্ট নিচে নামাতে হবে। কন্ট্রাস্ট ড্রিলগুলো অনুশীলন করে স্পষ্ট পিচ ড্রপ তৈরি করুন।';
        diagnosticSummaryEn =
          'Detected mora flattening. Pronunciation lacks distinct downstep transitions.';
        break;
      case 'atamadaka_downstep':
        diagnosticSummaryBn =
          'আতামাদাকা (Atamadaka ①) প্যাটার্নে প্রথম মোরায় সুর উঁচু করে দ্বিতীয় মোরায় সাথে সাথে নামিয়ে দেওয়ার টাইমিংয়ে দুর্বলতা রয়েছে। প্রথম সিলেবলে সুর তুলে সাথে সাথে নামিয়ে দিন।';
        diagnosticSummaryEn =
          'Difficulty executing immediate mora 1 downstep in Atamadaka accent pattern.';
        break;
      case 'nakadaka_timing':
        diagnosticSummaryBn =
          'নাকাদাকা (Nakadaka) প্যাটার্নে শব্দের মাঝের ডাউনস্টেপ ঠিক কোন মোরায় ঘটবে তা চিহ্নিত করায় অসঙ্গতি রয়েছে। নির্দিষ্ট সিলেবলে চূড়ায় উঠে নামার অনুশীলন করুন।';
        diagnosticSummaryEn =
          'Downstep locus error in Nakadaka pattern. Target precise mid-word pitch fall.';
        break;
      case 'heiban_elevation':
        diagnosticSummaryBn =
          'হেইবান (Heiban ⓪) প্যাটার্নে সুর নিচু থেকে উঁচু হয়ে সমান্তরাল থাকার কথা, কিন্তু অসময়ে সুর নামিয়ে ফেলা হচ্ছে। হেইবান শব্দে কখনো আকস্মিক ড্রপ করবেন না।';
        diagnosticSummaryEn =
          'Premature pitch drop in Heiban pattern. Maintain flat elevated plateau.';
        break;
      default:
        diagnosticSummaryBn =
          'টোকিও পিচ অ্যাকসেন্ট ও মোরা ছন্দের মৌলিক কন্ট্রাস্ট আয়ত্ত করতে নিচের ৩ জোড়া ড্রিল অনুশীলন করুন।';
        diagnosticSummaryEn =
          'General Tokyo pitch accent and isochronous mora rhythm contrast drills.';
        break;
    }

    return {
      userId,
      primaryWeakness,
      secondaryWeakness,
      diagnosticSummaryBn,
      diagnosticSummaryEn,
      errorFrequency: {
        dynamicStressCount,
        moraFlatteningCount,
        choonShorteningCount,
        sokuonRushedCount,
        patternFailures,
        totalEvaluationsAnalyzed: assessments.length
      },
      recommendedPairs,
      synthesizedDrillCount: synthesizedCount,
      generatedAt: new Date().toISOString()
    };
  }
}
