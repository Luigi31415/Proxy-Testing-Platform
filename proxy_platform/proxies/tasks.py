# your_app_name/tasks.py
from celery import shared_task
from .models import Proxy
import urllib
from datetime import datetime

@shared_task
def check_proxy():
    proxies = Proxy.objects.all()
    for proxy in proxies:
        ip = proxy.ip
        port = proxy.port
        proxy_handler = urllib.request.ProxyHandler({'http': f'http://{ip}:{port}','https': f'http://{ip}:{port}'})
        opener = urllib.request.build_opener(proxy_handler)
        
        urllib.request.install_opener(opener)
        try:
            response = urllib.request.urlopen('http://google.com', timeout=10)
            if response.getcode() == 200:
                print(f"Proxy {ip}:{port} is working")
                proxy.status = "UP"
                proxy.last_checked = datetime.now()
                proxy.save()
            else:
                print(f"Proxy {ip}:{port} returned status code {response.getcode()}")
                proxy.status = "DOWN"
                proxy.last_checked = datetime.now()
                proxy.save()
        except Exception as e:
            print(f"Error: {e}")
            proxy.status 
            
