# Coupons API — LocalStack Assessment

This project creates a local AWS REST API with `GET /coupons_poc`. API Gateway invokes the `coupons_list` Lambda, which returns:

```json
{
  "message": "Coupons API is working successfully"
}
```

## Implemented requirements

- IAM role `coupons_lambda_role` with a Lambda trust policy.
- CloudWatch Logs access restricted to `/aws/lambda/coupons*` log groups.
- Node.js Lambda function `coupons_list`.
- API Gateway REST endpoint `GET /coupons_poc` on the `test` stage.
- Jest unit test using a sample API Gateway event.
- Newman collection containing status, JSON, and response-body assertions.
- JSON reports from Lambda, the live API, Jest, and Newman.

## Prerequisites

- Windows PowerShell
- WSL 2
- Docker Desktop using Linux containers
- AWS CLI v2
- Node.js and npm

LocalStack is pinned to Community version `4.14.0` because later images require an authentication token.

## Run from a fresh clone

1. Start Docker Desktop.
2. Open PowerShell in this project folder.
3. Run `npm install`.
4. Follow the project commands in `Command.txt` beginning with **Configure fake credentials used only by LocalStack**.

The REST API ID is generated during deployment. The Newman command passes that value to the collection through its `apiId` variable.

## Important files

| File | Purpose |
| --- | --- |
| `src/index.js` | Lambda handler |
| `events/api-gateway-event.json` | Sample API Gateway event |
| `tests/coupons-list.test.js` | Jest unit test |
| `iam/trust-policy.json` | Lambda role trust policy |
| `iam/cloudwatch-policy.json` | Prefix-restricted logging permissions |
| `coupons_newman.json` | Postman/Newman collection |
| `unit_test_output.json` | Jest JSON test report |
| `newman_output.json` | Newman JSON test report |
| `output-lambda.json` | Direct Lambda invocation output |
| `api_output.json` | Live API response |
| `Command.txt` | Complete ordered command record |

## Recording checklist

Show the following in one recording:

1. Docker Desktop and `docker compose ps` showing LocalStack as healthy.
2. The IAM role and restricted inline policy using the evidence commands in `Command.txt`.
3. The registered `coupons_list` Lambda configuration.
4. A GET request to `/coupons_poc` and its successful JSON response.
5. `npm run test:json` with one passing unit test.
6. The Newman run with three passing assertions.
7. The important project files in VS Code.

Upload the finished recording to the D2L dropbox and paste the GitHub repository link into the D2L submission comment.
