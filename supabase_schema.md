# Supabase Database Schema & Policies

## Overview
All tables in the `public` schema currently have **Row Level Security (RLS) Disabled** (`rls_enabled: false`).
There are **no policies** defined on any of these tables.

---

## Tables

### 1. `organisations`
| Column | Type | Constraints / Default |
|--------|------|------------------------|
| `id` | `uuid` | PRIMARY KEY, default: `uuid_generate_v4()` |
| `name` | `text` | NOT NULL |
| `logo_url` | `text` | NULL |
| `created_at` | `timestamptz` | default: `now()` |

### 2. `users`
| Column | Type | Constraints / Default |
|--------|------|------------------------|
| `id` | `uuid` | PRIMARY KEY, default: `uuid_generate_v4()` |
| `username` | `text` | NOT NULL, UNIQUE |
| `email` | `text` | NOT NULL, UNIQUE |
| `password_hash` | `text` | NOT NULL |
| `role` | `text` | CHECK `role IN ('admin', 'hr', 'team_lead', 'applicant', 'candidate')` |
| `is_active` | `boolean` | default: `true` |
| `created_at` | `timestamptz` | default: `now()` |

### 3. `organisation_users`
| Column | Type | Constraints / Default |
|--------|------|------------------------|
| `id` | `uuid` | PRIMARY KEY, default: `uuid_generate_v4()` |
| `organisation_id`| `uuid` | FOREIGN KEY > `organisations.id` |
| `user_id` | `uuid` | FOREIGN KEY > `users.id` |

### 4. `jobs`
| Column | Type | Constraints / Default |
|--------|------|------------------------|
| `id` | `uuid` | PRIMARY KEY, default: `uuid_generate_v4()` |
| `organisation_id`| `uuid` | FOREIGN KEY > `organisations.id` |
| `created_by` | `uuid` | FOREIGN KEY > `users.id` |
| `title` | `text` | NOT NULL |
| `description` | `text` | NULL |
| `skills` | `text[]` | NULL |
| `ats_threshold` | `integer`| default: `70` |
| `expiry_date` | `timestamptz`| NULL |
| `status` | `text` | default: `'active'`, CHECK `status IN ('active', 'expired', 'closed')` |
| `created_at` | `timestamptz`| default: `now()` |
| `slug` | `text` | UNIQUE, NULL |
| `responsibilities`| `text[]` | NULL |
| `requirements` | `text[]` | NULL |
| `benefits` | `text[]` | NULL |

### 5. `application_statuses`
| Column | Type | Constraints / Default |
|--------|------|------------------------|
| `status` | `text` | PRIMARY KEY |
| `label` | `text` | NOT NULL |
| `description` | `text` | NULL |

### 6. `applications`
| Column | Type | Constraints / Default |
|--------|------|------------------------|
| `id` | `uuid` | PRIMARY KEY, default: `uuid_generate_v4()` |
| `job_id` | `uuid` | FOREIGN KEY > `jobs.id` |
| `candidate_name` | `text` | NULL |
| `candidate_email`| `text` | NULL |
| `resume_url` | `text` | NULL |
| `ats_score` | `integer`| NULL |
| `status` | `text` | FOREIGN KEY > `application_statuses.status`, default: `'pending'` |
| `created_at` | `timestamptz`| default: `now()` |
| `ats_result` | `jsonb` | NULL |
| `comments` | `text` | NULL |
| `candidate_id` | `uuid` | FOREIGN KEY > `users.id` |

---

## Policies

**No RLS policies are currently configured for the tables in the `public` schema.**

> Note: RLS should typically be enabled on tables exposed through the Supabase Data API for security. However, since the access might be done via a secure backend or serverless functions, it may not be strictly necessary depending on your environment architecture.
