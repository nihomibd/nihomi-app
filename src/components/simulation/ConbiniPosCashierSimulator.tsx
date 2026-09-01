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
  UserCheck
} from 'lucide-react';
import { ConbiniPosProduct, ConbiniCustomerOrder } from '../../types';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';

interface ConbiniPosCashierSimulatorProps {
  onCompleteOrder?: (score: number, yenTotal: number) => void;
}

export const ConbiniPosCashierSimulator: React.FC<ConbiniPosCashierSimulatorProps> = ({
  onCompleteOrder
}) => {
  const [orders, setOrders] = useState<ConbiniCustomerOrder[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [scannedItems, setScannedItems] = useState<ConbiniPosProduct[]>([]);
  const [isBentoHeated, setIsBentoHeated] = useState(false);
  const [isBagAdded, setIsBagAdded] = useState(false);
  const [isChopsticksGiven, setIsChopsticksGiven] = useState(false);
  const [isPointCardAsked, setIsPointCardAsked] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'suica' | 'paypay' | 'credit' | null>(null);
  const [cashTendered, setCashTendered] = useState<number | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [shiftStats, setShiftStats] = useState({
    customersServed: 0,
    totalSalesYen: 0,
    perfectTransactions: 0,
    satisfactionScore: 100
  });

  const [activePromptSpeech, setActivePromptSpeech] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'warn' | 'info' } | null>(null);

  // Fetch initial orders
  useEffect(() => {
    fetch('/api/baito/conbini/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        }
      })
      .catch(() => {
        // Fallback default
      });
  }, []);

  const currentOrder = orders[currentOrderIndex];

  // Play customer dialogue when current order changes
  useEffect(() => {
    if (currentOrder) {
      setScannedItems([]);
      setIsBentoHeated(false);
      setIsBagAdded(false);
      setIsChopsticksGiven(false);
      setIsPointCardAsked(false);
      setIsAgeVerified(false);
      setSelectedPayment(null);
      setCashTendered(null);
      setOrderCompleted(false);

      // Auto speak customer dialogue
      speakJapanese(currentOrder.customerSpeechJa, { rate: 0.95 });
      setActivePromptSpeech(currentOrder.customerSpeechJa);
    }
    return () => {
      stopJapaneseSpeech();
    };
  }, [currentOrderIndex, orders]);

  // Total amount calculated from scanned items
  const subtotal = scannedItems.reduce((acc, item) => acc + item.priceYen, 0);
  const bagPrice = isBagAdded ? 5 : 0;
  const totalAmount = subtotal + bagPrice;
  const changeDue = (cashTendered && cashTendered >= totalAmount) ? cashTendered - totalAmount : 0;

  const handleScanItem = (item: ConbiniPosProduct) => {
    soundEffects.playBarcodeBeep();
    setScannedItems((prev) => [...prev, item]);
    setFeedbackMessage({
      text: `スキャン完了: ${item.nameJa} (¥${item.priceYen})`,
      type: 'info'
    });
  };

  const handleScanAll = () => {
    if (!currentOrder) return;
    soundEffects.playBarcodeBeep();
    setScannedItems([...currentOrder.items]);
    setFeedbackMessage({
      text: '全商品をスキャンしました！(All items scanned)',
      type: 'info'
    });
  };

  const handleAskPointCard = () => {
    soundEffects.playButtonTap();
    speakJapanese('ポイントカードはお持ちですか？', { rate: 0.9 });
    setIsPointCardAsked(true);
    if (currentOrder.hasPointCard) {
      setFeedbackMessage({
        text: `お客様: 「はい、${currentOrder.pointCardName || 'ポイントカード'}持っています」 (+10点 接客満点)`,
        type: 'success'
      });
    } else {
      setFeedbackMessage({
        text: 'お客様: 「持っていません」 (丁寧な確認Good!)',
        type: 'info'
      });
    }
  };

  const handleToggleMicrowave = () => {
    soundEffects.playButtonTap();
    speakJapanese('お弁当温めますか？', { rate: 0.9 });
    setIsBentoHeated(true);
    setFeedbackMessage({
      text: 'チン！レンジ加熱を開始しました (Heated in microwave)',
      type: 'success'
    });
  };

  const handleToggleBag = () => {
    soundEffects.playButtonTap();
    speakJapanese('レジ袋はお付けしますか？5円になります。', { rate: 0.9 });
    setIsBagAdded((prev) => !prev);
  };

  const handleGiveChopsticks = () => {
    soundEffects.playButtonTap();
    speakJapanese('お箸をお付けいたします。', { rate: 0.9 });
    setIsChopsticksGiven(true);
    setFeedbackMessage({
      text: '割り箸をお渡ししました (Chopsticks provided)',
      type: 'info'
    });
  };

  const handleAgeVerify = () => {
    soundEffects.playCorrectPing();
    speakJapanese('年齢確認ボタンのタッチをお願いします。', { rate: 0.9 });
    setIsAgeVerified(true);
    setFeedbackMessage({
      text: '20歳以上確認完了 (Age 20+ Verified)',
      type: 'success'
    });
  };

  const handleProcessPayment = (method: 'cash' | 'suica' | 'paypay' | 'credit') => {
    setSelectedPayment(method);
    soundEffects.playRegisterSettlement();

    if (method === 'cash') {
      const given = currentOrder.tenderedCashAmount || Math.ceil(totalAmount / 1000) * 1000;
      setCashTendered(given);
      speakJapanese(`${given}円お預かりいたします。${given - totalAmount}円のお返しとレシートでございます。`, { rate: 0.9 });
    } else if (method === 'suica') {
      speakJapanese('Suicaですね。ピピッ！お支払い完了です。レシートのお渡しです。', { rate: 0.9 });
    } else if (method === 'paypay') {
      speakJapanese('PayPayですね。ペイペイ！ありがとうございました。', { rate: 0.9 });
    } else {
      speakJapanese('クレジットカードですね。ありがとうございました。', { rate: 0.9 });
    }

    setOrderCompleted(true);
    soundEffects.playLessonCelebration();

    // Calculate score for this transaction
    let penalty = 0;
    if (currentOrder.wantsBentoHeated && !isBentoHeated) penalty += 20;
    if (currentOrder.needsBag && !isBagAdded) penalty += 15;
    if (currentOrder.hasPointCard && !isPointCardAsked) penalty += 10;
    const hasAlcohol = currentOrder.items.some((i) => i.needsAgeVerification);
    if (hasAlcohol && !isAgeVerified) penalty += 30;

    const score = Math.max(50, 100 - penalty);

    setShiftStats((prev) => ({
      customersServed: prev.customersServed + 1,
      totalSalesYen: prev.totalSalesYen + totalAmount,
      perfectTransactions: score === 100 ? prev.perfectTransactions + 1 : prev.perfectTransactions,
      satisfactionScore: Math.round((prev.satisfactionScore * prev.customersServed + score) / (prev.customersServed + 1))
    }));

    if (onCompleteOrder) {
      onCompleteOrder(score, totalAmount);
    }
  };

  const handleNextCustomer = () => {
    if (currentOrderIndex < orders.length - 1) {
      setCurrentOrderIndex((prev) => prev + 1);
    } else {
      setCurrentOrderIndex(0); // loop
    }
  };

  if (!currentOrder) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Clock className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-400" />
        <p>コンビニPOS端末を起動中... (Booting Conbini POS)</p>
      </div>
    );
  }

  const needsAgeCheck = currentOrder.items.some((i) => i.needsAgeVerification);
  const hasBento = currentOrder.items.some((i) => i.needsHeating);

  return (
    <div id="conbini-pos-cashier-simulator" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Shift Dashboard Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">接客数 (Customers)</div>
            <div className="text-lg font-bold text-slate-100">{shiftStats.customersServed} <span className="text-xs text-slate-400 font-normal">名</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">売上総額 (Total Sales)</div>
            <div className="text-lg font-bold text-emerald-400">¥{shiftStats.totalSalesYen.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">満足度 (Satisfaction)</div>
            <div className="text-lg font-bold text-cyan-400">{shiftStats.satisfactionScore}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">満点接客 (Perfect)</div>
            <div className="text-lg font-bold text-purple-300">{shiftStats.perfectTransactions} 回</div>
          </div>
        </div>
      </div>

      {/* Main POS Register Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer & Conveyor Belt (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Customer Avatar & Speech Bubble */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
                    {currentOrder.customerType === 'salaryman' && '👔'}
                    {currentOrder.customerType === 'student' && '🎒'}
                    {currentOrder.customerType === 'grandma' && '👵'}
                    {currentOrder.customerType === 'foreigner' && '🌍'}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-200 text-sm">{currentOrder.customerName}</h4>
                  <button
                    onClick={() => speakJapanese(currentOrder.customerSpeechJa)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                    title="音声を聞く (Play Speech)"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-amber-400/90 mt-0.5">来店中のお客様 (Current Customer)</div>
              </div>
            </div>

            {/* Dialogue Bubble */}
            <div className="mt-4 p-3.5 bg-slate-950/70 border border-amber-500/20 rounded-xl space-y-1">
              <div className="text-sm font-medium text-slate-100">{currentOrder.customerSpeechJa}</div>
              <div className="text-xs text-amber-400/80 font-mono">{currentOrder.customerSpeechRomaji}</div>
              <div className="text-xs text-slate-400">{currentOrder.customerSpeechBn}</div>
            </div>

            {/* Customer Demands Pills */}
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              {currentOrder.wantsBentoHeated && (
                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> 温め希望 (Heat Bento)
                </span>
              )}
              {currentOrder.needsBag && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  🛍️ 袋必要 (Needs Bag)
                </span>
              )}
              {currentOrder.hasPointCard && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  💳 {currentOrder.pointCardName || 'ポイントカード'}有
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                💰 支払: {currentOrder.paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Customer Items on Counter */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                レジ前商品 (Items on Belt)
              </div>
              <button
                onClick={handleScanAll}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition flex items-center gap-1"
              >
                <Scan className="w-3.5 h-3.5" /> 一括スキャン (Scan All)
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {currentOrder.items.map((item, idx) => {
                const isScanned = scannedItems.some((s, sIdx) => s.id === item.id && sIdx === idx);
                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                      isScanned
                        ? 'bg-slate-950/40 border-emerald-500/30 opacity-70'
                        : 'bg-slate-950 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{item.imageIcon}</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{item.nameJa}</div>
                        <div className="text-[10px] text-slate-400">{item.nameBn}</div>
                        <div className="text-[10px] text-amber-400 font-mono">¥{item.priceYen}</div>
                      </div>
                    </div>

                    <button
                      disabled={isScanned}
                      onClick={() => handleScanItem(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                        isScanned
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-md'
                      }`}
                    >
                      {isScanned ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> スキャン済
                        </>
                      ) : (
                        <>
                          <Scan className="w-3.5 h-3.5" /> スキャン
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Touch POS Register Terminal (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 flex flex-col justify-between">
          {/* POS Top Screen Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-mono font-bold text-slate-300">NIHOMI 7-POS TERMINAL #01</span>
              </div>
              <span className="text-xs text-amber-400 font-mono">{new Date().toLocaleTimeString()}</span>
            </div>

            {/* Receipt Itemized Feed */}
            <div className="min-h-24 max-h-36 overflow-y-auto space-y-1 text-xs font-mono">
              {scannedItems.length === 0 ? (
                <div className="text-center py-6 text-slate-500 italic">
                  バーコードをスキャンしてください (Awaiting barcode scan...)
                </div>
              ) : (
                <>
                  {scannedItems.map((item, i) => (
                    <div key={`scanned-${i}`} className="flex justify-between text-slate-200">
                      <span>{item.nameJa}</span>
                      <span className="text-amber-400">¥{item.priceYen}</span>
                    </div>
                  ))}
                  {isBagAdded && (
                    <div className="flex justify-between text-cyan-300">
                      <span>レジ袋小 (Plastic Bag)</span>
                      <span>¥5</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Total Display */}
            <div className="border-t border-slate-800 pt-3 mt-2 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-300">合計金額 (TOTAL DUE):</span>
              <span className="text-2xl font-black text-amber-400 tracking-tight font-mono">
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>

            {cashTendered !== null && (
              <div className="mt-1 pt-1 border-t border-dashed border-slate-800 flex justify-between text-xs font-mono text-emerald-400">
                <span>お預かり (Tendered): ¥{cashTendered}</span>
                <span>お釣り (Change): ¥{changeDue}</span>
              </div>
            )}
          </div>

          {/* Feedback & Keigo Guide Box */}
          {feedbackMessage && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : feedbackMessage.type === 'warn'
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Interactive POS Function Keypad */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              接客アクションキー (Cashier Service Buttons)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* 1. Point Card Button */}
              <button
                onClick={handleAskPointCard}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isPointCardAsked
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950 border-slate-800 hover:border-amber-500/40 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-400">ポイントカード</div>
                <div className="font-bold text-xs mt-1">「カードはお持ち？」</div>
                <div className="text-[10px] text-amber-400/80 mt-1">Point Card Check</div>
              </button>

              {/* 2. Microwave Warm Button */}
              <button
                disabled={!hasBento}
                onClick={handleToggleMicrowave}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  !hasBento
                    ? 'bg-slate-950/30 border-slate-800/40 text-slate-600 cursor-not-allowed'
                    : isBentoHeated
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                    : 'bg-slate-950 border-slate-800 hover:border-rose-500/40 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-400">レンジ加熱</div>
                <div className="font-bold text-xs mt-1">「温めますか？」</div>
                <div className="text-[10px] text-rose-400/80 mt-1">Microwave Warm</div>
              </button>

              {/* 3. Bag & Chopsticks Button */}
              <button
                onClick={handleToggleBag}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isBagAdded
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 hover:border-cyan-500/40 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-400">レジ袋 (+¥5)</div>
                <div className="font-bold text-xs mt-1">「袋は付けますか？」</div>
                <div className="text-[10px] text-cyan-400/80 mt-1">Bag Selector</div>
              </button>

              {/* 4. Chopsticks Button */}
              <button
                onClick={handleGiveChopsticks}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isChopsticksGiven
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-950 border-slate-800 hover:border-purple-500/40 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-400">お箸・スプーン</div>
                <div className="font-bold text-xs mt-1">「お箸をお付け」</div>
                <div className="text-[10px] text-purple-400/80 mt-1">Chopsticks / Spoon</div>
              </button>
            </div>

            {/* Age Verification Banner if Alcohol Present */}
            {needsAgeCheck && (
              <div className="p-3 bg-amber-500/10 border-2 border-amber-500/40 rounded-xl flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-amber-300">酒類・タバコ 年齢確認必須 (20+ Age Check)</div>
                    <div className="text-[10px] text-slate-400">「年齢確認ボタンのタッチをお願いします」</div>
                  </div>
                </div>
                <button
                  disabled={isAgeVerified}
                  onClick={handleAgeVerify}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isAgeVerified
                      ? 'bg-emerald-500 text-slate-950 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                  }`}
                >
                  {isAgeVerified ? '✓ 確認完了' : '20歳以上タッチ'}
                </button>
              </div>
            )}
          </div>

          {/* Payment Method Keypad & Settlement */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              お会計選択 (Payment Tender)
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                disabled={scannedItems.length === 0 || orderCompleted}
                onClick={() => handleProcessPayment('cash')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-200 hover:text-emerald-400 transition flex flex-col items-center gap-1 disabled:opacity-40"
              >
                <Coins className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold">現金 (Cash)</span>
              </button>

              <button
                disabled={scannedItems.length === 0 || orderCompleted}
                onClick={() => handleProcessPayment('suica')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-200 hover:text-cyan-400 transition flex flex-col items-center gap-1 disabled:opacity-40"
              >
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold">Suica / IC</span>
              </button>

              <button
                disabled={scannedItems.length === 0 || orderCompleted}
                onClick={() => handleProcessPayment('paypay')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-slate-200 hover:text-rose-400 transition flex flex-col items-center gap-1 disabled:opacity-40"
              >
                <Smartphone className="w-5 h-5 text-rose-400" />
                <span className="text-xs font-bold">PayPay</span>
              </button>

              <button
                disabled={scannedItems.length === 0 || orderCompleted}
                onClick={() => handleProcessPayment('credit')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-slate-200 hover:text-purple-400 transition flex flex-col items-center gap-1 disabled:opacity-40"
              >
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold">Credit Card</span>
              </button>
            </div>
          </div>

          {/* Next Customer Button on Order Completion */}
          {orderCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2"
            >
              <button
                onClick={handleNextCustomer}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 transition"
              >
                <span>次のお客様へ (Next Customer)</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
