import { Injectable } from '@nestjs/common';
import { createClient } from '@libsql/client';

export interface Mood {
  date: string;
  mood: number;
  note: string;
}

@Injectable()
export class MoodService {
  // TURSO_DATABASE_URL이 있으면 외부 DB(배포용), 없으면 로컬 파일을 쓴다.
  private db = createClient({
    url: process.env.TURSO_DATABASE_URL ?? 'file:moods.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  private ready = this.db.execute(
    `CREATE TABLE IF NOT EXISTS moods (
      date TEXT PRIMARY KEY,
      mood INTEGER NOT NULL,
      note TEXT NOT NULL DEFAULT ''
    )`,
  );

  async list(limit: number): Promise<Mood[]> {
    await this.ready;
    const r = await this.db.execute({
      sql: 'SELECT date, mood, note FROM moods ORDER BY date DESC LIMIT ?',
      args: [limit],
    });
    return r.rows as unknown as Mood[];
  }

  // month: 'YYYY-MM'
  async listByMonth(month: string): Promise<Mood[]> {
    await this.ready;
    const r = await this.db.execute({
      sql: 'SELECT date, mood, note FROM moods WHERE date LIKE ? ORDER BY date',
      args: [`${month}-%`],
    });
    return r.rows as unknown as Mood[];
  }

  // 하루에 하나만 기록한다. 같은 날 다시 저장하면 덮어쓴다.
  async save(date: string, mood: number, note: string): Promise<Mood> {
    await this.ready;
    await this.db.execute({
      sql: `INSERT INTO moods (date, mood, note) VALUES (?, ?, ?)
            ON CONFLICT(date) DO UPDATE SET mood = excluded.mood, note = excluded.note`,
      args: [date, mood, note],
    });
    return { date, mood, note };
  }
}
