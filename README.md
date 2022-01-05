# 포트폴리오 백엔드
## Caveat
- strapi 커맨드를 돌릴 때에는 반드시 url을 제공해 줄 것
```
$ DATABASE_URL=test yarn strapi $STRAPI_ARGS
```
- 어드민 첫 접속시 반드시 public role에 대한 접근 권한을 허용해 줄 것
- 다시 indexing이 필요하지 않을 경우 `.env`에서 `INDEXING_ON_BOOT=true`를 삭제할 것

# endpoints
```
$HOST_URL:1337/admin
$HOST_URL:1337/graphql
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