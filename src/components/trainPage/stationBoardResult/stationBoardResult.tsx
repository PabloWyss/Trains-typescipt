import {UIEvent, useEffect, useState} from "react";
import useApiRequest from "../../../hooks/useAPIRequest";
import {StationBoardResultMainDiv, StationBoardResultsLI} from "./styles.ts";
import type {ElementID} from "../types.ts";
import StationBoardCard from "../stationBoardCard/stationBoardCard.tsx";

type Props = {
    stationId: string | null;
};

type ResponseData = {
    station: {
        id: string;
        name: string;
    }
    stationboard: Array<{
        category: string;
        number: string;
        to: string;
        operator: string;
        stop: {
            departure: string | null;
            prognosis: {
                departure: string | null;
            } | null;
            platform: string | null;
        };
        passList: Array<{
            arrival: string | null;
            departure: string | null;
            station: {
                name: string | null;
            };
        }>;
    }>;
}

const formatTime = (iso: string | null) => {
    if (!iso) return "--:--";
    const date = new Date(iso);
    return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
};

const PAGE_SIZE = 10;

const StationBoardResults = ({stationId}: Props) => {
    const {
        sendRequest,
        data,
        loading,
    } = useApiRequest<ResponseData>();

    const [elementClicked, setElementClicked] = useState<ElementID>(null);
    const [page, setPage] = useState(0);
    const [departures, setDepartures] = useState<ResponseData["stationboard"]>([]);
    const [stationName, setStationName] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (!stationId) return;

        const limit = (page + 1) * PAGE_SIZE;
        sendRequest("GET", "stationboard", null, false, {
            id: stationId,
            limit,
        });
    }, [stationId, page, sendRequest]);

    useEffect(() => {
        if (!data) return;

        setStationName(data.station.name);
        setDepartures(data.stationboard);

        const expected = (page + 1) * PAGE_SIZE;
        setHasMore(data.stationboard.length >= expected);
    }, [data, page]);

    useEffect(() => {
        // Reset pagination when station changes
        setPage(0);
        setDepartures([]);
        setStationName(null);
        setHasMore(false);
        setElementClicked(null);
    }, [stationId]);

    const handleElementClicked = (index: number) => {
        if (index === elementClicked) {
            setElementClicked(null);
        } else {
            setElementClicked(index);
        }
    };

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;
        const distanceToBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight;

        if (distanceToBottom < 120 && hasMore && !loading) {
            setPage((prev) => prev + 1);
        }
    };

    if (!stationId) {
        return (
            <p style={{marginTop: "1.25rem", fontSize: "0.9rem", color: "#6b7280"}}>
                Start by searching for a station to see upcoming departures.
            </p>
        );
    }

    const isInitialLoading = loading && departures.length === 0;

    return (
        <div style={{marginTop: "1.5rem"}}>
            {stationName && (
                <h3
                    style={{
                        marginBottom: "0.75rem",
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        color: "#111827",
                    }}
                >
                    {stationName} departures
                </h3>
            )}

            {isInitialLoading && <p>Loading departures…</p>}

            {departures.length > 0 && (
                <div
                    style={{
                        maxHeight: "420px",
                        overflowY: "auto",
                        paddingRight: "4px",
                        background: "#f9fafb",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                    }}
                    onScroll={handleScroll}
                >
                    <ul style={{listStyle: "none", padding: "0.6rem 0.5rem", margin: 0}}>
                        {departures.map((train, index) => {
                            const departureTime =
                                train.stop.prognosis?.departure || train.stop.departure;

                            return (
                                <StationBoardResultsLI
                                    key={index}
                                    $primary={index % 2 === 0}
                                    onClick={() => handleElementClicked(index)}
                                >
                                    <StationBoardResultMainDiv>
                                        <div style={{flex: 1}}>
                                            <strong style={{fontSize: "15px"}}>
                                                {train.category} {train.number}
                                            </strong>{" "}
                                            → {train.to}
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#6b7280",
                                                    marginTop: "2px",
                                                }}
                                            >
                                                Operator: {train.operator}
                                            </div>
                                        </div>

                                        <div style={{textAlign: "right"}}>
                                            <div
                                                style={{
                                                    fontSize: "15px",
                                                    fontWeight: 500,
                                                    color: "#111827",
                                                }}
                                            >
                                                {formatTime(departureTime)}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#6b7280",
                                                    marginTop: "2px",
                                                }}
                                            >
                                                Platform: {train.stop.platform || "-"}
                                            </div>
                                        </div>
                                    </StationBoardResultMainDiv>
                                    {elementClicked === index && <StationBoardCard train={train}/>}
                                </StationBoardResultsLI>
                            );
                        })}
                    </ul>

                    {loading && departures.length > 0 && (
                        <p
                            style={{
                                textAlign: "center",
                                padding: "0.25rem 0.5rem 0.6rem",
                                fontSize: "0.8rem",
                                color: "#9ca3af",
                            }}
                        >
                            Loading more departures…
                        </p>
                    )}

                    {!hasMore && !loading && departures.length > 0 && (
                        <p
                            style={{
                                textAlign: "center",
                                padding: "0.25rem 0.5rem 0.6rem",
                                fontSize: "0.78rem",
                                color: "#9ca3af",
                            }}
                        >
                            No more departures to load.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StationBoardResults;
