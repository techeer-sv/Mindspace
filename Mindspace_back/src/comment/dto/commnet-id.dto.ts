import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CommentIdDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  comment_id?: number;
}
