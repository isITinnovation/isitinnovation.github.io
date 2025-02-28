import styled from "styled-components";
import { Paper, Container } from "@mui/material";
import { theme } from "../theme";

export const StyledContainer = styled(Container)`
  padding: 2rem;
`;

export const StyledCard = styled(Paper)`
  padding: 1.5rem;
  margin: 1rem 0;
  background-color: ${theme.palette.background.paper};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

interface FlexBoxProps {
  direction?: "row" | "column";
  justify?: string;
  align?: string;
  gap?: string;
  marginTop?: string;
}

export const FlexBox = styled.div<FlexBoxProps>`
  display: flex;
  flex-direction: ${({ direction = "row" }) => direction};
  justify-content: ${({ justify = "flex-start" }) => justify};
  align-items: ${({ align = "stretch" }) => align};
  gap: ${({ gap = "0" }) => gap};
  margin-top: ${({ marginTop = "0" }) => marginTop};
`;
