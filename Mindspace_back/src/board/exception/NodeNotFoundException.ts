
import {HttpStatus} from "@nestjs/common";
import {CustomException} from "../../global/common/customException";
import {ErrorCode} from "../../global/exception/ErrorCode";


export class NodeNotFoundException extends CustomException {
    constructor() {
        super(ErrorCode.NODE_NOT_FOUND, "해당 노드를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }
}
