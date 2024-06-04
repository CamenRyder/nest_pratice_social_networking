import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ReportPostDTO {
    @ApiProperty({ description: 'post id you want see issue ticked', type: Number })
    @IsNumber()
    @IsNotEmpty()
    post_id: number;
 
  
    @ApiProperty({
      type: Number,
      description: 'user id you want to apply ticked issue report',
    })
    @IsNumber()
    @IsNotEmpty()
    user_id: number;
  }
  