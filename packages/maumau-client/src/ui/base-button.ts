import styled, { CSSObject } from 'styled-components';

const reset: CSSObject = {
  border: 'none',
  margin: 0,
  padding: 0,
  width: 'auto',
  overflow: 'visible',
  color: 'inherit',
  font: 'inherit',
  lineHeight: 'normal',
  background: 'transparent',
};

export default styled.button({
  ...reset,
  '&:disabled': {
    cursor: 'unset',
    opacity: 0.7,
  },
  '&:focus, &:active': {
    outline: 'none',
  },
  '&:hover': {
    opacity: 0.7,
    cursor: 'pointer',
  },
  '&:hover:disabled': {
    opacity: '0.6',
    cursor: 'unset',
  },
});
