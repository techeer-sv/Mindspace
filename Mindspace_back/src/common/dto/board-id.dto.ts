import { IsNotEmpty, IsString } from 'class-validator';

export class BoardIdDto {
  @IsString()
  @IsNotEmpty()
  board_id: string;
}
