# DOMJudge

## Introduction

DOMJudge 被广泛用于 ICPC 比赛的评测。

https://www.domjudge.org/download
https://github.com/DOMjudge/domjudge

https://github.com/icpctools/icpctools
https://github.com/CSGrandeur/CCPCOJ
Problem Package Format
https://www.kattis.com/problem-package-format/

## 安装

https://www.domjudge.org/docs/manual/8.3/install-domserver.html

```sh
apt install libcgroup-dev make acl zip unzip pv mariadb-server apache2 php php-fpm php-gd php-cli php-intl php-mbstring php-mysql php-curl php-json php-xml php-zip composer ntp python3-yaml g++ pkg-config

./configure --prefix=/opt/domjudge --with-domjudge-user=root
make domserver
sudo make install-domserver 

mysql
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('');

dj_setup_database genpass
dj_setup_database [-u <mysql admin user>] [-p <password>|-r] install

ln -s /opt/domjudge/domserver/etc/apache.conf /etc/apache2/conf-available/domjudge.conf
ln -s /opt/domjudge/domserver/etc/domjudge-fpm.conf /etc/php/8.2/fpm/pool.d/domjudge.conf
a2enmod proxy_fcgi setenvif rewrite
a2enconf php8.2-fpm domjudge
systemctl reload apache2
```
