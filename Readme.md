## 동작 방법
- 해당 테스트는 node 18.10버전 이상에서 사용할 수 있고, 오피스에서는 Node 16버전을 사용하고 있으므로, 18.10버전으로 버전업 한 뒤 사용하도록 해야한다.

- nvm 설치 방법 가이드: https://github.com/nvm-sh/nvm
- 맥 기준 nvm 설치하는 방법
1. `$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash` 커맨드 입력 or brew install nvm 
2. 설치 후 => 추후 작성

이제 cucumber-js 명령어를 실행하면 다음과 같은 순서로 테스트가 실행됩니다:

.feature 파일에서 시나리오를 읽어옵니다.
<!-- support/world.js에서 정의한 CustomWorld 클래스의 인스턴스를 생성합니다.
support/hooks.js에서 정의한 Before 훅이 실행되어 브라우저를 실행합니다. -->
각 step-definitions에서 각 step마다 Before,After를 세팅하게 됩니다.
기본적으로는 Before에서는 
```
Before(async function () {
  browser = await puppeteer.launch();
  page = await browser.newPage();
});
```
와 같은 방식으로 구현하고 테스트가 끝나면
```
AfterAll(async function () {
  await browser.close();
});
```
위와 같이 browser를 종료해주시면 됩니다. 

### 시나리오에서 파라미터 사용하는 방법

cucumber를 사용하여 시나리오 작성시, 파라미터를 사용해서 다양한 값으로 시나리오 실행이 가능합니다.

#### 파라미터 정의하기
- 시나리오 파일에서 파라미터를 정의하려면, `Scenario Outline` 키워드를 사용한다. 파라미터는 `<>`로 표현한다.

##### 파라미터 예시
Scenario Outline: name of scenari 
  Given login using <username> and <password>
  hen Navigate to <url> page
  Then Verify <parameter>

  Examples:
    | username | password | url    | parameter |
    | value1   | value2   | value3 | value4    |
    | value5   | value6   | value7 | value8    |


##### 사용부 예시

```
Given('Login with {string} and {string}', async function (username, password) {

});

When('Navigate to {string} page', async function (url) {

});

Then('Verify {string}', async function (param) {

})
```

### Before,After
@cucumber/cucumber에서 가지고 오면 됩니다.

1. BeforeAll => 모든 시나리오 전에 한 번 실행되는 코드
2. Before => 각 시나리오 전에 실행되는 코드(테스트 데이터 초기화 또는 사용자 로그인)
3. BeforeStep => 각 단계 전에 실행되는 코드(예시: 각 단계 전 스크린샷 촬영)

### 콘솔 창 띄우는 방법
맥기준 cmd + shift + D 눌러서 디버거용 터미널 생성


### 여러 창을 듸워서 작업 하는 방법
- 공동 편집의 경우, 여러 명이 작업 하는 것을 구현해야 한다.


## 이슈 공유
1. 공동 편집 케이스에서 문서 다수를 열어놓고 시작할 때, timeout 에러가 발생하는 경우
- 여러 케이스를 확인해본 결과, cucumber에서의 timeout 시간을 5초로 설정해놓고 있고, 문서에 입장하는 시간이 있기 때문에, Given 부분에서는 따로 timeout을 설정하여, 여유있게 설정하도록 해야된다.

2. 간혹가다 글자가 사라지는 경우
- "Hello world,"를 쓰기 바랬는데, 어쩌다가 "Hell world," 이런식으로 글자가 유실되는 케이스 발견
- 해당 이슈가 어째서 발생하는 것인지는 확인중이지만, util.js에서의 writeText 함수에서 delay를 주는 부분이 있는데, 딜레이 시간을 줌으로써, 어느정도의 해결 가능


## Puppeer 기능
### page 기능
#### evaluate
- 컨텍스트에서 함수 평가 및 결과 반환 =>Promise 해결때까지 기다렸다가 해당 값을 반환한다.

#### rect.left, window.pageXOffset
  - rect.left는 뷰포트 기준의 좌표 => 현재 브라우저 창에 보이는 영역
  -  현재 스크롤 위치를 고려하지 않고, 뷰포트의 왼쪽 가장자리를 기준으로 요소의 왼쪽 경계까지의 거리

- rect.left + window.pageXOffset
  - window.pageXOffset는 페이지의 가로 스크롤 위치를 나타낸다.
  -  페이지 전체 기준의 좌표 => 실제 위치를 페이지 전체에서의 절대 좌표


### 추가 고려 사항
1. textContext vs innerText
- innerText: textContent와 달리 <script> 및 <style> 요소를 포함하지 않고 사람이 읽을 수 있는 요소만을 보여준다.
- DOM에서 HTMLElement 인터페이스 속성으로, 해당 노드와 그 자손의 렌더링된 텍스트 내용을 나타내나.

2. replace(/\n/g, '') 이란
- \n => 줄 바꿈 문자 매칭, g는 글로벌 플래그로, 문자열 내 모든 발생 대체
- 서브스트링이나 패턴을 대체하는 데 사용된다. 즉, 문자열에서 모든 줄 바꿈 문자를 제거한다.