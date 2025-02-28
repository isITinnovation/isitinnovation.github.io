import styled from "styled-components";
import { Paper } from "@mui/material";
import { theme } from "../../styles/theme";

export const TrendingItem = styled.div`
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  background-color: ${theme.palette.background.paper};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const CategorySection = styled(Paper)`
  padding: 1.5rem;
  margin: 1rem 0;
  background-color: ${theme.palette.background.default} !important;
  border-radius: 12px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const MainContent = styled.div`
  padding: 2rem 0;
`;
