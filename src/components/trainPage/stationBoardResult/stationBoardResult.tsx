import {useEffect, useState} from "react";
import useApiRequest from "../../../hooks/useAPIRequest";
import {StationBoardResultMainDiv, StationBoardResultsLI} from "./styles.ts";
import type {ElementID} from "../types.ts";

type Props = {
    stationId: string | null;
};

const formatTime = (iso: string | null) => {
    if (!iso) return "--:--";
    const date = new Date(iso);
    return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
};


const StationBoardResults = ({stationId}: Props) => {
    const {sendRequest, data, loading} = useApiRequest();
    const [elementClicked, setElementClicked] = useState<ElementID>(null)

    useEffect(() => {
        if (!stationId) return;

        sendRequest("GET", "stationboard", null, false, {
            id: stationId,
            limit: 10,
        });
    }, [stationId, sendRequest]);

    if (loading) return <p>Loading departures…</p>;
    if (!data) return null;

    const handleElementClicked = (index) => {
        if (index === elementClicked) {
            setElementClicked(null)
        } else {
            setElementClicked(index)
        }
    }

    return (
        <div style={{marginTop: "20px"}}>
            <h3 style={{marginBottom: "12px"}}>{data.station.name} Departures</h3>
            <ul style={{listStyle: "none", padding: 0}}>
                {data.stationboard.map((train, index) => {
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
                                    <strong style={{fontSize: "16px"}}>
                                        {train.category} {train.number}
                                    </strong>{" "}
                                    → {train.to}
                                    <div style={{fontSize: "12px", color: "#555"}}>
                                        Operator: {train.operator}
                                    </div>
                                </div>

                                <div style={{textAlign: "right"}}>
                                    <div style={{fontSize: "16px", fontWeight: 500}}>
                                        {formatTime(departureTime)}
                                    </div>
                                    <div style={{fontSize: "12px", color: "#777"}}>
                                        Platform: {train.stop.platform || "-"}
                                    </div>
                                </div>
                            </StationBoardResultMainDiv>
                            {
                                elementClicked === index &&
                                <div>
                                    helo
                                </div>
                            }
                        </StationBoardResultsLI>
                    );
                })}
            </ul>
        </div>
    );
};

export default StationBoardResults;
