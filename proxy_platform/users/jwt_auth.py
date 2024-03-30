import jwt
from django.conf import settings
from django.http import JsonResponse
from functools import wraps

def jwt_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        # Get the JWT token from the request
        auth_header = args[0].headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({"error": "Invalid Authorization header"}, status=401)
        token = auth_header.split(' ')[1]

        # Verify the JWT token
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)

        # Attach the decoded payload to the request object
        request.jwt_payload = payload

        return view_func(request, *args, **kwargs)

    return wrapped_view
