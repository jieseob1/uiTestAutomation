import path from 'path'

interface Customconsole {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;// ..args는 어떤 형태로 받아오는지
}
let originalConsole = console; //console 객체 저장

const customConsole: Customconsole = {
  log: function (...args: any[]): void {
    const timestamp = new Date().toISOString(); //현재 시간 ISO로 가져옴
    originalConsole.log(`[${timestamp}]`, ...args);
    // do whatever custom thing you want
  },
  error: function (...args: any[]): void { // 해당 부분 확인해봐야 함
    const timestamp = new Date().toISOString();

    const stack = new Error().stack; //새로운 Error 객체 생성 및 스택 트레이스 생성
    if (stack) {
      const stackLines = stack.split('\n'); // 스택 트레이스 줄단위 분리

      // step-definitions 폴더에 있는 첫 번째 파일을 찾습니다.
      const relevantLine = stackLines.find(line => line.includes('step-definitions'));

      if (relevantLine) {
        const match = relevantLine.match(/\(([^)]+)\)/) || relevantLine.match(/at (.+)/);
        // 이게 어떻게 매칭되는지는 모르겠음
        if (match && match[1]) { //  이거 왜 이렇게 매칭함?
          const callerFile = match[1];
          const relativeFilePath = path.relative(process.cwd(), callerFile); //process.cwd뭐임 그리고 .relative는?
          originalConsole.error(`[${timestamp}]  \n Error location: ${relativeFilePath} \n`, ...args);
        }
      }
    }
  }
}
console = customConsole as unknown as Console; // as unknown as Console은 왜 하는걸까