
import React from 'react';

const styles = {
  td: {
    color: '#18486B',
    padding: '8px',
    whiteSpace: 'nowrap',
  },
};

interface ITdProps {
  children: React.ReactNode;
  style?: any;
}

export type TTd = (props: ITdProps) => JSX.Element;

const Td: TTd = ({ children, style, ...props }) => (
  <td
    style={{
      ...styles.td,
      ...style,
    }}
    {...props}
    >
    {children}
  </td>
);

export default Td;
