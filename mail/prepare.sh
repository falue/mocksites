#!/usr/bin/env bash
cd $(dirname $0)
mkdir -p config
touch config/postfix-accounts.cf
docker run --rm \
  -e MAIL_USER=jonaswid_92@gmail.com \
  -e MAIL_PASS=1234 \
  -ti tvial/docker-mailserver:latest \
  /bin/sh -c 'echo "$MAIL_USER|$(doveadm pw -s SHA512-CRYPT -u $MAIL_USER -p $MAIL_PASS)"' > config/postfix-accounts.cf

docker run --rm \
  -e MAIL_USER=swish@gmail.com \
  -e MAIL_PASS=1234 \
  -ti tvial/docker-mailserver:latest \
  /bin/sh -c 'echo "$MAIL_USER|$(doveadm pw -s SHA512-CRYPT -u $MAIL_USER -p $MAIL_PASS)"' >> config/postfix-accounts.cf

docker run --rm \
      -v "$(pwd)/config":/tmp/docker-mailserver \
        -ti tvial/docker-mailserver:latest generate-dkim-config
