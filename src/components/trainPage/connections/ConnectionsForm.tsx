import type {JSX} from "react";
import LocationSearchInput from "../locationSearchInput/locationsSearchInput";
import type {LocationResult} from "../types";
import {ButtonRow, FormColumn, Hint, PrimaryButton} from "./styles";

type Props = {
    fromValue: string;
    toValue: string;
    setFromValue: (value: string) => void;
    setToValue: (value: string) => void;
    setFromLocation: (loc: LocationResult | null) => void;
    setToLocation: (loc: LocationResult | null) => void;
    canSearch: boolean;
    isLoading: boolean;
    onSearch: () => void;
};

const ConnectionsForm = ({
    fromValue,
    toValue,
    setFromValue,
    setToValue,
    setFromLocation,
    setToLocation,
    canSearch,
    isLoading,
    onSearch,
}: Props): JSX.Element => {
    return (
        <FormColumn>
            <LocationSearchInput
                value={fromValue}
                onChange={(value) => {
                    setFromValue(value);
                    setFromLocation(null);
                }}
                onSelect={(item) => {
                    setFromLocation(item);
                    setFromValue(item.name);
                }}
                label="From station"
                placeholder="Search departure station"
            />
            <LocationSearchInput
                value={toValue}
                onChange={(value) => {
                    setToValue(value);
                    setToLocation(null);
                }}
                onSelect={(item) => {
                    setToLocation(item);
                    setToValue(item.name);
                }}
                label="To station"
                placeholder="Search arrival station"
            />

            <ButtonRow>
                <PrimaryButton
                    type="button"
                    disabled={!canSearch || isLoading}
                    onClick={onSearch}
                >
                    {isLoading ? "Searching…" : "Search connections"}
                </PrimaryButton>
                <Hint>
                    Select both stations, then scroll the results list to load more.
                </Hint>
            </ButtonRow>
        </FormColumn>
    );
};

export default ConnectionsForm;

