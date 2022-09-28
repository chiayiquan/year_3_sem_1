from friendbook.models import Profile

# for header


def profile_context_processor(request):
    if(request.user.id != None):
        user_profile_data = Profile.objects.get(user_id=request.user.id)
        print(user_profile_data)
        return {
            'profile': user_profile_data
        }
    return {}
