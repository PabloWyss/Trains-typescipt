import {JSX, useEffect, useRef, useState} from "react";
import {Wrapper} from "./trainPageStyles";
import useApiRequest from "../../hooks/useAPIRequest";
import {useForm} from "react-hook-form";

/* -------------------- TYPES -------------------- */

type Inputs = {
    location: string;
};

type LocationsResponse = {
    stations: LocationResult[];
};

type Coordinate = {
    type: string;
    x: number | null;
    y: number | null;
};

type LocationResult = {
    id: string | null;
    name: string;
    score: number | null;
    coordinate: Coordinate;
    distance: number | null;
    icon: string | null;
};

const TrainPage: () => JSX.Element = () => {
    const {
        register,
        watch,
        setValue
    } = useForm<Inputs>({
        defaultValues: {
            location: "",
            selectedLocation: ""
        },
    });

    const locationValue = watch("location");
    const selectedLocationValue = watch('selectedLocation')
    const inputRef = useRef<HTMLInputElement | null>(null);
    const prevValueRef = useRef<HTMLInputElement | null>(null);

    const {
        sendRequest: sendRequestListLocations,
        data: dataListLocations,
        loading: loadingListLocations
    } = useApiRequest();

    const {
        sendRequest: sendRequestLocation,
        data: dataLocation,
        loading: loadingLocation
    } = useApiRequest();


    const [results, setResults] = useState<LocationResult[]>([]);
    const [open, setOpen] = useState(false);
    const [elementHasBeenSelected, setElementHasBeenSelected] = useState(false)

    useEffect(() => {
        // User typed something new → unlock fetching
        if (locationValue !== prevValueRef.current) {
            setElementHasBeenSelected(false);
        }

        prevValueRef.current = locationValue;

        if (!locationValue || locationValue.length < 2 || elementHasBeenSelected) {
            setResults([]);
            setOpen(false);
            return;
        }

        const timer = setTimeout(() => {
            sendRequestListLocations("GET", "locations", null, false, {
                query: locationValue,
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [locationValue, elementHasBeenSelected, sendRequestListLocations]);

    useEffect(() => {
        if (!selectedLocationValue) {
            return;
        }

        sendRequestLocation("GET", "stationboard", null, false, {
            id: locationValue,
            limit: 10,
        });

    }, [selectedLocationValue]);

    console.log(dataLocation)


    useEffect(() => {
        if (dataListLocations && Array.isArray((dataListLocations as LocationsResponse).stations)) {
            setResults((dataListLocations as LocationsResponse).stations);
            setOpen(true);
        }
    }, [dataListLocations]);


    const handleSelect = (item: LocationResult) => {
        setValue("location", item.name);
        setValue("selectedLocation", item.id);
        prevValueRef.current = item.name
        setOpen(false);
        setElementHasBeenSelected(true);
        inputRef.current?.blur();
    };

    return (
        <Wrapper>
            <div style={{position: "relative", width: "300px"}}>
                <input
                    {...register("location")}
                    ref={(e) => {
                        register("location").ref(e);
                        inputRef.current = e;
                    }}
                    autoComplete="off"
                />

                {open && results.length > 0 && (
                    <ul
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            background: "white",
                            border: "1px solid #ccc",
                            borderTop: "none",
                            listStyle: "none",
                            margin: 0,
                            padding: 0,
                            maxHeight: "220px",
                            overflowY: "auto",
                            zIndex: 100,
                        }}
                    >
                        {results.map((item, index) => (
                            <li
                                key={`${item.id}-${index}`}
                                onMouseDown={() => handleSelect(item)}
                                style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                }}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                )}

                {loadingListLocations && <small>Searching…</small>}
            </div>
        </Wrapper>
    );
};

export default TrainPage;
