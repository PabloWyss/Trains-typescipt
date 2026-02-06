import styled from "styled-components";

export const Grid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
    gap: 1.75rem;
    margin-top: 0.75rem;

    @media (max-width: 900px) {
        grid-template-columns: minmax(0, 1fr);
    }
`;

export const FormColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

export const ButtonRow = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-top: 0.5rem;
`;

export const PrimaryButton = styled.button`
    padding: 0.6rem 1.4rem;
    border-radius: 999px;
    border: none;
    background: #1d4ed8;
    color: #f9fafb;
    font-size: 0.95rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
    transition:
        background 0.15s ease,
        transform 0.1s ease,
        box-shadow 0.15s ease;

    &:hover {
        background: #1e40af;
        transform: translateY(-1px);
        box-shadow: 0 14px 32px rgba(30, 64, 175, 0.4);
    }

    &:disabled {
        opacity: 0.7;
        cursor: default;
        transform: none;
        box-shadow: none;
    }
`;

export const Hint = styled.p`
    font-size: 0.83rem;
    color: #6b7280;
`;

export const ListContainer = styled.div`
    background: #f9fafb;
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    padding: 0.9rem 0.75rem 0.75rem;
    max-height: 420px;
    overflow-y: auto;
`;

export const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

export const ConnectionCard = styled.li`
    border-radius: 0.9rem;
    background: #ffffff;
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    box-shadow: 0 12px 20px rgba(15, 23, 42, 0.06);
    border: 1px solid rgba(229, 231, 235, 0.9);
`;

export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
`;

export const TimeBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    font-size: 0.95rem;
    color: #111827;
`;

export const StationNames = styled.div`
    font-size: 0.94rem;
    color: #4b5563;
`;

export const ChipRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.1rem;
`;

export const Chip = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 0.15rem 0.65rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 500;
    background: #eff6ff;
    color: #1e3a8a;
`;

export const Meta = styled.div`
    font-size: 0.78rem;
    color: #6b7280;
`;

export const EmptyState = styled.div`
    padding: 1rem;
    text-align: center;
    font-size: 0.9rem;
    color: #6b7280;
`;

export const FooterText = styled.p`
    margin-top: 0.4rem;
    font-size: 0.78rem;
    color: #9ca3af;
    text-align: center;
`;

