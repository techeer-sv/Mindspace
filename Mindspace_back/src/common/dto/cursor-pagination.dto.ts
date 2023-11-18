import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CursorPaginationDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  afterCursor?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  beforeCursor?: string;
}
