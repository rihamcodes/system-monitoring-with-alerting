docd# System Monitoring and Alerting Platform

This project provides a professional, production-ready monitoring stack using Prometheus, Grafana, and Alertmanager.

## 🚀 Services
- **Prometheus**: Metrics collection and alerting rules evaluation. (Port: 9090)
- **Grafana**: Visual dashboards for metrics visualization. (Port: 3000)
- **Alertmanager**: Routing and notifying on alerts. (Port: 9093)
- **Node Exporter**: Host hardware and OS metrics. (Port: 9100)
- **cAdvisor**: Container resource usage and performance metrics. (Port: 8080)

## 🛠️ Prerequisites
- Docker and Docker Compose installed.

## 🏃 Quick Start
1. Clone this repository.
2. Run the stack:
   ```bash
   docker compose up -d
   ```
3. Access the services:
   - **Grafana**: http://localhost:3000 (Default login: `admin`/`admin`)
   - **Prometheus**: http://localhost:9090
   - **Alertmanager**: http://localhost:9093

## 📊 Dashboards
Log into Grafana, navigate to **Dashboards** -> **Browse**. The Prometheus datasource is auto-mapped. You can import community dashboards (e.g., ID 1860 for Node Exporter) to get started quickly.

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
└── grafana/
    └── provisioning/
```

## 🛠️ Management Commands
- `docker compose up -d`: Start all services.
- `docker compose down`: Stop services.
- `docker compose logs -f`: View service logs.
- `docker compose down -v`: Reset environment (removes data volumes).
