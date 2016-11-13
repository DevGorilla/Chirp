#!/bin/bash
set -e


rm -f deploymentPackage.zip
npm install
zip -r deploymentPackage.zip ./index.js ./node_modules -x "*/\.*" -x "*license*" -x "*LICENSE*" -x "*README*" -X "*Readme*"

echo "===========Done Zipping. Uploading to AWS Lambda==========="
aws lambda update-function-code --function-name "facebook-vfp" --zip-file "fileb://./deploymentPackage.zip" --profile prod --region "us-east-1"

echo "===========Testing function================ (Expected StatusCode:200)"
aws lambda invoke --function-name "facebook-vfp" --payload "file://./test/sampleDocument.json" --region "us-east-1" --invocation-type "RequestResponse" --log-type "Tail"  deploymentTestResult.txt --profile prod

echo "===========Function returned the following: (EXPECTED: Virtual Field Object)==========="
cat deploymentTestResult.txt

echo "===========Testing function================ (Expected StatusCode:200)"
aws lambda invoke --function-name "facebook-vfp" --payload "file://./test/sampleNonArticleDocument.json" --region "us-east-1" --invocation-type "RequestResponse" --log-type "Tail" deploymentTestResult.txt --profile prod

echo "===========Function returned the following: (EXPECTED: No web_article_url)==========="
cat deploymentTestResult.txt

rm -f deploymentTestResult.txt
rm -f ./deploymentPackage.zip
