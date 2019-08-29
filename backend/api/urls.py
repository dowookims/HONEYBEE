from django.urls import path
from .views import movie_views
from accounts import views
app_name = "api"

urlpatterns = [
    # Auth
    path("users/", views.user_list, name="user_list"),
    path("users/<str:username>/", views.user_detail, name="user_detail"),
    path("users/<str:username>/selected", views.user_selected, name="user_selected"),
    path('users/<str:username>/ratings/', views.user_ratings, name='user_ratings'),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),

    # movies, ratings
    path('movies/', movie_views.movie_list, name='movie_list'),
    path('movies/<int:movie_id>/', movie_views.movie_detail,
         name='movie_detail'),
    path('movies/<int:movie_id>/ratings/',
         movie_views.movie_ratings, name='movie_rating_list'),
    path('ratings/', movie_views.rating_list, name='rating_list'),
    path('ratings/<int:rating_id>/',
         movie_views.rating_detail, name='rating_detail'),
]
