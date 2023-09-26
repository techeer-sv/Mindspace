import { Injectable } from '@nestjs/common';
import { Board } from '../entities/board.entity';
import { CreateBoardDto } from './create-board.dto';
import { BoardResponseDto } from './board-response.dto';
import { BoardNodeResponseDto } from './board-node-response.dto';
import { SpecificBoardNodeDto } from './specific-board-node.dto';
import { BoardDetailDto } from './board-detail.dto'; // 필요한 import를 추가하세요.

@Injectable()
export class BoardMapper {
  dtoToEntity(
    createBoardDto: CreateBoardDto,
    nodeId: number,
    userId: number,
    userNickname: string,
  ): Board {
    const board = new Board();
    board.nodeId = nodeId;
    board.userNickname = userNickname;
    board.title = createBoardDto.title;
    board.content = createBoardDto.content;
    board.userId = userId;

    return board;
  }

  static boardToResponseDto(board: Board): BoardResponseDto {
    return {
      id: board.id,
      userNickname: board.userNickname,
      title: board.title,
      content: board.content,
      updatedAt: board.updatedAt,
    };
  }

  static BoardNodeResponseDto(board: Board): BoardNodeResponseDto {
    return {
      id: board.id,
      userNickname: board.userNickname,
      title: board.title,
      // `content` 제거
      updatedAt: board.updatedAt,
    };
  }

  static SpecificBoardNodeDto(board: Board): SpecificBoardNodeDto {
    return {
      title: board.title,
      content: board.content,
      updatedAt: board.updatedAt,
    };
  }

  static toBoardDetailDto(board: Board): BoardDetailDto {
    return {
      id: board.id,
      userNickname: board.userNickname,
      title: board.title,
      content: board.content,
      updatedAt: board.updatedAt,
    };
  }
}
