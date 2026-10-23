import { Injectable } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';

export interface Mood {
  date: string;
  mood: number;
  note: string;
}

@Injectable()
export class MoodService {
  private db = new DatabaseSync('moods.db');

  constructor() {
    this.db.exec(
      `CREATE TABLE IF NOT EXISTS moods (
        date TEXT PRIMARY KEY,
        mood INTEGER NOT NULL,
        note TEXT NOT NULL DEFAULT ''
      )`,
    );
  }

  list(limit: number): Mood[] {
    return this.db
      .prepare('SELECT date, mood, note FROM moods ORDER BY date DESC LIMIT ?')
      .all(limit) as unknown as Mood[];
  }

  // month: 'YYYY-MM'
  listByMonth(month: string): Mood[] {
    return this.db
      .prepare('SELECT date, mood, note FROM moods WHERE date LIKE ? ORDER BY date')
      .all(`${month}-%`) as unknown as Mood[];
  }

  // 하루에 하나만 기록한다. 같은 날 다시 저장하면 덮어쓴다.
  save(date: string, mood: number, note: string): Mood {
    this.db
      .prepare(
        `INSERT INTO moods (date, mood, note) VALUES (?, ?, ?)
         ON CONFLICT(date) DO UPDATE SET mood = excluded.mood, note = excluded.note`,
      )
      .run(date, mood, note);
    return { date, mood, note };
  }
}
