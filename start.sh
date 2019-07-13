
THISDIR="$(dirname ${BASH_SOURCE[0]})"
cd $THISDIR

cd $THISDIR/db
npm stop
npm start

cd ../$THISDIR/api
npm start
