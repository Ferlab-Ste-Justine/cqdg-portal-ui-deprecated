/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import './StackLayout.css';

export enum StackOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

interface IExtraProps {
  onClick?: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {};
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => {};
}
interface IStackLayout extends IExtraProps {
  orientation?: StackOrientation;
  vertical?: boolean;
  horizontal?: boolean;
  children: React.ReactNode;
  className: string;
  style: object;
}

const StackLayout = ({
  children, className, horizontal, onClick, orientation, style, vertical,
}: IStackLayout) => {
  const definedOrientation = vertical
  ? StackOrientation.Vertical
  : horizontal
    ? StackOrientation.Horizontal
    : orientation || StackOrientation.Horizontal;

  const extraProps: IExtraProps = {};
  if (onClick) {
    extraProps.onClick = onClick;
    extraProps.onKeyDown = onClick;
  }

  return (
    <div
      className={`fui-stack-layout ${definedOrientation} ${className || ''}`}
      style={style}
      {...extraProps}
      >
      {children}
    </div>
  );
};

export default StackLayout;
