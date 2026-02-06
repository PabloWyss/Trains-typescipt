import type {JSX, UIEvent} from "react";
import type {Connection} from "./types";
import {
    Chip,
    ChipRow,
    ConnectionCard,
    EmptyState,
    FooterText,
    List,
    ListContainer,
    Meta,
    StationNames,
    CardHeader,
    TimeBlock,
} from "./styles";

type Props = {
    connections: Connection[];
    activeFromLabel: string;
    activeToLabel: string;
    isLoading: boolean;
    hasMore: boolean;
    error: string | null;
    hasSearched: boolean;
    onScroll: (event: UIEvent<HTMLDivElement>) => void;
};

const formatTime = (iso: string | null) => {
    if (!iso) return "--:--";
    const date = new Date(iso);
    return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
};

const formatDuration = (raw: string | null) => {
    if (!raw) return "—";
    // API duration format: 00d00:43:00
    const match = raw.match(/(\d+)d(\d{2}):(\d{2}):(\d{2})/);
    if (!match) return raw;
    const [, , hh, mm] = match;
    if (hh === "00") return `${parseInt(mm, 10)} min`;
    return `${parseInt(hh, 10)} h ${parseInt(mm, 10)} min`;
};

const ConnectionsList = ({
    connections,
    activeFromLabel,
    activeToLabel,
    isLoading,
    hasMore,
    error,
    hasSearched,
    onScroll,
}: Props): JSX.Element => {
    return (
        <ListContainer onScroll={onScroll}>
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
                                Platform {c.from.platform || "—"} · {c.transfers ?? 0} transfer
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
    );
};

export default ConnectionsList;

