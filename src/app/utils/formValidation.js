import * as Yup from 'yup';

export const validateForm = (isUpdate) =>
  Yup.object().shape({
    name: Yup.string().max(255, 'Tên người dùng không được vượt quá 255 ký tự').required('Tên người dùng là bắt buộc'),
    username: Yup.string().max(255, 'Tên đăng nhập không được vượt quá 255 ký tự').required('Tên đăng nhập là bắt buộc'),
    password: isUpdate
      ? Yup.string() // Không bắt buộc password khi update
      : Yup.string()
          .required('Vui lòng nhập mật khẩu')
          .matches(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
            'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
          ),
    email: Yup.string().email('Email phải hợp lệ').max(255, 'Email không được vượt quá 255 ký tự').required('Email là bắt buộc'),
    phone: Yup.string()
      .required('Số điện thoại là bắt buộc')
      .matches(/^0\d{9}$/, 'Số điện thoại không hợp lệ'), // ví dụ định dạng 10 số bắt đầu bằng 0)
    roleList: Yup.array().default(['STAFF'])
  });
