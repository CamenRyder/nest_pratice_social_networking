import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class NotificationDTO {
    @ApiProperty({ description: 'post id you want to React', type: Number })
    @IsNumber()
    @IsNotEmpty()
    notification_id: number;
  
  
    @ApiProperty({
      type: Number,
      description: 'user report post',
    })
    @IsNumber()
    @IsNotEmpty()
    user_id: number;
  }