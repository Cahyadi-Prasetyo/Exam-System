# Exam System - Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Prerequisites:**
- Vercel account
- Neon PostgreSQL database

**Steps:**

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel
   ```

2. **Set Environment Variables**
   In Vercel Dashboard → Settings → Environment Variables:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   ```

3. **Run Database Migration**
   ```bash
   npx prisma migrate deploy
   ```

---

### Option 2: Docker (VPS/Self-hosted)

**Prerequisites:**
- Docker & Docker Compose installed
- VPS with 1GB+ RAM

**Steps:**

1. **Clone and Configure**
   ```bash
   git clone <repo-url>
   cd exam-system
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Build and Run**
   ```bash
   docker build -t exam-system .
   docker run -p 3000:3000 --env-file .env exam-system
   ```

3. **With Docker Compose** (if using local PostgreSQL)
   ```yaml
   # docker-compose.yml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgresql://...
         - NEXTAUTH_SECRET=...
       depends_on:
         - db
     db:
       image: postgres:15
       volumes:
         - pgdata:/var/lib/postgresql/data
       environment:
         - POSTGRES_PASSWORD=password
   volumes:
     pgdata:
   ```

---

### Option 3: Manual VPS Deployment

**Steps:**

1. **Install Node.js 20+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd exam-system
   npm install
   ```

3. **Build**
   ```bash
   npx prisma generate
   npm run build
   ```

4. **Run with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "exam-system" -- start
   pm2 save
   pm2 startup
   ```

5. **Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **SSL with Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🔐 Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET` (min 32 chars)
- [ ] Enable HTTPS/SSL
- [ ] Set secure database password
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Enable rate limiting
- [ ] Set up monitoring (uptime, errors)
- [ ] Configure backup for database

---

## 🗄️ Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to `DATABASE_URL`
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

## 📊 Monitoring

**Recommended tools:**
- **Uptime:** UptimeRobot, Better Uptime
- **Errors:** Sentry
- **Analytics:** Vercel Analytics, Plausible
- **Logs:** Logtail, Papertrail
