FROM richarvey/nginx-php-fpm

ADD config/php.ini /etc/php5/conf.d/php.ini
ADD config/php.ini /etc/php5/php.ini

RUN apk update
RUN apk add php5-pear
RUN pear install net_smtp mail
