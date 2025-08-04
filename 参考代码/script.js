document.addEventListener('DOMContentLoaded', function() {
    // 主页面逻辑
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
    const playButton = document.querySelector('.play-button');
    const audioPlayer = document.getElementById('audio-player');
    const authButtons = document.getElementById('auth-buttons');
    
    // 音乐播放相关变量
    let songs = [];
    let currentSongIndex = -1;
    
    // 检查登录状态并更新UI
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn && authButtons) {
        authButtons.style.display = 'none';
        // 可在此处添加用户信息展示逻辑
    }
    
    [registerBtn, loginBtn].forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // 播放按钮动画效果
    if (playButton && audioPlayer) {
        playButton.addEventListener('click', function() {
            this.classList.toggle('playing');
            
            if (this.classList.contains('playing')) {
                // 播放音频
                playRandomSong();
            } else {
                // 暂停音频
                audioPlayer.pause();
            }
        });
    }
    
    // 页面切换功能
    const registerButton = document.getElementById('register-button');
    const loginButton = document.getElementById('login-button');
    const backButtonRegister = document.getElementById('back-button-register');
    const backButtonLogin = document.getElementById('back-button-login');
    const mainPage = document.getElementById('main-page');
    const registerPage = document.getElementById('register-page');
    const loginPage = document.getElementById('login-page');
    const switchToLogin = document.getElementById('switch-to-login');
    const switchToRegister = document.getElementById('switch-to-register');
    
    // 确保所有页面元素都存在再添加事件监听器
    if (registerButton && mainPage && registerPage) {
        registerButton.addEventListener('click', function() {
            mainPage.style.display = 'none';
            registerPage.style.display = 'flex';
        });
    }
    
    if (loginButton && mainPage && loginPage) {
        loginButton.addEventListener('click', function() {
            mainPage.style.display = 'none';
            loginPage.style.display = 'flex';
        });
    }
    
    if (backButtonRegister && registerPage && mainPage) {
        backButtonRegister.addEventListener('click', function() {
            registerPage.style.display = 'none';
            mainPage.style.display = 'flex';
        });
    }
    
    if (backButtonLogin && loginPage && mainPage) {
        backButtonLogin.addEventListener('click', function() {
            loginPage.style.display = 'none';
            mainPage.style.display = 'flex';
        });
    }
    
    // 在注册页面切换到登录页面
    if (switchToLogin && registerPage && loginPage) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerPage.style.display = 'none';
            loginPage.style.display = 'flex';
        });
    }
    
    // 在登录页面切换到注册页面
    if (switchToRegister && loginPage && registerPage) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginPage.style.display = 'none';
            registerPage.style.display = 'flex';
        });
    }
    
    // 点击"just-listen-quietly"文字弹出播放列表
    const slogan = document.querySelector('.slogan');
    const playlistModal = document.getElementById('playlist-modal');
    const closePlaylistModal = document.querySelector('.playlist-close');
    
    if (slogan && playlistModal) {
        slogan.addEventListener('click', function() {
            playlistModal.style.display = 'block';
            // 生成播放列表
            generatePlaylist();
        });
    }
    
    // 关闭播放列表
    if (closePlaylistModal && playlistModal) {
        closePlaylistModal.addEventListener('click', function() {
            playlistModal.style.display = 'none';
        });
    }
    
    // 点击模态框外部关闭
    if (playlistModal) {
        playlistModal.addEventListener('click', function(event) {
            if (event.target === playlistModal) {
                playlistModal.style.display = 'none';
            }
        });
    }
    
    // 从Cloudflare R2获取歌曲列表
    async function fetchSongsFromR2() {
        try {
            // Cloudflare R2公共访问URL前缀
            const r2BaseUrl = 'https://pub-62b071f0470f4c7dbb37004268e46ed0.r2.dev/';
            
            // 歌曲文件列表
            const songFiles = [
                '刘德华 - 17岁.mp3',
                // 可添加更多歌曲
            ];
            
            // 构建完整的歌曲URL列表
            songs = songFiles.map(file => r2BaseUrl + encodeURIComponent(file));
            return songs;
        } catch (error) {
            console.error('获取歌曲列表失败:', error);
            alert('获取歌曲列表失败，请检查网络连接');
            return [];
        }
    }
    
    // 扫描当前目录下的音乐文件（异步版本）
    async function scanAudioFiles() {
        // 常见的音乐文件名列表
        const possibleFiles = [
            "刘德华 - 17岁.mp3",
            // 可添加更多歌曲
        ];
        
        // 检查每个文件是否存在
        songs = [];
        for (const file of possibleFiles) {
            try {
                const response = await fetch(file, { method: 'HEAD' });
                if (response.ok) {
                    songs.push(file);
                }
            } catch (e) {
                // 文件不存在或无法访问，忽略错误
            }
        }
        
        return songs;
    }
    
    // 生成播放列表函数
    async function generatePlaylist() {
        const playlistElement = document.getElementById('playlist');
        if (!playlistElement) return;
        
        // 清空现有列表
        playlistElement.innerHTML = '';
        
        // 显示加载状态
        const loadingLi = document.createElement('li');
        loadingLi.textContent = '加载中...';
        loadingLi.style.color = '#999';
        playlistElement.appendChild(loadingLi);
        
        // 从Cloudflare R2获取歌曲列表
        await fetchSongsFromR2();
        
        // 清空加载状态
        playlistElement.innerHTML = '';
        
        // 检查是否至少有一首歌曲
        if (songs.length === 0) {
            const li = document.createElement('li');
            li.textContent = '未找到音频文件';
            li.style.color = '#999';
            playlistElement.appendChild(li);
            return;
        }
        
        // 为每个歌曲创建列表项
        songs.forEach(function(song, index) {
            const li = document.createElement('li');
            // 解码文件名以正确显示中文
            const decodedSongName = decodeURIComponent(song.split('/').pop());
            li.textContent = decodedSongName;
            li.dataset.index = index; // 添加索引属性
            
            // 点击歌曲播放
            li.addEventListener('click', function() {
                playSongByIndex(parseInt(this.dataset.index), li);
            });
            
            playlistElement.appendChild(li);
        });
    }
    
    // 播放随机歌曲函数
    async function playRandomSong() {
        // 显示加载提示
        if (playButton) playButton.textContent = '加载中...';
        
        // 确保歌曲列表是最新的
        await fetchSongsFromR2();
        
        if (songs.length === 0) {
            alert('没有找到可播放的音频文件');
            if (playButton) {
                playButton.classList.remove('playing');
                playButton.textContent = '';
            }
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * songs.length);
        currentSongIndex = randomIndex;
        playSongByIndex(currentSongIndex);
        
        // 恢复按钮状态
        if (playButton) playButton.textContent = '';
    }
    
    // 根据索引播放歌曲函数
    function playSongByIndex(index, listItem) {
        if (songs.length === 0 || !audioPlayer) {
            console.warn('没有找到音频文件');
            return;
        }
        
        // 移除所有列表项的playing类
        const playlistItems = document.querySelectorAll('#playlist li');
        playlistItems.forEach(function(item) {
            item.classList.remove('playing');
        });
        
        // 为当前播放项添加playing类
        if (listItem) {
            listItem.classList.add('playing');
        } else if (playlistItems[index]) {
            playlistItems[index].classList.add('playing');
        }
        
        // 更新音频源
        const audioSource = audioPlayer.querySelector('source');
        if (audioSource) {
            audioSource.src = songs[index];
        } else {
            audioPlayer.src = songs[index];
        }
        
        // 加载并播放音频
        audioPlayer.load();
        audioPlayer.play().catch(error => {
            console.error('播放失败:', error);
            alert('播放失败，请检查音频文件或浏览器权限');
            if (playButton) playButton.classList.remove('playing');
        });
        
        // 更新播放按钮状态
        if (playButton) {
            playButton.classList.add('playing');
        }
        
        // 更新当前歌曲索引
        currentSongIndex = index;
    }
    
    // 当音频播放结束时，播放下一首随机歌曲
    if (audioPlayer) {
        audioPlayer.addEventListener('ended', function() {
            playNextRandomSong();
        });
    }
    
    // 播放下一首随机歌曲
    async function playNextRandomSong() {
        // 确保歌曲列表是最新的
        await fetchSongsFromR2();
        
        if (songs.length === 0) {
            console.warn('没有找到音频文件');
            if (playButton) playButton.classList.remove('playing');
            return;
        }
        
        // 单首歌曲时直接重播
        if (songs.length === 1) {
            playSongByIndex(0);
            return;
        }
        
        // 多首歌曲时随机选择下一首（不重复当前）
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * songs.length);
        } while (nextIndex === currentSongIndex);
        
        currentSongIndex = nextIndex;
        playSongByIndex(currentSongIndex);
    }
    
    // 验证码相关元素
    const sendVerificationBtn = document.getElementById('send-verification');
    const emailInput = document.getElementById('email');
    const verificationCodeInput = document.getElementById('verification-code');
    
    // 添加邮箱格式验证提示功能
    if (emailInput && !document.getElementById('email-hint')) {
        // 创建提示元素（仅在不存在时）
        const emailHint = document.createElement('div');
        emailHint.id = 'email-hint';
        emailHint.style.fontSize = '12px';
        emailHint.style.marginTop = '5px';
        emailHint.style.minHeight = '16px';
        
        // 将提示元素插入到邮箱输入框后面
        emailInput.parentNode.insertBefore(emailHint, emailInput.nextSibling);
        
        // 监听邮箱输入框的变化
        emailInput.addEventListener('input', function() {
            validateEmailFormat(this.value);
        });
        
        // 监听邮箱输入框失去焦点事件
        emailInput.addEventListener('blur', function() {
            validateEmailFormat(this.value);
        });
    }
    
    // 邮箱格式验证函数
    function validateEmailFormat(email) {
        const hintElement = document.getElementById('email-hint');
        if (!hintElement) return;
        
        if (email === '') {
            // 输入为空时，不显示提示
            hintElement.textContent = '';
            hintElement.style.color = '';
            emailInput.style.borderColor = '#4CAF50'; // 恢复默认边框颜色
        } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            // 邮箱格式正确
            hintElement.textContent = '✓ 邮箱格式正确';
            hintElement.style.color = 'green';
            emailInput.style.borderColor = 'green';
        } else {
            // 邮箱格式错误
            hintElement.textContent = '✗ 请输入正确的邮箱格式';
            hintElement.style.color = 'red';
            emailInput.style.borderColor = 'red';
        }
    }
    
    // 添加密码强度验证提示功能
    const passwordInput = document.getElementById('reg-password');
    if (passwordInput && !document.getElementById('password-hint')) {
        // 创建密码提示元素（仅在不存在时）
        const passwordHint = document.createElement('div');
        passwordHint.id = 'password-hint';
        passwordHint.style.fontSize = '12px';
        passwordHint.style.marginTop = '5px';
        passwordHint.style.minHeight = '32px';
        
        // 将提示元素插入到密码输入框后面
        passwordInput.parentNode.insertBefore(passwordHint, passwordInput.nextSibling);
        
        // 监听密码输入框的变化
        passwordInput.addEventListener('input', function() {
            validatePasswordStrength(this.value);
        });
        
        // 监听密码输入框失去焦点事件
        passwordInput.addEventListener('blur', function() {
            validatePasswordStrength(this.value);
        });
    }
    
    // 密码强度验证函数
    function validatePasswordStrength(password) {
        const hintElement = document.getElementById('password-hint');
        if (!hintElement) return;
        
        if (password === '') {
            // 输入为空时，显示默认提示
            hintElement.textContent = '密码至少8位，包含字母和数字';
            hintElement.style.color = '#666';
            passwordInput.style.borderColor = '#4CAF50'; // 恢复默认边框颜色
            return;
        }
        
        // 检查密码强度
        const isLengthValid = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        let hintMessage = '';
        let isValid = true;
        
        if (!isLengthValid) {
            hintMessage += '✗ 至少8位\n';
            isValid = false;
        } else {
            hintMessage += '✓ 至少8位\n';
        }
        
        if (!hasLetter) {
            hintMessage += '✗ 至少包含一个字母\n';
            isValid = false;
        } else {
            hintMessage += '✓ 包含字母\n';
        }
        
        if (!hasNumber) {
            hintMessage += '✗ 至少包含一个数字';
            isValid = false;
        } else {
            hintMessage += '✓ 包含数字';
        }
        
        hintElement.textContent = hintMessage;
        hintElement.style.whiteSpace = 'pre-line'; // 保持换行
        
        if (isValid) {
            hintElement.style.color = 'green';
            passwordInput.style.borderColor = 'green';
        } else {
            hintElement.style.color = 'red';
            passwordInput.style.borderColor = 'red';
        }
    }
    
    // 添加确认密码一致性校验功能
    const confirmPasswordInput = document.getElementById('confirm-password');
    if (confirmPasswordInput && passwordInput && !document.getElementById('confirm-password-hint')) {
        // 创建确认密码提示元素（仅在不存在时）
        const confirmPasswordHint = document.createElement('div');
        confirmPasswordHint.id = 'confirm-password-hint';
        confirmPasswordHint.style.fontSize = '12px';
        confirmPasswordHint.style.marginTop = '5px';
        confirmPasswordHint.style.minHeight = '16px';
        
        // 将提示元素插入到确认密码输入框后面
        confirmPasswordInput.parentNode.insertBefore(confirmPasswordHint, confirmPasswordInput.nextSibling);
        
        // 监听确认密码输入框的变化
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch(passwordInput.value, this.value);
        });
        
        // 监听确认密码输入框失去焦点事件
        confirmPasswordInput.addEventListener('blur', function() {
            validatePasswordMatch(passwordInput.value, this.value);
        });
        
        // 监听原密码输入框的变化，同步更新确认密码提示
        passwordInput.addEventListener('input', function() {
            validatePasswordMatch(this.value, confirmPasswordInput.value);
        });
    }
    
    // 密码一致性验证函数
    function validatePasswordMatch(password, confirmPassword) {
        const hintElement = document.getElementById('confirm-password-hint');
        if (!hintElement) return;
        
        if (confirmPassword === '') {
            // 输入为空时，不显示提示
            hintElement.textContent = '';
            confirmPasswordInput.style.borderColor = '#4CAF50'; // 恢复默认边框颜色
            return;
        }
        
        if (password === confirmPassword) {
            // 密码一致
            hintElement.textContent = '✓ 两次输入的密码一致';
            hintElement.style.color = 'green';
            confirmPasswordInput.style.borderColor = 'green';
        } else {
            // 密码不一致
            hintElement.textContent = '✗ 两次输入的密码不一致';
            hintElement.style.color = 'red';
            confirmPasswordInput.style.borderColor = 'red';
        }
    }
    
    // 发送验证码功能
    if (sendVerificationBtn) {
        sendVerificationBtn.addEventListener('click', function() {
            const email = emailInput.value.trim();
            
            // 简单的邮箱格式验证
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            // 模拟发送验证码（实际项目中这里会调用后端API）
            sendVerificationCode(email);
        });
    }
    
    // 模拟发送验证码函数
    function sendVerificationCode(email) {
        // 禁用发送按钮并开始倒计时
        sendVerificationBtn.disabled = true;
        let countdown = 60;
        sendVerificationBtn.textContent = `${countdown}秒后重发`;
        
        const timer = setInterval(() => {
            countdown--;
            sendVerificationBtn.textContent = `${countdown}秒后重发`;
            
            if (countdown <= 0) {
                clearInterval(timer);
                sendVerificationBtn.disabled = false;
                sendVerificationBtn.textContent = '发送验证码';
            }
        }, 1000);
        
        // 模拟发送成功（实际项目中这里会有真正的发送逻辑）
        console.log(`验证码已发送至: ${email}`);
        alert(`验证码已发送至: ${email}\n(实际项目中这里会发送真正的验证码)`);
    }
    
    // 重置密码链接点击事件
    const resetPasswordLink = document.getElementById('reset-password');
    if (resetPasswordLink) {
        resetPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            // 显示重置密码模态窗口
            const resetPasswordModal = document.getElementById('reset-password-modal');
            if (resetPasswordModal) {
                resetPasswordModal.style.display = 'block';
            }
            
            // 初始化邮箱验证提示
            initializeResetEmailValidation();
        });
    }
    
    // 初始化重置密码邮箱验证（避免重复创建元素）
    function initializeResetEmailValidation() {
        const resetEmailInput = document.getElementById('reset-email');
        if (!resetEmailInput) return;
        
        // 检查提示元素是否已存在
        let emailHint = document.getElementById('reset-email-hint');
        if (!emailHint) {
            // 创建提示元素
            emailHint = document.createElement('div');
            emailHint.id = 'reset-email-hint';
            emailHint.style.fontSize = '12px';
            emailHint.style.marginTop = '5px';
            emailHint.style.minHeight = '16px';
            
            // 将提示元素插入到邮箱输入框后面
            resetEmailInput.parentNode.insertBefore(emailHint, resetEmailInput.nextSibling);
            
            // 监听邮箱输入框的变化
            resetEmailInput.addEventListener('input', function() {
                validateEmailFormatForReset(this.value);
            });
            
            // 监听邮箱输入框失去焦点事件
            resetEmailInput.addEventListener('blur', function() {
                validateEmailFormatForReset(this.value);
            });
        }
        
        // 清空输入框内容
        resetEmailInput.value = '';
        // 重置提示状态
        emailHint.textContent = '';
        resetEmailInput.style.borderColor = '#4CAF50';
    }
    
    // 为重置密码页面的邮箱格式验证函数
    function validateEmailFormatForReset(email) {
        const hintElement = document.getElementById('reset-email-hint');
        if (!hintElement) return;
        
        const resetEmailElement = document.getElementById('reset-email');
        if (!resetEmailElement) return;
        
        if (email === '') {
            // 输入为空时，不显示提示
            hintElement.textContent = '';
            hintElement.style.color = '';
            resetEmailElement.style.borderColor = '#4CAF50'; // 恢复默认边框颜色
        } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            // 邮箱格式正确
            hintElement.textContent = '✓ 邮箱格式正确';
            hintElement.style.color = 'green';
            resetEmailElement.style.borderColor = 'green';
        } else {
            // 邮箱格式错误
            hintElement.textContent = '✗ 请输入正确的邮箱格式';
            hintElement.style.color = 'red';
            resetEmailElement.style.borderColor = 'red';
        }
    }
    
    // 重置密码模态窗口关闭按钮
    const resetPasswordCloseBtn = document.querySelector('.reset-close');
    if (resetPasswordCloseBtn) {
        resetPasswordCloseBtn.addEventListener('click', function() {
            const resetPasswordModal = document.getElementById('reset-password-modal');
            if (resetPasswordModal) {
                resetPasswordModal.style.display = 'none';
            }
        });
    }
    
    // 点击重置密码模态窗口外部关闭
    const resetPasswordModal = document.getElementById('reset-password-modal');
    if (resetPasswordModal) {
        resetPasswordModal.addEventListener('click', function(event) {
            if (event.target === resetPasswordModal) {
                resetPasswordModal.style.display = 'none';
            }
        });
    }
    
    // 重置密码确认按钮点击事件
    const resetPasswordConfirmBtn = document.getElementById('reset-password-confirm');
    if (resetPasswordConfirmBtn) {
        resetPasswordConfirmBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const resetEmail = document.getElementById('reset-email');
            if (!resetEmail) return;
            
            const resetEmailValue = resetEmail.value.trim();
            
            // 邮箱验证
            if (!resetEmailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmailValue)) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            // 模拟发送重置密码链接
            alert(`重置密码链接已发送至: ${resetEmailValue}\n请检查您的邮箱并按照指示重置密码。`);
            
            // 关闭模态窗口
            if (resetPasswordModal) {
                resetPasswordModal.style.display = 'none';
            }
        });
    }
    
    // 注册表单提交功能（使用form提交事件）
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const username = document.getElementById('username');
            const email = document.getElementById('email');
            const password = document.getElementById('reg-password');
            const confirmPassword = document.getElementById('confirm-password');
            const verificationCode = document.getElementById('verification-code');
            
            // 表单验证
            if (!username || !username.value.trim()) {
                alert('请输入用户名');
                return;
            }
            
            if (!email || !email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            if (!verificationCode || !verificationCode.value.trim()) {
                alert('请输入验证码');
                return;
            }
            
            if (!password || !password.value) {
                alert('请输入密码');
                return;
            }
            
            // 密码强度验证
            const isLengthValid = password.value.length >= 8;
            const hasLetter = /[a-zA-Z]/.test(password.value);
            const hasNumber = /\d/.test(password.value);
            
            if (!isLengthValid || !hasLetter || !hasNumber) {
                alert('密码必须至少8位，且包含字母和数字');
                return;
            }
            
            if (!confirmPassword || password.value !== confirmPassword.value) {
                alert('两次输入的密码不一致');
                return;
            }
            
            // 模拟注册成功（实际项目中这里会调用后端API）
            alert('注册成功！');
            
            // 重置表单
            registerForm.reset();
            
            // 清除提示
            document.getElementById('email-hint')?.textContent('');
            document.getElementById('password-hint')?.textContent('密码至少8位，包含字母和数字');
            document.getElementById('confirm-password-hint')?.textContent('');
            
            // 重置输入框边框颜色
            if (password) password.style.borderColor = '#4CAF50';
            if (email) email.style.borderColor = '#4CAF50';
            if (confirmPassword) confirmPassword.style.borderColor = '#4CAF50';
            
            // 返回首页
            if (registerPage) registerPage.style.display = 'none';
            if (mainPage) mainPage.style.display = 'flex';
        });
    }
    
    // 登录表单提交功能（使用form提交事件）
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取登录表单数据
            const loginEmail = document.getElementById('login-email');
            const loginPassword = document.getElementById('login-password');
            
            // 表单验证
            if (!loginEmail || !loginEmail.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.value.trim())) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            if (!loginPassword || !loginPassword.value) {
                alert('请输入密码');
                return;
            }
            
            // 简单的登录验证（实际项目中这里会调用后端API）
            // 保存登录状态到本地存储
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', loginEmail.value.trim());
            
            // 重置登录表单
            loginForm.reset();
            
            // 更新UI
            if (authButtons) authButtons.style.display = 'none';
            
            // 返回首页
            if (loginPage) loginPage.style.display = 'none';
            if (mainPage) mainPage.style.display = 'flex';
            
            // 显示欢迎信息
            alert('登录成功！');
        });
    }
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 空格键控制播放/暂停
        if (e.code === 'Space') {
            e.preventDefault();
            if (playButton) playButton.click();
        }
        // ESC键关闭所有模态框
        if (e.code === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
});