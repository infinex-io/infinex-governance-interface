import styled from "styled-components";
import { theme } from "@synthetixio/ui/dist/cjs/styles/";

export default function Header() {
  return <StyledHeader>Synthetix</StyledHeader>;
}

const StyledHeader = styled.header`
  background-color: ${theme.colors.backgroundColor};
  width: 100%;
  min-height: 66px;
`;
