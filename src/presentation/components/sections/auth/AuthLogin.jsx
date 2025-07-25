"use client"

import React from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"

// material-ui
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormHelperText from "@mui/material/FormHelperText"
import Grid from "@mui/material/Grid2"
import Link from "@mui/material/Link"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import Typography from "@mui/material/Typography"

// third-party
import * as Yup from "yup"
import { Formik } from "formik"

// project imports
import IconButton from "../../@extended/IconButton"
import AnimateButton from "../../@extended/AnimateButton"
import { useAuthActions } from "infrastructure/hooks/useAuthActions"

// assets
import EyeOutlined from "@ant-design/icons/EyeOutlined"
import EyeInvisibleOutlined from "@ant-design/icons/EyeInvisibleOutlined"
import dashboardPreview from "../../../assets/images/auth/dashboard-preview.jpeg"
import logo from "../../../assets/images/logo/logo.png"

// styles
import "../../../assets/styles/login.css"

export default function AuthLogin() {
  const [checked, setChecked] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [loginError, setLoginError] = React.useState(null)
  const { login, loading } = useAuthActions()
  const navigate = useNavigate()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  return (
    <div className="login-container">
      {/* Left Column - Login Form */}
      <div className="login-left">
        <div className="login-content">
          {/* Logo */}
          <div className="logo-section">
            <img src={logo} alt="ERP-SYSTEM" width={40} height={40} className="logo" />
            <span className="brand-name">ERP SYSTEM</span>
          </div>

          {/* Welcome Section */}
          <div className="welcome-section">
            <Typography className="welcome-title">Chào mừng bạn trở lại</Typography>
            <Typography className="welcome-subtitle">Nhập email và mật khẩu để truy cập tài khoản của bạn.</Typography>
          </div>

          {/* Login Form */}
          <div className="form-section">
            <Formik
              initialValues={{
                email: "sellostore@company.com",
                password: "Sellostore.",
                submit: null,
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email("Email không hợp lệ").max(255).required("Email không được bỏ trống"),
                password: Yup.string()
                  .required("Mật khẩu không được bỏ trống")
                  .test(
                    "no-leading-trailing-whitespace",
                    "Mật khẩu không được bắt đầu hoặc kết thúc bằng khoảng trắng",
                    (value) => value === value.trim(),
                  )
                  .max(10, "Mật khẩu phải ít hơn 10 ký tự"),
              })}
              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                  setLoginError(null)
                  const result = await login({
                    email: values.email,
                    password: values.password,
                  })
                  if (result.success) {
                    setStatus({ success: true })
                    navigate("/dashboard/default")
                  } else {
                    setStatus({ success: false })
                    const errorMessage = result.error || "Đăng nhập thất bại"
                    setErrors({ submit: errorMessage })
                    setLoginError(errorMessage)
                  }
                } catch (err) {
                  setStatus({ success: false })
                  const errorMessage = err.message || "Đã xảy ra lỗi không xác định"
                  setErrors({ submit: errorMessage })
                  setLoginError(errorMessage)
                } finally {
                  setSubmitting(false)
                }
              }}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={0}>
                    <Grid size={12}>
                      <div className="form-group">
                        <InputLabel htmlFor="email-login" className="form-label">
                          Email
                        </InputLabel>
                        <OutlinedInput
                          id="email-login"
                          type="email"
                          value={values.email}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="sellostore@company.com"
                          fullWidth
                          error={Boolean(touched.email && errors.email)}
                          className="form-input"
                        />
                        {touched.email && errors.email && (
                          <FormHelperText error id="standard-weight-helper-text-email-login">
                            {errors.email}
                          </FormHelperText>
                        )}
                      </div>
                    </Grid>

                    <Grid size={12}>
                      <div className="form-group">
                        <InputLabel htmlFor="password-login" className="form-label">
                          Mật khẩu
                        </InputLabel>
                        <OutlinedInput
                          fullWidth
                          error={Boolean(touched.password && errors.password)}
                          id="password-login"
                          type={showPassword ? "text" : "password"}
                          value={values.password}
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                color="secondary"
                              >
                                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              </IconButton>
                            </InputAdornment>
                          }
                          placeholder="Sellostore."
                          className="form-input"
                        />
                        {touched.password && errors.password && (
                          <FormHelperText error id="standard-weight-helper-text-password-login">
                            {errors.password}
                          </FormHelperText>
                        )}
                      </div>

                      <div className="form-options">
                        <div className="remember-me">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checked}
                                onChange={(event) => setChecked(event.target.checked)}
                                name="checked"
                                color="primary"
                                size="small"
                              />
                            }
                            label={<Typography className="remember-label">Ghi nhớ</Typography>}
                          />
                        </div>
                        <Link component={RouterLink} to="#" className="forgot-password">
                          Quên mật khẩu?
                        </Link>
                      </div>
                    </Grid>

                    {loginError && (
                      <Grid size={12}>
                        <FormHelperText error>{loginError}</FormHelperText>
                      </Grid>
                    )}

                    <Grid size={12}>
                      <AnimateButton>
                        <Button
                          fullWidth
                          size="large"
                          variant="contained"
                          type="submit"
                          disabled={isSubmitting || loading}
                          className="login-button"
                        >
                          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                      </AnimateButton>
                    </Grid>

                    <Grid size={12}>
                      <div className="divider-section">
                        <div className="divider-line"></div>
                        <span className="divider-text">Hoặc đăng nhập với</span>
                      </div>
                    </Grid>

                    <Grid size={12}>
                      <div className="social-buttons">
                        <Button className="social-button">
                          <svg className="social-icon" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Google
                        </Button>
                        <Button className="social-button">
                          <svg className="social-icon" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                            />
                          </svg>
                          Apple
                        </Button>
                      </div>
                    </Grid>

                    <Grid size={12}>
                      <div className="register-link">
                        {"Bạn chưa có tài khoản? "}
                        <Link component={RouterLink} to="/register" className="register-link-text">
                          Đăng ký ngay.
                        </Link>
                      </div>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </div>

          {/* Footer */}
          <div className="footer-section">
            <span>Copyright © 2025 ERP System Metasol LTD.</span>
            <Link href="/privacy" className="privacy-link">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Marketing Content */}
      <div className="login-right">
        <div className="marketing-content">
          <Typography className="marketing-title">Quản lý đội ngũ và hoạt động của bạn.</Typography>
          <Typography className="marketing-subtitle">
            Đăng nhập để truy cập bảng điều khiển ERP và quản lý đội ngũ của bạn.
          </Typography>

          <div className="dashboard-preview">
            <img
              src={dashboardPreview}
              alt="Dashboard Preview"
              width={700}
              height={700}
              className="preview-image"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

