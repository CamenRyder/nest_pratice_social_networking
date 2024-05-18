import { ApiProperty } from "@nestjs/swagger";

export class BaseResponse {
    @ApiProperty({type: Number, description: 'status code'})
    statusCode: number;

    @ApiProperty({type: String, description: 'status code'})
    message: string;

    @ApiProperty({type: String, description: 'status code'})
    createAt: string;

    constructor(data: any){
        const currentTime = new Date();
        const {statusCode = 200, message = 'Successful'} = data;
        this.createAt = currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,});
        this.statusCode = statusCode;
        this.message = message
    }
}

// Rồi mấy dto khác em kế thừa cái này chẳng hạn