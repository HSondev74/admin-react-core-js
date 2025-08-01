import { DownOutlined } from '@ant-design/icons';

export default function NavPopup({ items }) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>{item.title}</div>
            {item.children ? <DownOutlined /> : null}
          </div>
          {/* Đệ quy nếu có children */}
          {item.children && (
            <div style={{ marginLeft: 16 }}>
              <NavPopup items={item.children} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
