import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds = 10;

  /**
   * Mã hóa chuỗi (password)
   * @param password Chuỗi gốc cần mã hóa
   * @returns Chuỗi đã được băm (hashed string)
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  /**
   * So sánh chuỗi gốc với chuỗi đã được mã hóa
   * @param password Chuỗi gốc người dùng nhập
   * @param hash Chuỗi mã hóa lấy từ database
   * @returns True nếu khớp, False nếu sai
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
