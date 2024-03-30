import json
import jwt
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views import View
from .models import User
from django.db import IntegrityError
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings


class Register(View):
    def post(self, request):
        try:
            user_data = json.loads(request.body)
            username = user_data.get("username")
            password = user_data.get("password")

            if not (username and password):
                return JsonResponse(
                    {"error": "Username, password, and email are required."}, status=400
                )

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists."}, status=400)

            hashed_password = make_password(password)
            user_data["password"] = hashed_password
            user = User.objects.create(**user_data)

            return JsonResponse({"user": str(user)})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except IntegrityError:
            return JsonResponse({"error": "Data Integrity Error."}, status=400)


class Login(View):
    def post(self, request):
        try:
            user_data = json.loads(request.body)
            username = user_data["username"]
            password = user_data["password"]

            # Retrieve user from custom User model
            user = User.objects.get(username=username)

            if user is not None and check_password(password, user.password):
                # Generate JWT token
                token = self.generate_jwt_token(user)
                return JsonResponse({"token": token})
            else:
                return JsonResponse({"error": "Invalid credentials."}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def generate_jwt_token(self, user):
        expiration_time = datetime.now() + timedelta(hours=1)
        payload = {
            "user_id": user.id,
            "exp": expiration_time,
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        return token
