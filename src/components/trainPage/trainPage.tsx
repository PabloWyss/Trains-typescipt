import {JSX} from "react";
import LocationSearchInput from "./locationSearchInput/locationsSearchInput.tsx";
import StationBoardResults from "./stationBoardResult/stationBoardResult.tsx";
import {useForm} from "react-hook-form";
import type {LocationResult} from "./types.ts";
import {Wrapper} from "./trainPageStyles.tsx";


type Inputs = {
    location: string;
    selectedLocation: string | null;
};

const TrainPage: () => JSX.Element = () => {

    const {watch, setValue} = useForm<Inputs>({
        defaultValues: {
            location: "",
            selectedLocation: null,
        },
    });

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
            <LocationSearchInput
                value={location}
                onChange={handleLocationChange}
                onSelect={handleSelect}
            />

            <StationBoardResults stationId={selectedLocation}/>
        </Wrapper>
    );
};

export default TrainPage;
