import { Controller, Get, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@src/auth/current-user.decorator'
import { CurrentUserDTO } from '@src/auth/current-user.dto'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'

@Controller('feature')
export class FeatureController {
  @Get('public')
  getPublic() {
    return 'This is a public feature'
  }

  @Get('private')
  @UseGuards(JwtAuthGuard)
  getPrivate(@CurrentUser() user: CurrentUserDTO) {
    return `This is a private feature for user: ${user.username}`
  }
}
