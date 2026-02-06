import {useEffect, useRef, useState} from "react";
import useApiRequest from "../../../hooks/useAPIRequest";
import type {LocationResult, LocationsResponse} from "../types";
import {InputLi, InputUL} from "./style.ts";

type Props = {
    value: string;
    onChange: (value: string) => void;
    onSelect: (item: LocationResult) => void;
    label?: string;
    placeholder?: string;
    width?: string;
};

const LocationSearchInput = ({value, onChange, onSelect, label, placeholder, width}: Props) => {
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
        <div
            style={{
                position: "relative",
                width: width ?? "100%",
                maxWidth: "420px",
            }}
        >
            <label
                htmlFor="location-search-input"
                style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "#4b5563",
                }}
            >
                {label ?? "Search for a location"}
            </label>
            <input
                id="location-search-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                ref={inputRef}
                autoComplete="off"
                placeholder={placeholder ?? "Enter a station name"}
                onFocus={() => setInputSelected(true)}
                onBlur={() => setInputSelected(false)}
                style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    outline: "none",
                    fontSize: "0.95rem",
                    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                }}
                onFocusCapture={(e) => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(37, 99, 235, 0.15)";
                }}
                onBlurCapture={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow =
                        "0 1px 2px rgba(15, 23, 42, 0.04)";
                }}
            />

            {open && results.length > 0 && (
                <InputUL>
                    {results.map((item, i) => (
                        <InputLi
                            key={`${item.id}-${i}`}
                            onMouseDown={() => handleSelect(item)}
                        >
                            {item.name}
                        </InputLi>
                    ))}
                </InputUL>
            )}

            {loading && (
                <small style={{display: "block", marginTop: "4px", color: "#6b7280"}}>
                    Searching…
                </small>
            )}
        </div>
    );
};

export default LocationSearchInput;
