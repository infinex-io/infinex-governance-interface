import clsx from 'clsx';
import React from 'react';

export type TabProps = {
  text: React.ReactNode;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  testId?: string;
  tabId: string;
};

export const Tab: React.FC<TabProps> = ({
  text,
  active,
  onClick,
  disabled,
  className,
  testId,
  tabId
}) => (
  <button
    className={clsx(
      'ui-transition ui-ease-out ui-px-2 ui-py-1.5 ui-whitespace-nowrap',
      {
        'text-slate-400': !active,
        'border-b border-primary ui-text-white': active,
        'ui-cursor-pointer': !disabled,
        'hover:ui-border-primary': !disabled && !active,
        'ui-opacity-50 ui-cursor-not-allowed': disabled
      },
      className
    )}
    data-testid={testId}
    id={tabId}
    onClick={onClick}
  >
    {text}
  </button>
);