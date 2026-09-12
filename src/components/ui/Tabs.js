'use client';
import { useState } from 'react';
import styles from './Tabs.module.css';

/**
 * Tab navigation component.
 *
 * @param {{ label: string, value: string }[]} tabs
 * @param {string} defaultValue - Initial active tab value
 * @param {function} onTabChange - Callback when tab changes
 */
export default function Tabs({ tabs, defaultValue, onTabChange, children, className = '' }) {
  const [active, setActive] = useState(defaultValue || tabs[0]?.value);

  const handleClick = (value) => {
    setActive(value);
    onTabChange?.(value);
  };

  return (
    <div className={className}>
      <div className={styles.tabs} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${active === tab.value ? styles.active : ''}`}
            onClick={() => handleClick(tab.value)}
            role="tab"
            aria-selected={active === tab.value}
            aria-controls={`panel-${tab.value}`}
            id={`tab-${tab.value}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {typeof children === 'function' ? (
        <div
          className={styles.panel}
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
        >
          {children(active)}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
