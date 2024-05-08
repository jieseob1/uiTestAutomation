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
