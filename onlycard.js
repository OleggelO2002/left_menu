document.querySelectorAll('[class*="training-row"]').forEach(function(row, index) {
  const imageUrl = row.getAttribute('data-training-image');
  if (imageUrl) {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : 'https:' + imageUrl;

    // Находим первую ячейку (td) в строке — или нужную тебе
    const firstTd = row.querySelector('td');
    if (!firstTd) return;

    // Добавляем класс и position: relative
    const uniqueClass = 'training-image-after-' + index;
    firstTd.classList.add(uniqueClass);
    firstTd.style.position = 'relative';

    // Создаем CSS
    const style = document.createElement('style');
    style.textContent = `
      .${uniqueClass}::after {
        content: '';
        position: absolute;
        top: 10px;
        right: 10px;
        width: 100px;
        height: 100px;
        background-image: url('${fullUrl}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 10px;
      }
    `;
    document.head.appendChild(style);
  }
});
