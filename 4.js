// ======= Внешний вид уроков =======
// Этот блок стилизует элементы уроков
// ==========================================================
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".user-state-label.user-state-label-ex");
    elements.forEach(element => {
        const text = element.textContent.trim();
        if (text === "Необходимо выполнить задание (стоп-урок)" || text === "Необходимо выполнить задание") {
            element.textContent = "Важное задание";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Задача 1: Замена текста "Недоступен (стоп-урок)" на "Недоступен"
    const stopLessonElements = document.querySelectorAll(".user-state-label.user-state-label-ex.is-stop-lesson");
    stopLessonElements.forEach(element => {
        const text = element.textContent.trim();
        if (text === "Недоступен (стоп-урок)") {
            element.textContent = "Недоступен";
        }
    });

    // Задача 2: Добавление текста "Недоступен" для элементов, где его нет
    const listItems = document.querySelectorAll("li.user-state-not_reached");
    listItems.forEach(item => {
        const vmiddleDiv = item.querySelector(".vmiddle"); // Находим div с классом "vmiddle"
        if (vmiddleDiv && !vmiddleDiv.querySelector(".user-state-label")) {
            const newLabel = document.createElement("div");
            newLabel.className = "user-state-label user-state-label-ex";
            newLabel.textContent = "Недоступен";
            vmiddleDiv.prepend(newLabel); // Добавляем текст в начало div "vmiddle"
        }
    });
});

// Получаем все элементы td
var tdElements = document.querySelectorAll('.lesson-list li table td');

// Проходимся по каждому элементу и добавляем номер урока
tdElements.forEach(function(td, index) {
    var lessonNumber = index + 1; // Увеличиваем индекс на 1 для нумерации с 1
    
    var lessonIdClass = 'lesson-id-' + lessonNumber; // Создаём уникальный класс для урока
    td.classList.add(lessonIdClass); // Добавляем класс к td элементу

    var afterElement = document.createElement('span'); // Создаем элемент span
    afterElement.textContent = "Урок " + lessonNumber; // Устанавливаем текст
    afterElement.classList.add('lesson-number'); // Добавляем класс
    td.appendChild(afterElement); // Добавляем созданный элемент в конец td
});
