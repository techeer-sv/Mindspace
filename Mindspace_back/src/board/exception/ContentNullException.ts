
import {ErrorCode} from "./ErrorCode";
import {HttpStatus} from "@nestjs/common";
import {CustomException} from "../../global/common/customException";


export class ContentNullException extends CustomException {
    constructor() {
        super(ErrorCode.CONTENT_NULL, "Content is null", HttpStatus.BAD_REQUEST);
    }
}
