.PHONY: help build up down logs clean restart status shell-backend shell-mongo backup

help:
	@echo "Church Management System - Docker Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make build          Build all Docker images"
	@echo "  make up             Start all services"
	@echo "  make down           Stop all services"
	@echo "  make logs           View logs from all services"
	@echo "  make restart        Restart all services"
	@echo "  make clean          Remove all containers and images"
	@echo "  make status         Show container status"
	@echo "  make shell-backend  Open shell in backend container"
	@echo "  make shell-mongo    Open MongoDB shell"
	@echo "  make backup         Backup MongoDB database"

build:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

clean:
	docker-compose down -v
	docker image prune -a -f

status:
	docker-compose ps

shell-backend:
	docker-compose exec backend sh

shell-mongo:
	docker-compose exec mongodb mongosh

backup:
	@echo "Creating MongoDB backup..."
	docker-compose exec mongodb mongodump --out /data/backup
	docker cp church-mongodb:/data/backup ./mongodb-backup-$$(date +%Y%m%d-%H%M%S)
	@echo "Backup completed!"
