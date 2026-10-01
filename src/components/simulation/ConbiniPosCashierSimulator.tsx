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
  // Simulator Modes: Training (研修) vs Real Shift (本番シフト)
  const [mode, setMode] = useState<SimulatorMode>('training');

  // Scenarios State
  const [scenarios] = useState<ConbiniScenarioItem[]>(CONBINI_SCENARIOS);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const currentScenario = scenarios[currentScenarioIndex] || scenarios[0];

  // Stage Progression
  const [stage, setStage] = useState<CashierStage>('greeting');

  // Customer Interaction States
  const [isGreetingCompleted, setIsGreetingCompleted] = useState(false);
  const [scannedItems, setScannedItems] = useState<ConbiniPosProduct[]>([]);
  const [currentlyScanningItemId, setCurrentlyScanningItemId] = useState<string | null>(null);

  // Service Inquiries
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

  // Customer Dynamic Response Bubble
  const [customerDialogueText, setCustomerDialogueText] = useState<{
    ja: string;
    romaji: string;
    bn: string;
  }>({
    ja: currentScenario.customerSpeechJa,
    romaji: currentScenario.customerSpeechRomaji,
    bn: currentScenario.customerSpeechBn
  });

  // Payment Tender
  const [activePaymentMethod, setActivePaymentMethod] = useState<'cash' | 'suica' | 'paypay' | 'credit' | null>(null);
  const [cashTendered, setCashTendered] = useState<number | null>(null);
  const [cashInputValue, setCashInputValue] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isIcCardTapping, setIsIcCardTapping] = useState(false);
  const [isPhoneScanning, setIsPhoneScanning] = useState(false);
  const [isCreditChipReading, setIsCreditChipReading] = useState(false);
  const [isPaymentApproved, setIsPaymentApproved] = useState(false);

  // Closing & Handover
  const [isReceiptPrinting, setIsReceiptPrinting] = useState(false);
  const [isPartingCompleted, setIsPartingCompleted] = useState(false);

  // Real Shift Rush Hour & Patience Timer
  const [patienceSeconds, setPatienceSeconds] = useState<number>(currentScenario.patienceTimeSeconds);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [customerPatienceExpired, setCustomerPatienceExpired] = useState(false);

  // Shift Performance Metrics
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

  // Voice Recognition for Tap-to-Speak
  const [isListening, setIsListening] = useState(false);
  const [speechEvaluation, setSpeechEvaluation] = useState<{ score: number; text: string } | null>(null);
  const recognitionRef = useRef<any>(null);

  // Audio & Notification
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

  // When Scenario changes, reset scenario-specific states
  useEffect(() => {
    setStage('greeting');
    setIsGreetingCompleted(false);
    setScannedItems([]);
    setCurrentlyScanningItemId(null);
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
    setIsIcCardTapping(false);
    setIsPhoneScanning(false);
    setIsCreditChipReading(false);
    setIsPaymentApproved(false);
    setIsReceiptPrinting(false);
    setIsPartingCompleted(false);
    setCurrentTransactionScore(null);
    setSpeechEvaluation(null);
    setFeedbackNotice(null);
    setCustomerPatienceExpired(false);
    setPatienceSeconds(currentScenario.patienceTimeSeconds);

    setCustomerDialogueText({
      ja: currentScenario.customerSpeechJa,
      romaji: currentScenario.customerSpeechRomaji,
      bn: currentScenario.customerSpeechBn
    });

    // Customer arrival chime
    soundEffects.playConbiniChime();

    // Voice announce arrival dialogue in training mode or initial customer greeting
    const timer = setTimeout(() => {
      speakJapanese(currentScenario.customerSpeechJa, { rate: 0.95 });
    }, 400);

    return () => clearTimeout(timer);
  }, [currentScenarioIndex, scenarios]);

  // Real Shift Mode: Customer Patience Countdown
  useEffect(() => {
    if (mode !== 'shift' || isTimerPaused || stage === 'completed' || isPartingCompleted) return;

    const interval = setInterval(() => {
      setPatienceSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCustomerPatienceExpired(true);
          soundEffects.playIncorrectSoft();
          setFeedbackNotice({
            text: 'お客様の待ち時間が限界に達しました！(Patience Expired: Satisfaction -20%)',
            type: 'warn'
          });
          return 0;
        }
        if (prev <= 8) {
          soundEffects.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, isTimerPaused, stage, isPartingCompleted]);

  // Microwave countdown simulation
  useEffect(() => {
    if (!isMicrowaveRunning) return;

    if (microwaveSecondsLeft <= 0) {
      setIsMicrowaveRunning(false);
      setIsBentoHeated(true);
      soundEffects.playMicrowaveChime();
      setFeedbackNotice({
        text: 'ピー、ピー、ピー！ レンジ加熱完了 (Bento heated to 75°C)',
        type: 'success'
      });
      return;
    }

    const timer = setTimeout(() => {
      setMicrowaveSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isMicrowaveRunning, microwaveSecondsLeft]);

  // Calculations
  const subtotal = scannedItems.reduce((acc, item) => acc + item.priceYen, 0);
  const totalAmount = subtotal + bagFee;
  const changeDue = cashTendered !== null && cashTendered >= totalAmount ? cashTendered - totalAmount : 0;
  const allItemsScanned = scannedItems.length === currentScenario.items.length;
  const hasHeatingItem = currentScenario.items.some((i) => i.needsHeating);
  const hasAgeVerificationItem = currentScenario.items.some((i) => i.needsAgeVerification);

  // -----------------------------------------------------------------------------
  // STAGE 1: GREETING (いらっしゃいませ！)
  // -----------------------------------------------------------------------------
  const handleCashierGreeting = (spokenText?: string) => {
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

    // Delay speech slightly to let cashier greeting finish
    setTimeout(() => {
      speakJapanese(greetingResp.customerResponseJa, { rate: 0.95 });
    }, 800);
  };

  // -----------------------------------------------------------------------------
  // STAGE 2: BARCODE SCANNING
  // -----------------------------------------------------------------------------
  const handleScanItem = (item: ConbiniPosProduct) => {
    if (scannedItems.some((s) => s.id === item.id)) return;

    setCurrentlyScanningItemId(item.id);
    soundEffects.playBarcodeBeep();

    setTimeout(() => {
      setScannedItems((prev) => [...prev, item]);
      setCurrentlyScanningItemId(null);

      // Check if all items are scanned
      if (scannedItems.length + 1 === currentScenario.items.length) {
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

  // -----------------------------------------------------------------------------
  // STAGE 3: INTERACTIVE SERVICE INQUIRIES
  // -----------------------------------------------------------------------------
  const handleAskPointCard = () => {
    soundEffects.playButtonTap();
    speakJapanese(currentScenario.dialogueState.pointCard.cashierPromptJa, { rate: 0.9 });
    setIsPointCardAsked(true);

    const pc = currentScenario.dialogueState.pointCard;
    setCustomerDialogueText({
      ja: pc.customerResponseJa,
      romaji: pc.customerResponseRomaji,
      bn: pc.customerResponseBn
    });

    setTimeout(() => {
      speakJapanese(pc.customerResponseJa, { rate: 0.95 });
    }, 800);

    setFeedbackNotice({
      text: pc.hasCard
        ? `お客様: 「${pc.customerResponseJa}」 (+10点 規定手順完了)`
        : `お客様: 「${pc.customerResponseJa}」 (確認完了)`,
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
      // Trigger microwave timer simulation (3s quick test representation)
      setIsMicrowaveRunning(true);
      setMicrowaveSecondsLeft(3);
      setFeedbackNotice({
        text: '業務用1500Wレンジ加熱開始 (Microwave heating in progress...)',
        type: 'info'
      });
    } else {
      setFeedbackNotice({
        text: 'お客様: 温め不要 (No heating requested)',
        type: 'info'
      });
    }
  };

  const handleAskBag = () => {
    soundEffects.playButtonTap();
    speakJapanese(currentScenario.dialogueState.bagSelection.cashierPromptJa, { rate: 0.9 });
    setIsBagAsked(true);

    const bs = currentScenario.dialogueState.bagSelection;
    setCustomerDialogueText({
      ja: bs.customerResponseJa,
      romaji: bs.customerResponseRomaji,
      bn: bs.customerResponseBn
    });

    setTimeout(() => {
      speakJapanese(bs.customerResponseJa, { rate: 0.95 });
    }, 800);

    if (bs.needsBag) {
      setIsBagAdded(true);
      setBagFee(bs.bagFeeYen || 5);
      setFeedbackNotice({
        text: `レジ袋小 (+¥${bs.bagFeeYen || 5}) を加算しました。(Bag added)`,
        type: 'success'
      });
    } else {
      setIsBagAdded(false);
      setBagFee(0);
      setFeedbackNotice({
        text: 'お客様: マイバッグご利用・シール貼付 (No bag needed, tape sticker affixed)',
        type: 'info'
      });
    }
  };

  const handleAskUtensils = () => {
    soundEffects.playButtonTap();
    speakJapanese(currentScenario.dialogueState.utensils.cashierPromptJa, { rate: 0.9 });
    setIsUtensilsAsked(true);
    setIsUtensilsPacked(true);

    const ut = currentScenario.dialogueState.utensils;
    setCustomerDialogueText({
      ja: ut.customerResponseJa,
      romaji: ut.customerResponseRomaji,
      bn: ut.customerResponseBn
    });

    setTimeout(() => {
      speakJapanese(ut.customerResponseJa, { rate: 0.95 });
    }, 800);

    setFeedbackNotice({
      text: `カトラリー梱包完了: 「${ut.customerResponseJa}」`,
      type: 'success'
    });
  };

  const handleAgeVerify = () => {
    soundEffects.playCorrectPing();
    speakJapanese('年齢確認ボタンのタッチをお願いします。', { rate: 0.9 });
    setIsAgeVerified(true);
    setFeedbackNotice({
      text: '20歳以上年齢確認完了 (Age 20+ Verified)',
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
    }
  };

  // Cash Tender Execution
  const handleConfirmCashPayment = () => {
    const entered = parseInt(cashInputValue, 10);
    if (isNaN(entered) || entered < totalAmount) {
      soundEffects.playIncorrectSoft();
      setFeedbackNotice({
        text: `お預かり金額が不足しています！合計 ¥${totalAmount.toLocaleString()} 以上を入力してください。`,
        type: 'warn'
      });
      return;
    }

    setCashTendered(entered);
    setIsDrawerOpen(true);
    soundEffects.playCashDrawerSound();

    const change = entered - totalAmount;
    speakJapanese(`${entered}円お預かりいたします。${change}円のお返しとレシートでございます。`, { rate: 0.9 });

    setTimeout(() => {
      setIsPaymentApproved(true);
      soundEffects.playRegisterSettlement();
      setStage('closing');
    }, 700);
  };

  // Transit IC Card Tap Execution (Suica / Pasmo)
  const handleTapIcCard = () => {
    setIsIcCardTapping(true);
    soundEffects.playButtonTap();

    setTimeout(() => {
      soundEffects.playIcCardChime();
      setIsIcCardTapping(false);
      setIsPaymentApproved(true);
      soundEffects.playRegisterSettlement();
      speakJapanese('Suicaですね。ピピッ！お支払い完了いたしました。', { rate: 0.9 });
      setStage('closing');
    }, 600);
  };

  // Code Payment Phone Barcode Scan (PayPay / d-Barai)
  const handleScanPhoneBarcode = () => {
    setIsPhoneScanning(true);
    soundEffects.playBarcodeBeep();

    setTimeout(() => {
      soundEffects.playPayPaySound();
      setIsPhoneScanning(false);
      setIsPaymentApproved(true);
      soundEffects.playRegisterSettlement();
      speakJapanese('PayPayですね。ペイペイ！お支払い完了いたしました。', { rate: 0.9 });
      setStage('closing');
    }, 600);
  };

  // Credit Card Chip Read Execution
  const handleInsertCreditCard = () => {
    setIsCreditChipReading(true);
    soundEffects.playButtonTap();

    setTimeout(() => {
      soundEffects.playCreditCardChipSound();
      setIsCreditChipReading(false);
      setIsPaymentApproved(true);
      soundEffects.playRegisterSettlement();
      speakJapanese('クレジットカード承認完了いたしました。', { rate: 0.9 });
      setStage('closing');
    }, 700);
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

  // -----------------------------------------------------------------------------
  // SPEECH RECOGNITION DRILL (WEB SPEECH API)
  // -----------------------------------------------------------------------------
  const handleTapToSpeakTarget = (targetPhraseJa: string, onMatchAction: () => void) => {
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
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          setFeedbackNotice({
            text: `🎙️ マイク起動中... 「${targetPhraseJa}」と発音してください`,
            type: 'info'
          });
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join('');
          setIsListening(false);
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
    <div id="conbini-shift-simulator" className="w-full max-w-6xl mx-auto space-y-6">
      {/* 1. Simulator Top Navigation Bar & Mode Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  NIHOMI CONBINI WORKOS™
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentScenario.locationContextJa}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-100 mt-0.5">
                コンビニ実務・セミセルフレジ接客シミュレーター
              </h2>
            </div>
          </div>

          {/* Mode Switcher Toggle: 研修モード vs 本番シフト */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <div className="inline-flex p-1 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setMode('training');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  mode === 'training'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>研修モード (Training)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setMode('shift');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
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

        {/* Scenario Carousel / Quick Switcher */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                <span className="truncate max-w-[140px]">{sc.customerName}</span>
                {idx === 4 && <span className="text-[9px] bg-rose-500/30 text-rose-300 px-1 rounded font-mono">RUSH</span>}
              </button>
            );
          })}
        </div>

        {/* Real Shift Active Patience Meter Bar */}
        {mode === 'shift' && (
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Clock className={`w-4 h-4 ${patienceSeconds <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
              <span>お客様の忍耐メーター (Customer Patience):</span>
              <span className={`font-mono text-sm font-black ${patienceSeconds <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                {patienceSeconds}s
              </span>
            </div>

            <div className="flex-1 max-w-xs bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-1000 ${
                  patienceSeconds <= 10
                    ? 'bg-rose-500 animate-pulse'
                    : patienceSeconds <= 20
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{
                  width: `${Math.min(100, (patienceSeconds / currentScenario.patienceTimeSeconds) * 100)}%`
                }}
              />
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              日本語のみ • ノーヒント実践
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive Cashier Workflow Stepper Navigation */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-xs font-bold">
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

      {/* 3. Main Workspace: Customer Counter (Left) & POS Cashier Terminal (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================================
            LEFT COLUMN (5 Cols): Customer Counter, Dialogue Bubble & Conveyor Belt
           ========================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* Customer Avatar & Live Speech Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentScenario.avatarBgColor} p-1 shadow-lg flex items-center justify-center`}>
                  <span className="text-3xl">{currentScenario.avatarEmoji}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-100 text-base truncate">
                    {currentScenario.customerName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => speakJapanese(customerDialogueText.ja)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                    title="音声を聞く (Play Speech)"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-amber-400/90 mt-0.5 font-medium">
                  {currentScenario.roleTitleJa}
                </div>
                {mode === 'training' && (
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {currentScenario.roleTitleBn}
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Customer Speech Bubble */}
            <div className="mt-4 p-4 bg-slate-950/80 border border-amber-500/25 rounded-2xl space-y-1.5 shadow-inner relative">
              <div className="text-sm font-bold text-slate-100 leading-snug">
                「{customerDialogueText.ja}」
              </div>

              {mode === 'training' && (
                <>
                  <div className="text-xs text-amber-400/80 font-mono">
                    {customerDialogueText.romaji}
                  </div>
                  <div className="text-xs text-slate-300">
                    {customerDialogueText.bn}
                  </div>
                </>
              )}
            </div>

            {/* Workplace Keigo Pro-Tip Banner (Training Mode Only) */}
            {mode === 'training' && currentScenario.workplaceProTip && (
              <div className="mt-3.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{currentScenario.workplaceProTip.titleJa} ({currentScenario.workplaceProTip.titleBn})</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {currentScenario.workplaceProTip.explanationBn}
                </p>
                <div className="text-[11px] text-emerald-400 font-mono">
                  {currentScenario.workplaceProTip.keigoRuleJa}
                </div>
              </div>
            )}
          </div>

          {/* Microwave Commercial Oven Simulation Component */}
          {hasHeatingItem && (isMicrowaveRunning || isBentoHeated) && (
            <div className="bg-slate-900/90 border border-rose-500/40 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>業務用電子レンジ (Commercial Microwave 1500W)</span>
                </div>
                {isBentoHeated ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ✓ 加熱完了 75°C
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                    加熱中... {microwaveSecondsLeft}s
                  </span>
                )}
              </div>

              {/* Microwave Chamber Visual */}
              <div className="relative h-24 rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden flex items-center justify-center">
                {isMicrowaveRunning && (
                  <div className="absolute inset-0 bg-amber-500/15 animate-pulse flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-amber-400/40 border-t-amber-400 animate-spin"></div>
                  </div>
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-4xl">{isBentoHeated ? '♨️ 🍱' : '🍱'}</span>
                  <div className="font-mono text-xs text-slate-300">
                    <div>特製から揚げ弁当</div>
                    <div className="text-amber-400">
                      {isMicrowaveRunning ? `残り時間: 00:0${microwaveSecondsLeft}` : '温め完了・取り出し可能'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conveyor Belt & Item Scanning Area */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>レジ前商品 (Conveyor Belt Items)</span>
              </div>
              <button
                type="button"
                onClick={handleScanAllItems}
                className="px-2.5 py-1 text-xs font-bold rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition flex items-center gap-1"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>一括スキャン (Scan All)</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {currentScenario.items.map((item, idx) => {
                const isScanned = scannedItems.some((s) => s.id === item.id);
                const isScanning = currentlyScanningItemId === item.id;

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className={`relative p-3 rounded-2xl border transition overflow-hidden flex items-center justify-between ${
                      isScanned
                        ? 'bg-slate-950/40 border-emerald-500/30 opacity-75'
                        : 'bg-slate-950 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    {/* Laser scanning beam line effect */}
                    {isScanning && (
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 0.28, ease: 'linear' }}
                        className="absolute inset-y-0 w-2 bg-gradient-to-r from-red-500 via-rose-300 to-red-500 shadow-lg shadow-red-500/80 z-20 pointer-events-none"
                      />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-3xl shrink-0">{item.imageIcon}</div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-200 truncate">{item.nameJa}</div>
                        {mode === 'training' && (
                          <div className="text-[10px] text-slate-400 truncate">{item.nameBn}</div>
                        )}
                        <div className="text-xs font-black text-amber-400 font-mono mt-0.5">
                          ¥{item.priceYen.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isScanned || isScanning}
                      onClick={() => handleScanItem(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                        isScanned
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md font-black'
                      }`}
                    >
                      {isScanned ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>スキャン済</span>
                        </>
                      ) : (
                        <>
                          <Scan className="w-3.5 h-3.5" />
                          <span>スキャン</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (7 Cols): Dual-Screen POS Register & Semi-Self Payment Engine
           ========================================================================= */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Cashier Top Screen: Itemized POS Receipt Feed */}
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    NIHOMI 7-POS TOUCH #01
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-amber-400">{new Date().toLocaleTimeString()}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                    レジ01
                  </span>
                </div>
              </div>

              {/* Itemized Scanned Lines */}
              <div className="min-h-28 max-h-40 overflow-y-auto space-y-1.5 text-xs font-mono">
                {scannedItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 italic">
                    バーコードをスキャンしてください (Awaiting barcode scan...)
                  </div>
                ) : (
                  <>
                    {scannedItems.map((item, i) => (
                      <div key={`scanned-${item.id}-${i}`} className="flex justify-between items-center text-slate-200">
                        <span className="truncate pr-2">{item.nameJa}</span>
                        <span className="text-amber-400 font-bold shrink-0">¥{item.priceYen.toLocaleString()}</span>
                      </div>
                    ))}

                    {isBagAdded && (
                      <div className="flex justify-between items-center text-cyan-300 border-t border-dashed border-slate-800 pt-1">
                        <span>レジ袋小 (Plastic Bag)</span>
                        <span className="font-bold">¥{bagFee}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Subtotal & Total Display */}
              <div className="border-t border-slate-800 pt-3 mt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-300">合計金額 (TOTAL DUE):</span>
                  <span className="text-[10px] text-slate-500 ml-2 font-mono">(うち消費税等 8%/10%)</span>
                </div>
                <span className="text-3xl font-black text-amber-400 tracking-tight font-mono">
                  ¥{totalAmount.toLocaleString()}
                </span>
              </div>

              {cashTendered !== null && (
                <div className="mt-2 pt-2 border-t border-dashed border-slate-800 flex justify-between text-xs font-mono text-emerald-400">
                  <span>お預かり (Tendered): ¥{cashTendered.toLocaleString()}</span>
                  <span>お釣り (Change): ¥{changeDue.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Notification / Feedback Banner */}
            {feedbackNotice && (
              <div
                className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                  feedbackNotice.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : feedbackNotice.type === 'warn'
                    ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                    : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{feedbackNotice.text}</span>
              </div>
            )}

            {/* -------------------------------------------------------------------
                DYNAMIC INTERACTION CONSOLE (BY STAGE)
               ------------------------------------------------------------------- */}

            {/* STAGE 1: GREETING CONSOLE */}
            {stage === 'greeting' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    <span>ステップ 1: お客様来店・挨拶 (Customer Greeting)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">必須コール</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-100">
                      「いらっしゃいませ！」 (Irasshaimase!)
                    </div>
                    {mode === 'training' && (
                      <div className="text-xs text-slate-400 mt-0.5">
                        স্বাগতম! গ্রাহক কাউন্টারে আসার সাথে সাথে বলুন।
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCashierGreeting()}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md text-xs transition"
                    >
                      挨拶する (Greet)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTapToSpeakTarget('いらっしゃいませ！', () => handleCashierGreeting())}
                      className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-amber-400'
                      }`}
                      title="声を出して発音練習"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: SCANNING CONSOLE */}
            {stage === 'scanning' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Scan className="w-4 h-4" />
                    <span>ステップ 2: バーコードスキャン (Scan Barcodes)</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {scannedItems.length} / {currentScenario.items.length} 完了
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  左側のコンベアベルトから商品をタップしてスキャンしてください。
                </p>
              </div>
            )}

            {/* STAGE 3: INTERACTIVE SERVICE INQUIRIES CONSOLE */}
            {stage === 'service' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>ステップ 3: 接客確認 (Service Dialogue Prompts)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">お客様へ質問してください</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Point Card Check */}
                  <button
                    type="button"
                    onClick={handleAskPointCard}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isPointCardAsked
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 hover:border-amber-500 text-slate-200'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-mono">① ポイントカード確認</div>
                    <div className="font-bold text-xs mt-1">「カードはお持ちですか？」</div>
                    <div className="text-[10px] text-amber-400/90 mt-1">Point Card Inquiry</div>
                  </button>

                  {/* Bento Warming Check */}
                  <button
                    type="button"
                    disabled={!hasHeatingItem}
                    onClick={handleAskBentoWarming}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      !hasHeatingItem
                        ? 'bg-slate-900/30 border-slate-800/40 text-slate-600 cursor-not-allowed'
                        : isBentoWarmAsked
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                        : 'bg-slate-900 border-slate-800 hover:border-rose-500 text-slate-200'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-mono">② 温め確認 (Bento Warming)</div>
                    <div className="font-bold text-xs mt-1">「お弁当温めますか？」</div>
                    <div className="text-[10px] text-rose-400/90 mt-1">Microwave Warm Check</div>
                  </button>

                  {/* Bag Check */}
                  <button
                    type="button"
                    onClick={handleAskBag}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isBagAsked
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 hover:border-cyan-500 text-slate-200'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-mono">③ レジ袋確認 (+¥5)</div>
                    <div className="font-bold text-xs mt-1">「レジ袋はご利用ですか？」</div>
                    <div className="text-[10px] text-cyan-400/90 mt-1">Plastic Bag Inquiry</div>
                  </button>

                  {/* Utensils Check */}
                  <button
                    type="button"
                    onClick={handleAskUtensils}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isUtensilsAsked
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                        : 'bg-slate-900 border-slate-800 hover:border-purple-500 text-slate-200'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 font-mono">④ お箸・スプーン確認</div>
                    <div className="font-bold text-xs mt-1">「お箸はお付けしますか？」</div>
                    <div className="text-[10px] text-purple-400/90 mt-1">Chopsticks / Spoon Check</div>
                  </button>
                </div>

                {/* Age Verification Required (if alcohol/tobacco) */}
                {hasAgeVerificationItem && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-300">酒類・タバコ 年齢確認必須</div>
                      <div className="text-[11px] text-slate-400">「画面の確認ボタンにタッチをお願いします」</div>
                    </div>
                    <button
                      type="button"
                      disabled={isAgeVerified}
                      onClick={handleAgeVerify}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isAgeVerified
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow'
                      }`}
                    >
                      {isAgeVerified ? '✓ 確認完了' : '20歳以上タッチ'}
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 transition"
                >
                  <span>お会計に進む (Proceed to Payment)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STAGE 4: CUSTOMER-FACING TOUCHSCREEN PAYMENT ENGINE */}
            {stage === 'payment' && (
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 border-2 border-cyan-500/40 space-y-4 shadow-inner">
                {/* Semi-self customer display header */}
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                    お客様側タッチパネル画面 (Customer-Facing Touchscreen)
                  </div>
                  <h3 className="text-lg font-black text-slate-100">
                    お支払い方法をお選びください
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Please select your payment method / পেমেন্ট মাধ্যম নির্বাচন করুন
                  </p>
                </div>

                {/* 4 Authentic Japanese Payment Channels */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('cash')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition ${
                      activePaymentMethod === 'cash'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500/40'
                    }`}
                  >
                    <Coins className="w-6 h-6 text-emerald-400" />
                    <div className="text-xs font-black">現金 (Cash)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('suica')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition ${
                      activePaymentMethod === 'suica'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/40'
                    }`}
                  >
                    <CardIcon className="w-6 h-6 text-cyan-400" />
                    <div className="text-xs font-black">交通系IC (Suica)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('paypay')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition ${
                      activePaymentMethod === 'paypay'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-rose-500/40'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 text-rose-400" />
                    <div className="text-xs font-black">バーコード (PayPay)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('credit')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition ${
                      activePaymentMethod === 'credit'
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 ring-2 ring-purple-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-purple-500/40'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-purple-400" />
                    <div className="text-xs font-black">クレジットカード</div>
                  </button>
                </div>

                {/* Sub-Panel: Channel-Specific Interactive Engine */}
                {activePaymentMethod === 'cash' && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Coins className="w-4 h-4" />
                        <span>現金投入・お預かり金額入力 (Cash Tender Engine)</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        請求額: ¥{totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={cashInputValue}
                        onChange={(e) => setCashInputValue(e.target.value)}
                        placeholder="受取金額を入力 (e.g. 10000)"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleConfirmCashPayment}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition shrink-0"
                      >
                        お預かり確定 (Tender)
                      </button>
                    </div>

                    {/* Quick Bill Selectors */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[totalAmount, 1000, 2000, 5000, 10000].map((amt) => {
                        if (amt < totalAmount && amt !== totalAmount) return null;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setCashInputValue(amt.toString())}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 hover:border-emerald-500 transition"
                          >
                            {amt === totalAmount ? 'ちょうど (Exact)' : `¥${amt.toLocaleString()} 札`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activePaymentMethod === 'suica' && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-center space-y-3">
                    <div className="text-xs font-bold text-cyan-400">
                      交通系ICカード端末 (Suica / Pasmo Contactless Reader)
                    </div>
                    <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/30 flex flex-col items-center justify-center gap-2">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl transition-all ${
                        isIcCardTapping
                          ? 'border-emerald-400 bg-emerald-500/20 animate-pulse text-emerald-300'
                          : 'border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      }`}>
                        💳
                      </div>
                      <span className="text-xs font-bold text-slate-200">
                        {isIcCardTapping ? '通信中... (Reading IC chip...)' : '端末の青い光にタッチしてください'}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={isIcCardTapping}
                      onClick={handleTapIcCard}
                      className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition"
                    >
                      端末にタッチ (Tap IC Card)
                    </button>
                  </div>
                )}

                {activePaymentMethod === 'paypay' && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/40 text-center space-y-3">
                    <div className="text-xs font-bold text-rose-400">
                      バーコード決済 (PayPay / Smartphone Code Scanner)
                    </div>
                    <div className="p-3 bg-slate-950 rounded-2xl border border-rose-500/30 flex items-center justify-center gap-4">
                      <div className="p-2 rounded-xl bg-white text-slate-950 font-mono text-center">
                        <div className="text-xs font-bold">PayPay</div>
                        <div className="text-xl tracking-tighter">||| | | |||| | ||</div>
                      </div>
                      <div className="text-left text-xs">
                        <div className="font-bold text-slate-200">お客様のスマホ画面</div>
                        <div className="text-slate-400 text-[10px]">ハンドスキャナーで読み取ります</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isPhoneScanning}
                      onClick={handleScanPhoneBarcode}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs shadow-md transition"
                    >
                      スマホバーコードをスキャン (Scan Phone)
                    </button>
                  </div>
                )}

                {activePaymentMethod === 'credit' && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-center space-y-3">
                    <div className="text-xs font-bold text-purple-400">
                      クレジットカード端末 (IC Chip / Contactless Reader)
                    </div>
                    <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 flex items-center justify-center gap-3">
                      <CreditCard className="w-8 h-8 text-purple-400" />
                      <div className="text-left text-xs">
                        <div className="font-bold text-slate-200">ICチップ挿入またはタッチ</div>
                        <div className="text-slate-400 text-[10px]">VISA / Mastercard / JCB 対応</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isCreditChipReading}
                      onClick={handleInsertCreditCard}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs shadow-md transition"
                    >
                      カード挿入 / タッチ (Insert / Tap Card)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 5: CLOSING & HANDOVER CONSOLE */}
            {stage === 'closing' && (
              <div className="p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    <span>ステップ 5: レシート発行・お見送り (Receipt & Closing)</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">✓ 精算完了</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-300">
                    店員の締め挨拶:
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    「ありがとうございました！またお越しくださいませ！」
                  </div>
                  {mode === 'training' && (
                    <div className="text-[11px] text-slate-400">
                      অনেক ধন্যবাদ! আবার আসবেন! (পাস্ট টেন্সে ありがとうございました বলুন)
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isReceiptPrinting}
                  onClick={handlePrintReceiptAndClose}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 transition"
                >
                  <Receipt className={`w-4 h-4 ${isReceiptPrinting ? 'animate-bounce' : ''}`} />
                  <span>
                    {isReceiptPrinting ? 'レシート印刷中... (Printing...)' : 'レシート手渡し & 見送り (Complete Order)'}
                  </span>
                </button>
              </div>
            )}

            {/* STAGE 6: COMPLETED ORDER REVIEW */}
            {stage === 'completed' && (
              <div className="p-5 rounded-3xl bg-slate-950 border-2 border-amber-500/50 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h4 className="text-base font-black text-slate-100">
                        接客対応 完了 (Transaction Completed!)
                      </h4>
                      <p className="text-xs text-slate-400">
                        {currentScenario.customerName} 様の精算が正常に終了しました。
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Satisfaction</div>
                    <div className="text-2xl font-black text-amber-400">
                      {currentTransactionScore}%
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">獲得Nihomi XP:</span>
                  <span className="font-bold text-amber-400">+50 XP (バイト即戦力 +5 pts)</span>
                </div>

                <button
                  type="button"
                  onClick={handleAdvanceToNextCustomer}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 transition text-sm"
                >
                  <span>
                    {currentScenarioIndex < scenarios.length - 1
                      ? '次のお客様へ (Next Customer)'
                      : 'シフト終了・総合成績表を見る (View Shift Scorecard)'}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. End-of-Shift Performance Scorecard Modal */}
      {showShiftScorecardModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                    NIHOMI CONBINI SHIFT REPORT
                  </div>
                  <h3 className="text-lg font-black">
                    本番シフト成績表 (Shift Performance Scorecard)
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShiftScorecardModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Key Performance Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">スキャン速度・正確性</div>
                <div className="text-2xl font-black text-amber-400 mt-1">
                  {shiftStats.customersServed > 0
                    ? Math.round(shiftStats.scanningAccuracySum / shiftStats.customersServed)
                    : 100}%
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Scanning Speed</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">接客敬語スコア</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                  {shiftStats.customersServed > 0
                    ? Math.round(shiftStats.keigoServiceScoreSum / shiftStats.customersServed)
                    : 100}%
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Keigo Service</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">金銭・決済処理正確性</div>
                <div className="text-2xl font-black text-purple-400 mt-1">
                  {shiftStats.customersServed > 0
                    ? Math.round(shiftStats.paymentAccuracySum / shiftStats.customersServed)
                    : 100}%
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Payment Handling</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">顧客満足度</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {shiftStats.customersServed > 0
                    ? Math.round(shiftStats.satisfactionScoreSum / shiftStats.customersServed)
                    : 100}%
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Satisfaction Rating</div>
              </div>
            </div>

            {/* Total Revenue & Nihomi XP */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-emerald-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">総レジ売上金額 (Shift Sales):</div>
                <div className="text-xl font-black text-amber-400 font-mono">
                  ¥{shiftStats.totalSalesYen.toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">獲得 Nihomi XP:</div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  +{shiftStats.earnedXp || 150} XP
                </div>
              </div>
            </div>

            {/* Store Manager Yamamoto-san Review */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="text-3xl shrink-0">👨‍💼</span>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-300">
                  山本店長からのフィードバック (Store Manager Review):
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  「お疲れ様でした！挨拶の声の通りも良く、セミセルフレジの誘導もスムーズでした。東京の店舗でも即戦力としてシフトに入れますよ！」
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestartShift}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-xl transition text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>もう一度シフトに入る (Restart Shift)</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ConbiniPosCashierSimulator;
