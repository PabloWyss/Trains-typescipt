import styled from "styled-components";

export const InputUL = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1;
    background: white;
    list-style: none;
    padding: 10px 10px 10px 10px;
    border-radius: 8px;
    box-shadow: 0 5px 5px 5px rgba(0, 0, 0, .3);
    max-height: 200px;
    overflow-y: auto;
`

export const InputLi = styled.li `
    cursor: pointer;
    width: 100%;

    &:hover {
        background-color: #f0f0f0;
    }
`