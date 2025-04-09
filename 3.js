$(document).ready(function () {
  let typingTimer;
  const typingDelay = 1000;

  // Определение, используется ли мобильная версия
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Функция для выполнения поиска
  function getData(searchStr, callback) {
    $.getJSON('/c/sa/search', { searchStr }, function (response) {
      if (response.success === true && Array.isArray(response.data.blocks)) {
        const results = response.data.blocks
          .filter(block => block.onClick?.url) // Учитываем только блоки с ссылкой
          .map(function (block) {
            const domain = window.location.origin;
            const fullUrl = domain + block.onClick.url;
            const isLesson = fullUrl.includes('lesson'); // Проверяем, содержит ли URL слово 'lesson'
            return {
              isLesson,
              title: block.title || "Без названия",
              description: block.description || "Нет описания",
              image: block.logo?.image || null,
              url: fullUrl
            };
          });
        callback(results);
      } else {
        callback([]);
      }
    });
  }

  // Рендеринг результатов поиска
  function renderResults(results, searchResults) {
    if (results.length > 0) {
      const lessons = results.filter(result => result.isLesson); // Уроки
      const trainings = results.filter(result => !result.isLesson); // Тренинги

      let resultItems = '';

      // Добавляем заголовок и элементы для тренингов
      if (trainings.length > 0) {
        resultItems += '<h2>Тренинги</h2>';
        resultItems += trainings.map(function (result) {
          return `
            <div class="result-item training-item">
              ${result.image ? `<img src="${result.image}" alt="Результат" />` : ""}
              <h3>${result.title}</h3>
              <p>${result.description}</p>
              <a href="${result.url}" target="_blank">Перейти</a>
            </div>
          `;
        }).join('');
      }

      // Добавляем заголовок и элементы для уроков
      if (lessons.length > 0) {
        resultItems += '<h2>Уроки</h2>';
        resultItems += lessons.map(function (result) {
          return `
            <div class="result-item lesson-item">
              ${result.image ? `<img src="${result.image}" alt="Результат" />` : ""}
              <h3>${result.title}</h3>
              <p>${result.description}</p>
              <a href="${result.url}" target="_blank">Перейти</a>
            </div>
          `;
        }).join('');
      }

      searchResults.html(resultItems);
    } else {
      searchResults.html('<p>Ничего не найдено.</p>');
    }

    searchResults.addClass('visible'); // Показываем блок
  }

  // Скрытие результатов при клике вне блока
  $(document).on('click', function (event) {
    const searchContainer = isMobile() ? $('#searchContainerMobile') : $('#searchContainer');
    const searchResults = isMobile() ? $('#searchResultsMobile') : $('#searchResults');

    if (!searchContainer.is(event.target) && searchContainer.has(event.target).length === 0) {
      searchResults.removeClass('visible');
    }
  });

  // Обработчик для поиска (и на ПК, и на мобильной версии)
  $(document).on('input', '#searchInput, #searchInputMobile', function () {
    clearTimeout(typingTimer);

    const searchInput = $(this);
    const searchResults = isMobile() ? $('#searchResultsMobile') : $('#searchResults');
    const searchStr = searchInput.val().trim();

    if (searchStr) {
      typingTimer = setTimeout(function () {
        getData(searchStr, function (results) {
          renderResults(results, searchResults);
        });
      }, typingDelay);
    } else {
      searchResults.removeClass('visible').empty();
    }
  });

  // Отслеживаем появление мобильных элементов
  $(document).on('click', '.search-icon', function () {
    setTimeout(function () {
      const searchInput = $('#searchInputMobile');
      if (searchInput.length > 0) {
        searchInput.trigger('focus'); // Автоматически ставим фокус
      }
    }, 300); // Ожидание перед проверкой, чтобы элементы успели подгрузиться
  });
});
