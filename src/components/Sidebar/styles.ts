import styled from "styled-components";
import { Box, Typography, List, ListItem } from "@mui/material";

export const SidebarContainer = styled(Box)`
  position: fixed;
  left: 0;
  top: 136px;
  width: 280px;
  height: calc(100vh - 136px);
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-right: 1px solid ${({ theme }) => theme.palette.grey[100]};
  padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(3)}`};
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md}px) {
    display: none;
  }
`;

export const SidebarSection = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const SectionTitle = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  letter-spacing: -0.5px;
`;

export const TagList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const TagItem = styled(Box)`
  padding: ${({ theme }) => theme.spacing(0.7, 1.8)};
  background-color: ${({ theme }) => theme.palette.grey[50]};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .MuiTypography-body2 {
    font-weight: 600;
    transition: all 0.3s;
  }

  &:hover {
    background-color: #03c75a;
    transform: translateX(8px);
    box-shadow: 0 2px 8px rgba(3, 199, 90, 0.2);

    .MuiTypography-body2,
    .MuiTypography-caption {
      color: white !important;
    }
  }
`;

export const RecentPostList = styled(List)`
  padding: 0;
  margin: 0;
`;

export const RecentPostItem = styled(ListItem)`
  padding: ${({ theme }) => theme.spacing(1.5, 0)};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:last-child {
    border-bottom: none;
  }

  .MuiTypography-body2 {
    font-weight: 600;
    color: ${({ theme }) => theme.palette.text.primary};
    transition: all 0.3s;
  }

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey[50]};
    padding-left: ${({ theme }) => theme.spacing(2)};

    .MuiTypography-body2 {
      color: #03c75a;
    }
  }
`;
