#!/bin/sh

celery -A proxy_platform.celery worker --detach --loglevel=info --logfile=/app/celery_worker.log
celery -A proxy_platform.celery beat --detach --loglevel=info --logfile=/app/celery_beat.log
python /app/manage.py runserver 0.0.0.0:8000
