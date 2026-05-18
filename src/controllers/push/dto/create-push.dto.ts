import { IsIn, IsString, MinLength } from "class-validator";

export class RegisterPushDeviceDto {
  @IsString()
  @MinLength(20)
  expoPushToken!: string;
  @IsIn(["ios", "android", "web"])
  platform!: string;
}