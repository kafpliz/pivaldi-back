import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailSletterHrDto } from './create-email-sletter.dto';

export class UpdateEmailSletterDto extends PartialType(CreateEmailSletterHrDto) {}
