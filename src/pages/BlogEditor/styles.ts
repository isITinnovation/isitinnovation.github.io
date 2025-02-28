import styled from "styled-components";
import { Paper } from "@mui/material";
import { theme } from "../../styles/theme";

export const EditorContainer = styled(Paper)`
  && {
    padding: 2rem;
    margin: 1rem 0;
    background-color: #ffffff;
    border-radius: 12px;
    min-height: 600px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const EditorWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
  height: calc(100vh - 400px);
  min-height: 500px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: 1px solid ${theme.palette.primary.main};
  border-radius: 8px;
  font-family: "Consolas", monospace;
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  background-color: white;
  overflow-y: auto;

  &:focus {
    outline: none;
    border-color: ${theme.palette.primary.dark};
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.2);
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

export const PreviewContainer = styled.div`
  padding: 1rem;
  border: 1px solid ${theme.palette.primary.main};
  border-radius: 8px;
  background-color: white;
  height: 100%;
  overflow-y: auto;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    color: ${theme.palette.primary.main};
    font-weight: 600;
    line-height: 1.3;
  }

  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.75rem;
  }
  h3 {
    font-size: 1.5rem;
  }
  h4 {
    font-size: 1.25rem;
  }
  h5 {
    font-size: 1.1rem;
  }
  h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  a {
    color: ${theme.palette.primary.main};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  code {
    background-color: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: "Consolas", monospace;
    font-size: 0.9em;
  }

  pre {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  blockquote {
    margin: 1rem 0;
    padding-left: 1rem;
    border-left: 4px solid ${theme.palette.primary.main};
    color: rgba(0, 0, 0, 0.7);
  }

  ul,
  ol {
    margin: 1rem 0;
    padding-left: 2rem;

    li {
      margin-bottom: 0.5rem;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;

    th,
    td {
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0.5rem;
    }

    th {
      background-color: ${theme.palette.primary.main};
      color: white;
    }

    tr:nth-child(even) {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1rem 0;
  }

  hr {
    border: none;
    border-top: 2px solid rgba(0, 0, 0, 0.1);
    margin: 2rem 0;
  }
`;

export const ToolBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: ${theme.palette.background.paper};
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);

  button {
    color: ${theme.palette.primary.main};

    &:hover {
      background-color: rgba(96, 108, 56, 0.1);
    }
  }
`;

export const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid ${theme.palette.primary.main};
  border-radius: 8px;
  margin: 1rem 0;
  background-color: white;
  align-items: center;
`;

export const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: ${theme.palette.primary.main};
  color: white;
  border-radius: 16px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
`;
