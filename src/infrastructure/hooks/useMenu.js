import { useState, useEffect } from 'react';
import menuApi from '../api/http/menuApi';

export function useMenus() {
  const [menus, setMenus] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshMenuData = async () => {
    try {
      const response = await menuApi.getAllMenuTree();
      const menuData = Array.isArray(response.data) ? response.data : response;
      setMenus(menuData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMenuData();
    menuApi
      .getRoles()
      .then((res) => setAvailableRoles(res.data))
      .catch(() => setAvailableRoles([]));
  }, []);

  return { menus, setMenus, availableRoles, loading, error, refreshMenuData };
}
