import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { IEmail } from 'src/modules/emails/interfaces';

export class SendEmailDto implements IEmail {
  @IsArray()
  @IsNotEmpty({ each: true })
  to: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  cc: string[];

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  html: string;

  @IsString()
  @IsOptional()
  from: string;
}
