import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { randomBytes, scrypt as _script } from 'crypto'
import { promisify } from 'util'

const script = promisify(_script)
const fakeUserDb = []

@Injectable()
export class AuthService {
  async signUp(email: string, password: string) {
    if (fakeUserDb.find((user) => user.email === email)) {
      throw new BadRequestException('Email in use')
    }

    const salt = randomBytes(8).toString('hex')
    const hash = (await script(password, salt, 32)) as Buffer
    const saltAndHash = `${salt}.${hash.toString('hex')}`
    const user = {
      email,
      password: saltAndHash,
    }

    fakeUserDb.push(user)
    // eslint-disable-next-line no-console
    console.log(fakeUserDb)

    return {
      email,
    }
  }

  async login(email: string, password: string) {
    const user = fakeUserDb.find((user) => user.email === email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const [salt, storedHash] = user.password.split('.')
    const hash = (await script(password, salt, 32)) as Buffer

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return {
      ...user,
      password: undefined,
    }
  }
}
