import styled from "styled-components";
import { Paper } from "@mui/material";
import { theme } from "../../styles/theme";

export const TrendingCard = styled(Paper)`
  padding: 1.5rem;
  margin: 1rem 0;
  background-color: ${theme.palette.background.default} !important;
  border-radius: 12px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const TrendingStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  color: ${theme.palette.text.secondary};
`;

export const TrendingTags = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

export const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: ${theme.palette.primary.main};
  color: white;
  border-radius: 16px;
  font-size: 0.875rem;
`;
