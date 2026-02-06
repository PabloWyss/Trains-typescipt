import {JSX, UIEvent, useCallback, useMemo, useState} from "react";
import LocationSearchInput from "./locationSearchInput/locationsSearchInput";
import type {LocationResult} from "./types";
import trainAPI from "../../axios/axios";
import styled from "styled-components";

type Connection = {
    duration: string;
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

type ConnectionsResponse = {
    connections: Connection[];
};

const Grid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
    gap: 1.75rem;
    margin-top: 0.75rem;

    @media (max-width: 900px) {
        grid-template-columns: minmax(0, 1fr);
    }
`;

const FormColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-top: 0.5rem;
`;

const PrimaryButton = styled.button`
    padding: 0.6rem 1.4rem;
    border-radius: 999px;
    border: none;
    background: #1d4ed8;
    color: #f9fafb;
    font-size: 0.95rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
    transition:
        background 0.15s ease,
        transform 0.1s ease,
        box-shadow 0.15s ease;

    &:hover {
        background: #1e40af;
        transform: translateY(-1px);
        box-shadow: 0 14px 32px rgba(30, 64, 175, 0.4);
    }

    &:disabled {
        opacity: 0.7;
        cursor: default;
        transform: none;
        box-shadow: none;
    }
`;

const Hint = styled.p`
    font-size: 0.83rem;
    color: #6b7280;
`;

const ListContainer = styled.div`
    background: #f9fafb;
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    padding: 0.9rem 0.75rem 0.75rem;
    max-height: 420px;
    overflow-y: auto;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const ConnectionCard = styled.li`
    border-radius: 0.9rem;
    background: #ffffff;
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    box-shadow: 0 12px 20px rgba(15, 23, 42, 0.06);
    border: 1px solid rgba(229, 231, 235, 0.9);
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
`;

const TimeBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    font-size: 0.95rem;
    color: #111827;
`;

const StationNames = styled.div`
    font-size: 0.94rem;
    color: #4b5563;
`;

const ChipRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.1rem;
`;

const Chip = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 0.15rem 0.65rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 500;
    background: #eff6ff;
    color: #1e3a8a;
`;

const Meta = styled.div`
    font-size: 0.78rem;
    color: #6b7280;
`;

const EmptyState = styled.div`
    padding: 1rem;
    text-align: center;
    font-size: 0.9rem;
    color: #6b7280;
`;

const FooterText = styled.p`
    margin-top: 0.4rem;
    font-size: 0.78rem;
    color: #9ca3af;
    text-align: center;
`;

const formatTime = (iso: string | null) => {
    if (!iso) return "--:--";
    const date = new Date(iso);
    return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
};

const formatDuration = (raw: string) => {
    // API duration format: 00d00:43:00
    const match = raw.match(/(\d+)d(\d{2}):(\d{2}):(\d{2})/);
    if (!match) return raw;
    const [, , hh, mm] = match;
    if (hh === "00") return `${parseInt(mm, 10)} min`;
    return `${parseInt(hh, 10)} h ${parseInt(mm, 10)} min`;
};

const ConnectionsSection = (): JSX.Element => {
    const [fromValue, setFromValue] = useState("");
    const [toValue, setToValue] = useState("");
    const [fromLocation, setFromLocation] = useState<LocationResult | null>(null);
    const [toLocation, setToLocation] = useState<LocationResult | null>(null);

    const [connections, setConnections] = useState<Connection[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activeFromLabel = useMemo(
        () => fromLocation?.name ?? (fromValue || "From"),
        [fromLocation, fromValue],
    );
    const activeToLabel = useMemo(
        () => toLocation?.name ?? (toValue ? "To" : ""),
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

            const nextPage = mode === "reset" ? 0 : page + 1;

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

                setConnections((prev) =>
                    mode === "reset" ? newConnections : [...prev, ...newConnections],
                );
                setPage(nextPage);
                setHasMore(newConnections.length === 10);
                setHasSearched(true);
            } catch (e) {
                setError("Could not load connections. Please try again.");
            } finally {
                setIsLoading(false);
            }
        },
        [canSearch, fromLocation, fromValue, isLoading, page, toLocation, toValue],
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
            <FormColumn>
                <LocationSearchInput
                    value={fromValue}
                    onChange={(value) => {
                        setFromValue(value);
                        setFromLocation(null);
                    }}
                    onSelect={(item) => {
                        setFromLocation(item);
                        setFromValue(item.name);
                    }}
                    label="From station"
                    placeholder="Search departure station"
                />
                <LocationSearchInput
                    value={toValue}
                    onChange={(value) => {
                        setToValue(value);
                        setToLocation(null);
                    }}
                    onSelect={(item) => {
                        setToLocation(item);
                        setToValue(item.name);
                    }}
                    label="To station"
                    placeholder="Search arrival station"
                />

                <ButtonRow>
                    <PrimaryButton
                        type="button"
                        disabled={!canSearch || isLoading}
                        onClick={() => runSearch("reset")}
                    >
                        {isLoading ? "Searching…" : "Search connections"}
                    </PrimaryButton>
                    <Hint>
                        Select both stations, then scroll the results list to load more.
                    </Hint>
                </ButtonRow>
            </FormColumn>

            <div>
                <ListContainer onScroll={handleScroll}>
                    {connections.length === 0 && !hasSearched && (
                        <EmptyState>
                            Choose a departure and arrival station to see upcoming journeys.
                        </EmptyState>
                    )}
                    {connections.length === 0 && hasSearched && !isLoading && !error && (
                        <EmptyState>No upcoming connections found for this route.</EmptyState>
                    )}
                    {error && <EmptyState>{error}</EmptyState>}

                    {connections.length > 0 && (
                        <List>
                            {connections.map((c, index) => (
                                <ConnectionCard key={index}>
                                    <CardHeader>
                                        <TimeBlock>
                                            <strong>
                                                {formatTime(c.from.departure)} —{" "}
                                                {formatTime(c.to.arrival)}
                                            </strong>
                                            <span>
                                                {activeFromLabel} → {activeToLabel}
                                            </span>
                                        </TimeBlock>
                                        <TimeBlock style={{textAlign: "right"}}>
                                            <span
                                                style={{
                                                    fontSize: "0.8rem",
                                                    color: "#6b7280",
                                                }}
                                            >
                                                Duration
                                            </span>
                                            <strong>{formatDuration(c.duration)}</strong>
                                        </TimeBlock>
                                    </CardHeader>

                                    <StationNames>
                                        Platform {c.from.platform || "—"} ·{" "}
                                        {c.transfers ?? 0} transfer
                                        {c.transfers === 1 ? "" : "s"}
                                    </StationNames>

                                    <ChipRow>
                                        {c.products?.slice(0, 4).map((p) => (
                                            <Chip key={p}>{p}</Chip>
                                        ))}
                                        {c.products && c.products.length > 4 && (
                                            <Chip>+{c.products.length - 4} more</Chip>
                                        )}
                                    </ChipRow>

                                    <Meta>
                                        {c.from.station.name} → {c.to.station.name}
                                    </Meta>
                                </ConnectionCard>
                            ))}
                        </List>
                    )}

                    {isLoading && connections.length > 0 && (
                        <FooterText>Loading more connections…</FooterText>
                    )}
                    {!hasMore && connections.length > 0 && !isLoading && (
                        <FooterText>No more connections to load.</FooterText>
                    )}
                </ListContainer>
            </div>
        </Grid>
    );
};

export default ConnectionsSection;

