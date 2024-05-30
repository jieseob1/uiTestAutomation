var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { clickElement } from "./elementActions.js";
import { dragAndDropElement } from "./mouseActions.js";
import { INSERT_BUTTON, SHAPE_GROUP } from "constants/office_docx.js";
export function createShape(page, startX, startY, endX, endY, shapeSelector) {
    return __awaiter(this, void 0, void 0, function* () {
        yield clickElement(page, INSERT_BUTTON);
        yield clickElement(page, SHAPE_GROUP);
        yield clickElement(page, shapeSelector);
        yield dragAndDropElement(page, startX, startY, endX, endY);
    });
}
//# sourceMappingURL=shapeActions.js.map