# nestjs 환경설정에 대해서 알아보겠습니다.
<p>환경변수는 @nestjs/config 패키지를 사용하니, npm i @nestjs/config 로 패키지 설치해주세요 이 패키지는 dotenv 라이브러리를 사용하는데, 이는 .env 확장자를 읽어옵니다.</p>
<p>app.module.ts에서 환경변수 파일들을 컨트롤 합니다.</P>
<p>app.module.ts에서 @nestjs/config 패키지에서 가져온 ConfigModule 클래스를 이용하는데, 이는 환경 설정에 특화된 기능을 하는 모듈 입니다.</P>
<p>@Module내에 imports: [ConfigModule.forRoot()], 를 추가하여 .env 파일을 환경설정으로 읽어옵니다.</P>
<p>기본적으로 데이터를 읽어 올 때에는 ConfigService 의존성 주입을 사용하여 ConfigModule의 데이터를 사용합니다.</p>

```
constructor(private readonly configService: configService){}
```

<br><br>

# 1. .env 환경변수 설정하기
```
ConfigModule.forRoot()
```
root 디렉토리에 .env 파일을 생성하고 아래 내용을 작성합니다.
```
MESSAGE=hello nestjs
WEATHER_API_URL=http://api.openwearthermap.org/data/2.5/forecast?id=524901&appid=
WEATHER_API_KEY=my_weather_api_key
```
테스트 메서드는 app.controller.ts의 getHello() 입니다. MESSAGE의 값을 출력해줍니다.

<br><br>

# 2. ConfigModule의 전역변수 isGlobal: true 사용하기
```
ConfigModule.forRoot({ isGlobal: true })
```
<p>이걸 전역변수로 사용하면, ConfigModule에서 등록한 환경변수들을 전역으로 사용합니다.</p>
<p>전역변수로 설정을 하면, 다른 @Module에서 선언하지 않아도 사용이 가능해집니다.</p>
<p>아래는 다른 컨트롤러,모듈을 새로 생성하는 명령어 입니다.</p>

```
npx @nestjs/cli g module weather
npx @nestjs/cli g controller weather --no-spec
```

테스트 메서드는 weather/weather.controller.ts의 getWeather() 입니다.

<br><br>

# 3. local, dev, prod 환경 변수 사용하기
<p>환경 변수명은 보통 NODE_ENV 를 사용하며, 각각 환경설정 파일을 다르게 설정하여 배포 할 수 있어 편리합니다.</p>
<p>package.json의 파일을 수정해줍니다.</p>

```
"start": "set NODE_ENV=local&& nest start",
"start:dev": "set NODE_ENV=dev&& nest start --watch",
"start:prod": "set NODE_ENV=prod&& node dist/main",
```

<p>각각 따로 사용할 환경설정 파일을 envs/ 폴더에 local.env, dev.env, prod.env를 생성 했습니다.</p>
<p>환경 변수명을 이용하여 생성한 환경변수를 각각 설정 해봅시다.</p>

```
ConfigModule.forRoot({ 
  isGlobal: true,
  envFilePath: `${process.cwd()}/envs/${process.envNODE_ENV}.env`,
})
```
<p>테스트 메서드는 app.module.ts의 console.log 와 app.controller.ts의 getServiceUrl() 입니다.</p>

<br><br>

# 4. 커스텀 환경 설정 하기
<p>공통 환경변수파일을 configs/common.ts에 만들어줍니다.</p>
<p>이후 각각의 환경 변수명에 따라 데이터를 덮어 쓸 configs/{local.ts, dev.ts, prod.ts}파일들을 config.ts 파일에서 컨트롤 합니다.</p>
<p>이후 app.module.ts에 커스텀 설정 파일을 추가 해줍니다.</p>

```
import config from '/configs/config';

ConfigModule.forRoot({ 
  isGlobal: true,
  envFilePath: `${process.cwd()}/envs/${process.envNODE_ENV}.env`,
  load: [config],
})
```
테스트 메서드는 app.controller.ts의 getTest() 입니다.

<br><br>

# 5. YAML 사용하기
<p>최근에는 YAML을 사용하는 경우가 많습니다. 쿠버네티스, 스프링에서 지원 합니다.</p>

```
npm i js-yaml
npm i -D @types/js-yaml
```
-D 옵션은 개발, 빌드시에만 필요한 패키지로, 배포시 용량을 줄일수 있습니다.

envs/config.yaml을 생성하고 데이터를 입력합니다.

configs/config.ts에 readFileSync와 yaml을 import 하고, yamlConfig 설정하고 기존 환경설정 파일 뒤에 추가합니다.

테스트 메서드는 app.controller.ts의 getRedisInfo() 입니다.

<br><br>

# 6. 캐시 사용하기
환경설정은 로딩시 한번만 불러오고 변경을 하지 않으니, 이는 메모리에 올려서 사용하는게 성능상 좋습니다.
```
ConfigModule.forRoot({ 
  isGlobal: true,
  envFilePath: `${process.cwd()}/envs/${process.envNODE_ENV}.env`,
  load: [config],
  cache: true,
})
```

<br><br>

# 7. 확장변수 사용하기
envs/local.env를 살펴보면, 환경변수를 등록하고 이를 이용한 환경변수를 또 등록 합니다.

```
SERVER_DOMAIN=localhost
SERVER_PORT=3000

SERVICE_URL=http://${SERVICE_URL}:${SERVER_PORT}
```


이렇게 사용하기 위해서는 expandVariables 설정이 필요합니다.

```
ConfigModule.forRoot({ 
  isGlobal: true,
  envFilePath: `${process.cwd()}/envs/${process.envNODE_ENV}.env`,
  load: [config],
  cache: true,
  expandVariables: true,
})
```
테스트 메서드는 app.controller.ts의 getServerUrl() 메서드 입니다.

<br><br>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
