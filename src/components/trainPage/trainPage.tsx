import {JSX, useState} from "react";
import LocationSearchInput from "./locationSearchInput/locationsSearchInput.tsx";
import StationBoardResults from "./stationBoardResult/stationBoardResult.tsx";
import {useForm} from "react-hook-form";
import type {LocationResult} from "./types.ts";
import {SelectionButton, SelectionButtonDiv, Title, Wrapper} from "./trainPageStyles.tsx";


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
            <Title>{featureSelected.label}</Title>
            <SelectionButtonDiv>
                <SelectionButton
                    $active={featureSelected.value === "departures"}
                    onClick={() => setFeatureSelected({label: "Train Departures", value: "departures"})}
                    disabled={featureSelected.value === "departures"}
                >
                    Train Departures
                </SelectionButton>
                <SelectionButton
                    $active={featureSelected.value === "connections"}
                    onClick={() => setFeatureSelected({label: "Connections", value: "connections"})}
                    disabled={featureSelected.value === "connections"}
                >
                    Connections
                </SelectionButton>
            </SelectionButtonDiv>
            {
                featureSelected.value === "connections" && (
                    <p style={{textAlign: "center", marginBottom: "20px"}}>
                        Connections feature is coming soon!
                    </p>
                )
            }
            {
                featureSelected.value === "departures" &&
                <LocationSearchInput
                    value={location}
                    onChange={handleLocationChange}
                    onSelect={handleSelect}
                />
            }
            <StationBoardResults stationId={selectedLocation}/>
        </Wrapper>
    );
};

export default TrainPage;
