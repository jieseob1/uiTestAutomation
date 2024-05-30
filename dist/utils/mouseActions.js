var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function dragAndDropElement(page, startX, startY, endX, endY) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.mouse.move(startX, startY);
        yield page.mouse.down();
        yield page.mouse.move(endX, endY); // steps:10이건 뭐지?
        yield page.mouse.up();
    });
}
//# sourceMappingURL=mouseActions.js.map