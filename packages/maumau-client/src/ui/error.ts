import { lighten } from 'polished';
import styled from 'styled-components';

const Error = styled.div`
  background: ${lighten(0, '#e74c3c')};
  color: white;
  border: 1px solid #e74c3c;
  padding: 8px 16px;
  border-radius: 8px;
  margin: 4px 0;
`;

export default Error;
