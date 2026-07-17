'use strict';

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: NavItem[];
}

export default function NavDropdown({ label, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <button
        type="button"
        style={{
          color: 'var(--text-medium)',
          fontWeight: '600',
          fontSize: '15px',
          transition: 'var(--transition-smooth)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontFamily: 'inherit',
        }}
      >
        {label}
        <ChevronDown
          size={14}
          style={{
            transition: 'transform 0.25s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Dropdown Hover Bridge + Panel */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          paddingTop: '8px',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
          zIndex: 50,
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
            minWidth: '260px',
            padding: '8px 0',
            position: 'relative',
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '12px',
              height: '12px',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderBottom: 'none',
              borderRight: 'none',
              borderRadius: '2px 0 0 0',
            }}
          />

          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              style={{
                display: 'block',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--primary-dark)',
                textDecoration: 'none',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                (e.currentTarget as HTMLElement).style.color = 'var(--accent-blue)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--primary-dark)';
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
