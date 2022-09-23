import { Controller, Post, Param, NotFoundException } from '@nestjs/common';
import { Game } from '@prisma/client';
import { GameService } from './game.service';

import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class GameDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;
}

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('game/by-exact-name/:name')
  public async fetchGameByExactName(@Param('name') name: string): Promise<Game | null> {
    const game: Game = await this.gameService.fetchGameByExactName(name);

    if (!game) {
      // As always, it's up for debate whether "No resource found" should return 404 or 200 with empty response, 
      // in this case decided to go with 404
      throw new NotFoundException('No game for given name');
    }
    return game;
  }

  @Post('game/search/:name')
  public searchGamesByFuzzyName(@Param('name') name: string): Promise<Game[] | null> {
    return this.gameService.searchGamesByFuzzyName(name);
  }
}
