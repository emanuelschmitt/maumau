import styled from 'styled-components';

const Container = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridGap: 4,
  gridAutoRows: 'auto',
  height: 700,
});

const One = styled.div({
  gridColumn: '1 / 5',
  gridRow: '1',
});

const Two = styled.div({
  gridColumn: '1 / 3',
  gridRow: '2',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const Three = styled.div({
  gridColumn: '3 / 5',
  gridRow: '2',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
});

const Four = styled.div({
  gridColumn: '1 / 5',
  gridRow: '3',
});

export default { Container, One, Two, Three, Four };
