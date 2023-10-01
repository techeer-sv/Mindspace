import {ErrorCode} from "./ErrorCode";
import {HttpStatus} from "@nestjs/common";
import {CustomException} from "../../global/common/customException";


export class NodeNotFoundException extends CustomException {
    constructor() {
        super(ErrorCode.NODE_NOT_FOUND, "Node not found", HttpStatus.NOT_FOUND);
    }
}
