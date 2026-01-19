import styled from "styled-components";

export const StationBoardResultsLI = styled.li<{ $primary?: boolean; }>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid #eee;
    align-items: center;
    background: ${props => props.$primary ? "#bbbbbb" : "white"};
    border-radius: 6px;
    margin-bottom: 4px;
`

export const StationBoardResultMainDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`