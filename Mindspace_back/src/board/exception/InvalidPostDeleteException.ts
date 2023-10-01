
import {ErrorCode} from "./ErrorCode";
import {HttpStatus} from "@nestjs/common";
import {CustomException} from "../../global/common/customException";



export class InvalidPostDeleteException extends CustomException {
    constructor() {
        super(ErrorCode.INVALID_POST_DELETE, "Invalid post deletion", HttpStatus.BAD_REQUEST);
    }
}
