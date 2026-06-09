# GRC Ecosystem — Backend API Endpoints

Base URL: `/api/v1`. All endpoints return JSON. Auth: `Authorization: Bearer <jwt>`.
For Spring Boot + MongoDB, map each resource below to a `@RestController` + `MongoRepository`.

## Groups
| Method | Path | Description |
|---|---|---|
| GET | `/groups` | List all groups |
| POST | `/groups` | Create a group `{ groupName, color }` |
| GET | `/groups/{id}` | Get group |
| PUT | `/groups/{id}` | Update group |
| DELETE | `/groups/{id}` | Delete group |

## Applications
| Method | Path | Description |
|---|---|---|
| GET | `/apps?groupId=&q=&sort=&active=` | List apps (filter, search, sort) |
| POST | `/apps` | Create `{ appName, appShortName, description, groupId, accentColor, tags[], modules[], active }` |
| GET | `/apps/{id}` | Get one app |
| PUT | `/apps/{id}` | Update app |
| PATCH | `/apps/{id}/active` | Toggle active `{ active }` |
| DELETE | `/apps/{id}` | Delete app |
| PUT | `/apps/reorder` | Persist drag-sort order `{ ids: [] }` |
| GET | `/apps/{id}/modules` | List modules attached to app |
| POST | `/apps/{id}/modules` | Attach modules `{ moduleIds: [] }` |

## Modules (Platform Configurations)
| Method | Path | Description |
|---|---|---|
| GET | `/modules?category=&active=&q=` | List modules |
| POST | `/modules` | Create `{ name, category, active, description }` |
| GET | `/modules/{id}` | Get one |
| PUT | `/modules/{id}` | Update |
| PATCH | `/modules/{id}/active` | Activate/deactivate |
| DELETE | `/modules/{id}` | Delete |
| GET | `/modules/categories` | Distinct categories |

## Generic CRUD for App Modules (records)
Used by every grid (RAUs, Risks, Controls, MCRs, FRCs, MREs, Business Units, Policies, etc.)
| Method | Path | Description |
|---|---|---|
| GET | `/apps/{appId}/m/{moduleName}/records?page=&size=&sort=&q=&filter=` | List records (paginated) |
| POST | `/apps/{appId}/m/{moduleName}/records` | Create record |
| GET | `/apps/{appId}/m/{moduleName}/records/{id}` | Get one |
| PUT | `/apps/{appId}/m/{moduleName}/records/{id}` | Update record |
| DELETE | `/apps/{appId}/m/{moduleName}/records/{id}` | Delete record |
| POST | `/apps/{appId}/m/{moduleName}/records/bulk-delete` | Bulk delete `{ ids: [] }` |
| GET | `/apps/{appId}/m/{moduleName}/records/export?format=json|csv` | Export |
| POST | `/apps/{appId}/m/{moduleName}/records/import` | Import (CSV/JSON) |

## Dashboards / Analytics
| Method | Path | Description |
|---|---|---|
| GET | `/apps/{appId}/dashboard/stats` | Top-bar stats for app dashboard |
| GET | `/apps/{appId}/dashboard/cards` | Configured cards + chart series |
| PUT | `/apps/{appId}/dashboard/config` | Save user's dashboard layout/config |

## Platform Configurations sub-resources
| Resource | Base path |
|---|---|
| Modules | `/config/modules` |
| API Connectors | `/config/api-connectors` |
| Chatbot MCP | `/config/chatbot-mcp` |
| MCP APIs | `/config/mcp-apis` |
| Email Notifications | `/config/email-notifications` |
| Batch Jobs & Scheduling | `/config/batch-jobs` |
| Logging Levels | `/config/logging-levels` |
| Form Feedback | `/config/form-feedback` |

Each sub-resource exposes `GET/POST/PUT/DELETE` following the standard pattern above.

## User & Access Management
| Method | Path | Description |
|---|---|---|
| GET | `/iam/users` | List users |
| POST | `/iam/users` | Create user |
| PUT | `/iam/users/{id}` | Update |
| DELETE | `/iam/users/{id}` | Delete |
| GET/POST/PUT/DELETE | `/iam/permissions` | Permissions CRUD |
| GET/POST/PUT/DELETE | `/iam/entitlements` | Entitlements CRUD |
| GET/POST/PUT/DELETE | `/iam/profiles` | Profiles CRUD |
| POST | `/iam/users/{id}/assign` | Assign profile/permission |

## Workflow Designer
| Method | Path | Description |
|---|---|---|
| GET | `/workflows` | List workflows |
| POST | `/workflows` | Create workflow (DAG JSON) |
| PUT | `/workflows/{id}` | Update |
| POST | `/workflows/{id}/publish` | Publish version |
| GET | `/workflows/{id}/versions` | Version history |
| POST | `/workflows/{id}/run` | Trigger run |

## Risk Inventory Management (per-module example)
- `/apps/a-rim/m/RAUs/records`
- `/apps/a-rim/m/Risks/records`
- `/apps/a-rim/m/Controls/records`
- `/apps/a-rim/m/MCRs/records`
- `/apps/a-rim/m/FRCs/records`
- `/apps/a-rim/m/Controls Library/records`
- `/apps/a-rim/m/MREs/records`
- `/apps/a-rim/m/Business Units/records`
- `/apps/a-rim/m/Policies/records`

## Suggested MongoDB Collections
- `groups`, `apps`, `modules`
- `records_{appId}_{moduleSlug}` (or one `records` collection with `appId` + `module` indexed)
- `users`, `permissions`, `entitlements`, `profiles`
- `workflows`, `workflow_runs`
- `audit_logs` (capture all CRUD)

## Spring Boot mapping suggestion
```
@RestController @RequestMapping("/api/v1/apps")
class AppController {
  @GetMapping ResponseEntity<List<App>> list(...)
  @PostMapping ResponseEntity<App> create(@RequestBody App app)
  @PutMapping("/{id}") ...
  @DeleteMapping("/{id}") ...
  @PutMapping("/reorder") void reorder(@RequestBody List<String> ids)
}
```

The frontend `src/app/data/store.ts` currently implements all of the above against `localStorage`.
Swap the implementation to `fetch(...)` calls against these endpoints when the backend is ready.
