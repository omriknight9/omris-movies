export interface Person {
    id: number,
    profile_path: string,
    popularity: number,
    name: string,
    biography: string,
    birthday: string,
    deathday: string,
    imdb_id: string,
    place_of_birth: string,
    gender: number,
    images: PersonImages,
    combined_credits: PersonCredits,
    birthdayToday: boolean,
    age: number,
    deathAge: number,
    known_for_department: string
}

export interface PersonDto {
    page: number,
    results: Person[],
    total_results: number,
}

export interface PersonCredits {
    id: number,
    cast: {
        id: number,
        name: string,
        title: string,
        poster_path: string,
        backdrop_path: string,
        character: string,
        popularity: number,
        first_air_date: string,
        release_date: string,
        media_type: string
    }[],
    crew: {
        id: number,
        name: string,
        gender: number,
        profile_path: string,
        backdrop_path: string,
        popularity: number,
        job: string,
        first_air_date: string,
        release_date: string,
        media_type: string
    }[]
}

export interface PersonImages {
    profiles: {
        file_path: string
    }[]
}