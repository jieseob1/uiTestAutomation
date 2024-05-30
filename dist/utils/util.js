var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OFFICE_SECTION, TABLE_WRAPPER } from "../constants/office_docx.js";
export function waitTime(second) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, second * 1000));
        // 이부분 확인 필요
    });
}
export function getOfficeSesctionArea(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(() => {
            const shapeArea = document.querySelector(OFFICE_SECTION);
            if (shapeArea) {
                const shapeAreaRect = shapeArea.getBoundingClientRect();
                return {
                    width: shapeArea.offsetWidth,
                    height: shapeArea.offsetHeight,
                    top: shapeAreaRect.top,
                    left: shapeAreaRect.left
                };
            }
        });
    });
}
export function getCoordinateUsingSelector(page, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        // 좌표 받아오는 역할 => mouse로 핸들링시 필요
        const element = yield page.$(selector);
        if (!element) {
            throw new Error(`Element with selector "${selector}" not found`);
        }
        const rect = yield page.evaluate((el) => {
            const { left, top } = el.getBoundingClientRect();
            return { left, top };
        }, element);
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY
        };
    });
}
export function graphicMove(page, xPosition, yPosition) {
    return __awaiter(this, void 0, void 0, function* () {
        const tableWrapper = yield page.$(TABLE_WRAPPER);
        if (!tableWrapper) {
            throw new Error(`Element with selector "${TABLE_WRAPPER}" not found`);
        }
        const boundingBox = yield tableWrapper.boundingBox();
        if (!boundingBox) {
            throw new Error(`Element with selector "${TABLE_WRAPPER}" does not have a bounding box`);
        }
        // 테두리 위치 계산 (예: 상단 중앙 테두리)
        const startX = boundingBox.x + boundingBox.width / 2;
        const startY = boundingBox.y;
        // 마우스 이동 및 드래그
        yield page.mouse.move(startX, startY);
        yield page.mouse.down();
        yield page.mouse.move(xPosition, yPosition, { steps: 10 });
        yield page.mouse.up();
    });
}
export function graphicSizeTransform(page, newWidth, newHeight) {
    return __awaiter(this, void 0, void 0, function* () {
        const tableWrapper = yield page.$(TABLE_WRAPPER);
        if (!tableWrapper) {
            throw new Error(`Element with selector "${TABLE_WRAPPER}" not found`);
        }
        const boundingBox = yield tableWrapper.boundingBox(); //요소 위치, 크기 정보
        if (!boundingBox) {
            throw new Error(`Element with selector "${TABLE_WRAPPER}" does not have a bounding box`);
        }
        // 현재 크기
        const currentWidth = boundingBox.width;
        const currentHeight = boundingBox.height;
        // 오른쪽 아래 모서리 위치 계산
        const startX = boundingBox.x + currentWidth;
        const startY = boundingBox.y + currentHeight;
        // 목표 위치 계산 (오른쪽 아래 모서리를 드래그하여 새로운 크기로 조정)
        const endX = boundingBox.x + newWidth;
        const endY = boundingBox.y + newHeight;
        // 마우스 이동 및 드래그
        yield page.mouse.move(startX, startY);
        yield page.mouse.down();
        yield page.mouse.move(endX, endY, { steps: 10 });
        yield page.mouse.up();
    });
}
export function withErrorHandling(cb, errorString) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield cb();
        }
        catch (e) {
            console.error(errorString, e);
        }
    });
}
//# sourceMappingURL=util.js.map