import styled from "styled-components";

export const CardDataDiv = styled.div`
  margin-top: 12px;
  padding: 14px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
`;

export const Timeline = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-left: 24px;

  /* vertical line */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 12px;
    width: 2px;
    background: #d1d5db;
  }
`;

export const StopItem = styled.div<{
  $current?: boolean;
  $past?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  opacity: ${({ $past }) => ($past ? 0.5 : 1)};
  font-weight: ${({ $current }) => ($current ? 600 : 400)};
`;

export const Dot = styled.div<{ $current?: boolean }>`
  position: absolute;
  left: ${({ $current }) => ($current ? "-32px" : "-30px")};
  width: ${({ $current }) => ($current ? "14px" : "10px")};
  height: ${({ $current }) => ($current ? "14px" : "10px")};
  background: ${({ $current }) => ($current ? "#2563eb" : "#9ca3af")};
  border-radius: 50%;
  border: 2px solid white;
`;

export const StopTime = styled.div`
  min-width: 48px;
  font-size: 12px;
  color: #374151;
`;

export const StopName = styled.div`
  font-size: 14px;
  color: #111827;
`;
