from .models import Movie, Rating
from rest_framework import serializers


class MovieSerializer(serializers.ModelSerializer):
    genres_array = serializers.ReadOnlyField()

    class Meta:
        model = Movie
        fields = ('id', 'title', 'genres_array',
                  'avg_rating', 'rating_count', 'story', 'still_cut', 'poster')


class RatingSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username')
    title = serializers.SerializerMethodField('get_movie_title')
    story = serializers.SerializerMethodField('get_movie_story')
    poster = serializers.SerializerMethodField('get_movie_poster')

    class Meta:
        model = Rating
        fields = ('id', 'rating', 'username',
                  'title', 'movie_id', 'story', 'poster', 'timestamp')

    def get_movie_title(self, obj):
        return obj.movie.title

    def get_movie_poster(self, obj):
        return obj.movie.poster

    def get_movie_story(self, obj):
        return obj.movie.story

    def get_username(self, obj):
        return obj.user.username
