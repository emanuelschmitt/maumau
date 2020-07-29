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
};

export default styled.button({
  ...reset,
  '&:disabled': {
    cursor: 'unset',
    opacity: 0.6,
  },
  '&:focus, &:active': {
    border: '1px solid #eee',
  },
  '&:hover': {
    opacity: 0.9,
    cursor: 'pointer',
  },
  '&:hover:disabled': {
    opacity: '0.6',
    cursor: 'unset',
  },
});
