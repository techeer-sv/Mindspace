
import {HttpStatus} from "@nestjs/common";
import {CustomException} from "../../global/common/customException";
import {ErrorCode} from "../../global/exception/ErrorCode";


export class NodeAlreadyWrittenException extends CustomException {
    constructor() {
        super(ErrorCode.NODE_ALREADY_WRITTEN, "이미 작성된 노드에 대한 작성 요청입니다.", HttpStatus.BAD_REQUEST);
    }
}
