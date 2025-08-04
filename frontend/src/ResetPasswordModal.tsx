import React, { useState } from 'react';
import './ResetPasswordModal.css';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnToHome: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, onReturnToHome }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 提交前验证邮箱格式
    if (!validateEmail(email)) {
      setEmailError('请输入有效的邮箱地址');
      return;
    }
    
    // 这里可以添加重置密码的逻辑
    console.log('重置密码邮箱:', email);
    onClose();
  };

  // 检查邮箱是否有效（确认按钮的启用条件）
  const isConfirmButtonDisabled = !(
    email && 
    validateEmail(email)
  );

  return (
    <div className={`reset-password-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>重置密码</h2>
        <p className="reset-password-info">请使用注册邮箱接收重置密码的链接</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="reset-email">邮箱</label>
            <input
              type="email"
              id="reset-email"
              placeholder="请输入注册时使用的邮箱地址"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>
          <button 
            type="submit" 
            disabled={isConfirmButtonDisabled}
            className={isConfirmButtonDisabled ? 'disabled-button' : ''}
          >
            确认
          </button>
        </form>
        <button className="return-home-button" onClick={onReturnToHome}>返回首页</button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;