import styled from "styled-components";

export const Wrapper = styled.section`
    min-height: 100vh;
    padding: 3rem 1.5rem;
    background: radial-gradient(circle at top left, #e0f2fe, #e5e7eb 40%, #eef2ff);
    color: #111827;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ContentCard = styled.div`
    width: 100%;
    max-width: 1040px;
    background: rgba(255, 255, 255, 0.94);
    border-radius: 1.5rem;
    padding: 2.5rem 2.25rem 2.25rem;
    box-shadow:
        0 22px 45px rgba(15, 23, 42, 0.18),
        0 0 0 1px rgba(148, 163, 184, 0.16);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.9);
`;

export const Title = styled.h1`
    font-size: 2.1rem;
    line-height: 1.1;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.75rem;
    text-align: center;
`;

export const Subtitle = styled.p`
    font-size: 0.95rem;
    color: #6b7280;
    text-align: center;
    margin-bottom: 2rem;
`;

export const SelectionButtonDiv = styled.div`
    margin-bottom: 1.75rem;
    display: flex;
    justify-content: center;
    gap: 0.75rem;
`;

export const SelectionButton = styled.button<{ $active: boolean }>`
    background: ${({ $active }) => ($active ? "#1d4ed8" : "#eff6ff")};
    color: ${({ $active }) => ($active ? "#f9fafb" : "#1e3a8a")};
    border: none;
    padding: 0.55rem 1.45rem;
    border-radius: 999px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: ${({ $active }) =>
        $active ? "0 10px 25px rgba(37, 99, 235, 0.35)" : "none"};
    transition:
        background 0.15s ease,
        color 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.1s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
    }

    &:disabled {
        opacity: 0.85;
        cursor: default;
        transform: none;
        box-shadow: ${({ $active }) =>
            $active ? "0 10px 25px rgba(37, 99, 235, 0.28)" : "none"};
    }
`;