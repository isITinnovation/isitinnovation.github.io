import styled from "styled-components";
import { Paper } from "@mui/material";

export const TrendingCard = styled(Paper)`
  padding: 1.5rem;
  margin: 1rem 0;
  background-color: #ffffff !important;
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
  color: rgba(0, 0, 0, 0.6);
`;

export const TrendingTags = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

export const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: #000000;
  color: white;
  border-radius: 16px;
  font-size: 0.875rem;
`;
