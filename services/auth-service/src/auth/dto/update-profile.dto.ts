import { IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  githubUsername?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  leetcodeUsername?: string;
}
