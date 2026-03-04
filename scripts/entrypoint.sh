#!/bin/sh
set -e

firebase emulators:start --import=testdata --project "${FIREBASE_PROJECT:-demo-sampark}" &
sleep 10
npm run dev -- --host &
wait
