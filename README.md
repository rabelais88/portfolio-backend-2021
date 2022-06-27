# 포트폴리오 백엔드
## Caveat
- strapi 커맨드를 돌릴 때에는 반드시 url을 제공해 줄 것
```
$ DATABASE_URL=test yarn strapi $STRAPI_ARGS
```
- 어드민 첫 접속시 반드시 public role에 대한 접근 권한을 허용해 줄 것
- 다시 indexing이 필요하지 않을 경우 `.env`에서 `INDEXING_ON_BOOT=true`를 삭제할 것
- [strapi v4 플러그인 개발 관련 문서 1](https://docs.strapi.io/developer-docs/latest/development/plugins-development.html#creating-a-plugin)
- [strapi v4 플러그인 개발 관련 문서 2](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/file-structure.html)
- 플러그인 수정시 반드시 `yarn build` 해 줄 것
- 빌드 폴더는 도커의 문제로 볼륨마운트에서 제거가 불가능함. 무조건 들어간다고 봐야함. 그래도 admin-ui 관련 플러그인을 제거하지 않는 이상 이슈 없음.
- 현재 플러그인이 적용되어 있는 부분:
  - 미리보기 버튼

# endpoints
```
# server only mode
$HOST_URL:1337/admin
$HOST_URL:1337/graphql
# frontend mode(admin)
$HOST_URL:8080/admin
$HOST_URL:8080/graphql
```

# local test
```
yarn build
docker-compose -f docker-compose.local-db.yml -f docker-compose.local.yml up
```

# setting up & deploy
```
# https://devcenter.heroku.com/articles/git
cp .env.example .env
vi .env
heroku git:remote -a sungryeol-portfolio
# proceed next step after setting up heroku config vars
git push heroku main
```

2022.6.27 -[] check @/src/index.js for debugging default user info