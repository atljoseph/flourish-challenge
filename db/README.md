# MySQL Docker Image

## Dependencies

```
[Install Docker]
[Start Docker]
npm start
npm stop
```

## Raw Docker CLI Commands

```
docker build -t flourish-mysql:latest .
docker run --name flourish-mysql --publish 3306:3306 -d --rm flourish-mysql:latest
docker container kill flourish-mysql
```

Note: Killing a running container deletes all the data within it.



