import {
  BadRequestException,
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
import { TitleNullException } from './exception/TitleNullException';
import { ContentNullException } from './exception/ContentNullException';
import { NodeNotFoundException } from './exception/NodeNotFoundException';
import { NodeService } from '../node/node.service';
import { BoardNotFoundException } from './exception/BoardNotFoundException';
import { InvalidPostDeleteException } from './exception/InvalidPostDeleteException';
import { NodeAlreadyWrittenException } from './exception/NodeAlreadyWrittenException';
import { UtilsService } from '../utils/utils.service';
import { AwsService } from '../aws/aws.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BoardService {
  private readonly DEFAULT_NODE_ID = 1;

  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private readonly boardMapper: BoardMapper,
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
    private readonly utilsService: UtilsService,
    private readonly awsService: AwsService,
    private configService: ConfigService,
  ) {}

  async getAllBoardsByNodeId(nodeId: number): Promise<BoardNodeResponseDto[]> {
    const boards = await this.boardRepository.find({
      where: { nodeId: nodeId },
    });

    if (!boards || boards.length === 0) {
      throw new NodeNotFoundException();
    }

    return boards.map((board) => BoardMapper.BoardNodeResponseDto(board));
  }

  async createBoard(
    nodeId: number,
    userId: string,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseDto> {
    // nodeId가 없으면 DEFAULT_NODE_ID 사용
    nodeId = nodeId ? nodeId : this.DEFAULT_NODE_ID;

    // 입력된 nodeId로 노드 조회
    const existingNode = await this.nodeService.findById(nodeId);
    if (!existingNode) {
      throw new NodeNotFoundException(); // 노드가 없으면 예외 발생
    }

    // Check if a board already exists for this node
    const existingBoard = await this.boardRepository.findOne({
      where: { nodeId: nodeId, userId: Number(userId) },
    });

    if (existingBoard) {
      throw new NodeAlreadyWrittenException();
    }
  
    // userId를 숫자로 변환
    const convertedUserId = Number(userId);

    // 게시글 제목이 비어있는지 검사
    if (!createBoardDto.title || createBoardDto.title.trim() === '') {
      throw new TitleNullException();
    }

    // 게시글 내용이 비어있는지 검사
    if (!createBoardDto.content || createBoardDto.content.trim() === '') {
      throw new ContentNullException();
    }

    // 사용자 정보 조회
    const user = await this.userService.findUserById(convertedUserId);
    const userNickname = user.nickname;

    // DTO를 엔터티로 변환
    const board = this.boardMapper.dtoToEntity(
      createBoardDto,
      nodeId,
      convertedUserId,
      userNickname,
    );

    // 게시글 저장 후 반환
    const savedBoard = await this.boardRepository.save(board);
    return BoardMapper.boardToResponseDto(savedBoard);
  }

  async updateBoard(
    nodeId: number,
    userId: string, // userId의 타입을 string에서 number로 변경
    updateBoardDto: UpdateBoardDto,
  ): Promise<BoardResponseDto> {
    // 노드의 유효성 확인
    const node = await this.nodeService.findById(nodeId);
    if (!node) {
      throw new NodeNotFoundException();
    }

    const convertedUserId = Number(userId);

    // 해당 노드와 사용자 ID로 게시글을 조회
    const board = await this.boardRepository.findOne({
      where: { nodeId: nodeId, userId: convertedUserId },
    });

    // 게시글이 없는 경우
    if (!board) {
      throw new BoardNotFoundException();
    }

    // 제목 및 내용의 유효성 검사
    if (!updateBoardDto.title || updateBoardDto.title.trim() === '') {
      throw new TitleNullException();
    }
    if (!updateBoardDto.content || updateBoardDto.content.trim() === '') {
      throw new ContentNullException();
    }

    // 게시글 업데이트
    board.title = updateBoardDto.title;
    board.content = updateBoardDto.content;

    const updatedBoard = await this.boardRepository.save(board);

    return BoardMapper.boardToResponseDto(updatedBoard);
  }

  async deleteOwnBoard(nodeId: number, userId: string): Promise<void> {
    const convertedUserId = parseInt(userId); // userId를 숫자로 변환
    if (isNaN(convertedUserId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    // 해당 노드와 사용자 ID로 게시글 조회
    const board = await this.boardRepository.findOne({
      where: { nodeId: nodeId, userId: convertedUserId },
    });

    // 게시글이 없는 경우
    if (!board) {
      throw new InvalidPostDeleteException(); // 게시물을 찾을 수 없습니다 예외 처리
    }

    // 사용자 ID가 일치하지 않는 경우
    if (board.userId !== convertedUserId) {
      throw new UnauthorizedException(`게시물을 삭제할 권한이 없습니다.`);
    }

    // 게시글 삭제
    const deleteResult = await this.boardRepository.delete(board.id);
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

  async findBoardById(boardId: number): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (!board) {
      throw new BoardNotFoundException();
    }
    return board;
  }

  async saveImage(file: Express.Multer.File) {
    return await this.imageUpload(file);
  }

  // S3 이미지 업로드
  async imageUpload(file: Express.Multer.File) {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { imageUrl };
  }
}
