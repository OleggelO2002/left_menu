document.addEventListener("DOMContentLoaded", function () { 

        const menuItems = document.querySelectorAll(".gc-account-user-menu .menu-item");

        menuItems.forEach(item => {
            item.addEventListener("click", async function () {
                if (item.classList.contains("menu-item-profile") || item.classList.contains("menu-item-notifications_button_small")) {
                    return;
                }

                const isAlreadySelected = item.classList.contains("select");

                menuItems.forEach(el => {
                    el.classList.remove("select");
                    const submenu = el.querySelector(".custom-submenu-bar");
                    if (submenu) {
                        submenu.classList.remove("open");
                        submenu.style.display = "none";
                    }
                    if (!el.classList.contains("menu-item-profile") && !el.classList.contains("menu-item-notifications_button_small")) {
                        el.style.height = '66px';
                        const link = el.querySelector("a");
                        if (link) {
                            link.style.height = '66px';
                        }
                    }
                });

                if (isAlreadySelected) return;

                item.classList.add("select");

                await waitForSubmenuLoad();

                const submenu = document.querySelector(".gc-account-user-submenu");
                if (submenu) {
                    let newSubmenu = item.querySelector(".custom-submenu-bar");

                    if (!newSubmenu) {
                        const newSubmenuHTML = `
                            <div class="custom-submenu-bar" style="margin-top: 10px; display: none;">
                                <ul class="custom-submenu"></ul>
                            </div>
                        `;
                        item.insertAdjacentHTML("beforeend", newSubmenuHTML);
                        newSubmenu = item.querySelector(".custom-submenu-bar");
                    }

                    const customSubmenu = newSubmenu.querySelector(".custom-submenu");
                    customSubmenu.innerHTML = "";
                    submenu.querySelectorAll("li").forEach(submenuItem => {
                        const clonedItem = submenuItem.cloneNode(true);
                        clonedItem.style.opacity = 0; // Изначально скрываем пункт
                        clonedItem.style.transform = "translateY(-10px)"; // Добавляем начальную позицию
                        customSubmenu.appendChild(clonedItem);
                    });

                    newSubmenu.style.display = "block";

                    setTimeout(() => {
                        newSubmenu.classList.add("open");
                    }, 10);

                    const submenuItems = customSubmenu.querySelectorAll("li");
                    submenuItems.forEach((submenuItem, index) => {
                        setTimeout(() => {
                            submenuItem.style.transition = "opacity 0.3s, transform 0.3s"; // Анимация
                            submenuItem.style.opacity = 1;
                            submenuItem.style.transform = "translateY(0)"; // Возвращаем в исходное положение
                        }, index * 100); // Задержка между пунктами
                    });

                    const submenuHeight = newSubmenu.scrollHeight;
                    item.style.height = `${submenuHeight + 12}px`;

                    const link = item.querySelector("a");
                    if (link) {
                        link.style.height = `${submenuHeight + 12}px`;
                    }
                }
            });
        });

        function waitForSubmenuLoad() {
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (document.querySelector(".gc-account-user-submenu")) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
   
});
