import styled from 'styled-components';

const Container = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridGap: 16,
  gridAutoRows: 'auto',
  width: '100%',
});

const One = styled.div({
  gridColumn: '1 / 5',
  gridRow: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Two = styled.div({
  gridColumn: '1 / 3',
  gridRow: '2',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  margin: '16px 0',
});

const Three = styled.div({
  gridColumn: '3 / 5',
  gridRow: '2',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginRight: 32,
});

const Four = styled.div({
  gridColumn: '1 / 5',
  gridRow: '3',
});

const Five = styled.div({
  gridColumn: '1 / 5',
  gridRow: '4',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 70,
});

export default { Container, One, Two, Three, Four, Five };
