var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { clickUsingSelector } from "./elementActions.js";
export function pageNavigationAndBringToFront(page, url) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(url);
        yield page.waitForNavigation();
        yield page.bringToFront();
    });
}
export function pageLoadingComplete(page, documentSelector, waitSelector, url) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pageNavigationAndBringToFront(page, url);
        yield clickUsingSelector(page, documentSelector);
        try {
            yield page.waitForSelector(waitSelector, { visible: true, timeout: 20 * 1000 });
        }
        catch (e) {
            console.error("pageLoading error Occured", e);
        }
    });
}
//# sourceMappingURL=navigation.js.map