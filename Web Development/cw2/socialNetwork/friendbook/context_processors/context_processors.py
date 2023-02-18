from friendbook.models import Profile
import requests

from django.urls import reverse
# for header


def profile_context_processor(request):
    if(request.user.id != None):
        user_profile_data = Profile.objects.get(user_id=request.user.id)

        get_friends_url = reverse('getFriendList', args=[request.user.username])
        friend_list = requests.get(request.build_absolute_uri(get_friends_url), params=request.GET)
        print(friend_list.json())
        return {
            'profile': user_profile_data,
            'friends':friend_list.json()
        }
    return {}
