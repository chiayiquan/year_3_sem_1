from .models import *
# from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import login, logout
from django.contrib.auth.hashers import check_password
from django.contrib.auth.decorators import login_required
import json

@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        email = body['email']
        password = body['password']
        user = User.objects.get(email=email)
        if check_password(password, user.password):
            if user.is_active:
                login(request, user)
                return Response({}, status=status.HTTP_200_OK)
            else:
                return Response({'status':'Your account is disabled'},status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'status': "Incorrect username or password"},status=status.HTTP_401_UNAUTHORIZED)