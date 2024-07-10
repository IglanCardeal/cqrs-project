import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'

@Controller('feature')
export class FeatureController {
  @Get('public')
  getPublic() {
    return 'This is a public feature'
  }

  @Get('private')
  @UseGuards(JwtAuthGuard)
  getPrivate() {
    return 'This is a private feature'
  }
}
