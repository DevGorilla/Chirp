#!/usr/bin/env bash
BUCKET= dwesleybrown.com
DIR=build/
aws  s3  sync $DIR s3://$BUCKET/ --profile default
