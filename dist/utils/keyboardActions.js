var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function undo(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.bringToFront();
        yield page.keyboard.down('Control');
        yield page.keyboard.press('Z');
        yield page.keyboard.up('Control');
    });
}
export function redo(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.bringToFront();
        yield page.keyboard.down('Control');
        yield page.keyboard.press('Y');
        yield page.keyboard.up('Control');
    });
}
export function enter(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.keyboard.press('Enter');
    });
}
//# sourceMappingURL=keyboardActions.js.map