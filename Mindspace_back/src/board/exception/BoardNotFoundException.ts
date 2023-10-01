import {CustomException} from "../../global/common/customException";
import {HttpStatus} from "@nestjs/common";
import {ErrorCode} from "./ErrorCode";



export class BoardNotFoundException extends CustomException {
    constructor() {
        super(ErrorCode.BOARD_NOT_FOUND, "Board not found", HttpStatus.NOT_FOUND);
    }
}
