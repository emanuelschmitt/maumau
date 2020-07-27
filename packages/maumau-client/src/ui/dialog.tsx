import React from 'react';
import styled from 'styled-components';

const Outer = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(0, 0, 0, 0.5)',
});

const Inner = styled.div({
  background: 'white',
  minWidth: 400,
  borderRadius: 8,
  zIndex: 100,
});

const Content = styled.div<{ centered: boolean }>(({ centered }) => ({
  padding: '32px 16px 16px 32px',
  textAlign: centered ? 'center' : 'left',
}));

const Footer = styled.div({
  padding: '16px 16px 16px',
  display: 'flex',
  alignSelf: 'flex-end',
  justifyContent: 'flex-end',
});

type Props = {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  centered?: boolean;
};

function Dialog({ children, footer, centered = false }: Props) {
  return (
    <Outer role="dialog">
      <Inner>
        <Content centered={centered}>{children}</Content>
        {footer && <Footer>{footer}</Footer>}
      </Inner>
    </Outer>
  );
}

export default React.memo(Dialog);
