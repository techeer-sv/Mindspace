import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BoardService } from './board.service';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './entities/board.entity';
import { BoardResponseDto } from './dto/board-response.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { SpecificBoardNodeDto } from './dto/specific-board-node.dto';
import { BoardDetailDto } from './dto/board-detail.dto';
import { ImageUploadDto } from './dto/image-upload.dto';
import { PagingParams } from '../global/common/type';
import { PaginatedBoardResponseDto } from './dto/board-pagination-response.dto';

@ApiTags('Board')
@Controller('api/v1/boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({ summary: '노드별 모든 게시글 조회' })
  @ApiQuery({
    name: 'node_id',
    description: '조회하려는 노드의 ID',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'beforeCursor',
    required: false,
    type: String,
    description: '이전 커서 값',
  })
  @ApiQuery({
    name: 'afterCursor',
    required: false,
    type: String,
    description: '다음 커서 값',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 목록 조회 성공',
    type: PaginatedBoardResponseDto,
  })
  @Get('/all')
  async getAllBoardsByNodeId(
    @Query('node_id') nodeId: number,
    @Query() pagingParams: PagingParams,
  ): Promise<PaginatedBoardResponseDto> {
    return await this.boardService.getAllBoardsByNodeId(nodeId, pagingParams);
  }

  @ApiOperation({ summary: '게시글 생성' })
  @ApiQuery({ name: 'node_id', description: '게시글을 작성할 노드의 ID' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID' })
  @ApiResponse({ status: 201, description: '게시글 작성 성공', type: Board }) // 201 Created response
  @ApiResponse({ status: 500, description: '서버 오류' }) // 500 Internal Server Error response
  @Post()
  async createBoard(
    @Query('node_id') nodeId: number,
    @Headers('user_id') userId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseDto> {
    return this.boardService.createBoard(nodeId, userId, createBoardDto);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @ApiQuery({ name: 'node_id', description: '게시글을 작성할 노드의 ID' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID' })
  @ApiResponse({ status: 201, description: '게시글 작성 성공', type: Board }) // 201 Created response
  @ApiResponse({ status: 500, description: '서버 오류' }) // 500 Internal Server Error response
  @Put()
  async updateBoard(
    @Query('node_id') nodeId: number,
    @Headers('user_id') userId: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<BoardResponseDto> {
    return this.boardService.updateBoard(nodeId, userId, updateBoardDto);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @ApiQuery({ name: 'node_id', description: '게시글을 삭제할 노드의 ID' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID' })
  @ApiResponse({ status: 201, description: '게시글 삭제 성공', type: Board }) // 201 Created response
  @ApiResponse({ status: 500, description: '서버 오류' }) // 500 Internal Server Error response
  @Delete()
  async deleteOwnBoard(
    @Query('node_id') nodeId: number,
    @Headers('user_id') userId: string,
  ) {
    return this.boardService.deleteOwnBoard(nodeId, userId);
  }

  @ApiOperation({ summary: '특정 노드의 사용자 게시글 조회' })
  @ApiQuery({
    name: 'node_id',
    description: '조회하려는 노드의 ID',
    required: true,
    type: Number,
  })
  @ApiHeader({
    name: 'user_id',
    description: '사용자 ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '게시글 조회 성공',
    type: SpecificBoardNodeDto,
  })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  @Get()
  async getBoardByNodeId(
    @Query('node_id') nodeId: number,
    @Headers('user_id') userIdHeader: string,
  ): Promise<SpecificBoardNodeDto> {
    const userId = parseInt(userIdHeader);
    return await this.boardService.getBoardByNodeIdAndUserId(nodeId, userId);
  }

  @ApiOperation({ summary: '특정 게시글 조회' })
  @ApiResponse({
    status: 200,
    description: '게시글 조회 성공',
    type: BoardDetailDto,
  })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  @Get(':id')
  async getBoardDetail(@Param('id') id: number): Promise<BoardDetailDto> {
    return this.boardService.getBoardDetailById(id);
  }

  /**
   * [POST] /boards/image - 게시글 작성/수정시 이미지 업로드 API
   * @param file - 업로드한 이미지 파일
   * @returns 업로드된 이미지의 URL 반환
   */
  @ApiOperation({ summary: '게시글 작성, 수정 시 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 파일',
    type: ImageUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @Post('image')
  async saveImage(@UploadedFile() file: Express.Multer.File) {
    return await this.boardService.imageUpload(file);
  }
}
