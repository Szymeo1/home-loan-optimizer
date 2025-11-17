# CI/CD Pipeline Documentation

This project uses GitHub Actions for continuous integration and deployment.

---

## 🚀 Automated Deployment

### How It Works

Every time you push to the `main` branch, the app automatically:
1. ✅ Builds the application
2. ✅ Runs type checks
3. ✅ Deploys to GitHub Pages
4. ✅ Updates live site

**No manual deployment needed!**

---

## 📋 Workflows

### 1. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual trigger via GitHub Actions UI

**Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Build application (`npm run build`)
5. Deploy to `gh-pages` branch

**Status:** 
- Check at: https://github.com/riteshkawadkar/home-loan-optimizer/actions

### 2. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Pull requests to `main`
- Push to `main` branch

**Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Type check (`tsc --noEmit`)
5. Build application
6. Upload build artifacts

**Purpose:** Catch errors before merging

---

## 🔄 Workflow Diagram

```
┌─────────────────┐
│  Push to main   │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│   CI Workflow   │  │   Deploy     │
│                 │  │   Workflow   │
│ • Type Check    │  │              │
│ • Build         │  │ • Build      │
│ • Test          │  │ • Deploy     │
└─────────────────┘  └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ GitHub Pages │
                     │   Updated    │
                     └──────────────┘
```

---

## 💻 Usage

### Automatic Deployment

Simply push your changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**That's it!** GitHub Actions will:
- Build your app
- Deploy to GitHub Pages
- Update the live site in ~2 minutes

### Manual Deployment

If you need to manually trigger deployment:

1. Go to: https://github.com/riteshkawadkar/home-loan-optimizer/actions
2. Click "Deploy to GitHub Pages"
3. Click "Run workflow"
4. Select branch: `main`
5. Click "Run workflow"

### Local Deployment (Backup)

If GitHub Actions is down:

```bash
npm run deploy
```

---

## 📊 Monitoring

### Check Deployment Status

**GitHub Actions:**
- https://github.com/riteshkawadkar/home-loan-optimizer/actions

**GitHub Pages:**
- https://github.com/riteshkawadkar/home-loan-optimizer/settings/pages

### View Logs

1. Go to Actions tab
2. Click on latest workflow run
3. Click on job name
4. Expand steps to see logs

### Deployment History

All deployments are tracked:
- Commit message
- Timestamp
- Build duration
- Success/failure status

---

## 🔧 Configuration

### Workflow Permissions

The workflow needs `contents: write` permission to push to `gh-pages` branch.

**Already configured in:** `.github/workflows/deploy.yml`

### Secrets

No secrets needed! Uses built-in `GITHUB_TOKEN`.

### Node Version

Currently using: **Node.js 18**

To change:
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Change here
```

### Build Command

Default: `npm run build`

To change, update in `deploy.yml`:
```yaml
- name: Build application
  run: npm run build:prod  # Your custom command
```

---

## 🐛 Troubleshooting

### Deployment Failed

**Check:**
1. View workflow logs in Actions tab
2. Look for error messages
3. Common issues:
   - TypeScript errors
   - Build failures
   - Missing dependencies

**Fix:**
```bash
# Test locally first
npm run build

# If successful, push again
git push origin main
```

### Build Succeeds Locally but Fails in CI

**Possible causes:**
- Different Node versions
- Missing dependencies in package.json
- Environment-specific code

**Solution:**
```bash
# Use exact versions
npm ci

# Test with same Node version
nvm use 18
npm run build
```

### Deployment Successful but Site Not Updated

**Wait:** GitHub Pages can take 2-5 minutes to update

**Check:**
1. Clear browser cache (Ctrl+Shift+R)
2. Check GitHub Pages settings
3. Verify gh-pages branch updated

**Force refresh:**
```bash
# Manually trigger deployment
npm run deploy
```

### Type Check Errors

**Fix before pushing:**
```bash
# Check types locally
npx tsc --noEmit

# Fix errors
# Then commit and push
```

---

## 🎯 Best Practices

### Before Pushing

1. **Test locally:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check types:**
   ```bash
   npx tsc --noEmit
   ```

3. **Review changes:**
   ```bash
   git diff
   ```

### Commit Messages

Use clear, descriptive messages:
```bash
✅ Good:
git commit -m "Add dark mode toggle"
git commit -m "Fix calculation error in amortization"
git commit -m "Update README with deployment instructions"

❌ Bad:
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

### Branch Strategy

**Main branch:**
- Always deployable
- Protected (optional)
- Auto-deploys on push

**Feature branches:**
- Create for new features
- Open PR to main
- CI runs on PR
- Merge after approval

---

## 📈 Performance

### Build Time

Typical build times:
- **Install dependencies:** ~30s
- **Type check:** ~10s
- **Build:** ~20s
- **Deploy:** ~10s
- **Total:** ~70s (1-2 minutes)

### Optimization

Already optimized:
- ✅ `npm ci` (faster than `npm install`)
- ✅ Node.js cache enabled
- ✅ Parallel jobs where possible

### Cost

**GitHub Actions Free Tier:**
- 2,000 minutes/month (public repos)
- Unlimited for public repos
- **This project uses:** ~2 minutes per deployment

**Cost:** $0 (FREE) ✅

---

## 🔐 Security

### Permissions

Workflow has minimal permissions:
- `contents: write` - Only to push to gh-pages

### Secrets

No secrets stored or required.

### Dependencies

Automated security:
- Dependabot enabled (optional)
- npm audit on install
- Regular updates recommended

---

## 📚 Advanced Configuration

### Deploy to Custom Domain

Add to `deploy.yml`:
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    cname: yourdomain.com  # Add this
```

### Deploy Preview for PRs

Create `.github/workflows/preview.yml`:
```yaml
name: Deploy Preview

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Slack Notifications

Add to workflow:
```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🎉 Benefits

### Automated Deployment
- ✅ No manual steps
- ✅ Consistent builds
- ✅ Fast deployment
- ✅ Error detection

### Quality Assurance
- ✅ Type checking
- ✅ Build verification
- ✅ Automated testing
- ✅ PR validation

### Developer Experience
- ✅ Push and forget
- ✅ Quick feedback
- ✅ Easy rollback
- ✅ Deployment history

---

## 📞 Support

### Issues

If CI/CD fails:
1. Check workflow logs
2. Test locally
3. Open an issue with logs
4. Tag with `ci/cd` label

### Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

---

## 🔄 Updates

### Workflow Updates

To update workflows:
1. Edit `.github/workflows/*.yml`
2. Commit and push
3. Changes apply immediately

### Node Version Update

Update in both workflows:
- `deploy.yml`
- `ci.yml`

### Action Version Updates

Keep actions up to date:
```yaml
uses: actions/checkout@v4  # Latest
uses: actions/setup-node@v4  # Latest
uses: peaceiris/actions-gh-pages@v3  # Latest
```

---

## ✅ Checklist

After setup, verify:

- [ ] Workflows exist in `.github/workflows/`
- [ ] Push to main triggers deployment
- [ ] Check Actions tab shows green ✓
- [ ] Live site updates after deployment
- [ ] PR checks run on pull requests
- [ ] Build artifacts are created

---

**Your CI/CD pipeline is now active!** 🚀

Every push to `main` automatically deploys to:
https://riteshkawadkar.github.io/home-loan-optimizer/

---

*Last Updated: November 2024*
