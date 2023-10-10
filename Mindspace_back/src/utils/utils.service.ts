import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class UtilsService {
  /**
   * UUID 생성 서비스
   * @returns UUID 텍스트
   */
  getUUID() {
    return v4();
  }
}
