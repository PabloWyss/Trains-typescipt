import type {JSX, UIEvent} from "react";
import {useCallback, useMemo, useState} from "react";
import type {LocationResult} from "./types";
import trainAPI from "../../axios/axios";
import type {Connection, ConnectionsResponse} from "./connections/types.ts";
import {Grid} from "./connections/styles.ts";
import ConnectionsForm from "./connections/ConnectionsForm.tsx";
import ConnectionsList from "./connections/ConnectionsList.tsx";

const ConnectionsSection = (): JSX.Element => {
    const [fromValue, setFromValue] = useState("");
    const [toValue, setToValue] = useState("");
    const [fromLocation, setFromLocation] = useState<LocationResult | null>(null);
    const [toLocation, setToLocation] = useState<LocationResult | null>(null);

    const [connections, setConnections] = useState<Connection[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activeFromLabel = useMemo(
        () => fromLocation?.name ?? (fromValue || "From"),
        [fromLocation, fromValue],
    );
    const activeToLabel = useMemo(
        () => toLocation?.name ?? (toValue || "To"),
        [toLocation, toValue],
    );

    const canSearch = !!(fromLocation || fromValue) && !!(toLocation || toValue);

    const runSearch = useCallback(
        async (mode: "reset" | "append") => {
            if (!canSearch || isLoading) return;

            const from = fromLocation?.id || fromValue;
            const to = toLocation?.id || toValue;

            if (!from || !to) return;

            setIsLoading(true);
            setError(null);

            const nextPage =
                mode === "reset" ? 0 : Math.floor(connections.length / 10);

            try {
                const response = await trainAPI.get<ConnectionsResponse>("connections", {
                    params: {
                        from,
                        to,
                        limit: 10,
                        page: nextPage,
                    },
                });
                const newConnections = response.data.connections ?? [];
                setConnections((prev) => {
                    if (mode === "reset") return newConnections;

                    const existingKeys = new Set(
                        prev.map(
                            (c) =>
                                `${c.from.station.name}-${c.to.station.name}-${c.from.departure}-${c.to.arrival}`,
                        ),
                    );

                    const deduped = newConnections.filter((c) => {
                        const key = `${c.from.station.name}-${c.to.station.name}-${c.from.departure}-${c.to.arrival}`;
                        if (existingKeys.has(key)) {
                            return false;
                        }
                        existingKeys.add(key);
                        return true;
                    });

                    return [...prev, ...deduped];
                });
                setHasMore(newConnections.length === 10);
                setHasSearched(true);
            } catch (e) {
                setError("Could not load connections. Please try again.");
            } finally {
                setIsLoading(false);
            }
        },
        [canSearch, connections.length, fromLocation, fromValue, isLoading, toLocation, toValue],
    );

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;
        const distanceToBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight;

        if (distanceToBottom < 120 && hasMore && !isLoading) {
            void runSearch("append");
        }
    };

    return (
        <Grid>
            <ConnectionsForm
                fromValue={fromValue}
                toValue={toValue}
                setFromValue={setFromValue}
                setToValue={setToValue}
                setFromLocation={setFromLocation}
                setToLocation={setToLocation}
                canSearch={canSearch}
                isLoading={isLoading}
                onSearch={() => runSearch("reset")}
            />

            <ConnectionsList
                connections={connections}
                activeFromLabel={activeFromLabel}
                activeToLabel={activeToLabel}
                isLoading={isLoading}
                hasMore={hasMore}
                error={error}
                hasSearched={hasSearched}
                onScroll={handleScroll}
            />
        </Grid>
    );
};

export default ConnectionsSection;

