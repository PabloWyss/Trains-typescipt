import {JSX, useState} from "react";
import LocationSearchInput from "./locationSearchInput/locationsSearchInput.tsx";
import StationBoardResults from "./stationBoardResult/stationBoardResult.tsx";
import {useForm} from "react-hook-form";
import type {LocationResult} from "./types.ts";
import {
    ContentCard,
    SelectionButton,
    SelectionButtonDiv,
    Subtitle,
    Title,
    Wrapper,
} from "./trainPageStyles.tsx";
import ConnectionsSection from "./ConnectionsSection";


type Inputs = {
    location: string;
    selectedLocation: string | null;
};

type FeatureOption = {
    label: string;
    value: string;
}


const TrainPage: () => JSX.Element = () => {

    const {watch, setValue} = useForm<Inputs>({
        defaultValues: {
            location: "",
            selectedLocation: null,
        },
    });

    const [featureSelected, setFeatureSelected] = useState<FeatureOption>({label: "Train Departures", value: "departures"});

    const location = watch("location");
    const selectedLocation = watch("selectedLocation");

    const handleLocationChange = (value: string) => {
        setValue("location", value);
        setValue("selectedLocation", null);
    };

    const handleSelect = (item: LocationResult) => {
        setValue("location", item.name);
        setValue("selectedLocation", item.id);
    };

    return (
        <Wrapper>
            <ContentCard>
                <Title>Swiss transport explorer</Title>
                <Subtitle>
                    Search departures from any station or discover the next train
                    connections between two locations, powered by the Swiss Transport API.
                </Subtitle>
                <SelectionButtonDiv>
                    <SelectionButton
                        $active={featureSelected.value === "departures"}
                        onClick={() =>
                            setFeatureSelected({label: "Train Departures", value: "departures"})
                        }
                        disabled={featureSelected.value === "departures"}
                    >
                        Train departures
                    </SelectionButton>
                    <SelectionButton
                        $active={featureSelected.value === "connections"}
                        onClick={() =>
                            setFeatureSelected({label: "Connections", value: "connections"})
                        }
                        disabled={featureSelected.value === "connections"}
                    >
                        Connections
                    </SelectionButton>
                </SelectionButtonDiv>

                {featureSelected.value === "departures" && (
                    <>
                        <LocationSearchInput
                            value={location}
                            onChange={handleLocationChange}
                            onSelect={handleSelect}
                            label="From station"
                            placeholder="Type to search for a departure station"
                        />
                        <StationBoardResults stationId={selectedLocation}/>
                    </>
                )}

                {featureSelected.value === "connections" && <ConnectionsSection/>}
            </ContentCard>
        </Wrapper>
    );
};

export default TrainPage;
