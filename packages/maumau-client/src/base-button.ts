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
});
