# 🔐 AKHQ + Nginx Secure Setup (Login Protected)

This setup provides:

- Apache Kafka UI via AKHQ
- Nginx reverse proxy
- Username/password login protection (Basic Auth)

## 🧱 Architecture

`Browser-> Nginx (Login Protection)->AKHQ (Docker UI)->Kafka Cluster`

## 📦 1. Install Nginx

```bash
# Installation
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
systemctl status nginx
```

## 🔐 2. Create Username & Password (Basic Auth)

```bash
# Install utility:
sudo apt install apache2-utils -y

# Create login user:
sudo htpasswd -c /etc/nginx/.htpasswd admin
# Enter password when prompted (example: admin123)
```

## 🌐 3. Nginx Configuration (AKHQ Reverse Proxy with Login)

```bash
# Create config file:
sudo nano /etc/nginx/sites-available/akhq
```

```nginx
server {
    listen 8081;
    server_name localhost;

    location / {
        auth_basic "AKHQ Login Required";
        auth_basic_user_file /etc/nginx/.htpasswd;

        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔗 4. Enable Nginx Site

```bash
sudo ln -s /etc/nginx/sites-available/akhq /etc/nginx/sites-enabled/
```

## 🔄 5. Test & Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🐳 6. Run AKHQ (Docker)

```bash
http://localhost:8081
```

- Login will appear:
  - Username: admin
  - Password: admin123

### 🔐 Security Notes

- Login is handled by Nginx (not AKHQ)
- No direct access to port 8080 should be exposed publicly
- Password is stored in: `/etc/nginx/.htpasswd`
