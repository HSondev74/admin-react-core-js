// // Mui
// import { Box, IconButton, Typography, TableCell, TableRow, Chip } from '@mui/material';

// // Icons
// import { MdOutlineModeEdit } from 'react-icons/md';
// import { MdDelete } from 'react-icons/md';
// import { IoMdAdd } from 'react-icons/io';

// const MenuTableRow = ({ menu, level, availableRoles = [], onEdit, onDelete, onAddChild }) => {
//   const item = menu.item;
//   const menuId = item.id;
//   const menuName = item.name;
//   const menuPath = item.path || item.url;
//   const menuOrder = item.sortOrder || 0;
//   const menuRoles = item.roles || [];
//   const hasChildren = menu.children && menu.children.length > 0;
  
//   // Determine menu type
//   const menuType = hasChildren ? 'Parent' : level > 0 ? 'Child' : 'Single';

//   return (
//     <TableRow
//       sx={{
//         backgroundColor: level === 0 ? '#f8f9fa' : '#ffffff',
//         '&:hover': { backgroundColor: '#f5f5f5' }
//       }}
//     >
//       <TableCell>
//         <Box sx={{ display: 'flex', alignItems: 'center', pl: level * 2 }}>
//           {level > 0 && <Box sx={{ mr: 1, color: 'text.secondary' }}>└─</Box>}

//           <Typography
//             variant="body1"
//             sx={{
//               fontWeight: level === 0 ? 'bold' : 'normal',
//               color: level === 0 ? 'primary.main' : 'text.primary'
//             }}
//           >
//             {menuName}
//             {hasChildren && (
//               <Box component="span" sx={{ ml: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
//                 ({menu.children.length})
//               </Box>
//             )}
//           </Typography>
//         </Box>
//       </TableCell>

//       <TableCell>
//         <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
//           {menuPath}
//         </Typography>
//       </TableCell>

//       <TableCell>{menuOrder}</TableCell>

//       <TableCell>
//         <Chip 
//           label={menuType} 
//           size="small"
//           color={menuType === 'Parent' ? 'primary' : menuType === 'Child' ? 'secondary' : 'default'}
//         />
//       </TableCell>

//       <TableCell>
//         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
//           {menuRoles.slice(0, 3).map((roleId) => {
//             const role = availableRoles.find(r => r.id === roleId);
//             return role ? (
//               <Chip 
//                 key={roleId} 
//                 label={role.name} 
//                 size="small" 
//                 variant="outlined"
//                 sx={{ fontSize: '0.7rem' }}
//               />
//             ) : null;
//           })}
//           {menuRoles.length > 3 && (
//             <Chip 
//               label={`+${menuRoles.length - 3}`} 
//               size="small" 
//               color="primary"
//               sx={{ fontSize: '0.7rem' }}
//             />
//           )}
//           {menuRoles.length === 0 && (
//             <Typography variant="body2" sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>
//               No roles
//             </Typography>
//           )}
//         </Box>
//       </TableCell>

//       <TableCell align="center">
//         <IconButton size="medium" onClick={() => onAddChild(menu)} color="success">
//           <IoMdAdd />
//         </IconButton>
//         <IconButton size="medium" onClick={() => onEdit(menu)} color="primary">
//           <MdOutlineModeEdit />
//         </IconButton>
//         <IconButton size="medium" onClick={() => onDelete(menuId)} color="error">
//           <MdDelete />
//         </IconButton>
//       </TableCell>
//     </TableRow>
//   );
// };

// export default MenuTableRow;
