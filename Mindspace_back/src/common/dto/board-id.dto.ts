import { IsNotEmpty, IsNumber } from 'class-validator';

export class BoardIdDto {
  @IsNumber()
  @IsNotEmpty()
  boardId: number;
}
