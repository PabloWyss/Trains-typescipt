export type Coordinate = {
    type: string;
    x: number | null;
    y: number | null;
};

export type LocationResult = {
    id: string | null;
    name: string;
    score: number | null;
    coordinate: Coordinate;
    distance: number | null;
    icon: string | null;
};

export type LocationsResponse = {
    stations: LocationResult[];
};


export type ElementID = {
    id: string | null
}