
THISDIR="$(dirname ${BASH_SOURCE[0]})"
# cd $THISDIR

docker build -t flourish-mysql:latest $THISDIR
docker run --name flourish-mysql --publish 3306:3306 -d --rm flourish-mysql:latest

sleep 5s
