/**
 * NIHOMI STUDY CIRCLES & COHORT SERVICE
 * Real-time virtual study rooms, live group chat, and shared level leaderboards.
 */

import { JLPTLevel } from '../types';

export interface StudyRoomMember {
  id: string;
  name: string;
  avatarSeed: string;
  role: 'leader' | 'member';
  currentStreak: number;
  studyMinutesToday: number;
  quizzesPassed: number;
  isOnline: boolean;
  lastActive: string;
}

export interface RoomChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isSenseiAi?: boolean;
}

export interface StudyCircleRoom {
  id: string;
  name: string;
  topic: string;
  jlptLevel: JLPTLevel;
  maxMembers: number;
  targetExamMonth: string;
  description: string;
  createdAt: string;
  isPrivate: boolean;
  joinCode?: string;
  members: StudyRoomMember[];
  messages: RoomChatMessage[];
  weeklyGoalHours: number;
  sharedStudyMinutesTotal: number;
}

const STORAGE_KEY = 'nihomi_study_circles_v1';

export const INITIAL_ROOMS: StudyCircleRoom[] = [
  {
    id: 'circle-n5-tokyo',
    name: '🌸 Tokyo Dreamers N5 Intensive',
    topic: 'Minna no Nihongo 1-25 & Particles Drill',
    jlptLevel: 'N5',
    maxMembers: 12,
    targetExamMonth: 'July 2027 / Dec 2026',
    description: 'Daily particle quizzes (は vs が, に vs で), 20 min morning reading, and active kanji drills.',
    createdAt: '2026-08-01T00:00:00.000Z',
    isPrivate: false,
    weeklyGoalHours: 10,
    sharedStudyMinutesTotal: 4320,
    members: [
      {
        id: 'usr-1',
        name: 'Tanvir K. (Leader)',
        avatarSeed: 'tanvir',
        role: 'leader',
        currentStreak: 14,
        studyMinutesToday: 45,
        quizzesPassed: 19,
        isOnline: true,
        lastActive: 'Just now'
      },
      {
        id: 'usr-2',
        name: 'Rahim Sensei',
        avatarSeed: 'rahim',
        role: 'member',
        currentStreak: 21,
        studyMinutesToday: 60,
        quizzesPassed: 24,
        isOnline: true,
        lastActive: '5m ago'
      },
      {
        id: 'usr-3',
        name: 'Aoi Sakura',
        avatarSeed: 'sakura',
        role: 'member',
        currentStreak: 8,
        studyMinutesToday: 30,
        quizzesPassed: 12,
        isOnline: false,
        lastActive: '1h ago'
      },
      {
        id: 'usr-4',
        name: 'Kenji Explorer',
        avatarSeed: 'kenji',
        role: 'member',
        currentStreak: 11,
        studyMinutesToday: 20,
        quizzesPassed: 15,
        isOnline: true,
        lastActive: 'Just now'
      }
    ],
    messages: [
      {
        id: 'm-1',
        senderId: 'usr-1',
        senderName: 'Tanvir K.',
        senderAvatar: 'tanvir',
        text: 'みなさん、こんにちは！ Lesson 10 grammar quiz is scheduled for 8:00 PM tonight. Ready?',
        timestamp: '10:15 AM'
      },
      {
        id: 'm-2',
        senderId: 'usr-2',
        senderName: 'Rahim Sensei',
        senderAvatar: 'rahim',
        text: 'はい！ I just practiced the pronunciation coach with 94% pitch accuracy.',
        timestamp: '10:18 AM'
      },
      {
        id: 'm-3',
        senderId: 'sensei-ai',
        senderName: 'Nihomi AI Sensei 🤖',
        senderAvatar: 'ai',
        text: '🌸 Study Tip: In Lesson 10, remember that あります is for inanimate objects (椅子があります) while います is for living beings (猫がいます).',
        timestamp: '10:20 AM',
        isSenseiAi: true
      }
    ]
  },
  {
    id: 'circle-n4-shinkansen',
    name: '🚄 Shinkansen N4 Grammar Sprint',
    topic: 'Te-form, Conditional 〜たら, Potential Form',
    jlptLevel: 'N4',
    maxMembers: 10,
    targetExamMonth: 'December 2026',
    description: 'Focused intermediate cohort dedicated to Minna no Nihongo II and workplace conversations.',
    createdAt: '2026-08-05T00:00:00.000Z',
    isPrivate: false,
    weeklyGoalHours: 12,
    sharedStudyMinutesTotal: 6180,
    members: [
      {
        id: 'usr-5',
        name: 'Farhan Ahmed',
        avatarSeed: 'farhan',
        role: 'leader',
        currentStreak: 18,
        studyMinutesToday: 50,
        quizzesPassed: 22,
        isOnline: true,
        lastActive: 'Just now'
      },
      {
        id: 'usr-6',
        name: 'Nadia Yasmin',
        avatarSeed: 'nadia',
        role: 'member',
        currentStreak: 12,
        studyMinutesToday: 40,
        quizzesPassed: 17,
        isOnline: true,
        lastActive: '2m ago'
      },
      {
        id: 'usr-7',
        name: 'Tatsuo Mori',
        avatarSeed: 'tatsuo',
        role: 'member',
        currentStreak: 30,
        studyMinutesToday: 75,
        quizzesPassed: 28,
        isOnline: false,
        lastActive: '3h ago'
      }
    ],
    messages: [
      {
        id: 'm-4',
        senderId: 'usr-5',
        senderName: 'Farhan Ahmed',
        senderAvatar: 'farhan',
        text: 'Does anyone want to review the difference between 〜なければなりません and 〜なくてもいいです?',
        timestamp: '09:30 AM'
      },
      {
        id: 'm-5',
        senderId: 'usr-6',
        senderName: 'Nadia Yasmin',
        senderAvatar: 'nadia',
        text: 'Sure! Let’s jump into the shared quiz room.',
        timestamp: '09:35 AM'
      }
    ]
  },
  {
    id: 'circle-n3-business',
    name: '🏢 Keigo & Workplace Japanese Lab (N3)',
    topic: 'Sonkeigo, Kenjougo & Baito Interview Prep',
    jlptLevel: 'N3',
    maxMembers: 8,
    targetExamMonth: 'December 2026',
    description: 'For IT engineers, caregivers, and job seekers relocating to Tokyo/Osaka.',
    createdAt: '2026-08-10T00:00:00.000Z',
    isPrivate: false,
    weeklyGoalHours: 15,
    sharedStudyMinutesTotal: 8450,
    members: [
      {
        id: 'usr-8',
        name: 'Mahbub Alam',
        avatarSeed: 'mahbub',
        role: 'leader',
        currentStreak: 25,
        studyMinutesToday: 90,
        quizzesPassed: 31,
        isOnline: true,
        lastActive: 'Just now'
      },
      {
        id: 'usr-9',
        name: 'Shoko Suzuki',
        avatarSeed: 'shoko',
        role: 'member',
        currentStreak: 16,
        studyMinutesToday: 45,
        quizzesPassed: 20,
        isOnline: true,
        lastActive: '1m ago'
      }
    ],
    messages: [
      {
        id: 'm-6',
        senderId: 'usr-8',
        senderName: 'Mahbub Alam',
        senderAvatar: 'mahbub',
        text: 'Remember Hou-Ren-So (報告・連絡・相談) practice at 6 PM!',
        timestamp: '11:00 AM'
      }
    ]
  }
];

export class StudyCircleService {
  public static getRooms(): StudyCircleRoom[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    this.saveRooms(INITIAL_ROOMS);
    return INITIAL_ROOMS;
  }

  public static saveRooms(rooms: StudyCircleRoom[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    } catch {}
  }

  public static createRoom(
    name: string,
    topic: string,
    jlptLevel: JLPTLevel,
    description: string,
    targetExamMonth: string,
    creatorName: string,
    isPrivate = false
  ): StudyCircleRoom {
    const rooms = this.getRooms();
    const newRoom: StudyCircleRoom = {
      id: `circle-${Date.now()}`,
      name,
      topic,
      jlptLevel,
      maxMembers: 12,
      targetExamMonth,
      description,
      createdAt: new Date().toISOString(),
      isPrivate,
      joinCode: isPrivate ? Math.random().toString(36).substring(2, 8).toUpperCase() : undefined,
      weeklyGoalHours: 10,
      sharedStudyMinutesTotal: 60,
      members: [
        {
          id: `usr-${Date.now()}`,
          name: `${creatorName} (Host)`,
          avatarSeed: creatorName.toLowerCase().replace(/\s+/g, ''),
          role: 'leader',
          currentStreak: 1,
          studyMinutesToday: 30,
          quizzesPassed: 1,
          isOnline: true,
          lastActive: 'Just now'
        }
      ],
      messages: [
        {
          id: `m-init-${Date.now()}`,
          senderId: 'system',
          senderName: 'Nihomi Circle Bot',
          senderAvatar: 'ai',
          text: `🎉 Study Circle "${name}" created! Invite your friends to study for JLPT ${jlptLevel} together!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    rooms.unshift(newRoom);
    this.saveRooms(rooms);
    return newRoom;
  }

  public static joinRoom(roomId: string, user: { id: string; name: string; streak?: number }): StudyCircleRoom | null {
    const rooms = this.getRooms();
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return null;

    const exists = room.members.find((m) => m.id === user.id || m.name === user.name);
    if (!exists) {
      room.members.push({
        id: user.id || `usr-${Date.now()}`,
        name: user.name,
        avatarSeed: user.name.toLowerCase().replace(/\s+/g, ''),
        role: 'member',
        currentStreak: user.streak || 1,
        studyMinutesToday: 15,
        quizzesPassed: 2,
        isOnline: true,
        lastActive: 'Just now'
      });

      room.messages.push({
        id: `m-${Date.now()}`,
        senderId: 'system',
        senderName: 'System',
        senderAvatar: 'system',
        text: `👋 ${user.name} has joined the circle!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      this.saveRooms(rooms);
    }
    return room;
  }

  public static sendMessage(roomId: string, message: { senderId: string; senderName: string; text: string }): RoomChatMessage | null {
    const rooms = this.getRooms();
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return null;

    const newMsg: RoomChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatar: message.senderName.toLowerCase().replace(/\s+/g, ''),
      text: message.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    room.messages.push(newMsg);
    this.saveRooms(rooms);
    return newMsg;
  }
}
