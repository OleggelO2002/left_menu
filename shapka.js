const container = document.querySelector('.container');

// Создаем новый элемент (например, div)
const newElement = document.createElement('div');
newElement.classList.add('new-element-class');

// Создаем тег <img>
const img = document.createElement('img');

// Проверяем ширину экрана
if (window.innerWidth <= 768) {
  // Мобильная версия
  img.src = 'https://static.tildacdn.com/tild6266-3566-4166-b565-353935386661/Group_48097271.png';
} else {
  // Десктопная версия
  img.src = 'https://static.tildacdn.com/tild6437-6131-4265-b333-313761336536/Group_48097257.png';
}

img.alt = 'Image';  // Альтернативный текст
img.style.width = '100%';
img.style.height = 'auto';

// Добавляем изображение внутрь нового элемента
newElement.appendChild(img);

// Добавляем в начало контейнера
container.prepend(newElement);
