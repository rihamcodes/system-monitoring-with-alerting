# System Monitoring and Alerting Platform

This project provides a production-ready monitoring stack using Prometheus, Grafana, Alertmanager, Loki, and Promtail.

## 🚀 Services
- **Prometheus**: Metrics collection and alerting.
- **Grafana**: Visual dashboards for monitoring.
- **Alertmanager**: Routing alerts to notification channels.
- **Node Exporter**: Hardware and OS metrics.
- **cAdvisor**: Container metrics.
- **Loki & Promtail**: Centralized log management.
- **Nginx**: Reverse proxy to access all services.

## 🛠️ Prerequisites
- Docker and Docker Compose installed.

## 🏃 Quick Start
1. Clone this repository.
2. Run the stack:
   ```bash
   make up
   ```
3. Access the services:
   - **Grafana**: http://localhost (Default login: `admin`/`admin`)
   - **Prometheus**: http://localhost/prometheus
   - **Alertmanager**: http://localhost/alertmanager

## 📊 Dashboards
- Once logged into Grafana, go to **Dashboards** -> **Browse**.
- High-level system metrics (CPU, RAM, Disk) are auto-provisioned.

## 🔔 Alerting Logic
Alerts are defined in `prometheus/alert_rules.yml`.
- **High CPU**: > 80% for 2 mins.
- **High Memory**: > 75% for 2 mins.
- **High Disk**: > 90% for 2 mins.
- **Container Restarts**: Detected within a 15 min window.

## 📂 Project Structure
```text
.
├── docker-compose.yml
├── Makefile
├── prometheus/
│   ├── prometheus.yml
│   └── alert_rules.yml
├── alertmanager/
│   └── alertmanager.yml
├── grafana/
│   └── provisioning/
├── loki/
├── promtail/
└── nginx/
```

## 🛠️ Management Commands
- `make up`: Start all services.
- `make down`: Stop services.
- `make logs`: View service logs.
- `make clean`: Reset the environment (removes volumes).
