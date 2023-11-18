import { IsNotEmpty, IsString } from 'class-validator';

export class CommentIdDto {
  @IsString()
  @IsNotEmpty()
  comment_id: string;
}
