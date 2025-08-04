import React, { useState, useEffect } from 'react';
import './RegisterModal.css';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 倒计时效果
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateUsername = (username: string) => {
    // 用户名长度应在2-18位之间
    return username.length >= 2 && username.length <= 18;
  };

  const validatePassword = (password: string) => {
    // 密码至少8位最大20位，至少包含1个字母和一个数字
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/;
    return re.test(password);
  };

  const validateVerificationCode = (code: string) => {
    // 验证码必须是6位数字
    const re = /^\d{6}$/;
    return re.test(code);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    // 实时验证邮箱格式
    if (emailValue && !validateEmail(emailValue)) {
      setEmailError('请输入有效的邮箱地址');
    } else {
      setEmailError('');
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usernameValue = e.target.value;
    setUsername(usernameValue);
    
    // 实时验证用户名长度
    if (usernameValue && !validateUsername(usernameValue)) {
      setUsernameError('用户名长度应在2-18位之间');
    } else {
      setUsernameError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    
    // 实时验证密码格式
    if (passwordValue && !validatePassword(passwordValue)) {
      setPasswordError('密码至少8位最大20位，至少包含1个字母和一个数字');
    } else {
      setPasswordError('');
    }
    
    // 如果确认密码不为空且与密码不一致，更新确认密码错误
    if (confirmPassword && passwordValue !== confirmPassword) {
      setConfirmPasswordError('两次输入的密码不一致');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);
    
    // 验证确认密码与密码是否一致
    if (password && password !== confirmPasswordValue) {
      setConfirmPasswordError('两次输入的密码不一致');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const codeValue = e.target.value;
    setVerificationCode(codeValue);
    
    // 实时验证验证码格式
    if (codeValue && !validateVerificationCode(codeValue)) {
      setVerificationCodeError('验证码必须是6位数字');
    } else {
      setVerificationCodeError('');
    }
  };

  const handleSendCode = () => {
    // 这里可以添加发送验证码的逻辑
    console.log('发送验证码到:', email);
    
    // 启动99秒倒计时
    setCountdown(99);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 提交前验证用户名
    if (!validateUsername(username)) {
      setUsernameError('用户名长度应在2-18位之间');
      return;
    }
    
    // 提交前再次验证邮箱格式
    if (!validateEmail(email)) {
      setEmailError('请输入有效的邮箱地址');
      return;
    }
    
    // 提交前验证密码
    if (!validatePassword(password)) {
      setPasswordError('密码至少8位最大20位，至少包含1个字母和一个数字');
      return;
    }
    
    // 提交前验证确认密码
    if (password !== confirmPassword) {
      setConfirmPasswordError('两次输入的密码不一致');
      return;
    }
    
    // 提交前验证验证码
    if (!validateVerificationCode(verificationCode)) {
      setVerificationCodeError('验证码必须是6位数字');
      return;
    }
    
    // 这里可以添加其他表单验证和提交逻辑
    console.log('Form submitted:', {
      username,
      email,
      verificationCode,
      password,
      confirmPassword,
    });
    onClose();
  };

  // 检查用户名和邮箱是否都有效（发送验证码按钮的启用条件）
  const isSendCodeButtonDisabled = !(
    username && 
    email && 
    validateUsername(username) && 
    validateEmail(email)
  ) || countdown > 0; // 倒计时期间按钮也禁用

  // 检查所有字段是否都有效（注册按钮的启用条件）
  const isRegisterButtonDisabled = !(
    username &&
    email &&
    verificationCode &&
    password &&
    confirmPassword &&
    validateUsername(username) &&
    validateEmail(email) &&
    validateVerificationCode(verificationCode) &&
    validatePassword(password) &&
    password === confirmPassword
  );

  return (
    <div className={`register-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>用户注册</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              placeholder="请输入用户名"
              value={username}
              onChange={handleUsernameChange}
            />
            {usernameError && <div className="error-message">{usernameError}</div>}
          </div>
          <div>
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              placeholder="请输入邮箱地址"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>
          <div>
            <label htmlFor="verificationCode">验证码</label>
            <input
              type="text"
              id="verificationCode"
              placeholder="请输入验证码"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
            />
            {verificationCodeError && <div className="error-message">{verificationCodeError}</div>}
            <button 
              type="button" 
              style={{ marginLeft: '10px' }}
              disabled={isSendCodeButtonDisabled}
              className={isSendCodeButtonDisabled ? 'disabled-button' : ''}
              onClick={handleSendCode}
            >
              {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
            </button>
          </div>
          <div>
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              placeholder="请输入密码"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>
          <div>
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
          </div>
          <button 
            type="submit" 
            disabled={isRegisterButtonDisabled}
            className={isRegisterButtonDisabled ? 'disabled-button' : ''}
          >
            注册
          </button>
        </form>
        <p>已有账户? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>立即登录</a> | <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>返回首页</a></p>
      </div>
    </div>
  );
};

export default RegisterModal;