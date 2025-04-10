const container = document.querySelector('.container');

// Создаем новый элемент (например, div)
const newElement = document.createElement('div');
newElement.classList.add('new-element-class');

// Создаем тег <img>
const img = document.createElement('img');

// Проверяем ширину экрана
if (window.innerWidth <= 768) {
  // Мобильная версия
  img.src = 'https://static.tildacdn.com/tild6235-3339-4230-b030-383864383531/Group_48097271.png';
} else {
  // Десктопная версия
  img.src = 'https://static.tildacdn.com/tild3262-3030-4435-b436-346233663133/Group_48097286.png';
}

img.alt = 'Image';  // Альтернативный текст
img.style.width = '100%';
img.style.height = 'auto';

// Добавляем изображение внутрь нового элемента
newElement.appendChild(img);

// Добавляем в начало контейнера
container.prepend(newElement);
