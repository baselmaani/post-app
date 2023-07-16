import {
  Get,
  Post,
  Controller,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { User, UserTypeD } from '../decorator/user.decorator';
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Post()
  createPost(@Body() body: PostDto, @User() id: number) {
    // console.log({ user });
    return this.postService.createPost(body, id);
  }
  @Get()
  getAll() {
    return this.postService.getAll();
  }
  @Get('/userspost')
  getPostByUserId(@User() id: number) {
    return this.postService.getPostByUserId(id);
  }
  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PostDto,
    @User() userId: number,
  ) {
    return this.postService.update(id, body, userId);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number, @User() userId: number) {
    return this.postService.delete(id, userId);
  }
}
