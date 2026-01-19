import {useEffect, useRef, useState} from "react";
import useApiRequest from "../../../hooks/useAPIRequest";
import type {LocationResult, LocationsResponse} from "../types";
import {InputUL} from "./style.ts";

type Props = {
    value: string;
    onChange: (value: string) => void;
    onSelect: (item: LocationResult) => void;
};

const LocationSearchInput = ({value, onChange, onSelect}: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const prevValueRef = useRef<string>("");
    const prevInputSelected = useRef(false)

    const {sendRequest, data, loading} = useApiRequest<LocationsResponse>();

    const lockedRef = useRef(false);

    const [results, setResults] = useState<LocationResult[]>([]);
    const [open, setOpen] = useState(false);
    const [inputSelected, setInputSelected] = useState(false)


    useEffect(() => {
        if (value !== prevValueRef.current) {
            lockedRef.current = false;
        } else {
            lockedRef.current = true;
            if (inputSelected && value === prevValueRef.current && inputSelected !== prevInputSelected.current) {
                lockedRef.current = false
                prevInputSelected.current = true
            } else {
                lockedRef.current = true
                prevInputSelected.current = false
            }
        }



        prevValueRef.current = value;

        if (lockedRef.current) {
            return;
        }

        if (!value || value.length < 2) {
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
    }, [value, sendRequest, results.length, open, inputSelected]);

    useEffect(() => {
        if (data?.stations) {
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
                onFocus={() => setInputSelected(true)}
                onBlur={() => setInputSelected(false)}
            />

            {open && results.length > 0 && (
                <InputUL>
                    {results.map((item, i) => (
                        <li
                            key={`${item.id}-${i}`}
                            onMouseDown={() => handleSelect(item)}
                        >
                            {item.name}
                        </li>
                    ))}
                </InputUL>
            )}

            {loading && <small>Searching…</small>}
        </div>
    );
};

export default LocationSearchInput;
