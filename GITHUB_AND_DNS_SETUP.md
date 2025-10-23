# GitHub and DNS Setup Guide

**Quick setup for pushing code to GitHub and configuring DNS**

---

## Part 1: GitHub Setup (5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `KAIROQUANTUM`
   - **Description**: `KAIRO QUANTUM - Advanced algorithmic trading platform`
   - **Visibility**: Private (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

### Step 2: Get Your Repository URL

After creating the repository, you'll see:
```
https://github.com/YOUR_USERNAME/KAIROQUANTUM.git
```

Copy this URL!

### Step 3: Update Git Remote and Push

Run these commands in your terminal:

```bash
# Remove the placeholder remote
git remote remove origin

# Add your actual GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/KAIROQUANTUM.git

# Verify the remote was added
git remote -v

# Push to GitHub
git push -u origin main
```

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your GitHub password)

#### Creating a Personal Access Token (if needed):

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `KAIROQUANTUM Deploy`
4. Select scopes:
   - ✅ repo (all)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`)
7. Use this as your password when pushing

### Step 4: Verify Push

After pushing, check:
```bash
git log --oneline -5
```

You should see your commits. Visit your GitHub repository to confirm all files are there.

---

## Part 2: DNS Configuration (10 minutes)

### Where is Your Domain Registered?

Find out where you registered `kairoquantum.com`:
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- Other registrar

### Option A: Using Cloudflare (RECOMMENDED)

**Why Cloudflare?**
- Free SSL certificates
- DDoS protection
- CDN (faster loading)
- Easy configuration
- Better security

#### Setup with Cloudflare:

1. **Add Site to Cloudflare**
   - Go to https://dash.cloudflare.com
   - Click "Add a site"
   - Enter: `kairoquantum.com`
   - Select Free plan
   - Click "Add site"

2. **Update Nameservers at Your Registrar**
   - Cloudflare will show you 2 nameservers (like `bob.ns.cloudflare.com`)
   - Go to your domain registrar (where you bought the domain)
   - Find "Nameservers" or "DNS Settings"
   - Replace existing nameservers with Cloudflare's nameservers
   - Save changes
   - Wait 5-30 minutes for propagation

3. **Add DNS Records in Cloudflare**

   Once Cloudflare is active, add these DNS records:

   | Type  | Name | Target | Proxy Status | TTL |
   |-------|------|--------|--------------|-----|
   | CNAME | www  | cname.vercel-dns.com | Proxied (🧡) | Auto |
   | CNAME | @    | cname.vercel-dns.com | Proxied (🧡) | Auto |
   | CNAME | api  | [YOUR-APP].up.railway.app | Proxied (🧡) | Auto |

   **Important**: Replace `[YOUR-APP]` with your actual Railway URL

4. **Configure SSL in Cloudflare**
   - Go to SSL/TLS tab
   - Set SSL mode to: **Full (strict)**
   - Turn ON:
     - Always Use HTTPS
     - Automatic HTTPS Rewrites
     - Opportunistic Encryption

5. **Verify DNS**
   ```bash
   dig www.kairoquantum.com
   dig api.kairoquantum.com
   ```

---

### Option B: Configuration at Your Domain Registrar

If you prefer not to use Cloudflare, configure directly at your registrar:

#### For Most Registrars (GoDaddy, Namecheap, etc.):

1. **Login to your domain registrar**
2. **Find DNS Management** (usually called "DNS Settings" or "Manage DNS")
3. **Add these DNS records:**

   | Type  | Host/Name | Points to / Target | TTL |
   |-------|-----------|-------------------|-----|
   | CNAME | www       | cname.vercel-dns.com | 300 |
   | CNAME | @         | cname.vercel-dns.com | 300 |
   | CNAME | api       | [YOUR-APP].up.railway.app | 300 |

   **Note**: Some registrars don't allow CNAME for root (@). In that case:
   - Use A records instead (you'll get IPs from Vercel/Railway)
   - Or use ALIAS/ANAME records if available

4. **SSL Certificates**
   - Vercel provides automatic SSL for frontend
   - Railway provides automatic SSL for backend
   - Both handle certificate renewal automatically

---

## Part 3: Verification (5 minutes)

### Step 1: Wait for DNS Propagation

DNS changes take time:
- Minimum: 5 minutes
- Typical: 15-30 minutes
- Maximum: 48 hours (rare)

### Step 2: Check DNS Propagation

**Online Tool:**
Visit https://dnschecker.org and check:
- `www.kairoquantum.com`
- `api.kairoquantum.com`

**Command Line:**
```bash
# Check if DNS is resolving
dig www.kairoquantum.com
dig api.kairoquantum.com

# Check if sites are reachable
curl -I https://www.kairoquantum.com
curl -I https://api.kairoquantum.com/api/health/ping
```

### Step 3: Update Deployment Platforms

#### Update Vercel:
1. Go to https://vercel.com
2. Go to your project → Settings → Domains
3. Add domains:
   - `kairoquantum.com`
   - `www.kairoquantum.com`
4. Vercel will show DNS instructions (you've already configured them)
5. Wait for verification checkmarks

#### Update Railway:
1. Go to https://railway.app
2. Go to your project → Backend service → Settings
3. Under "Networking" → "Custom Domain"
4. Add: `api.kairoquantum.com`
5. Railway will show a CNAME record (you've already configured it)
6. Wait for verification

---

## Quick Command Reference

### GitHub Commands
```bash
# Remove old remote
git remote remove origin

# Add your actual GitHub URL (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/KAIROQUANTUM.git

# Push to GitHub
git push -u origin main

# Check remote
git remote -v
```

### DNS Verification Commands
```bash
# Check DNS resolution
dig www.kairoquantum.com
dig api.kairoquantum.com

# Check online
open https://dnschecker.org

# Test HTTPS
curl -I https://www.kairoquantum.com
curl https://api.kairoquantum.com/api/health/ping
```

---

## Troubleshooting

### GitHub Push Issues

**Error: Authentication failed**
- Use Personal Access Token instead of password
- Generate at: https://github.com/settings/tokens

**Error: Repository not found**
- Verify the repository URL is correct
- Check you have access to the repository

**Error: Permission denied**
- Make sure you're the owner or have write access
- Verify your GitHub username

### DNS Issues

**DNS not resolving after 1 hour**
- Check nameservers are updated (if using Cloudflare)
- Verify DNS records are entered correctly
- Check for typos in domain name
- Clear DNS cache: `sudo dscacheutil -flushcache`

**SSL Certificate errors**
- If using Cloudflare: Set SSL mode to "Full (strict)"
- Wait 5-10 minutes for SSL provisioning
- Check certificate at: https://www.ssllabs.com/ssltest/

**CNAME not allowed for root domain (@)**
- Use ALIAS or ANAME record if available
- Or use A records with IP addresses
- Or use Cloudflare (supports CNAME flattening)

---

## Next Steps After Setup

Once GitHub and DNS are configured:

1. **Deploy Backend to Railway**
   ```bash
   railway login
   railway up
   ```

2. **Deploy Frontend to Vercel**
   ```bash
   vercel --prod
   ```

3. **Run Post-Deployment Setup**
   ```bash
   ./post-deployment-setup.sh
   ```

4. **Verify Everything Works**
   ```bash
   ./verify-deployment.sh
   ```

---

## Complete Setup Checklist

- [ ] Created GitHub repository
- [ ] Pushed code to GitHub (`git push -u origin main`)
- [ ] Configured DNS (Cloudflare or registrar)
- [ ] Added www CNAME record
- [ ] Added @ CNAME/A record
- [ ] Added api CNAME record
- [ ] Waited for DNS propagation (5-30 min)
- [ ] Verified DNS with `dig` command
- [ ] Added custom domains in Vercel
- [ ] Added custom domain in Railway
- [ ] SSL certificates are active
- [ ] Frontend accessible at https://www.kairoquantum.com
- [ ] API accessible at https://api.kairoquantum.com

---

## Support Resources

- **GitHub Help**: https://docs.github.com
- **Cloudflare Docs**: https://developers.cloudflare.com
- **Vercel Domains**: https://vercel.com/docs/concepts/projects/domains
- **Railway Domains**: https://docs.railway.app/deploy/custom-domains
- **DNS Checker**: https://dnschecker.org

---

**Status**: Ready to Configure
**Estimated Time**: 15-20 minutes
**Difficulty**: Easy

Follow this guide step by step, and you'll have GitHub and DNS configured quickly!
