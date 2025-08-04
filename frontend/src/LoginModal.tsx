import React, { useState } from 'react';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    // 密码至少8位，最少包含1个字母和1个数字
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(password);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usernameValue = e.target.value;
    setUsername(usernameValue);
    
    // 实时验证邮箱格式
    if (usernameValue && !validateEmail(usernameValue)) {
      setUsernameError('请输入有效的邮箱地址');
    } else {
      setUsernameError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    
    // 实时验证密码格式
    if (passwordValue && !validatePassword(passwordValue)) {
      setPasswordError('密码至少8位，最少包含1个字母和1个数字');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 提交前验证邮箱格式
    if (!validateEmail(username)) {
      setUsernameError('请输入有效的邮箱地址');
      return;
    }
    
    // 提交前验证密码
    if (!validatePassword(password)) {
      setPasswordError('密码至少8位，最少包含1个字母和1个数字');
      return;
    }
    
    // 这里可以添加登录逻辑
    console.log('登录信息:', { username, password });
    onClose();
  };

  // 检查所有字段是否都有效（登录按钮的启用条件）
  const isLoginButtonDisabled = !(
    username &&
    password &&
    validateEmail(username) &&
    validatePassword(password)
  );

  return (
    <div className={`login-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>用户登录</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-username">邮箱</label>
            <input
              type="text"
              id="login-username"
              placeholder="请输入邮箱"
              value={username}
              onChange={handleUsernameChange}
            />
            {usernameError && <div className="error-message">{usernameError}</div>}
          </div>
          <div>
            <label htmlFor="login-password">密码</label>
            <input
              type="password"
              id="login-password"
              placeholder="请输入密码"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>
          <button 
            type="submit" 
            disabled={isLoginButtonDisabled}
            className={isLoginButtonDisabled ? 'disabled-button' : ''}
          >
            登录
          </button>
        </form>
        <p>还没有账户? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>立即注册</a> | <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>重置密码</a> | <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>返回主页</a></p>
      </div>
    </div>
  );
};

export default LoginModal;