.PHONY: up down restart ps logs clean

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

ps:
	docker compose ps

logs:
	docker compose logs -f

clean:
	docker compose down -v
	docker system prune -f
