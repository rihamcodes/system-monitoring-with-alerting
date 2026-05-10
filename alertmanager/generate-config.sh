#!/bin/sh
export SMTP_FROM SMTP_AUTH_USERNAME SMTP_AUTH_PASSWORD ALERT_EMAIL_TO SLACK_WEBHOOK_URL SLACK_CHANNEL
while IFS= read -r line; do
  eval "echo \"$line\""
done < /etc/alertmanager/alertmanager.yml.template > /etc/alertmanager/alertmanager.yml
exec /bin/alertmanager --config.file=/etc/alertmanager/alertmanager.yml --storage.path=/alertmanager
