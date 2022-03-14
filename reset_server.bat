docker build -t code_harmony_nginx  .
@REM docker run --name chn -p 80:80 -p 8080:8080 -d code_harmony_nginx
PAUSE
@REM docker container stop chn
@REM docker container rm chn
@REM docker image rm code_harmony_nginx