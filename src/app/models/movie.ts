export interface Movie {
    backdrop_path: string,
    genre_ids: number [],
    id: number,
    overview: string,
    tagline: string,
    popularity: number,
    homepage: string,
    poster_path: string,
    release_date: string,
    release_date2: string,
    title: string,
    name: string,
    vote_average: number,
    revenue: string | number,
    runtime: string | number,
    original_language: string,
    status: string,
    first_air_date: string,
    imdb_id: string,
    genres: Genre[],
    production_companies: productionCompanies[],
    images: MovieImages,
    videos: MovieVideo,
    keywords: MovieKeywords,
    credits: MovieCredits,
    similar: MovieSimilar,
    vote_count: number,
}

export interface MovieDto {
    page: number,
    results: Movie[],
    total_results: number,
}

export interface MovieKeywords {
    keywords: {
        id: number,
        name: string
    }[]
}

export interface MovieImages {
    backdrops: {
        file_path: string
    }[]
}

export interface MovieVideo {
    results: {
        id: string,
        site: string,
        key: string
    }[]
}

export interface Genre {
    id: number,
    name: string
}

export interface productionCompanies {
    id: number,
    logo_path: string,
    name: string
}

export interface MovieCredits {
    cast: {
        id: number,
        name: string,
        profile_path: string,
        character: string,
        gender: number,
        imdb_id: string,
        instagram_id: string
    }[],
    crew: {
        id: number,
        name: string,
        gender: number,
        profile_path: string,
        job: string,
        imdb_id: string,
        instagram_id: string
    }[]
}

export interface MovieCrew {
    id: number,
    name: string,
    gender: number,
    profile_path: string,
    job: string,
    imdb_id: string,
    instagram_id: string
}

export interface MovieSimilar {
    results: {
        id: number,
        title: string;
        release_date: string,
        poster_path: string,
        popularity: number
    }[]
}

export interface MovieActorsExternals {
    id: number,
    instagram_id: string,
    imdb_id: string,
}
