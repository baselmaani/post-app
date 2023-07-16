import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

interface Signup {
  name: string;
  email: string;
  age: string;
  password: string;
}
interface Signin {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup({ name, email, age, password }: Signup) {
    const convertedAge = parseInt(age, 10);
    const isMatched = await this.prisma.user.findUnique({
      where: { email },
    });
    if (isMatched) throw new ConflictException('the user is already existed!');
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { name, email, age: convertedAge, password: hashed },
    });
    return jwt.sign({ name, email, id: user.id }, 'secret_key');
  }
  async signin({ email, password }: Signin) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException();
    const decodedPassword = await bcrypt.compare(password, user.password);
    if (!decodedPassword)
      throw new NotFoundException('passwords ar not match!!');
    return jwt.sign(
      { name: user.name, email: user.email, id: user.id },
      'secret_key',
    );
  }
}
