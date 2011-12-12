#! /bin/bash

sc-build apache_demo --languages=en --build=current --buildroot=www
mv www/static/apache_demo/en/current/index.html www
cp -f apache/.htaccess www
