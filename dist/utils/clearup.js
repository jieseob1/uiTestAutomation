var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DISCONNECT_BUTTON } from "../constants/office_docx.js";
import { clickElement } from "./elementActions.js";
export function clearUp(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.bringToFront();
        yield page.keyboard.down('Control');
        yield page.keyboard.press('A');
        yield page.keyboard.up('Control');
        yield page.keyboard.press('Backspace');
        // await tableClearUp(page);
    });
}
export function tableClearUp(page) {
    return __awaiter(this, void 0, void 0, function* () {
        // await getCoordinateUsingSelector(page, TABLE_WRAPPER)
        // page.keyboard.press('Backspace');
        //테이블 지우는 방법을 몰라서 모듈팀 추가 구현 요청
    });
}
export function clearUpAndDisconnectPage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.bringToFront();
        yield clearUp(page);
        yield clickElement(page, DISCONNECT_BUTTON);
    });
}
//# sourceMappingURL=clearup.js.map