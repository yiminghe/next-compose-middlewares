mv coverage/test-report coverage/test-report2 &&\
mkdir coverage/test-report &&\
npx mochawesome-merge "coverage/test-report2/*.json" > coverage/test-report/index.json &&\
npx marge coverage/test-report/index.json -o coverage/test-report &&\
rm -rf coverage/test-report2 &&\
rm -rf coverage/test-report/mochawesome.json