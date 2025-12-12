# 🚀 Guide de Déploiement VPS OVH

## 📋 Prérequis

### Informations VPS
- **Hostname**: vps-63198d57.vps.ovh.net
- **OS**: Ubuntu 24.04
- **RAM**: 8 Go
- **CPU**: 4 vCores
- **Stockage**: 75 Go
- **Localisation**: Gravelines (France)

### Logiciels requis sur le VPS
- Docker
- Docker Compose
- Git
- Nginx (optionnel, si reverse proxy externe)

---

## 🔧 Configuration Initiale du VPS

### 1. Connexion SSH

```bash
ssh root@vps-63198d57.vps.ovh.net
```

### 2. Mise à jour du système

```bash
apt update && apt upgrade -y
```

### 3. Installation de Docker

```bash
# Installer les dépendances
apt install -y ca-certificates curl gnupg lsb-release

# Ajouter la clé GPG officielle Docker
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Ajouter le dépôt Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker Engine
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Vérifier l'installation
docker --version
docker compose version
```

### 4. Installation de Git

```bash
apt install -y git
git --version
```

### 5. Créer un utilisateur dédié (sécurité)

```bash
# Créer l'utilisateur
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy

# Passer à l'utilisateur deploy
su - deploy
```

### 6. Cloner le projet

```bash
# Créer le dossier du projet
sudo mkdir -p /opt/metiers-de-bouche
sudo chown deploy:deploy /opt/metiers-de-bouche

# Cloner le dépôt
cd /opt
git clone <VOTRE_URL_GIT> metiers-de-bouche
cd metiers-de-bouche
```

### 7. Configuration des variables d'environnement

```bash
# Créer le fichier .env.production
nano .env.production
```

**Contenu du fichier `.env.production`** :

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<GENERER_MOT_DE_PASSE_FORT>

# Redis
REDIS_PASSWORD=<GENERER_MOT_DE_PASSE_FORT>

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=<GENERER_MOT_DE_PASSE_FORT>

# JWT
JWT_SECRET=<GENERER_SECRET_FORT>
JWT_EXPIRES_IN=7d

# Node
NODE_ENV=production
```

**Générer des mots de passe forts** :

```bash
openssl rand -base64 32  # Postgres
openssl rand -base64 32  # Redis
openssl rand -base64 32  # MinIO
openssl rand -hex 64     # JWT Secret
```

### 8. Déployer l'application

```bash
# Utiliser le fichier docker-compose de production
docker compose -f docker-compose.prod.yml --env-file .env.production up -d

# Vérifier les logs
docker compose -f docker-compose.prod.yml logs -f

# Vérifier que tous les services sont UP
docker compose -f docker-compose.prod.yml ps
```

### 9. Initialiser les migrations de base de données

```bash
# Auth service
docker compose -f docker-compose.prod.yml exec auth-service npx prisma migrate deploy

# Recipe service
docker compose -f docker-compose.prod.yml exec recipe-service npx prisma migrate deploy

# Label service
docker compose -f docker-compose.prod.yml exec label-service npx prisma migrate deploy
```

### 10. Configurer le pare-feu

```bash
# Activer UFW (Uncomplicated Firewall)
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
sudo ufw status
```

---

## 🔑 Configuration GitHub Actions (CI/CD)

### 1. Générer une clé SSH pour le déploiement

Sur votre **machine locale** :

```bash
ssh-keygen -t ed25519 -C "deploy@metiers-de-bouche" -f ~/.ssh/metiers_de_bouche_deploy
```

### 2. Ajouter la clé publique au VPS

```bash
# Copier la clé publique vers le VPS
ssh-copy-id -i ~/.ssh/metiers_de_bouche_deploy.pub deploy@vps-63198d57.vps.ovh.net
```

Ou manuellement :

```bash
# Sur le VPS (en tant qu'utilisateur deploy)
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Coller le contenu de metiers_de_bouche_deploy.pub
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 3. Configurer les secrets GitHub

Aller sur votre dépôt GitHub :
- **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Ajouter les secrets suivants :

| Nom           | Valeur                                       |
|---------------|----------------------------------------------|
| `VPS_HOST`    | `vps-63198d57.vps.ovh.net`                   |
| `VPS_USER`    | `deploy`                                     |
| `VPS_SSH_KEY` | Contenu de `~/.ssh/metiers_de_bouche_deploy` (clé privée) |

**Comment récupérer la clé privée** :

```bash
cat ~/.ssh/metiers_de_bouche_deploy
```

Copiez **tout le contenu** (y compris `-----BEGIN OPENSSH PRIVATE KEY-----` et `-----END OPENSSH PRIVATE KEY-----`).

### 4. Tester le déploiement

```bash
# Pousser sur la branche main
git push origin main
```

GitHub Actions va automatiquement :
1. Se connecter au VPS via SSH
2. Récupérer les derniers commits
3. Rebuilder les images Docker
4. Redémarrer les services

---

## 🌐 Configuration DNS (Optionnel)

### Si vous avez un nom de domaine

1. **Ajouter un enregistrement A** dans votre zone DNS :

```
Type: A
Nom: @  (ou www)
Valeur: <IP_DU_VPS>
TTL: 3600
```

2. **Configurer Nginx avec Let's Encrypt (SSL)**

Sur le VPS :

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir un certificat SSL
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com

# Renouvellement automatique (cron déjà configuré par Certbot)
```

---

## 📊 Monitoring et Logs

### Voir les logs d'un service

```bash
docker compose -f docker-compose.prod.yml logs -f <service_name>

# Exemples
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f api-gateway
docker compose -f docker-compose.prod.yml logs -f auth-service
```

### État des services

```bash
docker compose -f docker-compose.prod.yml ps
```

### Redémarrer un service

```bash
docker compose -f docker-compose.prod.yml restart <service_name>
```

### Nettoyer les ressources Docker inutilisées

```bash
docker system prune -af --volumes
```

---

## 🔄 Mises à jour manuelles

Si GitHub Actions ne fonctionne pas :

```bash
# Se connecter au VPS
ssh deploy@vps-63198d57.vps.ovh.net

# Aller dans le dossier du projet
cd /opt/metiers-de-bouche

# Récupérer les dernières modifications
git pull origin main

# Rebuilder et redémarrer
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# Vérifier les logs
docker compose -f docker-compose.prod.yml logs -f
```

---

## 🛡️ Sécurité

### 1. Désactiver l'authentification par mot de passe SSH

```bash
sudo nano /etc/ssh/sshd_config
```

Modifier :

```
PasswordAuthentication no
PubkeyAuthentication yes
```

Redémarrer SSH :

```bash
sudo systemctl restart sshd
```

### 2. Configurer Fail2Ban (protection contre les attaques brute-force)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Limiter l'accès root

```bash
sudo nano /etc/ssh/sshd_config
```

Modifier :

```
PermitRootLogin no
```

Redémarrer SSH :

```bash
sudo systemctl restart sshd
```

---

## 🚨 Troubleshooting

### Service ne démarre pas

```bash
# Voir les logs détaillés
docker compose -f docker-compose.prod.yml logs <service_name>

# Reconstruire l'image
docker compose -f docker-compose.prod.yml build --no-cache <service_name>
docker compose -f docker-compose.prod.yml up -d <service_name>
```

### Base de données corrompue

```bash
# Backup de la base de données
docker exec saas-postgres-prod pg_dumpall -U postgres > backup.sql

# Restaurer depuis un backup
docker exec -i saas-postgres-prod psql -U postgres < backup.sql
```

### Espace disque saturé

```bash
# Vérifier l'espace disque
df -h

# Nettoyer Docker
docker system prune -af --volumes

# Nettoyer les logs système
sudo journalctl --vacuum-time=3d
```

---

## 📞 Support

En cas de problème, vérifier :
1. Les logs Docker : `docker compose logs -f`
2. L'état des services : `docker compose ps`
3. Les variables d'environnement : `cat .env.production`
4. La connectivité réseau : `ping vps-63198d57.vps.ovh.net`

---

## ✅ Checklist de déploiement

- [ ] VPS configuré (Docker, Git installés)
- [ ] Utilisateur `deploy` créé et configuré
- [ ] Projet cloné dans `/opt/metiers-de-bouche`
- [ ] Fichier `.env.production` créé avec des secrets forts
- [ ] Services démarrés avec `docker-compose.prod.yml`
- [ ] Migrations de base de données exécutées
- [ ] Pare-feu configuré (ports 22, 80, 443)
- [ ] Clé SSH générée et ajoutée au VPS
- [ ] Secrets GitHub configurés (VPS_HOST, VPS_USER, VPS_SSH_KEY)
- [ ] Premier push sur `main` et déploiement réussi
- [ ] SSL configuré (si domaine personnalisé)
- [ ] Monitoring activé

---

**Votre application est maintenant en production ! 🎉**

Accessible via : `http://vps-63198d57.vps.ovh.net` (ou votre domaine personnalisé)
