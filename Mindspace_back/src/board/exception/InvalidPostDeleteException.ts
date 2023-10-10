import {HttpStatus} from "@nestjs/common";
import {CustomException} from "../../global/common/customException";
import {ErrorCode} from "../../global/exception/ErrorCode";



export class InvalidPostDeleteException extends CustomException {
    constructor() {
        super(ErrorCode.INVALID_POST_DELETE, "삭제할 수 없는 글이거나 이미 삭제된 글입니다.", HttpStatus.BAD_REQUEST);
    }
}
