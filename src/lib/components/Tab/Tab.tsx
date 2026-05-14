import React, { useState } from 'react';
import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';

export interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const Tab: React.FC<TabProps> = ({
  items,
  value,
  defaultValue,
  onChange,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? items[0]?.value ?? '');
  const activeValue = value ?? internalValue;

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <MuiTabs value={activeValue} onChange={handleChange} className={className}>
      {items.map((item) => (
        <MuiTab
          key={item.value}
          label={item.label}
          value={item.value}
          disabled={item.disabled}
          icon={item.icon ? <>{item.icon}</> : undefined}
          iconPosition="start"
        />
      ))}
    </MuiTabs>
  );
};

export default Tab;
