import styled from 'styled-components';

type Props = { disabled?: boolean; backgroundUrl: string };

export default styled.div<Props>(({ disabled = false, backgroundUrl }) => ({
  height: 100,
  width: 55,
  borderRadius: 4,
  padding: 16,
  margin: 8,
  boxShadow: '3px 7px 10px 0px rgba(0,0,0,0.05)',
  backgroundSize: 'cover',
  backgroundImage: `url('${backgroundUrl}')`,
  opacity: disabled ? '0.3' : '1',
}));
