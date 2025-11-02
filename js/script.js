// Скроллбар

document.addEventListener('DOMContentLoaded', () => {
  const scrollbar = document.querySelector('.custom-scrollbar');
  if (!scrollbar) return;

  const headerHeight = 36;
  const footerHeight = 36;
  let scrollTimeout;
  let isScrolling = false;
  let rafId = null;

  // Функция обновления позиции ползунка
  function updateScrollbar() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    if (scrollHeight <= clientHeight) {
      scrollbar.style.setProperty('--thumb-height', '0px');
      return;
    }

    const maxScroll = scrollHeight - clientHeight;
    const scrollbarHeight = clientHeight - (headerHeight + footerHeight);
    const thumbHeight = Math.max(20, (clientHeight / scrollHeight) * scrollbarHeight);
    const thumbPosition = maxScroll > 0 
      ? (scrollPosition / maxScroll) * (scrollbarHeight - thumbHeight)
      : 0;

    scrollbar.style.setProperty('--thumb-height', `${thumbHeight}px`);
    scrollbar.style.setProperty('--thumb-position', `${thumbPosition}px`);
  }

  // Функция обработки скролла
  function handleScroll() {
    if (!isScrolling) {
      isScrolling = true;
      scrollbar.classList.remove('disappearing');
      scrollbar.classList.add('appearing');
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      scrollbar.classList.remove('appearing');
      scrollbar.classList.add('disappearing');
    }, 200); // Задержка перед началом исчезновения

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        updateScrollbar();
        rafId = null;
      });
    }
  }

  // Инициализация
  function init() {
    updateScrollbar();
    
    // Проверка через 300ms после загрузки (на случай lazy-load)
    setTimeout(updateScrollbar, 300);
    
    // Обработчики событий
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollbar, { passive: true });
    window.addEventListener('load', updateScrollbar);
  }

  init();

  // Очистка
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateScrollbar);
    if (rafId) cancelAnimationFrame(rafId);
  });
});







// Блок с наградами

document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.award-slide');
  const dots = document.querySelectorAll('.dot');
  const prevButton = document.querySelector('.slider-control__left-side');
  const nextButton = document.querySelector('.slider-control__right-side');
  let currentSlide = 0;
  const totalSlides = slides.length;

  // Функция для показа конкретного слайда
  function showSlide(index) {
    // Корректировка индекса для циклического перехода
    currentSlide = (index + totalSlides) % totalSlides;

    // Удаляем класс active у всех слайдов и точек
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Добавляем класс active текущему слайду и точке
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  // Обработчики для кнопок "Вперед/Назад"
  nextButton.addEventListener('click', () => {
    showSlide(currentSlide + 1);
  });
  prevButton.addEventListener('click', () => {
    showSlide(currentSlide - 1);
  });

  // Обработчики для точек (делегирование событий)
  document.querySelector('.slider-dots').addEventListener('click', function(event) {
    const dot = event.target.closest('.dot');
    if (dot) {
      const slideIndex = parseInt(dot.getAttribute('data-slide'));
      showSlide(slideIndex);
    }
  });

  // Инициализация: показываем первый слайд
  showSlide(0);
});







// Автоматическое переключение слайдера с наградами

// Автоматическое переключение слайдера с наградами
document.addEventListener('DOMContentLoaded', function() {
  // Ждем пока инициализируется основной слайдер
  setTimeout(() => {
    initAutoSlide();
  }, 100);
});

function initAutoSlide() {
  let autoSlideInterval;
  const awardsBlock = document.querySelector('.awards-block');
  
  // Если блока с наградами нет, выходим
  if (!awardsBlock) return;

  function startAutoSlide() {
    stopAutoSlide();
    console.log('Запуск автосмены');
    
    autoSlideInterval = setInterval(() => {
      // Находим элементы внутри функции, так как они могут измениться
      const slides = document.querySelectorAll('.award-slide');
      const dots = document.querySelectorAll('.dot');
      const activeSlide = document.querySelector('.award-slide.active');
      const activeDot = document.querySelector('.dot.active');
      
      if (!activeSlide || !activeDot) return;
      
      // Определяем текущий индекс
      let currentIndex = 0;
      slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
          currentIndex = index;
        }
      });
      
      // Вычисляем следующий слайд
      const nextIndex = (currentIndex + 1) % slides.length;
      console.log('Автопереключение на слайд:', nextIndex);
      
      // Переключаем слайд
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[nextIndex].classList.add('active');
      dots[nextIndex].classList.add('active');
      
    }, 4000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      console.log('Остановка автосмены');
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  // Запускаем автосмену
  startAutoSlide();

  // Обработчики событий
  awardsBlock.addEventListener('mouseenter', stopAutoSlide);
  awardsBlock.addEventListener('mouseleave', startAutoSlide);
  
  // Останавливаем автосмену при клике на точки или кнопки
  awardsBlock.addEventListener('click', function(e) {
    if (e.target.closest('.dot') || 
        e.target.closest('.slider-control__left-side') || 
        e.target.closest('.slider-control__right-side')) {
      stopAutoSlide();
    }
  });
}







// Перемешивание слайдов

document.addEventListener('DOMContentLoaded', function() {
  // Находим контейнер с изображениями
  const imagesContainer = document.querySelector('.images');
  
  // Проверяем, что контейнер существует
  if (!imagesContainer) return;

  // Собираем все изображения в массив
  const images = Array.from(imagesContainer.querySelectorAll('img'));
  
  // Проверяем, есть ли что перемешивать
  if (images.length < 2) return;

  // Функция для перемешивания массива (алгоритм Фишера-Йетса)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Перемешиваем массив изображений
  const shuffledImages = shuffleArray(images);

  // Очищаем контейнер
  imagesContainer.innerHTML = '';

  // Вставляем изображения в новом порядке
  shuffledImages.forEach(img => {
    imagesContainer.appendChild(img);
  });

  // Обновляем обработчики событий после перемешивания
  initGallery();
});

function initGallery() {
  // Ваш существующий код инициализации галереи
  // (который вы предоставили ранее для модального окна)
  // ... 
}







// Органичение количества строк со слайдами

function limitVisibleSlides() {
  const container = document.getElementById('images');
  const slides = container.querySelectorAll('img');
  const containerWidth = container.clientWidth;
  const slideWidth = slides[0]?.clientWidth || 150; // предполагаемая ширина
  const slidesPerRow = Math.floor(containerWidth / (slideWidth + 10)); // + gap
  
  const maxSlides = slidesPerRow * 8;
  
  slides.forEach((slide, index) => {
    if (index >= maxSlides) {
      slide.style.display = 'none';
    } else {
      slide.style.display = 'block';
    }
  });
}

// Вызывать при загрузке и ресайзе
window.addEventListener('load', limitVisibleSlides);
window.addEventListener('resize', limitVisibleSlides);








// Модальное окно + увеличение изображения (1 раз, на всю ширину экрана) + скролл после увеличения + сохранение позиции на странице (сохранение скролла) после закрытия окна

// Глобальные переменные
let isZoomed = false;
let scrollContainer = null;
let zoomedImg = null;
let scrollPosition = 0;
let isModalOpen = false;

// Функции для управления скроллом
function saveScrollPosition() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
}

function lockBodyScroll() {
    document.body.style.overflow = 'hidden';
    // Сохраняем позицию через padding и margin вместо position: fixed
    document.body.dataset.scrollPosition = scrollPosition;
    document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px'; // Компенсируем исчезновение скроллбара
}

function unlockBodyScroll() {
    // Восстанавливаем стили
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Убираем сохраненную позицию
    delete document.body.dataset.scrollPosition;
}

document.addEventListener('DOMContentLoaded', function() {
  // Основные элементы
  const modal = document.getElementById('modalGallery');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.modal-close');

  // Явный обработчик для кнопки закрытия
  closeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });

  function handleModalClick(e) {
    if (e.target.classList.contains('modal-close')) return;
    
    if (e.target === modal) {
      closeModal();
    }
    else if (e.target === modalImg || e.target.classList.contains('modal-image')) {
      if (!isZoomed) {
        setZoom();
      }
    }
  }

  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');
  const galleryImages = document.querySelectorAll('.images img[data-full-size]');
  const allUiElements = document.querySelectorAll('.modal-close, .modal-nav, .desc, .modal-counter, .previous-image, .next-image');
  
  let currentIndex = 0;
  const fullSizeImages = Array.from(galleryImages).map(img => img.dataset.fullSize);

  // Функция увеличения изображения
  function setZoom() {
    allUiElements.forEach(el => el.style.display = 'none');
    
    scrollContainer = document.createElement('div');
    scrollContainer.className = 'image-scroll-container';
    scrollContainer.style.position = 'fixed';
    scrollContainer.style.top = '0';
    scrollContainer.style.left = '0';
    scrollContainer.style.width = '100vw';
    scrollContainer.style.height = '100vh';
    scrollContainer.style.overflow = 'auto';
    scrollContainer.style.backgroundColor = '#000';
    
    const innerContainer = document.createElement('div');
    innerContainer.style.display = 'flex';
    innerContainer.style.justifyContent = 'center';
    innerContainer.style.minHeight = '100%';
    innerContainer.style.alignItems = 'center';
    innerContainer.style.padding = '0px 0';
    
    zoomedImg = new Image();
    zoomedImg.onload = function() {
      const widthRatio = window.innerWidth / this.naturalWidth;
      const newWidth = window.innerWidth;
      const newHeight = this.naturalHeight * widthRatio;
      
      zoomedImg.style.width = newWidth + 'px';
      zoomedImg.style.height = newHeight + 'px';
      zoomedImg.style.maxWidth = 'none';
      zoomedImg.style.maxHeight = 'none';
      zoomedImg.style.objectFit = 'contain';
      zoomedImg.style.display = 'block';
      zoomedImg.style.cursor = 'zoom-out';
      
      zoomedImg.addEventListener('click', handleImageClick, { once: true });
      
      innerContainer.appendChild(zoomedImg);
      scrollContainer.appendChild(innerContainer);
      modalImg.parentNode.insertBefore(scrollContainer, modalImg);
      
      modalImg.style.display = 'none';
      
      const centerY = Math.max(0, (newHeight - window.innerHeight) / 2);
      setTimeout(() => {
        scrollContainer.scrollTo(0, 0);
      }, 10);
      
      isZoomed = true;
    };
    zoomedImg.src = modalImg.src;
  }

  function resetZoom() {
    if (scrollContainer) {
      scrollContainer.parentNode.removeChild(scrollContainer);
      scrollContainer = null;
    }
    
    if (zoomedImg) {
      zoomedImg.removeEventListener('click', handleImageClick);
      zoomedImg = null;
    }
    
    modalImg.style.display = '';
    allUiElements.forEach(el => el.style.display = '');
    modalImg.style.cursor = 'zoom-in';
    
    isZoomed = false;
  }

  function handleImageClick(e) {
    e.stopPropagation();
    resetZoom();
  }

  if (fullSizeImages.length > 0) {
    const img = new Image();
    img.src = fullSizeImages[0];
  }

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', function(e) {
      e.preventDefault();
      currentIndex = index;
      // Сохраняем позицию скролла перед открытием
      saveScrollPosition();
      openModalWithHighRes();
    });
  });

  function openModalWithHighRes() {
    // Блокируем скролл страницы
    lockBodyScroll();
    isModalOpen = true;

    modal.style.display = 'block';
    resetZoom();
    
    const loader = document.querySelector('.modal-loader');
    loader.style.display = 'block';
    modalImg.style.opacity = 0;
    
    const hiResImg = new Image();
    hiResImg.onload = function() {
      modalImg.src = this.src;
      modalImg.style.opacity = 1;
      loader.style.display = 'none';
      updateDescription(galleryImages[currentIndex]);
      updateNeighborPreviews();
      preloadAdjacentImages();
      
      modalImg.style.cursor = 'zoom-in';
      modal.addEventListener('click', handleModalClick);
    };
    
    hiResImg.onerror = function() {
      modalImg.src = galleryImages[currentIndex].src;
      modalImg.style.opacity = 1;
      loader.style.display = 'none';
      updateDescription(galleryImages[currentIndex]);
      updateNeighborPreviews();
    };
    
    hiResImg.src = fullSizeImages[currentIndex];
  }

  function updateNeighborPreviews() {
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    
    const prevPreview = document.querySelector('.previous-image');
    const nextPreview = document.querySelector('.next-image');
    
    prevPreview.src = galleryImages[prevIndex].src;
    nextPreview.src = galleryImages[nextIndex].src;
    
    prevPreview.onclick = function(e) {
      e.stopPropagation();
      currentIndex = prevIndex;
      openModalWithHighRes();
    };
    
    nextPreview.onclick = function(e) {
      e.stopPropagation();
      currentIndex = nextIndex;
      openModalWithHighRes();
    };
  }

  function navigate(direction) {
    currentIndex = (currentIndex + direction + fullSizeImages.length) % fullSizeImages.length;
    openModalWithHighRes();
  }

  function closeModal() {
    // Разблокируем скролл страницы
    unlockBodyScroll();
    isModalOpen = false;

    modal.style.display = 'none';
    resetZoom();
    modal.removeEventListener('click', handleModalClick);
  }

  prevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    navigate(-1);
  });
  
  nextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    navigate(1);
  });

  modal.addEventListener('click', handleModalClick);

  document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'block') {
      if (e.key === 'ArrowLeft') navigate(-1);
      else if (e.key === 'ArrowRight') navigate(1);
      else if (e.key === 'Escape') closeModal();
    }
  });

  function preloadAdjacentImages() {
    const nextIndex = (currentIndex + 1) % fullSizeImages.length;
    const prevIndex = (currentIndex - 1 + fullSizeImages.length) % fullSizeImages.length;
    
    [new Image().src = fullSizeImages[nextIndex], 
     new Image().src = fullSizeImages[prevIndex]];
  }

  function updateDescription(imageElement) {
    if (!imageElement) return;
    
    const { imageLink, pageLink, titleLink, title, description, additional, other } = imageElement.dataset;
    const targetLink = pageLink || titleLink;

    const firstColumn = document.querySelector('.desc__first-column');
    if (imageLink) {
      firstColumn.innerHTML = targetLink ? `
        <a href="${targetLink}" target="_blank" rel="noopener noreferrer" class="case-link">
          <img src="${imageLink}" alt="${title || 'Обложка кейса'}" class="cover-image">
        </a>
      ` : `<img src="${imageLink}" alt="${title || 'Обложка кейса'}" class="cover-image">`;
    } else {
      firstColumn.innerHTML = '';
    }

    document.querySelector('.desc__second-column').innerHTML = title ? 
      (titleLink ? `<a href="${titleLink}" target="_blank">${title}</a>` : title) : '';
    
    document.querySelector('.desc__third-column').textContent = description || '';
    document.querySelector('.desc__fourth-column').textContent = additional || '';
    document.querySelector('.desc__fivth-column').textContent = other || '';
  }

  window.addEventListener('resize', function() {
    if (isZoomed) {
      resetZoom();
      setZoom();
    }
  });
});







// // Ховер кнопки 32px

// document.addEventListener('DOMContentLoaded', function() {
//     const button = document.querySelector('.button-32px');
//     const blur = document.querySelector('.blur-effect');
    
//     button.addEventListener('mousemove', function(e) {
//         const rect = this.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
        
//         // Обновляем позицию блюра напрямую
//         blur.style.left = x + 'px';
//         blur.style.top = y + 'px';
//     });
    
//     button.addEventListener('mouseleave', function() {
//         // Плавно скрываем блюр
//         blur.style.opacity = '0';
//     });
    
//     button.addEventListener('mouseenter', function() {
//         // Показываем блюр
//         blur.style.opacity = '1';
//     });
// });






// Блюр-ховер основных и второстепенных кнопок

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.button-24px, .button-32px, .button-32px-secondary, .button-64px-secondary');
    
    buttons.forEach(button => {
        const blur = button.querySelector('.blur-effect, .blur-effect-24, .blur-effect-32-secondary, .blur-effect-64-secondary');
        
        if (blur) {
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Обновляем позицию блюра
                blur.style.left = x + 'px';
                blur.style.top = y + 'px';
            });
            
            button.addEventListener('mouseleave', function() {
                blur.style.opacity = '0';
            });
            
            button.addEventListener('mouseenter', function() {
                blur.style.opacity = '1';
            });
        }
    });
});








