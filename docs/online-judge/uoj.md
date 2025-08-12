# Universal Online Judge

https://github.com/UniversalOJ/UOJ-System

- Git clone

## 安装

```sh
apt install zip unzip apache2 libapache2-mod-xsendfile libapache2-mod-php php php-dev php-pear php-zip php-mysql php-mbstring php-gd php-intl php-xsl g++ make re2c libyaml-dev
pecl install yaml
apt install mariadb-server

printf "\n\n==> Setting LAMP configs\n"
    #Set Apache UOJ site conf
    cat >/etc/apache2/sites-available/000-uoj.conf <<UOJEOF
<VirtualHost *:80>
    #ServerName local_uoj.ac
    ServerAdmin opensource@uoj.ac
    DocumentRoot /var/www/uoj

    SetEnvIf Request_URI "^/judge/.*$" judgelog
    #LogLevel info ssl:warn
    ErrorLog \${APACHE_LOG_DIR}/uoj_error.log
    CustomLog \${APACHE_LOG_DIR}/uoj_judge.log common env=judgelog
    CustomLog \${APACHE_LOG_DIR}/uoj_access.log combined env=!judgelog

    XSendFile On
    XSendFilePath /var/uoj_data
    XSendFilePath /var/www/uoj/app/storage
    XSendFilePath /opt/uoj/judger/uoj_judger/include
</VirtualHost>
UOJEOF
    #Enable modules and make UOJ site conf enabled
    a2ensite 000-uoj.conf && a2dissite 000-default.conf
    a2enmod rewrite headers && sed -i -e '172s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf
    #Create UOJ session save dir and make PHP extensions available
    mkdir --mode=733 /var/lib/php/uoj_sessions && chmod +t /var/lib/php/uoj_sessions

# Set webroot path
    ln -sf $PWD /var/www/uoj
    chown -R www-data /var/www/uoj/app/storage
    # Set web config file
    php -a <<UOJEOF
\$config = include '/var/www/uoj/app/.default-config.php';
\$config['judger']['socket']['port']='$_judger_socket_port_';
file_put_contents('/var/www/uoj/app/.config.php', "<?php\nreturn ".str_replace('\'_httpHost_\'','UOJContext::httpHost()',var_export(\$config, true)).";\n");
UOJEOF

#Set uoj_data path
    mkdir -p /var/uoj_data/upload
    chown -R www-data:www-data /var/uoj_data
    #Using cli upgrade to latest
    php /var/www/uoj/app/cli.php upgrade:latest
```

SQL

```sql
use mysql;
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('root');
use app_uoj233
```

```bash
cat >/etc/mysql/conf.d/uoj_mysqld.cnf <<UOJEOF
[mysqld]
default-time-zone='+8:00'
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'
init_connect='SET collation_connection = utf8mb4_unicode_ci'
skip-character-set-client-handshake
sql-mode=ONLY_FULL_GROUP_BY,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
UOJEOF
mysql < app_uoj233.sql
mysql < add_judger.sql 
Field 'ip' doesn't have a default value
```

Current issue, compatibility issue with PHP 8.2

PHP 7.4:
https://dmvrtx.me/2023/06/php-7.4-on-debian-bookworm/
