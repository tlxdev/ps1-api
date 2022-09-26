import { Controller, Get, Param, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import { Game } from '@prisma/client';
import { GameService } from './game.service';
import { ParseUUIDPipe } from '@nestjs/common/pipes';

import { IsString, IsDefined, IsNotEmpty, UUIDVersion } from 'class-validator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Fetch paginated list of games' })
  @ApiResponse({ status: 200, description: 'Returns games with id and name included' })
  @ApiResponse({ status: 400, description: 'Invalid params' })
  public getPaginatedGameList(@Query('page') page: number): Promise<Game[]> {
    // Lets start pagination at 1 instead of 0
    if (page < 1) {
      throw new BadRequestException("Parameter 'page' must be an integer greater than zero");
    }
    return this.gameService.getPaginatedGameList(page);
  }

  @Get('/game/:id')
  @ApiOperation({ summary: 'Fetch full data of specific game for id' })
  @ApiResponse({ status: 200, description: 'Returns full data for game with given id' })
  @ApiResponse({ status: 404, description: 'Nothing found for given id' })
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
  @ApiOperation({ summary: 'Fetch full data of specific game for exact name (case sensitive)' })
  @ApiResponse({ status: 200, description: 'Returns full data for game with the exact given name' })
  @ApiResponse({ status: 404, description: 'Nothing found for given id' })
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
  @ApiOperation({ summary: 'Search games by name' })
  @ApiResponse({ status: 200, description: 'Returns games that match given fuzzy search, with id and name included' })
  public searchGamesByFuzzyName(@Param('name') name: string): Promise<Game[]> {
    return this.gameService.searchGamesByFuzzyName(name);
  }
}
