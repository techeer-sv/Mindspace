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
import { CustomBoardRepository } from './repository/board.repository';
import { UserNotFoundException } from '../user/exception/UserNotFoundException';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private readonly customBoardRepository: CustomBoardRepository,
    private readonly boardMapper: BoardMapper,
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
    private readonly utilsService: UtilsService,
    private readonly awsService: AwsService,
  ) {}

  /** 게시글 목록 조회 + 페이지네이션 */
  async getAllBoardsByNodeId(
    nodeId: number,
    pagingParams: CursorPaginationDto,
  ) {
    const paginationResult = await this.customBoardRepository.paginate(
      nodeId,
      pagingParams,
    );

    const data = paginationResult.data.map((board) =>
      BoardMapper.BoardNodeResponseDto(board),
    );

    const cursor = {
      count: paginationResult.data.length,
      ...paginationResult.cursor,
    };

    return { data, cursor };
  }

  async createBoard(
    nodeId: number,
    userId: string,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseDto> {
    // userId를 숫자로 변환
    const convertedUserId = Number(userId);

    // 입력된 nodeId로 노드 조회
    const existingNode = await this.nodeService.findById(Number(nodeId));
    if (!existingNode) {
      throw new NodeNotFoundException(); // 노드가 없으면 예외 발생
    }

    // Check if a board already exists for this node
    const existingBoard = await this.boardRepository.findOne({
      where: { node: { id: Number(nodeId) }, user: { id: Number(userId) } },
    });

    if (existingBoard) {
      throw new NodeAlreadyWrittenException();
    }

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
    console.log(`Creating board for node ID ${nodeId} and user ID ${userId}`);

    if (!user) {
      throw new UserNotFoundException();
    }

    // DTO를 엔터티로 변환하고 로그 출력
    console.log(
      `Converting DTO to board entity for node ID: ${existingNode.id} and user ID: ${user.id}`,
    );
    const board = this.boardMapper.dtoToEntity(
      createBoardDto,
      existingNode,
      user,
    );

    // 게시글 저장 후 반환
    const savedBoard = await this.boardRepository.save(board);
    console.log(`Board created with ID: ${savedBoard.id}`);
    return BoardMapper.boardToResponseDto(savedBoard);
  }

  async updateBoard(
    nodeId: number,
    userId: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<BoardResponseDto> {
    // 노드의 유효성 확인
    const node = await this.nodeService.findById(Number(nodeId));
    if (!node) {
      throw new NodeNotFoundException();
    }

    const convertedUserId = Number(userId);

    // 해당 노드와 사용자 ID로 게시글을 조회
    const board = await this.boardRepository.findOne({
      where: { node: { id: Number(nodeId) }, user: { id: convertedUserId } },
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

    // 변경된 내용 저장
    const updatedBoard = await this.boardRepository.save(board);

    // 업데이트된 게시글 정보를 DTO로 변환하여 반환
    return BoardMapper.boardToResponseDto(updatedBoard);
  }

  async deleteOwnBoard(nodeId: number, userId: string): Promise<void> {
    const convertedUserId = Number(userId); // userId를 숫자로 변환
    if (isNaN(convertedUserId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    // 해당 노드와 사용자 ID로 게시글 조회
    const board = await this.boardRepository.findOne({
      where: { node: { id: Number(nodeId) }, user: { id: convertedUserId } },
      relations: ['user'], // 'user' 관계를 로드하도록 명시
    });

    // 게시글이 없거나 연결된 사용자 정보가 없는 경우
    if (!board || !board.user) {
      throw new InvalidPostDeleteException();
    }

    // 사용자 ID가 일치하지 않는 경우
    if (board.user.id !== convertedUserId) {
      throw new UnauthorizedException(`게시물을 삭제할 권한이 없습니다.`);
    }

    // 게시글 soft delete
    board.deletedAt = new Date();
    await this.boardRepository.save(board);
  }

  async getBoardByNodeIdAndUserId(
    nodeId: number,
    userId: string,
  ): Promise<SpecificBoardNodeDto> {
    const board = await this.boardRepository.findOne({
      where: {
        node: { id: Number(nodeId) },
        user: { id: Number(userId) },
      },
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

  async findBoardById(id: number): Promise<Board> {
    return this.boardRepository.findOne({
      where: { id: id },
      relations: ['node', 'user'],
    });
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
