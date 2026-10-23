// src/components/simulation/ConbiniPosCashierSimulator.tsx
// NIHOMI V2 — TOKYO WORKOS™ 7-ELEVEN / CONBINI CASHIER WORKSTATION
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
  Store,
  Check,
  ArrowRight,
  Receipt,
  ShoppingBag,
  Utensils,
  Play,
  RotateCw
} from 'lucide-react';
import { ConbiniPosProduct, ConbiniCustomerOrder } from '../../types';
import { CONBINI_SCENARIOS, ConbiniScenarioItem } from '../../data/conbiniScenarios';
import { CONBINI_BRANDS, ConbiniBrandId, HotSnackMenuItem } from '../../data/conbiniBrands';
import { ConbiniCustomerFigure } from './conbini/ConbiniCustomerFigure';
import { ConbiniHotSnackCase } from './conbini/ConbiniHotSnackCase';
import { ConbiniMicrowaveOven } from './conbini/ConbiniMicrowaveOven';
import { ConbiniCartoneTray } from './conbini/ConbiniCartoneTray';
import { ConbiniCustomerTablet } from './conbini/ConbiniCustomerTablet';
import { ConbiniThermalReceiptModal } from './conbini/ConbiniThermalReceiptModal';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { loadLearnerKnowledgeState, saveLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';

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

  // 4. Stage Progression (1. Greeting -> 2. Scanning -> 3. Service -> 4. Payment -> 5. Closing)
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaymentApproved, setIsPaymentApproved] = useState(false);

  // 9. Closing & Handover
  const [isReceiptPrinting, setIsReceiptPrinting] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
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

  const [showShiftScorecardModal, setShowShiftScorecardModal] = useState(false);

  // 12. Audio & Notification Feedback
  const [feedbackNotice, setFeedbackNotice] = useState<{
    text: string;
    type: 'success' | 'warn' | 'info';
  } | null>(null);

  // Clean speech recognition on unmount
  useEffect(() => {
    return () => {
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
    setIsDrawerOpen(false);
    setIsPaymentApproved(false);
    setIsReceiptPrinting(false);
    setIsPartingCompleted(false);
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
      text: `কনভেনিয়েন্স ব্র্যান্ড পরিবর্তন: ${brand.nameJa} (${brand.nameBn})`,
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
            text: 'গ্রাহকের অপেক্ষার সময় শেষ হয়েছে! দ্রুত সেবা প্রদান করুন।',
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
        ? `ক্যাশিয়ার: 「いらっしゃいませ！」 → কাস্টমার: 「${greetingResp.customerResponseJa}」`
        : `অভিবাদন সম্পন্ন। পরবর্তী ধাপ: পণ্য স্ক্যান করুন।`,
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
          text: 'সকল পণ্য স্ক্যান সম্পন্ন হয়েছে! পরবর্তী ধাপ: সেবা নিশ্চিতকরণ (খাবার গরম, ব্যাগ, কার্ড)।',
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
      text: 'সকল পণ্য এক ক্লিকে সফলভাবে স্ক্যান করা হয়েছে।',
      type: 'info'
    });
  };

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
      text: `হট স্ন্যাক্স 「${snack.nameJa}」টংস দিয়ে প্যাকেজিং করে কার্টে যোগ করা হয়েছে (+¥${snack.priceYen})`,
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
        ? `কাস্টমার: 「${responseJa}」 (পয়েন্ট কার্ড চেক সম্পন্ন)`
        : `কাস্টমার: 「${responseJa}」 (পয়েন্ট কার্ড নেই)`,
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
        text: 'বেন্তোটি ১৫০০ ওয়াটের ওভেনে গরম করা শুরু হয়েছে (৪ সেকেন্ড)...',
        type: 'info'
      });
    } else {
      setFeedbackNotice({
        text: `কাস্টমার: 「${bw.customerResponseJa}」 (গরম করার প্রয়োজন নেই)`,
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
        text: 'পরিবেশবান্ধব পলিথিন ব্যাগ (+৫ ইয়েন) কার্টে যোগ করা হয়েছে।',
        type: 'success'
      });
    } else {
      setIsBagAdded(false);
      setBagFee(0);
      speakJapanese('かしこまりました。袋なしでテープをお貼りいたします。', { rate: 0.9 });
      setFeedbackNotice({
        text: 'ব্যাগ ছাড়া হাতে নেওয়া নিশ্চিত করা হয়েছে (ফ্রি টেপ)।',
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
        text: 'চপস্টিক ও চামচ ব্যাগে দেওয়া হয়েছে।',
        type: 'success'
      });
    } else {
      speakJapanese('かしこまりました。お箸はお付けいたしません。', { rate: 0.9 });
      setFeedbackNotice({
        text: 'কাটলারি ছাড়াই পণ্য প্রদান নিশ্চিত হয়েছে।',
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
      text: 'মদ ও তামাকের জন্য ২০ বছর বা তদূর্ধ্ব বয়স নিশ্চিতকরণ সম্পন্ন হয়েছে।',
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
      text: `কাস্টমারের পেমেন্ট মাধ্যম: 「${pay.customerAnnounceJa}」`,
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

  const handleOpenDrawerAndTender = () => {
    setIsDrawerOpen(true);
    soundEffects.playCashDrawerPop();
    const entered = cashTendered || totalAmount;
    setFeedbackNotice({
      text: `নগদ ¥${entered.toLocaleString()} গ্রহণ করা হয়েছে। ক্যাশ ড্রয়ার উন্মুক্ত।`,
      type: 'info'
    });
  };

  const handleCompleteChangeHandover = () => {
    setIsPaymentApproved(true);
    setStage('closing');
    soundEffects.playCoinDrop();
    setFeedbackNotice({
      text: `ভাংতি ¥${changeDue.toLocaleString()} এবং রসিদ প্রদান করা হয়েছে। পেমেন্ট সম্পন্ন।`,
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
      setShowReceiptModal(true);

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
        keigoScore -= 15;
      }
      if (customerPatienceExpired) {
        penalty += 20;
      }

      const finalScore = Math.max(50, 100 - penalty);
      const earnedXp = Math.max(30, Math.round(finalScore * 0.8));

      // Synchronize with durable learner knowledge state directly
      try {
        const state = loadLearnerKnowledgeState();
        const skills = Array.from(new Set([...(state.masteredSkills || []), 'baito_conbini_cashier']));
        saveLearnerKnowledgeState({
          ...state,
          totalXp: (state.totalXp || 0) + earnedXp,
          masteredSkills: skills
        });
      } catch (e) {
        console.warn('[WorkOS] Could not sync knowledge state:', e);
      }

      setShiftStats((prev) => ({
        ...prev,
        customersServed: prev.customersServed + 1,
        totalSalesYen: prev.totalSalesYen + totalAmount,
        perfectTransactions: penalty === 0 ? prev.perfectTransactions + 1 : prev.perfectTransactions,
        earnedXp: prev.earnedXp + earnedXp,
        readinessPoints: prev.readinessPoints + Math.round(finalScore / 10)
      }));

      setStage('completed');
      soundEffects.playLessonCelebration();

      setFeedbackNotice({
        text: `শিফট সম্পন্ন! স্কোর: ${finalScore}% | + ${earnedXp} XP অর্জিত হয়েছে।`,
        type: 'success'
      });

      onCompleteOrder?.(finalScore, totalAmount);
    }, 900);
  };

  const handleAdvanceToNextCustomer = () => {
    soundEffects.playButtonTap();
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
    } else {
      setShowShiftScorecardModal(true);
    }
  };

  const handleSelectScenarioDirect = (idx: number) => {
    soundEffects.playButtonTap();
    setCurrentScenarioIndex(idx);
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

  const stagesList = [
    { key: 'greeting', num: 1, ja: '1. 挨拶 (শুভেচ্ছা)', icon: '🗣️' },
    { key: 'scanning', num: 2, ja: '2. スキャン (স্ক্যান)', icon: '🛒' },
    { key: 'service', num: 3, ja: '3. 接客確認 (সেবা)', icon: '🍱' },
    { key: 'payment', num: 4, ja: '4. お会計 (পেমেন্ট)', icon: '💳' },
    { key: 'closing', num: 5, ja: '5. お見送り (রসিদ)', icon: '🧾' }
  ];

  return (
    <div id="conbini-pos-cashier-simulator" className="w-full space-y-5 animate-fadeIn">
      {/* =========================================================================
          1. TOP CONTROLS: Brand Selector (7-Eleven / Lawson / FamilyMart) & Mode
         ========================================================================= */}
      <div className="bg-[#141726] border border-white/10 rounded-2xl sm:rounded-3xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Brand Switcher Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
              <Store className="w-4 h-4 text-amber-400" />
              <span>স্টোর নির্বাচন:</span>
            </span>

            <div className="flex flex-wrap sm:inline-flex rounded-xl bg-black/40 p-1 border border-white/10 gap-1">
              {/* 7-Eleven */}
              <button
                type="button"
                onClick={() => handleSwitchBrand('seven_eleven')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedBrandId === 'seven_eleven'
                    ? 'bg-gradient-to-r from-orange-600 via-emerald-600 to-red-600 text-white shadow-md ring-2 ring-orange-400/50'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <span>🟢🟠🔴</span>
                <span>7-Eleven (セブン)</span>
              </button>

              {/* Lawson */}
              <button
                type="button"
                onClick={() => handleSwitchBrand('lawson')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedBrandId === 'lawson'
                    ? 'bg-gradient-to-r from-blue-700 to-sky-600 text-white shadow-md ring-2 ring-blue-400/50'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <span>🔵⚪</span>
                <span>Lawson (ローソン)</span>
              </button>

              {/* FamilyMart */}
              <button
                type="button"
                onClick={() => handleSwitchBrand('family_mart')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedBrandId === 'family_mart'
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md ring-2 ring-emerald-400/50'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <span>🟢⚪🔵</span>
                <span>FamilyMart (ファミマ)</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher: Training vs Real Shift */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex flex-wrap sm:inline-flex rounded-xl bg-black/40 p-1 border border-white/10 gap-1">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setMode('training');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  mode === 'training'
                    ? 'bg-amber-500 text-black font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>ট্রেনিং মোড (সহজ গাইড)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setMode('shift');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  mode === 'shift'
                    ? 'bg-red-600 text-white font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>লাইভ শিফট (টাইমার)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Customer Carousel / Quick Switcher */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-400 shrink-0 mr-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>গ্রাহক নির্বাচন:</span>
          </span>

          {scenarios.map((sc, idx) => {
            const isSelected = idx === currentScenarioIndex;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenarioDirect(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md'
                    : 'bg-black/40 border-white/10 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="text-sm">{sc.avatarEmoji}</span>
                <span className="truncate max-w-[130px]">{sc.customerName}</span>
                {idx === 4 && <span className="text-[9px] bg-rose-500/30 text-rose-300 px-1 rounded font-mono">RUSH</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          2. STEP-BY-STEP PROGRESSIVE STEPPER (1 to 5)
         ========================================================================= */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-xs font-bold select-none">
        {stagesList.map((s) => {
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
              className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? 'bg-gradient-to-b from-[#E45147]/20 to-[#141726] border-[#E45147] text-white ring-1 ring-[#E45147]/50 shadow-lg'
                  : isDone
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#141726]/60 border-white/5 text-stone-500'
              }`}
            >
              <div className="text-base sm:text-lg">{s.icon}</div>
              <div className="text-[10px] sm:text-xs truncate max-w-full font-serif">{s.ja}</div>
            </div>
          );
        })}
      </div>

      {/* Notification Banner */}
      {feedbackNotice && (
        <div
          className={`p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between border animate-fadeIn ${
            feedbackNotice.type === 'success'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
              : feedbackNotice.type === 'warn'
              ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
              : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{feedbackNotice.text}</span>
          </div>
          <button
            onClick={() => setFeedbackNotice(null)}
            className="text-stone-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          3. WORKSTATION MAIN: Balanced 2-Column Desktop Grid
             Left (7 cols): Customer Counter & Stage Action Guidance
             Right (5 cols): POS Terminal & Receipt Tape
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 Cols): Counter View & Active Task Guidance */}
        <div className="lg:col-span-7 space-y-4">
          {/* Customer Figure & Speech Card */}
          <div className="bg-[#141726] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4 flex flex-col items-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {currentScenario.customerName} ({currentScenario.roleTitleBn})
                </span>
                <span className="text-[10px] text-stone-400 font-serif">
                  {currentScenario.roleTitleJa}
                </span>
              </div>
              {mode === 'shift' && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ধৈর্য: {patienceSeconds}s</span>
                </div>
              )}
            </div>

            {/* Customer Illustration */}
            <div className="py-2">
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
            </div>

            {/* Speech Bubble with Audio */}
            <div className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>কাস্টমারের কথা (Japanese Customer Dialogue)</span>
                </span>
                <button
                  type="button"
                  id="btn-conbini-customer-audio-replay"
                  onClick={() => speakJapanese(customerDialogueText.ja)}
                  className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-bold flex items-center gap-1 cursor-pointer border border-red-500/30"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>উচ্চারণ শুনুন</span>
                </button>
              </div>

              <div className="text-base sm:text-lg font-serif font-black text-white">
                {customerDialogueText.ja}
              </div>
              <div className="text-xs font-mono text-stone-400">
                {customerDialogueText.romaji}
              </div>
              <div className="text-xs text-stone-300 pt-1.5 border-t border-white/10">
                <strong>বাংলা অনুবাদ:</strong> {customerDialogueText.bn}
              </div>
            </div>
          </div>

          {/* ACTIVE STEP CONTEXTUAL ACTION CENTER */}
          <div className="bg-[#141726] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
            {/* Stage Title Banner */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>
                  {stage === 'greeting' && 'ধাপ ১: গ্রাহককে বিনম্র অভিবাদন জানান'}
                  {stage === 'scanning' && 'ধাপ ২: পণ্যের বারকোড স্ক্যান ও হট স্ন্যাক্স'}
                  {stage === 'service' && 'ধাপ ৩: সেবা নিশ্চিতকরণ (গরম, কার্ড, ব্যাগ)'}
                  {stage === 'payment' && 'ধাপ ৪: বিল প্রদর্শন ও অর্থ গ্রহণ'}
                  {stage === 'closing' && 'ধাপ ৫: রসিদ প্রদান ও বিদায় সম্ভাষণ'}
                  {stage === 'completed' && 'শিফট মূল্যায়ন ও পরবর্তী গ্রাহক'}
                </span>
              </h3>
              <span className="text-[11px] font-mono text-stone-400">
                ধাপ {stage === 'greeting' ? '১/৫' : stage === 'scanning' ? '২/৫' : stage === 'service' ? '৩/৫' : stage === 'payment' ? '৪/৫' : '৫/৫'}
              </span>
            </div>

            {/* STAGE 1 ACTION: GREETING */}
            {stage === 'greeting' && (
              <div className="space-y-3 py-2 text-center animate-fadeIn">
                <p className="text-xs text-stone-300">
                  কাউন্টারে গ্রাহক আসা মাত্র বিনম্র জাপানিজ সম্বোধন করুন:
                </p>
                <button
                  type="button"
                  id="btn-conbini-greeting-action"
                  onClick={handleCashierGreeting}
                  className="w-full py-4 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🗣️「いらっしゃいませ！」বলুন বা ট্যাপ করুন</span>
                </button>
                <div className="text-[11px] text-stone-400 font-mono">
                  উচ্চারণ: Irasshaimase! (স্বাগতম / আপনার সেবা করতে পেরে আনন্দিত)
                </div>
              </div>
            )}

            {/* STAGE 2 ACTION: SCANNING & HOT SNACK */}
            {stage === 'scanning' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-bold">
                    কনভেয়র বেল্টের পণ্য ({scannedItems.length}/{currentScenario.items.length} টি স্ক্যান হয়েছে):
                  </span>
                  <button
                    type="button"
                    id="btn-scan-all-conbini-items"
                    onClick={handleScanAllItems}
                    className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>এক ক্লিকে সব স্ক্যান</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {currentScenario.items.map((item, idx) => {
                    const isScanned = scannedItems.some((s) => s.id === item.id);
                    const isScanning = currentlyScanningItemId === item.id;
                    return (
                      <div
                        key={`${item.id}-${idx}`}
                        className={`p-3 rounded-2xl border transition flex items-center justify-between ${
                          isScanned
                            ? 'bg-black/30 border-white/5 opacity-70'
                            : 'bg-[#1A1F36] border-amber-500/40 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{item.imageIcon}</span>
                          <div>
                            <div className="font-bold text-xs text-white">{item.nameJa}</div>
                            <div className="text-[10px] text-stone-400">{item.nameBn}</div>
                            <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                              ¥{item.priceYen}
                            </div>
                          </div>
                        </div>

                        {isScanned ? (
                          <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>স্ক্যানড</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleScanItem(item)}
                            disabled={isScanning}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow transition flex items-center gap-1 cursor-pointer"
                          >
                            <Scan className="w-3.5 h-3.5" />
                            <span>স্ক্যান</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Hot Snack Warmer Case Option */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                    <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                    <span>{activeBrand.nameJa} হট স্ন্যাক্স ওয়ার্মার কেস (টংস দিয়ে বের করুন):</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {activeBrand.hotSnacks.map((snack) => {
                      const isGrabbed = packagedSnacks.includes(snack.id);
                      return (
                        <button
                          key={snack.id}
                          type="button"
                          onClick={() => handleSelectHotSnack(snack)}
                          disabled={isGrabbed}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                            isGrabbed
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 opacity-60'
                              : 'bg-black/40 border-amber-500/40 text-stone-200 hover:border-amber-400 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span>{snack.imageEmoji}</span>
                            <span className="truncate">{snack.nameJa}</span>
                          </span>
                          <span className="font-mono text-amber-400 shrink-0">¥{snack.priceYen}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {allItemsScanned && (
                  <button
                    type="button"
                    onClick={() => setStage('service')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>পরবর্তী ধাপ: গ্রাহক সেবা নিশ্চিতকরণ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* STAGE 3 ACTION: SERVICE INQUIRIES */}
            {stage === 'service' && (
              <div className="space-y-3.5 animate-fadeIn">
                <p className="text-xs text-stone-300">
                  জাপানিজ কর্মক্ষেত্রের ৩টি আবশ্যকীয় প্রোটোকল নিশ্চিত করুন:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Point Card */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>🪪 {activeBrand.loyaltyCardNameJa} যাচাই</span>
                      {isPointCardAsked && <span className="text-emerald-400 text-[10px]">✓ সম্পন্ন</span>}
                    </div>
                    <p className="text-[11px] text-stone-400">
                      「ポイントカードはお持ちですか？」
                    </p>
                    <button
                      type="button"
                      onClick={handleAskPointCard}
                      disabled={isPointCardAsked}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isPointCardAsked
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      }`}
                    >
                      {isPointCardAsked ? 'কার্ড নিশ্চিত হয়েছে' : 'পয়েন্ট কার্ড জিজ্ঞেস করুন'}
                    </button>
                  </div>

                  {/* Bento Microwave Heating */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                      <span>♨️ বেন্তো গরম (1500Wレンジ)</span>
                      {isBentoHeated && <span className="text-emerald-400 text-[10px]">✓ গরম সম্পন্ন</span>}
                    </div>
                    <p className="text-[11px] text-stone-400">
                      「お弁当温めますか？」
                    </p>
                    <button
                      type="button"
                      onClick={handleAskBentoWarming}
                      disabled={isBentoWarmAsked}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isBentoWarmAsked
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                    >
                      {isMicrowaveRunning
                        ? `গরম হচ্ছে (${microwaveSecondsLeft}s)...`
                        : isBentoHeated
                        ? 'খাবার গরম সম্পন্ন'
                        : 'খাবার গরম করার অফার'}
                    </button>
                  </div>

                  {/* Plastic Bag Selection */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                      <span>🛍️ পলিথিন ব্যাগ (レジ袋)</span>
                      {isBagAsked && <span className="text-emerald-400 text-[10px]">✓ নিশ্চিত</span>}
                    </div>
                    <p className="text-[11px] text-stone-400">
                      「レジ袋はお付けしますか？」
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleBag(true)}
                        className={`py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                          isBagAdded
                            ? 'bg-emerald-500 text-black font-black'
                            : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
                        }`}
                      >
                        ব্যাগ (+¥৫)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleBag(false)}
                        className={`py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                          isBagAsked && !isBagAdded
                            ? 'bg-amber-500 text-black font-black'
                            : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
                        }`}
                      >
                        প্রয়োজন নেই
                      </button>
                    </div>
                  </div>

                  {/* Age 20+ Verification */}
                  {hasAgeVerificationItem ? (
                    <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                        <span>🔞 বয়স যাচাই (২০+ নিশ্চিত)</span>
                        {isAgeVerified && <span className="text-emerald-400 text-[10px]">✓ নিশ্চিত</span>}
                      </div>
                      <p className="text-[10px] text-stone-400">
                        মদ/তামাক ক্রয়কারীর বয়স ২০+ হওয়া আবশ্যক
                      </p>
                      <button
                        type="button"
                        onClick={handleVerifyAge}
                        disabled={isAgeVerified}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isAgeVerified
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-600 hover:bg-rose-500 text-white font-black animate-pulse'
                        }`}
                      >
                        {isAgeVerified ? 'বয়স যাচাই সম্পন্ন' : 'স্ক্রিন টাচ করে বয়স যাচাই করুন'}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                        <span>🥢 চপস্টিক ও চামচ</span>
                        {isUtensilsAsked && <span className="text-emerald-400 text-[10px]">✓ নিশ্চিত</span>}
                      </div>
                      <p className="text-[11px] text-stone-400">
                        「お箸はお付けしますか？」
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleUtensils(true)}
                          className="py-1.5 rounded-xl text-[11px] font-bold bg-white/5 border border-white/10 text-stone-300 hover:text-white cursor-pointer"
                        >
                          চপস্টিক দিন
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleUtensils(false)}
                          className="py-1.5 rounded-xl text-[11px] font-bold bg-white/5 border border-white/10 text-stone-300 hover:text-white cursor-pointer"
                        >
                          দরকার নেই
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  id="btn-conbini-proceed-to-payment"
                  onClick={handleProceedToPayment}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>পরবর্তী ধাপ: পেমেন্ট গ্রহণ (Proceed to Payment)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STAGE 4 ACTION: PAYMENT & CASH TENDER */}
            {stage === 'payment' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-stone-400">মোট প্রদেয় বিল:</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">
                      ¥{totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right text-xs text-stone-400">
                    <div>গ্রাহকের পছন্দ:</div>
                    <div className="font-bold text-white uppercase">{currentScenario.paymentMethod}</div>
                  </div>
                </div>

                {/* Method Options */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    id="btn-conbini-pay-cash"
                    onClick={() => handleSelectPaymentMethod('cash')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      activePaymentMethod === 'cash'
                        ? 'bg-amber-500 text-black font-black'
                        : 'bg-black/40 border-white/10 text-stone-300 hover:text-white'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>নগদ (Cash)</span>
                  </button>
                  <button
                    type="button"
                    id="btn-conbini-pay-suica"
                    onClick={() => handleSelectPaymentMethod('suica')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      activePaymentMethod === 'suica'
                        ? 'bg-emerald-500 text-black font-black'
                        : 'bg-black/40 border-white/10 text-stone-300 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>সুইকা (Suica)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('paypay')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      activePaymentMethod === 'paypay'
                        ? 'bg-rose-500 text-white font-black'
                        : 'bg-black/40 border-white/10 text-stone-300 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>পেপে (PayPay)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('credit')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      activePaymentMethod === 'credit'
                        ? 'bg-cyan-500 text-black font-black'
                        : 'bg-black/40 border-white/10 text-stone-300 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>ক্রেডিট কার্ড</span>
                  </button>
                </div>

                {/* If Cash Method: Interactive Cartone Tray */}
                {activePaymentMethod === 'cash' && (
                  <div className="pt-2">
                    <ConbiniCartoneTray
                      totalAmountYen={totalAmount}
                      tenderedAmountYen={cashTendered || totalAmount}
                      isDrawerOpen={isDrawerOpen}
                      isPaymentApproved={isPaymentApproved}
                      onOpenDrawerAndTender={handleOpenDrawerAndTender}
                      onCompleteChangeHandover={handleCompleteChangeHandover}
                    />
                  </div>
                )}
              </div>
            )}

            {/* STAGE 5 ACTION: CLOSING & HANDOVER */}
            {(stage === 'closing' || isPaymentApproved) && stage !== 'completed' && (
              <div className="space-y-4 py-2 animate-fadeIn text-center">
                <p className="text-xs text-stone-300">
                  পেমেন্ট অনুমোদিত হয়েছে। রসিদ মুদ্রণ করুন এবং বিনম্র বিদায় সম্ভাষণ জানান:
                </p>
                <button
                  type="button"
                  id="btn-conbini-print-receipt-close"
                  onClick={handlePrintReceiptAndClose}
                  disabled={isReceiptPrinting}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-sm sm:text-base rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>
                    {isReceiptPrinting
                      ? 'রসিদ প্রিন্ট হচ্ছে...'
                      : '「ありがとうございました！」(রসিদ প্রদান ও বিদায়)'}
                  </span>
                </button>
                <div className="text-[11px] text-stone-400 font-mono">
                  Arigatou gozaimashita! Mata okoshi kudasaimase.
                </div>
              </div>
            )}

            {/* COMPLETED STAGE: ADVANCE BUTTON & RECEIPT ACTIONS */}
            {stage === 'completed' && (
              <div className="space-y-3 py-2 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>এই গ্রাহকের লেনদেন শতভাগ নির্ভুলভাবে সম্পন্ন হয়েছে!</span>
                  </div>
                  <span className="font-mono text-amber-400 font-black">+XP সংরক্ষিত</span>
                </div>

                {/* View Thermal Receipt Button */}
                <button
                  type="button"
                  id="btn-view-conbini-thermal-receipt"
                  onClick={() => setShowReceiptModal(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/40"
                >
                  <Receipt className="w-4 h-4 text-emerald-200" />
                  <span>🖨️ জাপানি থার্মাল রসিদ দেখুন ও প্রিন্ট করুন (View Thermal Receipt)</span>
                </button>

                <button
                  type="button"
                  id="btn-advance-conbini-next-customer"
                  onClick={handleAdvanceToNextCustomer}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {currentScenarioIndex < scenarios.length - 1
                      ? 'পরবর্তী গ্রাহকের দিকে এগিয়ে যান (Next Customer)'
                      : 'শিফট সমাপ্ত ও পূর্ণাঙ্গ স্কোরকার্ড দেখুন (Finish Shift)'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): POS Cashier Terminal & Receipt Roll */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#141726] border-2 border-white/10 rounded-3xl p-5 shadow-2xl space-y-3">
            {/* POS Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-xs"
                  style={{ backgroundColor: activeBrand.primaryColor }}
                ></div>
                <span className="text-xs font-black text-white">
                  {activeBrand.nameJa} POSレジ 01
                </span>
              </div>
              <div className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold ${activeBrand.uniformColorClass}`}>
                {activeBrand.uniformBadgeTitleJa}
              </div>
            </div>

            {/* POS Scanned Line Items Tape */}
            <div className="bg-black/90 rounded-2xl p-3.5 border border-white/5 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
              <div className="text-[10px] text-stone-500 border-b border-white/10 pb-1 flex justify-between">
                <span>品名 (Product)</span>
                <span>金額 (Price)</span>
              </div>
              {scannedItems.length === 0 ? (
                <div className="text-stone-500 text-center py-6">
                  [商品待機中 - পণ্য স্ক্যানের অপেক্ষায়]
                </div>
              ) : (
                scannedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-stone-200">
                    <span className="truncate max-w-[170px]">{item.nameJa}</span>
                    <span className="text-amber-400 font-bold">¥{item.priceYen}</span>
                  </div>
                ))
              )}
              {isBagAdded && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span>レジ袋 (পলিথিন ব্যাগ)</span>
                  <span>+¥5</span>
                </div>
              )}
            </div>

            {/* Subtotal & Total Bill Display */}
            <div className="p-3.5 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-stone-400 font-mono">
                  আইটেম: {scannedItems.length} টি (ভ্যাট ৮% সহ)
                </div>
                <div className="text-xs font-bold text-stone-200">সর্বমোট প্রদেয়:</div>
              </div>
              <div className="font-mono text-2xl font-black text-amber-400">
                ¥{totalAmount.toLocaleString()}
              </div>
            </div>

            {/* Customer Tablet */}
            <div className="pt-2">
              <ConbiniCustomerTablet
                totalAmountYen={totalAmount}
                customerPreferredMethod={currentScenario.paymentMethod}
                activeMethod={activePaymentMethod}
                onSelectMethod={handleSelectPaymentMethod}
                isApproved={isPaymentApproved}
                brandCardNameJa={activeBrand.loyaltyCardNameJa}
              />
            </div>
          </div>

          {/* Live Shift Performance Panel */}
          <div className="bg-[#141726] border border-white/10 rounded-3xl p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between text-stone-400 pb-2 border-b border-white/10">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>লাইভ শিফট পরিসংখ্যান</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-400">ONLINE</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-stone-400">সেবা প্রাপ্ত কাস্টমার</div>
                <div className="text-base font-black text-white mt-0.5">{shiftStats.customersServed} জন</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-stone-400">মোট বিক্রয় (Yen)</div>
                <div className="text-base font-black text-amber-400 font-mono mt-0.5">¥{shiftStats.totalSalesYen.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SHIFT SCORECARD MODAL
         ========================================================================= */}
      <AnimatePresence>
        {showShiftScorecardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#141726] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>শিফট সমাপ্তি প্রতিবেদন (Shift Completion Report)</span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  お疲れ様でした！শিফট সম্পন্ন
                </h3>
                <p className="text-xs text-stone-400">
                  {activeBrand.nameJa} {activeBrand.storeLocationJa} • আজকের পারফরম্যান্স
                </p>
              </div>

              {/* Performance Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-500/30 text-center">
                  <div className="text-xs text-stone-400">অর্জিত অভিজ্ঞতা (XP)</div>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">+{shiftStats.earnedXp || 150} XP</div>
                  <div className="text-[10px] text-emerald-400">অ্যাকাউন্টে সংরক্ষিত</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/50 border border-emerald-500/30 text-center">
                  <div className="text-xs text-stone-400">জাপান ক্যারিয়ার স্কোর</div>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">+25 pt</div>
                  <div className="text-[10px] text-emerald-400">ড্যাশবোর্ড আপডেট</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs space-y-2">
                <div className="flex justify-between text-stone-300">
                  <span>সেবাকৃত গ্রাহক:</span>
                  <span className="font-mono font-bold text-white">৫ জন (সকল সিনারিও সম্পন্ন)</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>মোট বিক্রয়:</span>
                  <span className="font-mono font-bold text-amber-400">¥{shiftStats.totalSalesYen.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>কেইগো শিষ্টাচার রেটিং:</span>
                  <span className="font-mono font-bold text-emerald-400">S-Rank (৯৮%)</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>কর্মরত স্টোর:</span>
                  <span className="font-bold text-amber-300">{activeBrand.nameJa}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRestartShift}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>নতুন শিফট শুরু করুন (Start New Shift)</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* =========================================================================
          JAPANESE CONBINI THERMAL RECEIPT MODAL
         ========================================================================= */}
      <ConbiniThermalReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        brand={activeBrand}
        items={scannedItems}
        totalAmount={totalAmount}
        paymentMethod={activePaymentMethod}
        amountPaid={cashTendered || totalAmount}
        changeDue={changeDue}
        hasBag={isBagAdded}
        bagFee={bagFee}
        scenarioTitle={currentScenario.customerName}
        earnedXp={shiftStats.earnedXp || 50}
        cashierName={activeBrand.uniformBadgeTitleJa}
        onAdvanceNextCustomer={handleAdvanceToNextCustomer}
      />
    </div>
  );
};

export default ConbiniPosCashierSimulator;
