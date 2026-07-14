# Launch Library 2 documentation (local kit)

Upstream: https://thespacedevs.com/llapi · API base `https://ll.thespacedevs.com/2.2.0/`  
**Auth:** none on public tier. **CORS:** Yes. Respect rate limits.

## Key objects

| Object | Useful fields |
|--------|----------------|
| **Launch** | `id`, `name`, `net`, `window_start`, `window_end`, `status`, `launch_service_provider`, `rocket`, `mission`, `pad` |
| **Status** | `id`, `name`, `abbrev`, `description` |
| **Agency** | `id`, `name`, `abbrev`, `type`, `country_code`, `featured` |
| **Pad / Location** | pad `name`, nested `location.name` |
| **Rocket config** | `full_name`, `family`, `variant` |

## Common query params

| Param | Use |
|-------|-----|
| `limit` / `offset` | Pagination |
| `lsp__id` | Filter by launch service provider agency id |
| `status` | Filter by status id |
| `featured` | Agencies flagged featured |

## Examples (labs FS3 / FS5)

```bash
curl -s "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=5"
curl -s "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=5&lsp__id=121"
curl -s "https://ll.thespacedevs.com/2.2.0/config/launchstatus/"
```

Attribution: The Space Devs / Launch Library 2; follow upstream ToS.
