# Coupons API - LocalStack Assessments

This project contains Assessment Parts 1 and 2 for a local AWS Coupons API. It uses LocalStack to run IAM, Lambda, API Gateway, CloudWatch Logs, and DynamoDB without connecting to an AWS account.

## Implemented API behavior

| Method | Path | Lambda | Behavior |
| --- | --- | --- | --- |
| GET | `/coupons_poc` | `coupons_list` | Returns the Part 1 API success message |
| GET | `/coupons_poc/{id}` | `coupons_get_by_id` | Retrieves a coupon using the `id` path parameter |
| PUT | `/coupons_poc/{id}` | `coupons_update` | Updates supported coupon fields using the `id` path parameter |

## DynamoDB design

The `coupons` table uses `id` as its string partition key and provisioned capacity mode.

- Average item size: 1 KB.
- Required eventually consistent reads: 50 per second.
- One RCU supports two eventually consistent reads per second for items up to 4 KB, so the table uses 25 RCUs.
- Required 1 KB writes: 10 per second, so the table uses 10 WCUs.
- Global secondary index: `provider_id-campaign_id-index`.
- Index partition key: `provider_id`.
- Index sort key: `campaign_id`.

The table definition is stored in `dynamodb/table-definition.json`, and three reproducible sample records are stored in `dynamodb/seed-items.json`.

## Security and functions

The `coupons_lambda_role` role trusts Lambda and has two inline policies:

- CloudWatch Logs access restricted to log groups beginning with `/aws/lambda/coupons`.
- DynamoDB read, update, query, and describe access restricted to the `coupons` table and its indexes.

The Part 2 Lambdas use the AWS SDK for JavaScript v3. `coupons_get_by_id` explicitly performs an eventually consistent read. `coupons_update` validates the request body, updates only supported fields, and returns the updated item.

## Prerequisites

- Windows PowerShell
- WSL 2
- Docker Desktop using Linux containers
- AWS CLI v2
- Node.js and npm

LocalStack is pinned to Community version `4.14.0` because later images require an authentication token.

## Run from a fresh clone

1. Start Docker Desktop.
2. Open PowerShell in the project folder.
3. Run `npm install`.
4. Follow `Command.txt` from top to bottom.

LocalStack resources are local and may need to be recreated after the container is replaced. `Command.txt` contains the full reproducible sequence.

## Tests and output files

| File | Purpose |
| --- | --- |
| `tests/coupons-list.test.js` | Part 1 Lambda unit test |
| `tests/coupons-get-by-id.test.js` | Get-by-ID unit tests |
| `tests/coupons-update.test.js` | Update unit tests |
| `unit_test_output.json` | Jest JSON report with all unit tests |
| `output-get-by-id.json` | Direct get-by-ID Lambda response |
| `output-update.json` | Direct update Lambda response |
| `output-get-after-update.json` | Direct read after the update |
| `api-get-by-id-output.json` | GET response through API Gateway |
| `api-update-output.json` | PUT response through API Gateway |
| `gsi-query-output.json` | Successful composite-index query |
| `table-description-output.json` | Table capacity and index configuration |
| `lambda-functions-output.json` | Registered Part 2 Lambda configurations |
| `coupons_newman.json` | Part 1 Postman/Newman collection |
| `Command.txt` | Ordered setup, deployment, test, and evidence commands |

Run the unit tests and regenerate their JSON report with:

```powershell
npm run test:json
```

## Recording checklist

Show the following in the Part 2 recording:

1. `docker compose ps` showing LocalStack as healthy.
2. `describe-table` showing the `coupons` table, 25 RCUs, 10 WCUs, and the global secondary index.
3. Both policies attached to `coupons_lambda_role`.
4. The `coupons_get_by_id` and `coupons_update` Lambda configurations.
5. GET `/coupons_poc/coupon-001` returning the matching item.
6. PUT `/coupons_poc/coupon-001` updating that item.
7. The composite-index query returning matching coupons.
8. `npm run test:json` showing all unit tests passing.

Push the `assessment-part-2` branch, open a pull request, upload the recording to the D2L dropbox, and paste the GitHub link into the submission comment.
