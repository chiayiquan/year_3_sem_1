from django.http import HttpResponse
from django.conf.urls import url
from django.urls import path
from django.conf import settings
import sys

settings.configure(
    DEBUG=True,
    SECRET_KEY='ThisIsTheSecretKey',
    ROOT_URLCONF=__name__,
    MIDDLEWARE_CLASSES=(
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    )
)


def index(request):
    return HttpResponse('<html><head></head><body><p>Hello World! </p></body></html>')


urlpatterns = [
    path('', index)
]

if __name__ == "__main__":
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
