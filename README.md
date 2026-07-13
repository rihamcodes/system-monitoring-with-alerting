# system-monitoring-with-alerting

A containerized system monitoring, log aggregation, and alerting stack deployed locally using Docker Compose — featuring real-time hardware metrics scraping, centralized Docker/host log shipper pipeline, dynamic configuration secrets handling, and automated Slack/Email alert routing.

Note: The focus of this repository is the DevOps and Infrastructure setup: the container networking, Prometheus scrape jobs, Promtail log pipelines, dynamic Alertmanager secret wrapping, and Grafana dashboard provisioning.

---

## 🚀 Observability & Alerting Workflow
```text
Host Hardware & Containers (Node Exporter, cAdvisor, Log Files)
        │
        ├── Metrics scraped by Prometheus (Port 9090)
        │         │
        │         └── If rule fires → Trigger Alertmanager (Port 9093)
        │                                 │
        │                                 ├── Warning → Slack Webhook
        │                                 └── Critical → Slack + Gmail SMTP
        │
        └── Logs shipped by Promtail ──> Ingested by Loki (Port 3100)
                  │
                  ▼
       Grafana Queries Databases (Port 3000)
                  │
                  ▼
       Unified Custom Visual Dashboard
```
Every service runs as a container under a single Docker bridge network. Prometheus scrapes host stats from Node Exporter and container stats from cAdvisor every 15 seconds. If thresholds (such as CPU, Memory, or Disk usage) are breached, Prometheus pushes alerts to Alertmanager. Alertmanager resolves env variables dynamically, groups the alerts, and routes warnings to Slack and critical events to both Slack and Email. Meanwhile, Promtail tails container stdout, host logs, and systemd journals, shipping them directly to Loki, allowing Grafana to map log streams next to metric charts.

---

## 🛠️ Technology Stack
| Layer | Tools |
| :--- | :--- |
| **Metrics Collector** | Prometheus v2.51.2 |
| **Log Database** | Grafana Loki v3.0.0 |
| **Log Shipper** | Grafana Promtail v3.0.0 |
| **Host Exporter** | Node Exporter v1.8.0 |
| **Container Exporter** | cAdvisor v0.56.2 (ghcr.io image) |
| **Visualization** | Grafana v10.4.2 |
| **Alerting Manager** | Alertmanager v0.27.0 |
| **Secrets & Routing** | Slack Webhook API, Gmail SMTP, Bash config wrapper |
| **Orchestration** | Docker, Docker Compose, Makefile |

---

## 🔌 Running Services & Port Access

All services are containerized inside a shared Docker bridge network (`monitoring`). Below is where each service runs and how it is accessed:

*   **Grafana** (`http://localhost:3000`): Runs on host port `3000` to serve the custom-provisioned UI dashboards.
*   **Prometheus** (`http://localhost:9090`): Runs on host port `9090` to collect, store, and query time-series metrics.
*   **Alertmanager** (`http://localhost:9093`): Runs on host port `9093` to route alerts to external APIs and SMTP gateways.
*   **Node Exporter** (`http://localhost:9100`): Runs on host port `9100` to expose hardware and OS metrics from the host machine.
*   **cAdvisor** (`http://localhost:8080`): Runs on host port `8080` to collect resource usage and telemetry directly from Docker containers.
*   **Loki** (`http://localhost:3100`): Runs on host port `3100` to receive and store aggregated log streams.
*   **Promtail** (Internal only): Runs as a background service without exposed host ports, securely forwarding logs directly to Loki inside the internal Docker network.

---

## 🔧 Platform Setup & Configuration Details

### 1. Prometheus Configurations & Rules (`prometheus/`)
*   `prometheus.yml` — Sets up global scrape intervals and jobs. Employs `metric_relabel_configs` to drop metrics originating from non-Docker cgroups collected by cAdvisor, keeping only container-specific targets.
*   `alert_rules.yml` — Implements custom alerting logic for system health: CPU (>80%), Memory (>75%), Disk (>90%), instance heartbeat status (`InstanceDown`), and container lifecycle (`ContainerRestarted`).

### 2. Alertmanager Secrets Wrapper (`alertmanager/`)
*   `alertmanager.yml.template` — Defines the alerting tree: groups notifications, configures SMTP for Gmail TLS and Slack Webhooks, and maps alert severity to specific receivers.
*   `generate-config.sh` — A custom container entrypoint shell script. Since Alertmanager doesn't natively support environment variables in its config file, this script reads `.env` variables at runtime, substitutes them into the template, and boots the Alertmanager process.

### 3. Log Ingestion Pipeline (`loki/` & `promtail/`)
*   `loki-config.yml` — Configures Loki with an active 30-day retention schema (`retention_period: 720h`) and compactor worker limits to keep disk usage light.
*   `promtail-config.yml` — Scrapes three log targets: Docker logs (`/var/run/docker.sock` with dynamic container name label relabeling), host system logs (`/var/log/*`), and systemd journal units.

### 4. Grafana Automatic Provisioning (`grafana/`)
*   `datasources.yml` — Automatically registers Prometheus and Loki as default datasources on boot so they don't have to be configured manually in the UI.
*   `dashboard_provider.yml` & `system_dashboard.json` — Automatically imports a customized 18-panel system dashboard on startup, displaying host CPU/Memory/Disk/Network, Docker resources, and real-time logs.

### 5. Deployment Orchestration (`docker-compose.yml` & `Makefile`)
*   `docker-compose.yml` — Configures networks, volumes, environments, and mounts host directories `/proc`, `/sys`, and `/var/run/docker.sock` as read-only.
*   `Makefile` — Automates commands for managing the stack (`up`, `down`, `restart`, `ps`, `logs`, `clean`).

---

## 📂 Project Directory Structure
```text
.
├── alertmanager/
│   ├── alertmanager.yml.template  # Config template with env placeholders
│   └── generate-config.sh        # Entrypoint script for env injection
├── grafana/
│   └── provisioning/
│       ├── dashboards/
│       │   ├── dashboard_provider.yml  # Registers folder scan location
│       │   └── system_dashboard.json   # 18-panel visual dashboard
│       └── datasources/
│           └── datasources.yml         # Auto-configures Prometheus/Loki
├── loki/
│   └── loki-config.yml            # Loki storage and retention rules
├── prometheus/
│   ├── alert_rules.yml            # Heartbeat, CPU, Memory, Disk rules
│   └── prometheus.yml             # Scrape jobs & metric relabel filters
├── promtail/
│   └── promtail-config.yml        # Docker, host syslog, & journal configurations
├── .env.example                   # Environment configuration template
├── docker-compose.yml             # Main Docker Compose manifest
├── Makefile                       # Operations commands wrapper
└── README.md
```

---

## ▶️ Local Setup & Execution
1. Clone the repository and navigate inside:
   ```bash
   git clone https://github.com/rihamcodes/system-monitoring-with-alerting.git
   cd system-monitoring-with-alerting
   ```

2. Copy the environment file template:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and fill in your credentials:
   *   `SMTP_FROM` & `SMTP_AUTH_USERNAME` (your Gmail address)
   *   `SMTP_AUTH_PASSWORD` (Gmail App Password)
   *   `SLACK_WEBHOOK_URL` & `SLACK_CHANNEL` (Slack channel destination)
   *   `GF_SECURITY_ADMIN_PASSWORD` (Grafana admin login password)

4. Spin up the entire monitoring stack:
   ```bash
   make up
   ```
   Access the Grafana Dashboard locally at `http://localhost:3000` (default login: `admin` / your password).

---

## 📈 Key Learnings & Outcomes
*   Deploying and networking a multi-service monitoring stack using Docker Compose.
*   Collecting and parsing Docker container stdout logs, system logs, and systemd journals using Promtail.
*   Injecting environment variables into applications that don't support native env-vars by writing custom container entrypoint shell wrappers.
*   Optimizing Prometheus memory usage by writing metric relabel rules to filter and drop cgroup metrics from cAdvisor.
*   Using Grafana provisioning to implement an "Observability-as-Code" dashboard setup.
*   Writing PromQL queries to alert on system resource thresholds (CPU, memory, disk usage).
*   Configuring Alertmanager routing trees and inhibition rules to route warning alerts to Slack and critical alerts to Email, muting warnings during system down times.

---

## 👤 Contact & Credits
Riham Ahamed

*   GitHub: [github.com/rihamcodes](https://github.com/rihamcodes)
*   LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile) *(Update with your LinkedIn link)*
