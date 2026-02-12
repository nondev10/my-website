// My Console
console.log("%c拾皓 ฅ՞•ﻌ•՞ฅ", "color:white;font-weight:bold;text-shadow:10px 5px 5px gray;font-size:6em;padding:10px 30px;".concat("background: linear-gradient(to right top,oklab(58.2% -0.04 -0.21),oklab(58.2% -0.376 -0.21));"));
console.log("个人博客 https://blog.shihao.us.kg/");
console.log('Press `help()` to get help.');

// 工具函数
window.help = function() {
    console.log('`add(a,b)` to add');
    console.log('`minus(a,b)` to minus');
};

window.add = function(a, b) {
    return a + b;
};

window.minus = function(a, b) {
    return a - b;
};

// 页面加载完成后的初始化
window.addEventListener('DOMContentLoaded', () => {
    // 标题动画
    document.querySelectorAll('.main-title').forEach((title, i) => {
        title.style.opacity = '0';
        title.style.transition = 'opacity 0.8s, transform 0.8s';
        
        setTimeout(() => {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, i * 1000);
    });
    
    // 初始化所有功能
    initSkillBars();
    initScrollObserver();
    fixHeaderAlignment();
    generateDynamicDirectory();
    initSideNav();
    initContactForm();
    updateCopyright();
});

// 修复顶栏标题垂直居中
const fixHeaderAlignment = () => {
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.style.display = 'flex';
        logoContainer.style.flexDirection = 'column';
        logoContainer.style.justifyContent = 'center';
        logoContainer.style.height = '100%';
    }
};

// 菜单功能
const menuBtn = document.getElementById('menu-btn');
const menuBlocks = document.getElementById('menu-blocks');
const menuItems = document.querySelectorAll('.menu-block');
let isMenuOpen = false;
const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    
    menuBtn.style.background = isMenuOpen ? '#b8b8b8' : 'transparent';
    menuBtn.style.transition = 'background 0.3s';
    menuBlocks.style.pointerEvents = isMenuOpen ? 'auto' : 'none';
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        menuBlocks.style.transition = 'opacity 0.4s, transform 0.4s';
        menuBlocks.style.opacity = isMenuOpen ? '1' : '0';
        menuBlocks.style.transform = isMenuOpen ? 'translateY(0)' : 'translateY(-10px)';
    } else {
        menuBlocks.style.opacity = isMenuOpen ? '1' : '0';
        menuBlocks.style.transform = isMenuOpen ? 'translateX(0)' : 'translateX(40px)';
    }
    
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            if (isMenuOpen) {
                item.style.opacity = '1';
                item.style.transform = isMobile ? 'translateY(0)' : 'translateX(0)';
            } else {
                item.style.opacity = '0';
                item.style.transform = isMobile ? 'translateY(-30px)' : 'translateX(40px)';
            }
        }, isMenuOpen ? index * 80 : (menuItems.length - index - 1) * 80);
    });
    
    // 防止背景滚动
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
};

menuBtn.addEventListener('click', toggleMenu);

// 版权年份更新
const updateCopyright = () => {
    const startYear = 2025;
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.getElementById('copyright');
    
    if (copyrightElement) {
        copyrightElement.textContent = 
            currentYear > startYear 
                ? `${startYear}-${currentYear} © Copyright ShiHao`
                : `${startYear} © Copyright ShiHao`;
    }
};

// 动态生成目录 - 基于实际标题内容
const generateDynamicDirectory = () => {
    const directoryList = document.getElementById('directory-list');
    if (!directoryList) return;
    
    // 清空现有目录
    directoryList.innerHTML = '';
    
    // 获取所有内容区域中的标题
    const contentSections = document.querySelectorAll('.content-section');
    let sectionCounter = 0;
    
    contentSections.forEach(section => {
        // 获取章节的主要标题 (h1)
        const mainTitle = section.querySelector('h1');
        if (!mainTitle) return;
        
        sectionCounter++;
        const sectionId = section.id || `section-${sectionCounter}`;
        section.id = sectionId; // 确保有ID

        // 创建主目录项
        const mainItem = document.createElement('li');
        const mainLink = document.createElement('a');
        mainLink.href = `#${sectionId}`;
        mainLink.className = 'directory-link level-1';
        mainLink.innerHTML = `<span class="directory-number">${sectionCounter}.</span> ${mainTitle.textContent}`;
        mainLink.setAttribute('data-level', '1');
        
        // 修复点击事件 - 这是唯一需要改的地方
        mainLink.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection(sectionId, this);
        });
        
        mainItem.appendChild(mainLink);
        directoryList.appendChild(mainItem);
        
        // 查找章节内的子标题 (h2, h3)
        const subTitles = section.querySelectorAll('h2, h3');
        if (subTitles.length > 0) {
            const subList = document.createElement('ul');
            subList.className = 'directory-sublist';
            
            subTitles.forEach((subTitle, index) => {
                const subId = subTitle.id || `${sectionId}-sub-${index + 1}`;
                subTitle.id = subId; // 确保子标题有ID
                
                const subItem = document.createElement('li');
                const subLink = document.createElement('a');
                
                // 确定层级
                const level = parseInt(subTitle.tagName.substring(1));
                subLink.href = `#${subId}`;
                subLink.className = `directory-link level-${level}`;
                subLink.textContent = subTitle.textContent;
                subLink.setAttribute('data-level', level.toString());
                
                // 修复点击事件
                subLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    scrollToSection(subId, this);
                });
                
                subItem.appendChild(subLink);
                subList.appendChild(subItem);
            });
            
            directoryList.appendChild(subList);
        }
    });
    
    // 如果没有生成任何目录项，添加默认项
    if (directoryList.children.length === 0) {
        const defaultItem = document.createElement('li');
        const defaultLink = document.createElement('a');
        defaultLink.href = "#introduction";
        defaultLink.className = 'directory-link level-1';
        defaultLink.textContent = "网站内容";
        defaultLink.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('introduction', this);
        });
        defaultItem.appendChild(defaultLink);
        directoryList.appendChild(defaultItem);
    }
};

// 滚动到指定章节 - 使用scrollIntoView，不搞修正主义
const scrollToSection = (sectionId, clickedLink = null) => {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;
    
    // 添加点击反馈
    if (clickedLink) {
        clickedLink.classList.add('clicking');
        setTimeout(() => clickedLink.classList.remove('clicking'), 300);
    }
    
    // 使用scrollIntoView，简单直接
    targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // 更新URL哈希
    history.replaceState(null, null, `#${sectionId}`);
};

// 技能条动画
const initSkillBars = () => {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.width = `${level}%`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillLevels.forEach(level => {
        observer.observe(level);
    });
};

// 滚动监听和导航显示/隐藏
const initScrollObserver = () => {
    const sections = document.querySelectorAll('.content-section, h2, h3');
    const directoryLinks = document.querySelectorAll('.directory-link');
    const topBtn = document.querySelector('.top-btn');
    const bottomBtn = document.querySelector('.bottom-btn');
    const directory = document.querySelector('.side-directory');
    const directoryList = document.querySelector('.directory-list');
    
    let lastScrollTop = 0;
    let isScrolling = false;
    let activeSectionId = null;
    
    const handleScroll = () => {
        if (isScrolling) return;
        
        isScrolling = true;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const titleSection = document.querySelector('.title-section');
        const titleBottom = titleSection.offsetTop + titleSection.offsetHeight;
        
        // 只在桌面端显示侧边元素
        if (window.innerWidth > 768) {
            if (currentScroll > titleBottom - 100) {
                topBtn.classList.add('visible');
                bottomBtn.classList.add('visible');
                directory.classList.add('visible');
            } else {
                topBtn.classList.remove('visible');
                bottomBtn.classList.remove('visible');
                directory.classList.remove('visible');
            }
        }
        
        // 章节检测逻辑
        let currentSection = null;
        let minDistance = Infinity;
        
        sections.forEach(section => {
            if (!section.id) return;
            
            const sectionTop = section.offsetTop - 100;
            const distance = Math.abs(currentScroll - sectionTop);
            
            if (currentScroll >= sectionTop - 50 && distance < minDistance) {
                minDistance = distance;
                currentSection = section;
            }
        });
        
        // 高亮对应的目录项
        if (currentSection && currentSection.id !== activeSectionId) {
            activeSectionId = currentSection.id;
            
            directoryLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${currentSection.id}`) {
                    link.classList.add('active');
                }
            });
        }
        
        lastScrollTop = currentScroll;
        setTimeout(() => { isScrolling = false; }, 50);
    };
    
    // 防抖滚动监听
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 16);
    });
    
    // 初始检查
    handleScroll();
};

// 侧边导航功能
const initSideNav = () => {
    const topBtn = document.querySelector('.top-btn');
    const bottomBtn = document.querySelector('.bottom-btn');
    
    // 返回顶部
    topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 跳至底部
    bottomBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
};

// 窗口大小变化时的优化
window.addEventListener('resize', () => {
    // 移动端切换时重新初始化
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.remove('mobile-device');
    }
    
    initScrollObserver();
});

// 移动端检测和优化
const isMobileDevice = () => {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 改进的页面加载初始化
window.addEventListener('load', () => {
    // 移动端特定优化
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
        
        // 移除桌面端特定元素
        const sideElements = document.querySelectorAll('.side-directory, .nav-btn');
        sideElements.forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }
    
    // 重新初始化目录
    generateDynamicDirectory();
    initScrollObserver();
});

// 联系表单处理
const initContactForm = () => {
    const contactForm = document.getElementById('message-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            const subject = `来自 ${name} 的消息`;
            const body = `姓名: ${name}\n邮箱: ${email}\n\n消息:\n${message}`;
            const mailtoLink = `mailto:hi@sayhow.us.kg?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            window.location.href = mailtoLink;
            contactForm.reset();
            alert('邮件客户端已打开，请发送您的消息。');
        });
    }
};