import { Injectable } from '@nestjs/common';
import { Game } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  // Note: case sensitive
  async fetchGameByExactName(incomingName: string): Promise<Game | null> {
    const game = await this.prisma.game.findFirst({
      where: {
        name: {
          has: incomingName,
        },
      },
    });

    if (game) {
      return game;
    }

    return null;
  }

  async searchGamesByFuzzyName(incomingName: string): Promise<Game[] | null> {
    // Have to use native query as ORM doesn't have support for ilike, and using ilike for text arrays is kinda complicated
    const games: Game[] = await this.prisma.$queryRawUnsafe(
      `select * from "Game" where array_to_string("name", ' ') ilike $1`,
      // Wrapping a value between % and using ilike = easy fuzzy search
      '%' + incomingName + '%',
    );

    if (games?.length > 0) {
      return games;
    }

    return [];
  }
}
