import React, { useState, useEffect, useRef } from 'react';
import { StudyCircleService, StudyCircleRoom, RoomChatMessage } from '../../lib/studyCirclesService';
import { haptic } from '../../lib/haptic';
import { JLPTLevel } from '../../types';
import {
  Users,
  MessageSquare,
  Trophy,
  Flame,
  Plus,
  Send,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  BookOpen,
  Target,
  ArrowRight
} from 'lucide-react';

interface StudyCirclesTabProps {
  currentUser: {
    id: string;
    name: string;
    level: JLPTLevel;
    streak?: number;
  };
  onNavigate?: (view: string) => void;
}

export const StudyCirclesTab: React.FC<StudyCirclesTabProps> = ({ currentUser, onNavigate }) => {
  const [rooms, setRooms] = useState<StudyCircleRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>('circle-n5-tokyo');
  const [messageText, setMessageText] = useState<string>('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [isCreatingModal, setIsCreatingModal] = useState<boolean>(false);

  // New Circle Form state
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomTopic, setNewRoomTopic] = useState<string>('');
  const [newRoomLevel, setNewRoomLevel] = useState<JLPTLevel>('N5');
  const [newRoomDesc, setNewRoomDesc] = useState<string>('');
  const [newRoomExam, setNewRoomExam] = useState<string>('December 2026');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    const r = StudyCircleService.getRooms();
    setRooms(r);
    if (r.length > 0 && !r.some((rm) => rm.id === activeRoomId)) {
      setActiveRoomId(r[0].id);
    }
  };

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeRoom?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRoom) return;

    StudyCircleService.sendMessage(activeRoom.id, {
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: messageText.trim()
    });

    setMessageText('');
    haptic.trigger('light');
    loadRooms();
  };

  const handleJoinCircle = (roomId: string) => {
    StudyCircleService.joinRoom(roomId, {
      id: currentUser.id,
      name: currentUser.name,
      streak: currentUser.streak
    });
    setActiveRoomId(roomId);
    haptic.trigger('success');
    loadRooms();
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomTopic.trim()) return;

    const created = StudyCircleService.createRoom(
      newRoomName.trim(),
      newRoomTopic.trim(),
      newRoomLevel,
      newRoomDesc.trim() || 'Collaborative JLPT Study Circle on Nihomi',
      newRoomExam,
      currentUser.name
    );

    setIsCreatingModal(false);
    setActiveRoomId(created.id);
    haptic.trigger('achievement');
    loadRooms();
  };

  const filteredRooms = selectedLevelFilter === 'ALL'
    ? rooms
    : rooms.filter((r) => r.jlptLevel === selectedLevelFilter);

  return (
    <div className="space-y-6 text-stone-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-stone-900 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Nihomi Study Circles™ • Realtime JLPT Cohorts</span>
          </div>
          <h2 className="text-xl font-bold font-serif text-white">Virtual Study Rooms & Cohort Leaderboards</h2>
          <p className="text-xs text-slate-400">
            Connect with peer learners across Tokyo, Dhaka, and worldwide. Share particle mnemonics, maintain joint streaks, and learn faster together.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Study Circle</span>
        </button>
      </div>

      {/* Level Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => {
              setSelectedLevelFilter(lvl);
              haptic.trigger('light');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedLevelFilter === lvl
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
            }`}
          >
            {lvl === 'ALL' ? 'All JLPT Circles' : `JLPT ${lvl} Cohorts`}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Circles / Center Chat & Right Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Circle Directory Column */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
            Active Study Circles ({filteredRooms.length})
          </h3>

          <div className="space-y-3">
            {filteredRooms.map((room) => {
              const isSelected = activeRoom?.id === room.id;
              const isMember = room.members.some((m) => m.id === currentUser.id || m.name === currentUser.name);

              return (
                <div
                  key={room.id}
                  onClick={() => {
                    setActiveRoomId(room.id);
                    haptic.trigger('light');
                  }}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-white border-red-500 ring-2 ring-red-500/10 shadow-md'
                      : 'bg-white hover:bg-stone-50/80 border-stone-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-bold">
                          JLPT {room.jlptLevel}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500">
                          🎯 {room.targetExamMonth}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900">{room.name}</h4>
                      <p className="text-xs text-stone-500 line-clamp-1">{room.topic}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100 text-stone-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      {room.members.length} / {room.maxMembers} Members
                    </span>

                    {!isMember ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinCircle(room.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] border border-red-200"
                      >
                        Join Room
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Joined
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Chat & Active Room Stage */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden h-[540px]">
          {activeRoom ? (
            <>
              {/* Room Top Bar */}
              <div className="p-4 border-b border-stone-100 bg-stone-50/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <span>{activeRoom.name}</span>
                  </h4>
                  <p className="text-xs text-stone-500">{activeRoom.topic}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live</span>
                </div>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/20">
                {activeRoom.messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id || msg.senderName === currentUser.name;

                  if (msg.isSenseiAi) {
                    return (
                      <div key={msg.id} className="p-3.5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-red-700">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-red-600" />
                            {msg.senderName}
                          </span>
                          <span className="font-mono text-stone-400">{msg.timestamp}</span>
                        </div>
                        <p className="text-stone-800 leading-relaxed font-medium">{msg.text}</p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <span className="text-[10px] text-stone-400 font-mono px-1">
                        {msg.senderName} • {msg.timestamp}
                      </span>
                      <div
                        className={`px-3.5 py-2 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                          isMe
                            ? 'bg-slate-900 text-white rounded-br-none'
                            : 'bg-white border border-stone-200 text-stone-900 rounded-bl-none shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-100 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a Japanese sentence, question, or study update..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-100 border border-transparent focus:border-red-500 focus:bg-white text-xs outline-hidden"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white transition cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-stone-400 text-xs">
              Select a study circle to join the live room.
            </div>
          )}
        </div>

        {/* Cohort Leaderboard & Shared Progress */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-xs text-stone-900 flex items-center gap-1.5 uppercase">
                <Trophy className="w-4 h-4 text-amber-500" />
                Circle Leaderboard
              </h3>
              <span className="text-[10px] text-stone-400 font-mono">Today</span>
            </div>

            {activeRoom?.members ? (
              <div className="space-y-3">
                {activeRoom.members
                  .slice()
                  .sort((a, b) => b.studyMinutesToday - a.studyMinutesToday)
                  .map((member, idx) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          idx === 0 ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-stone-900 text-xs">{member.name}</p>
                          <span className="text-[10px] text-red-600 flex items-center gap-0.5 font-mono">
                            <Flame className="w-3 h-3 text-red-500" />
                            {member.currentStreak} day streak
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-mono font-bold text-stone-900">{member.studyMinutesToday}m</p>
                        <span className="text-[10px] text-stone-400">{member.quizzesPassed} quizzes</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : null}

            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-[11px] text-red-900 space-y-1">
              <span className="font-bold block">🔥 Joint Circle Goal:</span>
              <p className="text-stone-700 leading-snug">
                Complete {activeRoom?.weeklyGoalHours || 10} collective study hours this week to unlock the "Tokyo Cohort Master" badge!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Creating New Circle */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Create a New Study Circle</h3>
              <button
                type="button"
                onClick={() => setIsCreatingModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Circle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🌸 Shinjuku N5 Particle Masters"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Topic / Main Focus</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minna no Nihongo Lesson 1-25 & Daily Audio Practice"
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Target JLPT Level</label>
                  <select
                    value={newRoomLevel}
                    onChange={(e) => setNewRoomLevel(e.target.value as JLPTLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden focus:border-red-500"
                  >
                    <option value="N5">JLPT N5 (Beginner)</option>
                    <option value="N4">JLPT N4 (Elementary)</option>
                    <option value="N3">JLPT N3 (Intermediate)</option>
                    <option value="N2">JLPT N2 (Pre-Advanced)</option>
                    <option value="N1">JLPT N1 (Advanced)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Target Exam Session</label>
                  <input
                    type="text"
                    value={newRoomExam}
                    onChange={(e) => setNewRoomExam(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description & Guidelines</label>
                <textarea
                  rows={3}
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="Brief description of the daily routine and study goals..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-hidden focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
