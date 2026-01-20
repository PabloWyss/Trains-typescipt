import {CardDataDiv, Dot, StopItem, StopName, StopTime, Timeline} from "./styles";
import {formatTime} from "../../../Functions/timeFumnctions.ts";

type Props = {
    train: {
        stop: {
            arrival: string | null;
            departure: string | null;
            station: {
                name: string | null;
            }
        }
    }
};

const StationBoardCard = ({train}: Props) => {
    const {passList} = train;

    // Heuristic for current stop
    const currentIndex =
        passList.findIndex(
            (stop) => stop.arrival === null && stop.departure !== null
        ) || 0;

    return (
        <CardDataDiv>
            <Timeline>
                {passList.map((stop, index) => {
                    const isCurrent = index === currentIndex;
                    const isPast = index < currentIndex;

                    return (
                        <StopItem
                            key={index}
                            $current={isCurrent}
                            $past={isPast}
                        >
                            <StopTime>
                                {formatTime(stop.arrival || stop.departure)}
                            </StopTime>

                            <Dot $current={isCurrent}/>

                            <StopName>
                                {stop.station.name ?? "—"}
                            </StopName>
                        </StopItem>
                    );
                })}
            </Timeline>
        </CardDataDiv>
    );
};

export default StationBoardCard;