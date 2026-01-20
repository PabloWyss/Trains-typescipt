import styled from "styled-components";

export const Wrapper = styled.section`
    padding: 4em;
    background: linear-gradient(135deg, #f5f7fa, #c3cfe2); /* Modern gradient */
    height: 100vh;
    color: #333; /* Neutral text color */
    font-family: 'Arial', sans-serif; /* Clean font */
    min-height: fit-content;
`;

export const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: bold;
    color: #2c3e50; /* Subtle dark blue */
    margin-bottom: 1.5em;
    text-align: center;
`;


export const SelectionButtonDiv = styled.div`
    margin-bottom: 2em;
    text-align: center;

    button {
        background-color: #3498db; /* Soft blue */
        color: white;
        border: none;
        padding: 0.75em 1.5em;
        margin: 0 0.5em;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #2980b9; /* Darker blue on hover */
        }

        &:disabled {
            background-color: #95a5a6; /* Gray for disabled state */
            cursor: not-allowed;
        }
    }
`;

export const SelectionButton = styled.button<{ $active: boolean }>`
    background-color: ${(props) => (props.$active ? "#2980b9" : "#3498db")};
    color: white;
    border: none;
    padding: 0.75em 1.5em;
    margin: 0 0.5em;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #2980b9; /* Darker blue on hover */
    }
`;