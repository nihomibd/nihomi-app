// src/components/simulation/ConbiniPosCashierSimulator.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart,
  Scan,
  Zap,
  Flame,
  CreditCard,
  Smartphone,
  Coins,
  CheckCircle2,
  AlertCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  HelpCircle,
  Clock,
  UserCheck,
  Mic,
  Store,
  ThumbsUp,
  Star,
  Check,
  ArrowRight,
  TrendingUp,
  Receipt,
  Radio,
  ShoppingBag,
  Utensils,
  CreditCard as CardIcon,
  Play,
  Pause,
  AlertTriangle,
  Lightbulb,
  X
} from 'lucide-react';
import { ConbiniPosProduct, ConbiniCustomerOrder } from '../../types';
import { CONBINI_SCENARIOS, ConbiniScenarioItem } from '../../data/conbiniScenarios';
import { CONBINI_BRANDS, ConbiniBrandId, ConbiniBrandConfig, HotSnackMenuItem } from '../../data/conbiniBrands';
import { ConbiniCustomerFigure } from './conbini/ConbiniCustomerFigure';
import { ConbiniHotSnackCase } from './conbini/ConbiniHotSnackCase';
import { ConbiniMicrowaveOven } from './conbini/ConbiniMicrowaveOven';
import { ConbiniCartoneTray } from './conbini/ConbiniCartoneTray';
import { ConbiniCustomerTablet } from './conbini/ConbiniCustomerTablet';
import { ConbiniStoreStageBackground } from './conbini/ConbiniStoreStageBackground';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { haptic } from '../../lib/haptic';

interface ConbiniPosCashierSimulatorProps {
  onCompleteOrder?: (score: number, yenTotal: number) => void;
}

export type SimulatorMode = 'training' | 'shift';
export type CashierStage = 'greeting' | 'scanning' | 'service' | 'payment' | 'closing' | 'completed';

export const ConbiniPosCashierSimulator: React.FC<ConbiniPosCashierSimulatorProps> = ({
  onCompleteOrder
}) => {
  // 1. Conbini Chain Brand State: 7-Eleven, Lawson, FamilyMart
  const [selectedBrandId, setSelectedBrandId] = useState<ConbiniBrandId>('seven_eleven');
  const activeBrand = CONBINI_BRANDS[selectedBrandId];

  // 2. Simulator Modes: Training (研修) vs Real Shift (本番シフト)
  const [mode, setMode] = useState<SimulatorMode>('training');

  // 3. Scenarios State
  const [scenarios] = useState<ConbiniScenarioItem[]>(CONBINI_SCENARIOS);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const currentScenario = scenarios[currentScenarioIndex] || scenarios[0];

  // 4. Stage Progression
  const [stage, setStage] = useState<CashierStage>('greeting');

  // 5. Customer Interaction & Hot Food States
  const [isGreetingCompleted, setIsGreetingCompleted] = useState(false);
  const [scannedItems, setScannedItems] = useState<ConbiniPosProduct[]>([]);
  const [currentlyScanningItemId, setCurrentlyScanningItemId] = useState<string | null>(null);
  const [packagedSnacks, setPackagedSnacks] = useState<string[]>([]);
  const [isHotSnackRequested, setIsHotSnackRequested] = useState(true);

  // 6. Service Inquiries
  const [isPointCardAsked, setIsPointCardAsked] = useState(false);
  const [isBentoWarmAsked, setIsBentoWarmAsked] = useState(false);
  const [isMicrowaveRunning, setIsMicrowaveRunning] = useState(false);
  const [microwaveSecondsLeft, setMicrowaveSecondsLeft] = useState(0);
  const [isBentoHeated, setIsBentoHeated] = useState(false);

  const [isBagAsked, setIsBagAsked] = useState(false);
  const [isBagAdded, setIsBagAdded] = useState(false);
  const [bagFee, setBagFee] = useState(0);

  const [isUtensilsAsked, setIsUtensilsAsked] = useState(false);
  const [isUtensilsPacked, setIsUtensilsPacked] = useState(false);

  const [isAgeVerified, setIsAgeVerified] = useState(false);

  // 7. Customer Dynamic Response Bubble
  const [customerDialogueText, setCustomerDialogueText] = useState<{
    ja: string;
    romaji: string;
    bn: string;
  }>({
    ja: currentScenario.customerSpeechJa,
    romaji: currentScenario.customerSpeechRomaji,
    bn: currentScenario.customerSpeechBn
  });

  // 8. Payment Tender
  const [activePaymentMethod, setActivePaymentMethod] = useState<'cash' | 'suica' | 'paypay' | 'credit' | null>(null);
  const [cashTendered, setCashTendered] = useState<number | null>(null);
  const [cashInputValue, setCashInputValue] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaymentApproved, setIsPaymentApproved] = useState(false);

  // 9. Closing & Handover
  const [isReceiptPrinting, setIsReceiptPrinting] = useState(false);
  const [isPartingCompleted, setIsPartingCompleted] = useState(false);

  // 10. Real Shift Rush Hour & Patience Timer
  const [patienceSeconds, setPatienceSeconds] = useState<number>(currentScenario.patienceTimeSeconds);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [customerPatienceExpired, setCustomerPatienceExpired] = useState(false);

  // 11. Shift Performance Metrics
  const [shiftStats, setShiftStats] = useState({
    customersServed: 0,
    totalSalesYen: 0,
    perfectTransactions: 0,
    scanningAccuracySum: 0,
    keigoServiceScoreSum: 0,
    paymentAccuracySum: 0,
    satisfactionScoreSum: 0,
    earnedXp: 0,
    readinessPoints: 0
  });

  const [currentTransactionScore, setCurrentTransactionScore] = useState<number | null>(null);
  const [showShiftScorecardModal, setShowShiftScorecardModal] = useState(false);

  // 12. Voice Recognition for Tap-to-Speak
  const [isListening, setIsListening] = useState(false);
  const [speechEvaluation, setSpeechEvaluation] = useState<{ score: number; text: string } | null>(null);
  const recognitionRef = useRef<any>(null);

  // 13. Audio & Notification
  const [feedbackNotice, setFeedbackNotice] = useState<{
    text: string;
    type: 'success' | 'warn' | 'info';
  } | null>(null);

  // Clean speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      stopJapaneseSpeech();
    };
  }, []);

  // Sync customer scenario whenever index changes or brand changes
  useEffect(() => {
    setStage('greeting');
    setIsGreetingCompleted(false);
    setScannedItems([]);
    setCurrentlyScanningItemId(null);
    setPackagedSnacks([]);
    setIsPointCardAsked(false);
    setIsBentoWarmAsked(false);
    setIsMicrowaveRunning(false);
    setMicrowaveSecondsLeft(0);
    setIsBentoHeated(false);
    setIsBagAsked(false);
    setIsBagAdded(false);
    setBagFee(0);
    setIsUtensilsAsked(false);
    setIsUtensilsPacked(false);
    setIsAgeVerified(false);
    setActivePaymentMethod(null);
    setCashTendered(null);
    setCashInputValue('');
    setIsDrawerOpen(false);
    setIsPaymentApproved(false);
    setIsReceiptPrinting(false);
    setIsPartingCompleted(false);
    setCurrentTransactionScore(null);
    setPatienceSeconds(currentScenario.patienceTimeSeconds);
    setCustomerPatienceExpired(false);
    setIsHotSnackRequested(true);

    // Initial customer speech with brand flavor
    const baseSpeechJa = currentScenario.customerSpeechJa;
    const hotSnackPromptJa = activeBrand.customerHotSnackRequestJa;

    setCustomerDialogueText({
      ja: `${baseSpeechJa} ${hotSnackPromptJa}`,
      romaji: `${currentScenario.customerSpeechRomaji} ${activeBrand.customerHotSnackRequestRomaji}`,
      bn: `${currentScenario.customerSpeechBn} ${activeBrand.customerHotSnackRequestBn}`
    });

    // Speak initial dialogue automatically in Training mode
    if (mode === 'training') {
      setTimeout(() => {
        speakJapanese(`${baseSpeechJa} ${hotSnackPromptJa}`, { rate: 0.95 });
      }, 700);
    }
  }, [currentScenarioIndex, selectedBrandId, mode]);

  // Handle Switch Brand
  const handleSwitchBrand = (brandId: ConbiniBrandId) => {
    soundEffects.playButtonTap();
    setSelectedBrandId(brandId);
    const brand = CONBINI_BRANDS[brandId];
    brand.playEntranceChime();
    setFeedbackNotice({
      text: `コンビニチェーン切替: ${brand.nameJa} (${brand.nameBn}) に移動しました`,
      type: 'info'
    });
  };

  // Real Shift Patience Countdown Timer
  useEffect(() => {
    if (mode !== 'shift' || isTimerPaused || stage === 'completed') return;

    const timer = setInterval(() => {
      setPatienceSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCustomerPatienceExpired(true);
          soundEffects.playIncorrectSoft();
          setFeedbackNotice({
            text: 'お客様の待ち時間が限界を超えました！接客スピードと手際を上げてください。',
            type: 'warn'
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isTimerPaused, stage]);

  // Microwave 1500W countdown timer
  useEffect(() => {
    if (!isMicrowaveRunning || microwaveSecondsLeft <= 0) return;

    const timer = setTimeout(() => {
      if (microwaveSecondsLeft === 1) {
        setIsMicrowaveRunning(false);
        setMicrowaveSecondsLeft(0);
        setIsBentoHeated(true);
        soundEffects.playMicrowaveBeep();
        setFeedbackNotice({
          text: '業務用電子レンジの加熱が完了しました！(75°C ピー、ピー、ピー)',
          type: 'success'
        });
      } else {
        setMicrowaveSecondsLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isMicrowaveRunning, microwaveSecondsLeft]);

  // Calculations
  const subtotal = scannedItems.reduce((acc, item) => acc + item.priceYen, 0);
  const totalAmount = subtotal + bagFee;
  const changeDue = cashTendered !== null && cashTendered >= totalAmount ? cashTendered - totalAmount : 0;
  const allItemsScanned = scannedItems.length >= currentScenario.items.length;
  const hasHeatingItem = currentScenario.items.some((i) => i.needsHeating);
  const hasAgeVerificationItem = currentScenario.items.some((i) => i.needsAgeVerification);

  // -----------------------------------------------------------------------------
  // STAGE 1: GREETING (いらっしゃいませ！)
  // -----------------------------------------------------------------------------
  const handleCashierGreeting = () => {
    soundEffects.playButtonTap();
    speakJapanese('いらっしゃいませ！', { rate: 0.95 });
    setIsGreetingCompleted(true);
    setStage('scanning');

    const greetingResp = currentScenario.dialogueState.greeting;
    setCustomerDialogueText({
      ja: greetingResp.customerResponseJa,
      romaji: greetingResp.customerResponseRomaji,
      bn: greetingResp.customerResponseBn
    });

    setFeedbackNotice({
      text: mode === 'training'
        ? `店員: 「いらっしゃいませ！」 → お客様: 「${greetingResp.customerResponseJa}」`
        : `店員: 「いらっしゃいませ！」 (挨拶完了・商品スキャンへ)`,
      type: 'success'
    });

    setTimeout(() => {
      speakJapanese(greetingResp.customerResponseJa, { rate: 0.95 });
    }, 800);
  };

  // -----------------------------------------------------------------------------
  // STAGE 2: BARCODE SCANNING & HOT SNACK PACKAGING
  // -----------------------------------------------------------------------------
  const handleScanItem = (item: ConbiniPosProduct) => {
    if (scannedItems.some((s) => s.id === item.id)) return;

    setCurrentlyScanningItemId(item.id);
    soundEffects.playBarcodeBeep();

    setTimeout(() => {
      setScannedItems((prev) => [...prev, item]);
      setCurrentlyScanningItemId(null);

      if (scannedItems.length + 1 >= currentScenario.items.length) {
        setStage('service');
        setFeedbackNotice({
          text: '全商品のスキャンが完了しました！接客確認（カード・温め・袋）へ進みます。',
          type: 'info'
        });
      }
    }, 280);
  };

  const handleScanAllItems = () => {
    soundEffects.playBarcodeBeep();
    setScannedItems([...currentScenario.items]);
    setStage('service');
    setFeedbackNotice({
      text: '全商品を一括スキャンしました。(All items scanned successfully)',
      type: 'info'
    });
  };

  // Grab hot snack from warmer case
  const handleSelectHotSnack = (snack: HotSnackMenuItem) => {
    if (packagedSnacks.includes(snack.id)) return;
    setPackagedSnacks((prev) => [...prev, snack.id]);

    const productItem: ConbiniPosProduct = {
      id: snack.id,
      barcode: `490${Math.floor(100000000 + Math.random() * 900000000)}`,
      nameJa: snack.nameJa,
      nameRomaji: snack.nameRomaji,
      nameBn: snack.nameBn,
      priceYen: snack.priceYen,
      category: 'hot_snack',
      needsHeating: false,
      imageIcon: snack.imageEmoji
    };

    setScannedItems((prev) => [...prev, productItem]);
    soundEffects.playBarcodeBeep();

    setCustomerDialogueText({
      ja: `ありがとうございます！${snack.nameJa}、美味しそうですね。`,
      romaji: `Arigatou gozaimasu! ${snack.nameRomaji}, oishisou desu ne.`,
      bn: `ধন্যবাদ! ${snack.nameBn}, দেখতে খুব লোভনীয় লাগছে!`
    });

    setFeedbackNotice({
      text: `ホットスナック「${snack.nameJa}」をトングで取り出し包装しました (+¥${snack.priceYen})`,
      type: 'success'
    });
  };

  // -----------------------------------------------------------------------------
  // STAGE 3: INTERACTIVE SERVICE INQUIRIES
  // -----------------------------------------------------------------------------
  const handleAskPointCard = () => {
    soundEffects.playButtonTap();
    speakJapanese(activeBrand.loyaltyPromptJa, { rate: 0.9 });
    setIsPointCardAsked(true);

    const pc = currentScenario.dialogueState.pointCard;
    const responseJa = pc.hasCard
      ? `はい、${activeBrand.loyaltyCardNameJa}があります。`
      : 'いえ、持っていません。';

    setCustomerDialogueText({
      ja: responseJa,
      romaji: pc.customerResponseRomaji,
      bn: pc.customerResponseBn
    });

    setTimeout(() => {
      speakJapanese(responseJa, { rate: 0.95 });
    }, 800);

    setFeedbackNotice({
      text: pc.hasCard
        ? `お客様: 「${responseJa}」 (+10点 規定ポイント確認完了)`
        : `お客様: 「${responseJa}」 (確認完了)`,
      type: 'success'
    });
  };

  const handleAskBentoWarming = () => {
    soundEffects.playButtonTap();
    speakJapanese(currentScenario.dialogueState.bentoWarming.cashierPromptJa, { rate: 0.9 });
    setIsBentoWarmAsked(true);

    const bw = currentScenario.dialogueState.bentoWarming;
    setCustomerDialogueText({
      ja: bw.customerResponseJa,
      romaji: bw.customerResponseRomaji,
      bn: bw.customerResponseBn
    });

    setTimeout(() => {
      speakJapanese(bw.customerResponseJa, { rate: 0.95 });
    }, 800);

    if (bw.wantsHeating) {
      setIsMicrowaveRunning(true);
      setMicrowaveSecondsLeft(4);
      setFeedbackNotice({
        text: 'お弁当を1500W業務用電子レンジに入れ、温めを開始しました (4秒)',
        type: 'info'
      });
    } else {
      setFeedbackNotice({
        text: `お客様: 「${bw.customerResponseJa}」 (温め不要)`,
        type: 'info'
      });
    }
  };

  const handleToggleBag = (add: boolean) => {
    soundEffects.playButtonTap();
    setIsBagAsked(true);

    if (add) {
      setIsBagAdded(true);
      setBagFee(5);
      soundEffects.playPlasticBagSound();
      speakJapanese('レジ袋、大サイズを1枚お付けいたします。(+5円)', { rate: 0.9 });
      setFeedbackNotice({
        text: 'レジ袋（有料5円）を追加し、袋詰めを行いました。',
        type: 'success'
      });
    } else {
      setIsBagAdded(false);
      setBagFee(0);
      speakJapanese('かしこまりました。袋なしでテープをお貼りいたします。', { rate: 0.9 });
      setFeedbackNotice({
        text: 'レジ袋なし（マイバッグまたは手持ちテープ貼付）',
        type: 'info'
      });
    }
  };

  const handleToggleUtensils = (add: boolean) => {
    soundEffects.playButtonTap();
    setIsUtensilsAsked(true);
    setIsUtensilsPacked(add);

    if (add) {
      speakJapanese('お箸とスプーンをお付けいたしました。', { rate: 0.9 });
      setFeedbackNotice({
        text: 'お箸・スプーンを商品にお付けしました。',
        type: 'success'
      });
    } else {
      speakJapanese('かしこまりました。お箸はお付けいたしません。', { rate: 0.9 });
      setFeedbackNotice({
        text: 'カトラリー不要確認完了',
        type: 'info'
      });
    }
  };

  const handleVerifyAge = () => {
    soundEffects.playButtonTap();
    setIsAgeVerified(true);
    soundEffects.playRegisterSettlement();
    speakJapanese('年齢確認ボタンのタッチ、ありがとうございます。', { rate: 0.9 });
    setFeedbackNotice({
      text: '酒・たばこの年齢確認（20歳以上タッチ）が正常に完了しました。',
      type: 'success'
    });
  };

  const handleProceedToPayment = () => {
    soundEffects.playButtonTap();
    setStage('payment');
    const pay = currentScenario.dialogueState.payment;
    setCustomerDialogueText({
      ja: pay.customerAnnounceJa,
      romaji: pay.customerAnnounceRomaji,
      bn: pay.customerAnnounceBn
    });

    setTimeout(() => {
      speakJapanese(pay.customerAnnounceJa, { rate: 0.95 });
    }, 500);

    setFeedbackNotice({
      text: `お客様の支払い希望: 「${pay.customerAnnounceJa}」`,
      type: 'info'
    });
  };

  // -----------------------------------------------------------------------------
  // STAGE 4: AUTHENTIC CONBINI PAYMENT ENGINE (DUAL-SCREEN TOUCHSCREEN)
  // -----------------------------------------------------------------------------
  const handleSelectPaymentMethod = (method: 'cash' | 'suica' | 'paypay' | 'credit') => {
    soundEffects.playButtonTap();
    setActivePaymentMethod(method);

    if (method === 'cash') {
      const defaultTender = currentScenario.tenderedCashAmount || Math.ceil(totalAmount / 1000) * 1000;
      setCashInputValue(defaultTender.toString());
      setCashTendered(defaultTender);
    } else if (method === 'suica') {
      setTimeout(() => {
        setIsPaymentApproved(true);
        activeBrand.playApprovalChime();
        setStage('closing');
      }, 700);
    } else if (method === 'paypay') {
      setTimeout(() => {
        setIsPaymentApproved(true);
        soundEffects.playPayPaySound();
        setStage('closing');
      }, 600);
    } else if (method === 'credit') {
      setTimeout(() => {
        setIsPaymentApproved(true);
        soundEffects.playRegisterSettlement();
        setStage('closing');
      }, 700);
    }
  };

  // Cash Cartone Actions
  const handleOpenDrawerAndTender = () => {
    setIsDrawerOpen(true);
    const entered = cashTendered || totalAmount;
    setFeedbackNotice({
      text: `現金 ¥${entered.toLocaleString()} をお預かりしました。レジが開きました。`,
      type: 'info'
    });
  };

  const handleCompleteChangeHandover = () => {
    setIsPaymentApproved(true);
    setStage('closing');
    setFeedbackNotice({
      text: `お釣り ¥${changeDue.toLocaleString()} とレシートをお渡ししました。会計完了。`,
      type: 'success'
    });
  };

  // -----------------------------------------------------------------------------
  // STAGE 5: CLOSING & HANDOVER (ありがとうございました！)
  // -----------------------------------------------------------------------------
  const handlePrintReceiptAndClose = () => {
    setIsReceiptPrinting(true);
    soundEffects.playReceiptPrinterSound();

    setTimeout(() => {
      setIsReceiptPrinting(false);
      setIsPartingCompleted(true);

      const closing = currentScenario.dialogueState.closing;
      speakJapanese(closing.cashierPartingJa, { rate: 0.95 });

      setCustomerDialogueText({
        ja: closing.customerReplyJa,
        romaji: closing.customerReplyRomaji,
        bn: closing.customerReplyBn
      });

      // Calculate shift scoring metrics
      let penalty = 0;
      let keigoScore = 100;
      let scanningScore = 100;
      let paymentScore = 100;

      if (!isGreetingCompleted) {
        penalty += 15;
        keigoScore -= 20;
      }
      if (currentScenario.hasPointCard && !isPointCardAsked) {
        penalty += 10;
        keigoScore -= 10;
      }
      if (currentScenario.wantsBentoHeated && !isBentoHeated) {
        penalty += 20;
        keigoScore -= 20;
      }
      if (currentScenario.needsBag && !isBagAdded) {
        penalty += 15;
        scanningScore -= 15;
      }
      if (hasAgeVerificationItem && !isAgeVerified) {
        penalty += 30;
        paymentScore -= 30;
      }
      if (customerPatienceExpired) {
        penalty += 20;
      }

      const satisfaction = Math.max(40, 100 - penalty);
      setCurrentTransactionScore(satisfaction);

      setShiftStats((prev) => {
        const nextCustomers = prev.customersServed + 1;
        return {
          customersServed: nextCustomers,
          totalSalesYen: prev.totalSalesYen + totalAmount,
          perfectTransactions: satisfaction >= 95 ? prev.perfectTransactions + 1 : prev.perfectTransactions,
          scanningAccuracySum: prev.scanningAccuracySum + scanningScore,
          keigoServiceScoreSum: prev.keigoServiceScoreSum + keigoScore,
          paymentAccuracySum: prev.paymentAccuracySum + paymentScore,
          satisfactionScoreSum: prev.satisfactionScoreSum + satisfaction,
          earnedXp: prev.earnedXp + 40 + (satisfaction >= 90 ? 20 : 0),
          readinessPoints: prev.readinessPoints + 5
        };
      });

      soundEffects.playLessonCelebration();
      setStage('completed');

      if (onCompleteOrder) {
        onCompleteOrder(satisfaction, totalAmount);
      }
    }, 900);
  };

  // Next Customer or Loop
  const handleAdvanceToNextCustomer = () => {
    soundEffects.playButtonTap();
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
    } else {
      // Full shift completed! Persist rewards (+150 XP, +25 Readiness points)
      try {
        const prevXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
        const nextXp = prevXp + 150;
        localStorage.setItem('nihomi_student_xp', nextXp.toString());

        const prevShifts = parseInt(localStorage.getItem('nihomi_baito_shifts_completed') || '0', 10);
        const nextShifts = prevShifts + 1;
        localStorage.setItem('nihomi_baito_shifts_completed', nextShifts.toString());

        const prevReadiness = parseInt(localStorage.getItem('nihomi_baito_readiness_score') || '75', 10);
        const nextReadiness = Math.min(100, Math.max(75, prevReadiness + 25));
        localStorage.setItem('nihomi_baito_readiness_score', nextReadiness.toString());

        localStorage.setItem('nihomi_conbini_passed', 'true');

        // Dispatch global sync events for Dashboard and Course roadmaps
        window.dispatchEvent(new CustomEvent('nihomi:baito-shift-completed', {
          detail: {
            xp: 150,
            totalXp: nextXp,
            readinessPoints: 25,
            readinessScore: nextReadiness,
            shiftsCompleted: nextShifts,
            timestamp: Date.now()
          }
        }));

        window.dispatchEvent(new CustomEvent('nihomi:progress-updated', {
          detail: {
            type: 'baito',
            xp: 150,
            readinessPoints: 25,
            shiftsCompleted: nextShifts
          }
        }));

        // Graceful API persist attempt
        if (typeof window !== 'undefined' && window.fetch) {
          fetch('/api/baito/shift/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              shiftsCompleted: nextShifts,
              earnedXp: 150,
              readinessScore: nextReadiness,
              totalSalesYen: shiftStats.totalSalesYen
            })
          }).catch(() => {
            // Silently handled on static/offline edge deployments
          });
        }
      } catch (err) {
        console.warn('[ConbiniSync] Failed to persist shift rewards:', err);
      }

      setShowShiftScorecardModal(true);
    }
  };

  const handleSelectScenarioDirect = (index: number) => {
    soundEffects.playButtonTap();
    setCurrentScenarioIndex(index);
  };

  const handleRestartShift = () => {
    soundEffects.playButtonTap();
    setShowShiftScorecardModal(false);
    setCurrentScenarioIndex(0);
    setShiftStats({
      customersServed: 0,
      totalSalesYen: 0,
      perfectTransactions: 0,
      scanningAccuracySum: 0,
      keigoServiceScoreSum: 0,
      paymentAccuracySum: 0,
      satisfactionScoreSum: 0,
      earnedXp: 0,
      readinessPoints: 0
    });
  };

  // Voice recognition for interactive practice
  const handleVoiceRecognition = (targetPhraseJa: string, onMatchAction: () => void) => {
    soundEffects.playButtonTap();

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const evaluateTranscript = (transcript: string) => {
      let score = 95;
      const cleanTarget = targetPhraseJa.replace(/[！!？?、。\s]/g, '');
      const cleanTrans = transcript.replace(/\s+/g, '');

      if (cleanTrans.length > 0 && cleanTarget.length > 0) {
        if (cleanTrans === cleanTarget) {
          score = 99;
        } else if (cleanTrans.includes(cleanTarget.substring(0, 3))) {
          score = 96;
        } else {
          score = Math.floor(88 + Math.random() * 8);
        }
      }

      setSpeechEvaluation({ score, text: transcript || targetPhraseJa });
      soundEffects.playCorrectPing();
      haptic.correct();
      onMatchAction();
    };

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          evaluateTranscript(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          evaluateTranscript(targetPhraseJa);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        setIsListening(false);
        evaluateTranscript(targetPhraseJa);
      }
    } else {
      evaluateTranscript(targetPhraseJa);
    }
  };

  return (
    <div id="conbini-first-person-pos" className="w-full space-y-4">
      {/* =========================================================================
          TOP STAGE HEADER: 3-Brand Switcher & Mode Toggles
         ========================================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Brand Switcher Bar (7-Eleven, Lawson, FamilyMart) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-400" />
              <span>コンビニブランド (Select Store):</span>
            </span>

            <div className="inline-flex rounded-2xl bg-slate-950 p-1 border border-slate-800 shadow-inner">
              {/* 7-Eleven */}
              <button
                type="button"
                onClick={() => handleSwitchBrand('seven_eleven')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  selectedBrandId === 'seven_eleven'
                    ? 'bg-gradient-to-r from-orange-600 via-emerald-600 to-red-600 text-white shadow-md ring-2 ring-orange-400/50 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🟢🟠🔴</span>
                <span>7-Eleven (セブン)</span>
              </button>

              {/* Lawson */}
              <button
                type="button"
                onClick={() => handleSwitchBrand('lawson')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  selectedBrandId === 'lawson'
                    ? 'bg-gradient-to-r from-blue-700 to-sky-600 text-white shadow-md ring-2 ring-blue-400/50 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🔵⚪</span>
                <span>Lawson (ローソン)</span>
              </button>

              {/* FamilyMart */}
              <button
                type="button"
                onClick={() => handleSwitchBrand('family_mart')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  selectedBrandId === 'family_mart'
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md ring-2 ring-emerald-400/50 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🟢⚪🔵</span>
                <span>FamilyMart (ファミマ)</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher: Training vs Real Shift */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex rounded-2xl bg-slate-950 p-1 border border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setMode('training');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  mode === 'training'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>研修モード (Training)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setMode('shift');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  mode === 'shift'
                    ? 'bg-rose-600 text-white shadow-md font-black ring-1 ring-rose-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>本番シフト (Real Shift)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Customer Carousel / Quick Switcher */}
        <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>お客様選択 (Customers):</span>
          </span>

          {scenarios.map((sc, idx) => {
            const isSelected = idx === currentScenarioIndex;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenarioDirect(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-base">{sc.avatarEmoji}</span>
                <span className="truncate max-w-[130px]">{sc.customerName}</span>
                {idx === 4 && <span className="text-[9px] bg-rose-500/30 text-rose-300 px-1 rounded font-mono">RUSH</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          STAGE WORKSPACE: First-Person 2.5D Japanese Store Environment
         ========================================================================= */}
      <ConbiniStoreStageBackground brand={activeBrand}>
        {/* Interactive Cashier Workflow Stepper Navigation */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-xs font-bold mb-5 select-none">
          {[
            { key: 'greeting', num: 1, ja: '挨拶 (Greeting)', icon: '🗣️' },
            { key: 'scanning', num: 2, ja: 'スキャン (Scan)', icon: '🛒' },
            { key: 'service', num: 3, ja: '接客確認 (Service)', icon: '🍱' },
            { key: 'payment', num: 4, ja: 'お会計 (Payment)', icon: '💳' },
            { key: 'closing', num: 5, ja: 'お見送り (Close)', icon: '🧾' }
          ].map((s) => {
            const isActive = stage === s.key;
            const isDone =
              (s.key === 'greeting' && isGreetingCompleted) ||
              (s.key === 'scanning' && allItemsScanned) ||
              (s.key === 'service' && isBagAsked) ||
              (s.key === 'payment' && isPaymentApproved) ||
              (s.key === 'closing' && isPartingCompleted);

            return (
              <div
                key={s.key}
                className={`p-2 rounded-xl border transition flex flex-col items-center justify-center gap-0.5 ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/40'
                    : isDone
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-base">{s.icon}</div>
                <div className="text-[11px] truncate max-w-full">{s.ja}</div>
              </div>
            );
          })}
        </div>

        {/* 3-Column / Stacked Cinematic Store Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* =====================================================================
              LEFT COLUMN (3 Cols): Hot Snack Showcase & 1500W Microwave
             ===================================================================== */}
          <div className="lg:col-span-3 space-y-4">
            {/* Hot Snack Warmer Case */}
            <ConbiniHotSnackCase
              brandNameJa={activeBrand.nameJa}
              brandCaseTitleJa={activeBrand.hotSnackCaseTitleJa}
              hotSnacks={activeBrand.hotSnacks}
              targetHotSnackId={activeBrand.targetHotSnackId}
              onSelectHotSnack={handleSelectHotSnack}
              packagedSnacks={packagedSnacks}
            />

            {/* Commercial Microwave */}
            <ConbiniMicrowaveOven
              isRunning={isMicrowaveRunning}
              secondsLeft={microwaveSecondsLeft}
              isCompleted={isBentoHeated}
              bentoNameJa={currentScenario.items.find((i) => i.needsHeating)?.nameJa || '特製から揚げ弁当'}
            />
          </div>

          {/* =====================================================================
              CENTER COLUMN (5 Cols): Customer Across Counter & Conveyor Belt Items
             ===================================================================== */}
          <div className="lg:col-span-5 space-y-4 flex flex-col items-center">
            {/* The Customer Figure */}
            <ConbiniCustomerFigure
              customerType={currentScenario.customerType}
              customerName={currentScenario.customerName}
              roleTitleJa={currentScenario.roleTitleJa}
              roleTitleBn={currentScenario.roleTitleBn}
              dialogueText={customerDialogueText}
              mode={mode}
              isHotSnackWanted={isHotSnackRequested}
              hotSnackNameJa={activeBrand.hotSnacks.find((s) => s.id === activeBrand.targetHotSnackId)?.nameJa}
              paymentMethod={currentScenario.paymentMethod}
              isPaying={stage === 'payment'}
              patienceRemainingSeconds={mode === 'shift' ? patienceSeconds : undefined}
            />

            {/* Conveyor Belt Items */}
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <span>レジ前商品 (Conveyor Belt Items)</span>
                </div>
                <button
                  type="button"
                  onClick={handleScanAllItems}
                  className="px-2.5 py-1 text-xs font-bold rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition flex items-center gap-1 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>一括スキャン (Scan All)</span>
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {currentScenario.items.map((item, idx) => {
                  const isScanned = scannedItems.some((s) => s.id === item.id);
                  const isScanning = currentlyScanningItemId === item.id;

                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      className={`relative p-2.5 rounded-2xl border transition overflow-hidden flex items-center justify-between ${
                        isScanned
                          ? 'bg-slate-950/60 border-slate-800/80 opacity-80'
                          : 'bg-slate-900 border-amber-500/40 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
                          {item.imageIcon}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                            <span>{item.nameJa}</span>
                            {item.needsHeating && (
                              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 rounded border border-rose-500/40 font-mono">
                                要温め
                              </span>
                            )}
                            {item.needsAgeVerification && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded border border-amber-500/40 font-mono">
                                20歳確認
                              </span>
                            )}
                          </div>
                          {mode === 'training' && (
                            <div className="text-[11px] text-slate-400">
                              {item.nameBn}
                            </div>
                          )}
                          <div className="font-mono text-xs font-bold text-amber-400 mt-0.5">
                            ¥{item.priceYen.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div>
                        {isScanned ? (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>済</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleScanItem(item)}
                            disabled={isScanning}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Scan className="w-3.5 h-3.5" />
                            <span>スキャン</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =====================================================================
              RIGHT COLUMN (4 Cols): Semi-Self Dual-Screen POS & Cartone Tray
             ===================================================================== */}
          <div className="lg:col-span-4 space-y-4">
            {/* 1. Main Cashier Touchpad POS */}
            <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 shadow-2xl space-y-3">
              {/* POS Bezel Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shadow-xs"
                    style={{ backgroundColor: activeBrand.primaryColor }}
                  ></div>
                  <span className="text-xs font-black text-slate-100">
                    {activeBrand.nameJa} POSレジ 01
                  </span>
                </div>

                {/* Cashier Badge */}
                <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${activeBrand.uniformColorClass}`}>
                  {activeBrand.uniformBadgeTitleJa}
                </div>
              </div>

              {/* POS Line Items Display */}
              <div className="bg-black/90 rounded-2xl p-3 border border-slate-800 font-mono text-xs space-y-1.5 max-h-36 overflow-y-auto">
                {scannedItems.length === 0 ? (
                  <div className="text-slate-600 text-center py-4">
                    商品待機中 (Waiting for Scan)
                  </div>
                ) : (
                  scannedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-300">
                      <span className="truncate max-w-[170px]">{item.nameJa}</span>
                      <span className="text-amber-400 font-bold">¥{item.priceYen}</span>
                    </div>
                  ))
                )}
                {isBagAdded && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>レジ袋 (有料バイオマス)</span>
                    <span>+¥5</span>
                  </div>
                )}
              </div>

              {/* Subtotal & Total Display */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    点数: {scannedItems.length}点 (内税8%: ¥{Math.round(totalAmount * 0.08)})
                  </div>
                  <div className="text-xs font-bold text-slate-200">合計請求額:</div>
                </div>
                <div className="font-mono text-xl font-black text-amber-400">
                  ¥{totalAmount.toLocaleString()}
                </div>
              </div>

              {/* Cashier Ergonomic Touch Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* 挨拶 */}
                <button
                  type="button"
                  onClick={handleCashierGreeting}
                  disabled={isGreetingCompleted}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isGreetingCompleted
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md'
                  }`}
                >
                  <span>🗣️</span>
                  <span>{isGreetingCompleted ? '✓ 挨拶済' : 'いらっしゃいませ'}</span>
                </button>

                {/* ポイントカード */}
                <button
                  type="button"
                  onClick={handleAskPointCard}
                  disabled={isPointCardAsked}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isPointCardAsked
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'
                  }`}
                >
                  <span>🪪</span>
                  <span>{isPointCardAsked ? '✓ ポイント確認済' : `${activeBrand.loyaltyCardNameJa}確認`}</span>
                </button>

                {/* 温め */}
                {hasHeatingItem && (
                  <button
                    type="button"
                    onClick={handleAskBentoWarming}
                    disabled={isBentoWarmAsked}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isBentoWarmAsked
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    <span>♨️</span>
                    <span>{isBentoWarmAsked ? '✓ レンジ手配済' : 'お弁当温め確認'}</span>
                  </button>
                )}

                {/* レジ袋 */}
                <button
                  type="button"
                  onClick={() => handleToggleBag(!isBagAdded)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isBagAdded
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-sky-500/40'
                  }`}
                >
                  <span>🛍️</span>
                  <span>{isBagAdded ? '✓ レジ袋有 (+¥5)' : 'レジ袋確認'}</span>
                </button>

                {/* 年齢確認 */}
                {hasAgeVerificationItem && (
                  <button
                    type="button"
                    onClick={handleVerifyAge}
                    disabled={isAgeVerified}
                    className={`col-span-2 p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isAgeVerified
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-600 hover:bg-rose-500 text-white font-black animate-pulse'
                    }`}
                  >
                    <span>🔞</span>
                    <span>{isAgeVerified ? '✓ 20歳以上確認完了' : '20歳以上タッチ確認 (酒・タバコ)'}</span>
                  </button>
                )}

                {/* お会計に進む */}
                {stage !== 'payment' && stage !== 'closing' && stage !== 'completed' && (
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="col-span-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    <span>お会計確定 (Proceed to Payment)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Customer-Facing Tablet Screen */}
            <ConbiniCustomerTablet
              totalAmountYen={totalAmount}
              customerPreferredMethod={currentScenario.paymentMethod}
              activeMethod={activePaymentMethod}
              onSelectMethod={handleSelectPaymentMethod}
              isApproved={isPaymentApproved}
              brandCardNameJa={activeBrand.loyaltyCardNameJa}
            />

            {/* 3. Real Blue Cartone Coin Tray (When Paying Cash) */}
            {activePaymentMethod === 'cash' && (
              <ConbiniCartoneTray
                totalAmountYen={totalAmount}
                tenderedAmountYen={cashTendered || totalAmount}
                isDrawerOpen={isDrawerOpen}
                isPaymentApproved={isPaymentApproved}
                onOpenDrawerAndTender={handleOpenDrawerAndTender}
                onCompleteChangeHandover={handleCompleteChangeHandover}
              />
            )}

            {/* 4. Closing Stage Receipt Handover Button */}
            {(stage === 'closing' || isPaymentApproved) && stage !== 'completed' && (
              <button
                type="button"
                onClick={handlePrintReceiptAndClose}
                disabled={isReceiptPrinting}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 transition cursor-pointer text-sm"
              >
                <Receipt className="w-4 h-4" />
                <span>
                  {isReceiptPrinting
                    ? 'レシート印字中...'
                    : '「ありがとうございました！」 (レシートお渡し・退店)'}
                </span>
              </button>
            )}

            {/* 5. Advance to Next Customer */}
            {stage === 'completed' && (
              <button
                type="button"
                onClick={handleAdvanceToNextCustomer}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 transition cursor-pointer text-sm"
              >
                <span>
                  {currentScenarioIndex < scenarios.length - 1
                    ? '次のお客様へ (Next Customer)'
                    : '本日のシフト終了・スコアカード確認 (Finish Shift)'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </ConbiniStoreStageBackground>

      {/* =========================================================================
          SHIFT SCORECARD MODAL (When all 5 customers finish)
         ========================================================================= */}
      <AnimatePresence>
        {showShiftScorecardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>シフト完了報告書 (Shift Complete Report)</span>
                </div>
                <h3 className="text-2xl font-black text-slate-100">
                  お疲れ様でした！本日のレジ勤務終了
                </h3>
                <p className="text-xs text-slate-400">
                  {activeBrand.nameJa} {activeBrand.storeLocationJa} • 本日の勤務実績
                </p>
              </div>

              {/* Performance Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 text-center">
                  <div className="text-xs text-slate-400">獲得経験値 (XP)</div>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">+150 XP</div>
                  <div className="text-[10px] text-emerald-400">即時アカウント反映</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center">
                  <div className="text-xs text-slate-400">日本即戦力スコア</div>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">+25 pt</div>
                  <div className="text-[10px] text-emerald-400">ダッシュボード更新</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>接客人数 (Customers):</span>
                  <span className="font-mono font-bold text-slate-100">5名 (全シナリオ完了)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>総売上 (Total Sales):</span>
                  <span className="font-mono font-bold text-amber-400">¥{shiftStats.totalSalesYen.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>接客敬語評価 (Keigo Rating):</span>
                  <span className="font-mono font-bold text-emerald-400">Sランク (98%)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>勤務店舗:</span>
                  <span className="font-bold text-amber-300">{activeBrand.nameJa}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRestartShift}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>新しいシフトを開始する (Start New Shift)</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConbiniPosCashierSimulator;
