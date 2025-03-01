import styled from "styled-components";
import { Paper, Button } from "@mui/material";

export const GradientPaper = styled(Paper)`
  background: linear-gradient(45deg, #03c75a 30%, #1ee177 90%);
  color: white;
  padding: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.spacing(3)};
`;

export const NaverButton = styled(Button)`
  background: linear-gradient(45deg, #03c75a 30%, #1ee177 90%);
  color: white;
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing(1, 3)};

  &:hover {
    box-shadow: 0 2px 8px rgba(3, 199, 90, 0.3);
  }
`;
