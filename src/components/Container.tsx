import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => (
  <div className="mx-auto max-w-5xl px-4 w-full">{children}</div>
);

export default Container; 