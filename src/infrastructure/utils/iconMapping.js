import React from 'react';
import * as AntIcons from '@ant-design/icons';

export const getIconComponent = (iconName) => {
  if (!iconName) return null;

  // Convert icon name to PascalCase and add 'Outlined' suffix if needed
  const formatIconName = (name) => {
    // Remove 'fa-' prefix if exists
    const cleanName = name.replace(/^fa-/, '');

    // Convert to PascalCase and add 'Outlined' if not already present
    const pascalCase = cleanName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    return pascalCase.endsWith('Outlined') ? pascalCase : `${pascalCase}Outlined`;
  };

  const formattedName = formatIconName(iconName);
  const IconComponent = AntIcons[formattedName];

  // Fallback to default icon if not found
  return IconComponent || AntIcons.AppstoreOutlined;
};
