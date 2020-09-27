import React from 'react';
import styled from 'styled-components';

import CloseIcon from '../icons/close';
import BaseButton from '../ui/base-button';

const OuterContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  box-shadow: 3px 9px 28px -2px rgba(0, 0, 0, 0.25);
`;

const Inner = styled.div`
  position: relative;
  background: white;
  min-width: 400;
  border-radius: 8px;
  z-index: 1;
`;

const CloseContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const Content = styled.div<{ centered: boolean }>`
  padding: 32px 32px 16px 32px;
  text-align: ${(props) => (props.centered ? 'center' : 'left')};
`;

const Footer = styled.div`
  padding: 16px;
  display: flex;
  align-self: flex-end;
  justify-content: flex-end;
`;

export type Props = {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  centered?: boolean;
  onClose?: () => void;
};

function Dialog({ children, footer, centered = false, onClose }: Props) {
  return (
    <OuterContainer role="dialog">
      <Inner>
        {onClose && (
          <CloseContainer>
            <BaseButton>
              <CloseIcon />
            </BaseButton>
          </CloseContainer>
        )}
        <Content centered={centered}>{children}</Content>
        {footer && <Footer>{footer}</Footer>}
      </Inner>
    </OuterContainer>
  );
}

export default React.memo(Dialog);
