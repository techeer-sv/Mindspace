import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardMapper } from './dto/board.mapper.dto';
import { UserService } from '../user/user.service';
import { BoardResponseDto } from './dto/board-response.dto';
import { BoardNodeResponseDto } from './dto/board-node-response.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { SpecificBoardNodeDto } from './dto/specific-board-node.dto';
import { BoardDetailDto } from './dto/board-detail.dto';
import {TitleNullException} from "./exception/TitleNullException";
import {ContentNullException} from "./exception/ContentNullException";
import {NodeNotFoundException} from "./exception/NodeNotFoundException";
import {NodeService} from "../node/node.service";

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private readonly boardMapper: BoardMapper,
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
  ) {}

  async getAllBoardsByNodeId(nodeId: number): Promise<BoardNodeResponseDto[]> {
    const boards = await this.boardRepository.find({
      where: { nodeId: nodeId },
    });
    return boards.map((board) => BoardMapper.BoardNodeResponseDto(board));
    //여기서 dto수정해주면 responsebody에 보이는 게 달라짐
  }

  async createBoard(
      nodeId: number,
      userId: string,
      createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseDto> {

    // 제목이 없거나 빈 문자열인 경우 예외를 발생시킵니다.
    if (!createBoardDto.title || createBoardDto.title.trim() === '') {
      throw new TitleNullException();
    }

    // 내용이 없거나 빈 문자열인 경우 예외를 발생시킵니다.
    if (!createBoardDto.content || createBoardDto.content.trim() === '') {
      throw new ContentNullException();
    }

    // 노드의 유효성 확인
    const node = await this.nodeService.findById(nodeId);
    if (!node) {
      throw new NodeNotFoundException();
    }

    const convertedUserId = Number(userId);
    const user = await this.userService.findUserById(convertedUserId);
    const userNickname = user.nickname;

    const board = this.boardMapper.dtoToEntity(
        createBoardDto,
        nodeId,
        convertedUserId,
        userNickname,
    );
    const savedBoard = await this.boardRepository.save(board);
    return BoardMapper.boardToResponseDto(savedBoard);
  }



  async getBoardById(id: number): Promise<BoardResponseDto> {
    const boardEntity: Board = await this.boardRepository.findOne({
      where: { id: id },
    });
    return BoardMapper.boardToResponseDto(boardEntity);
  }

  async updateBoard(
    nodeId: number,
    userId: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<BoardResponseDto> {
    const convertedUserId = Number(userId); // userId를 number로 변환

    const board = await this.boardRepository.findOne({
      where: { nodeId: nodeId, userId: convertedUserId },
    }); // 변환된 userId를 사용

    // 게시글이 없는 경우
    if (!board) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 사용자 권한 검사
    if (board.userId !== convertedUserId) {
      // 변환된 userId를 사용
      throw new UnauthorizedException('게시글을 수정할 권한이 없습니다.');
    }

    board.title = updateBoardDto.title;
    board.content = updateBoardDto.content;

    const updatedBoard = await this.boardRepository.save(board);

    // DTO 변환 로직 (예: BoardMapper를 사용)
    return BoardMapper.boardToResponseDto(updatedBoard);
  }

  async deleteOwnBoard(nodeId: number, userId: string): Promise<void> {
    const convertedUserId = parseInt(userId); // userId를 숫자로 변환

    const board = await this.boardRepository.findOne({
      where: { id: nodeId, userId: convertedUserId },
    });

    if (!board) {
      throw new NotFoundException(`게시물 ${nodeId}를 찾을 수 없습니다.`);
    }

    if (board.userId !== convertedUserId) {
      throw new UnauthorizedException(`게시물을 삭제할 권한이 없습니다.`);
    }

    await this.boardRepository.delete(nodeId);
  }

  async getBoardByNodeIdAndUserId(
    nodeId: number,
    userId: number,
  ): Promise<SpecificBoardNodeDto> {
    const board = await this.boardRepository.findOne({
      where: { nodeId: nodeId, userId: userId },
    });
    if (!board) {
      throw new NotFoundException(`게시물을 찾을 수 없습니다.`);
    }
    return BoardMapper.SpecificBoardNodeDto(board);
  }

  async getBoardDetailById(boardId: number): Promise<BoardDetailDto> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException(`게시물을 찾을 수 없습니다.`);
    }
    return BoardMapper.toBoardDetailDto(board);
  }
}
