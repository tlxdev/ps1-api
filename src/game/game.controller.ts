import { Controller, Get, Param, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import { Game } from '@prisma/client';
import { GameService } from './game.service';
import { ParseUUIDPipe } from '@nestjs/common/pipes';

import { IsString, IsDefined, IsNotEmpty, UUIDVersion } from 'class-validator';

export class GameDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;
}

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/games')
  public getPaginatedGameList(@Query('page') page: number): Promise<Game[]> {
    if (page < 0) {
      throw new BadRequestException("Parameter 'page' must be an non-negative integer");
    }
    return this.gameService.getPaginatedGameList(page);
  }

  @Get('/game/:id')
  public async fetchGameById(@Param('id', ParseUUIDPipe) id: string): Promise<Game> {
    const game: Game = await this.gameService.fetchGameById(id);

    if (!game) {
      // As always, it's up for debate whether "No resource found" should return 404 or 200 with empty response,
      // in this case decided to go with 404
      throw new NotFoundException('No game for given id');
    }
    return game;
  }

  @Get('/game/by-exact-name/:name')
  public async fetchGameByExactName(@Param('name') name: string): Promise<Game> {
    const game: Game = await this.gameService.fetchGameByExactName(name);

    if (!game) {
      // As always, it's up for debate whether "No resource found" should return 404 or 200 with empty response,
      // in this case decided to go with 404
      throw new NotFoundException('No game for given name');
    }
    return game;
  }

  @Get('/game/search/:name')
  public searchGamesByFuzzyName(@Param('name') name: string): Promise<Game[]> {
    return this.gameService.searchGamesByFuzzyName(name);
  }
}
