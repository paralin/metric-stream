#!/bin/bash
JSON_OUTPUT_PATH=./.tmp.json

if [ ! -d "./scripts" ]; then
  if [ -n "$ATTEMPTED_CD_DOTDOT" ]; then
    echo "You need to run this from the root of the project."
    exit 1
  fi
  set -e
  cd ../ && ATTEMPTED_CD_DOTDOT=yes $@
  exit 0
fi

PROTO_PATH=${GOPATH}/src/github.com/fuserobotics/rethinkts
if [ ! -d "$PROTO_PATH" ]; then
  echo "Set GOPATH to your go workspace and go get fuserobotics/rethinkts."
  exit 1
fi

set -e
./node_modules/protobufjs/bin/pbjs \
  -p ${GOPATH}/src \
  -p ${GOPATH}/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
  -t json \
  $PROTO_PATH/**/*.proto \
  ./proto/**/*.proto > \
  ${JSON_OUTPUT_PATH}
echo "Generated json, $(cat $JSON_OUTPUT_PATH | wc -l) lines."

echo "/* tslint:disable:trailing-comma */" > ./proto/definitions.ts
echo "/* tslint:disable:quotemark */" >> ./proto/definitions.ts
echo "/* tslint:disable:max-line-length */" >> ./proto/definitions.ts
echo "export const definitions = $(cat ${JSON_OUTPUT_PATH});" >> ./proto/definitions.ts

cat $JSON_OUTPUT_PATH | node ./scripts/gen_typings.js > ./proto/definitions.d.ts
cat $JSON_OUTPUT_PATH | node ./scripts/gen_member_resolvers.js > ./proto-server/member_resolvers.ts

rm ${JSON_OUTPUT_PATH} || true
