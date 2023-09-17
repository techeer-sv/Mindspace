export class UserResponseDto {
  id: number;
  email: string;
  password: string;
  nickname: string;

  // 모든 필드를 파라미터로 받는 생성자 정의
  constructor(id: number, email: string, password: string, nickname: string) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.nickname = nickname;
  }
}
