export interface TvShow {
    id: string,
    backdrop_path: string,
    first_air_date: string,
    number_of_seasons: number,
    number_of_episodes: number,
    networks: Networks[],
    external_ids: TvShowExternalIDs,
    credits: TvShowCredits,
    images: TvShowImages,
    videos: TvShowVideo,
    similar: TvShowSimilar,
    overview: string,
    tagline: string,
    popularity: number,
    original_language: string,
    homepage: string,
    poster_path: string,
    release_date: string,
    release_date2: string,
    name: string,
    genre_ids: number [],
    genres: TvShowGenre[],
    vote_average: number,
    revenue: string | number,
    runtime: string | number,
    status: string,
    imdb_id: string,
}

export interface Networks {
    id: number,
    logo_path: string,
    name: string
}

export interface TvShowDto {
    page: number,
    results: TvShow[],
    total_results: number,
    episodes: TvShowEpisodes[]
}

export interface TvShowEpisodes {
    overview: string,
    guest_stars: {
        character: string,
        gender: number,
        name: string,
        popularity: number
    }[];
}

export interface TvShowExternalIDs {
    id: number,
    imdb_id: string,
}

export interface TvShowGenre {
    id: number,
    name: string
}

export interface TvShowCredits {
    cast: {
        id: number,
        name: string;
        profile_path: string,
        character: string,
        gender: number,
        imdb_id: string,
        instagram_id: string
    }[];
}

export interface TvShowImages {
    backdrops: {
        file_path: string
    }[]
}

export interface TvShowImages {
    backdrops: {
        file_path: string
    }[]
}

export interface TvShowVideo {
    results: {
        id: string,
        site: string,
        key: string
    }[]
}

export interface TvShowSimilar {
    results: {
        id: number,
        title: string;
        first_air_date: string,
        poster_path: string,
        popularity: number
    }[]
}

export interface TVShowActorsExternals {
    id: number,
    instagram_id: string,
    imdb_id: string,
}