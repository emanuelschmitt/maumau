import { darken } from 'polished';
import styled from 'styled-components';

const Input = styled.input({
  padding: '16px 8px',
  minWidth: 200,
  borderRadius: 8,
  border: '1px solid #262626',
  '&:focus, &:active': {
    outline: 'none',
    background: darken(0.025, '#ffffff'),
  },
});

export default Input;
