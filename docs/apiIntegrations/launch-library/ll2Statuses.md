# Launch statuses snapshot

**Fetched:** 2026-07-13 from `GET /2.2.0/config/launchstatus/`.

| id | name | abbrev |
|----|------|--------|
| 1 | Go for Launch | Go |
| 2 | To Be Determined | TBD |
| 3 | Launch Successful | Success |
| 4 | Launch Failure | Failure |
| 5 | On Hold | Hold |
| 6 | Launch in Flight | In Flight |
| 7 | Launch was a Partial Failure | Partial Failure |
| 8 | To Be Confirmed | TBC |

Use status `id` / certainty (Go vs TBD) as soft constraint features in FS3 ranking.
