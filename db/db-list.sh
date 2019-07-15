docker exec -i flourish-mysql mysql -uroot -ppassword <<< "show Databases;"
docker exec -i flourish-mysql mysql -uroot -ppassword <<< "Use test; select * from strain;"
