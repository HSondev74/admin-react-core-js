import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  FolderOutlined,
  SettingOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const iconMap = {
  dashboard: DashboardOutlined,
  users: UserOutlined,
  news: FileTextOutlined,
  folder: FolderOutlined,
  settings: SettingOutlined,
  shield: SafetyOutlined
};

export const getIconComponent = (iconName) => {
  return iconMap[iconName] || DashboardOutlined;
};