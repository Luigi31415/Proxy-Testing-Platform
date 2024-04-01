import json
import jwt
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views import View
from .models import Proxy
from django.db import IntegrityError
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
from users.jwt_auth import jwt_required

class manageProxy(View):
    @jwt_required
    def get(self, request):
        user_id = self.jwt_payload["user_id"]
        proxies = Proxy.objects.filter(owner_id=user_id) | Proxy.objects.filter(owner__isnull=True)
        serialized_proxies = [{'proxy_id': proxy.id,'ip': proxy.ip, 'port': proxy.port,'last_checked': proxy.last_checked, 'status': proxy.status, "owner": proxy.owner.id if proxy.owner else proxy.owner} for proxy in proxies]
        return JsonResponse({"proxies": serialized_proxies})

    @jwt_required
    def post(self, request):
        user_id = self.jwt_payload["user_id"]
        proxy_id = json.loads(request.body).get('proxy_id')
        
        try:
            proxy = Proxy.objects.get(id=proxy_id)
        except Proxy.DoesNotExist:
            return JsonResponse({"error": "Proxy not found"}, status=404)
        
        if proxy.owner:
            if proxy.owner.id != user_id:
                return JsonResponse({"error": "Proxy already owned by another user"}, status=400)
            else:
                return JsonResponse({"message": "Proxy already owned by this user"}, status=200)
            
        proxy.owner_id = user_id
        proxy.save()
        
        return JsonResponse({"message": "Proxy owner set successfully"}, status=200)

    @jwt_required
    def delete(self, request):
        user_id = self.jwt_payload["user_id"]
        proxy_id = json.loads(request.body).get('proxy_id')
        
        try:
            proxy = Proxy.objects.get(id=proxy_id, owner_id=user_id)
        except Proxy.DoesNotExist:
            return JsonResponse({"error": "Proxy not found or not owned by the current user"}, status=404)
        
        proxy.owner = None
        proxy.save()
        
        return JsonResponse({"message": "Proxy owner removed successfully"}, status=200)
