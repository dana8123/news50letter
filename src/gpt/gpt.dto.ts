import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class createGptDataDto {
  @IsNotEmpty()
  @IsString()
  data: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  publishedAt: Date;

  @IsNotEmpty()
  @IsString()
  url: string;
}
