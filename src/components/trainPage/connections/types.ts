export type Connection = {
    duration: string | null;
    products?: string[];
    transfers?: number;
    from: {
        departure: string | null;
        platform: string | null;
        station: {
            name: string;
        };
    };
    to: {
        arrival: string | null;
        station: {
            name: string;
        };
    };
};

export type ConnectionsResponse = {
    connections: Connection[];
};

