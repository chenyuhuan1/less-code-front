#!/bin/sh
cd /data/mwbase/less-code-front;
rm -rf *;
cd /data/mwbase/backup/bak-less-code-front/rdc;
cp package.tgz  /data/mwbase/less-code-front/;
cp package.tgz  `date "+%Y-%m-%d-%T"`.tgz;
cd /data/mwbase/less-code-front/;
tar -xf package.tgz;
mv ./dist/* ./
rm -rf package.tgz;
rm -rf deploy.sh;
rm -rf dist;
#ln -s ./ static;
