/ Найдем элемент с классом "container"
const container = document.querySelector('.container');

// Создаем новый элемент (например, div)
const newElement = document.createElement('div');

// Задаем класс новому элементу
newElement.classList.add('new-element-class');

// Создаем тег <img>
const img = document.createElement('img');
img.src = 'https://static.tildacdn.com/tild3262-3030-4435-b436-346233663133/Group_48097286.png';
img.alt = 'Image';  // Устанавливаем альтернативный текст для изображения

// Устанавливаем стили для <img>, чтобы оно растягивалось по ширине блока
img.style.width = '100%';  // Ширина изображения будет равна ширине родительского блока
img.style.height = 'auto'; // Высота будет подстраиваться пропорционально ширине

// Добавляем <img> внутрь нового элемента
newElement.appendChild(img);

// Добавляем новый элемент в самое начало внутри контейнера
container.prepend(newElement);
