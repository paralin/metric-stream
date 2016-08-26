#!/bin/bash

if [[ ! -d "./typings/globals" ]]; then
  echo "Installing typings..."
  npm install typings
  npm run typings-install
else
  echo "Typings already installed, skipping."
fi
