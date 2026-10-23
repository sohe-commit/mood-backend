import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MoodService } from './mood.service';

@Controller('moods')
export class MoodController {
  constructor(private readonly moods: MoodService) {}

  @Get()
  list(@Query('limit') limit?: string, @Query('month') month?: string) {
    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        throw new BadRequestException('month는 YYYY-MM 형식이어야 합니다');
      }
      return this.moods.listByMonth(month);
    }
    return this.moods.list(Math.min(Number(limit) || 30, 365));
  }

  @Post()
  save(@Body() body: { date?: string; mood?: number; note?: string }) {
    const { date, mood, note = '' } = body ?? {};
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('date는 YYYY-MM-DD 형식이어야 합니다');
    }
    if (!Number.isInteger(mood) || mood! < 1 || mood! > 5) {
      throw new BadRequestException('mood는 1~5 정수여야 합니다');
    }
    return this.moods.save(date, mood!, String(note).slice(0, 200));
  }
}
