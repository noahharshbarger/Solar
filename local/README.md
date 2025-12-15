# Local Development Configuration

## Environment Files

- **`.env.example`** - Sanitized template (safe to commit)
- **`.env.development`** - Local development config (gitignored)
- **`.env.production`** - Docker production config (gitignored)

## Quick Setup

### Local Development
```bash
cp local/.env.development backend/.env
```

### Docker Development  
```bash
cp local/.env.production backend/.env
```

## Security Note

The `.env.development` and `.env.production` files contain real credentials and should be gitignored.
Only `.env.example` should be committed to the repository.
