import styled from "styled-components";

export const StationBoardResultsLI = styled.li<{ $primary?: boolean; }>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 12px;
    align-items: stretch;
    background: ${({ $primary }) =>
            $primary ? "linear-gradient(90deg, #eff6ff, #ffffff)" : "#ffffff"};
    border-radius: 10px;
    margin-bottom: 6px;
    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.06);
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition:
            transform 0.1s ease,
            box-shadow 0.15s ease,
            background 0.15s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
        background: linear-gradient(90deg, #dbeafe, #ffffff);
    }
`;

export const StationBoardResultMainDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 0.75rem;
`;