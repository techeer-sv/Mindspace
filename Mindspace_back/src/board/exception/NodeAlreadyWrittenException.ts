
import {ErrorCode} from "./ErrorCode";
import {HttpStatus} from "@nestjs/common";
import {CustomException} from "../../global/common/customException";


export class NodeAlreadyWrittenException extends CustomException {
    constructor() {
        super(ErrorCode.NODE_ALREADY_WRITTEN, "Node is already written", HttpStatus.BAD_REQUEST);
    }
}
