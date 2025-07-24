import authApi from './auth';
import usersApi from './users';
import { useGetMenuMaster, handlerDrawerOpen } from './menu';

// Re-export all APIs
export { authApi, usersApi, useGetMenuMaster, handlerDrawerOpen };

// Default export with all APIs grouped
export default {
  auth: authApi,
  users: usersApi,
  menu: {
    useGetMenuMaster,
    handlerDrawerOpen,
  },
};

// Export types for better type inference
export * from '@/api/types';

// If you have any utility types or interfaces that are used across multiple API files,
// you can define them here or in a separate types.ts file and export them.
