import {useEffect, useRef, useState} from "react";
import useApiRequest from "../../../hooks/useAPIRequest";
import type {LocationResult, LocationsResponse} from "../types";

type Props = {
    value: string;
    onChange: (value: string) => void;
    onSelect: (item: LocationResult) => void;
};

const LocationSearchInput = ({value, onChange, onSelect}: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const prevValueRef = useRef<string>("");

    const {sendRequest, data, loading} =
        useApiRequest<LocationsResponse>();

    const lockedRef = useRef(false);

    const [results, setResults] = useState<LocationResult[]>([]);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (value !== prevValueRef.current) {
            lockedRef.current = false;
        }

        prevValueRef.current = value;

        if (!value || value.length < 2 || lockedRef.current) {
            const shouldClearResults = results.length > 0;
            const shouldCloseDropdown = open;

            if (shouldClearResults) {
                setResults([]);
            }

            if (shouldCloseDropdown) {
                setOpen(false);
            }

            return;
        }

        const timer = setTimeout(() => {
            sendRequest("GET", "locations", null, false, {
                query: value,
                type: "station",
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [value, sendRequest, results.length, open]);

    useEffect(() => {
        if (data?.stations) {
            console.log(data)
            setResults(data.stations);
            setOpen(true);
        }
    }, [data]);

    const handleSelect = (item: LocationResult) => {
        onSelect(item);
        prevValueRef.current = item.name
        lockedRef.current = true;
        setOpen(false);
        inputRef.current?.blur();
    };

    return (
        <div style={{position: "relative", width: "300px"}}>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                ref={inputRef}
                autoComplete="off"
            />

            {open && results.length > 0 && (
                <ul style={{position: "absolute", top: "100%", left: 0, right: 0}}>
                    {results.map((item, i) => (
                        <li
                            key={`${item.id}-${i}`}
                            onMouseDown={() => handleSelect(item)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}

            {loading && <small>Searching…</small>}
        </div>
    );
};

export default LocationSearchInput;
