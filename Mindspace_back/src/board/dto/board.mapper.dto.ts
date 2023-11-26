import { Injectable } from '@nestjs/common';
import { Board } from '../entities/board.entity';
import { CreateBoardDto } from './create-board.dto';
import { BoardResponseDto } from './board-response.dto';
import { BoardNodeResponseDto } from './board-node-response.dto';
import { SpecificBoardNodeDto } from './specific-board-node.dto';
import { BoardDetailDto } from './board-detail.dto';
import { Node } from '../../node/entities/node.entity';
import { User } from '../../user/entities/user.entity'; // 필요한 import를 추가하세요.
@Injectable()
export class BoardMapper {
  dtoToEntity(
    createBoardDto: CreateBoardDto,
    node: Node, // Node 엔티티를 참조
    user: User, // User 엔티티를 참조
  ): Board {
    const board = new Board();
    board.node = node; // Node 객체를 할당
    board.user = user; // User 객체를 할당
    board.title = createBoardDto.title;
    board.content = createBoardDto.content;

    return board;
  }

  // DTO 변환 함수에서 Board 엔티티 내의 관계를 통해 필요한 정보를 추출
  static boardToResponseDto(board: Board): BoardResponseDto {
    return {
      id: board.id,
      userNickname: board.user.nickname, // user 객체의 nickname 속성 접근
      title: board.title,
      content: board.content,
      updatedAt: board.updatedAt,
    };
  }

  static BoardNodeResponseDto(board: Board): BoardNodeResponseDto {
    return {
      id: board.id,
      userNickname: board.user.nickname, // user 객체의 nickname 속성 접근
      title: board.title,
      updatedAt: board.updatedAt,
    };
  }

  static SpecificBoardNodeDto(board: Board): SpecificBoardNodeDto {
    return {
      title: board.title,
      content: board.content,
      updatedAt: board.updatedAt,
      // 여기에 필요한 userNickname 또는 다른 user 관련 정보가 있다면 추가합니다.
    };
  }

  static toBoardDetailDto(board: Board): BoardDetailDto {
    return {
      id: board.id,
      userNickname: board.user.nickname, // user 객체의 nickname 속성 접근
      title: board.title,
      content: board.content,
      updatedAt: board.updatedAt,
    };
  }
}
