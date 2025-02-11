document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-field input");
    const searchButton = document.querySelector(".search-bt");
    const searchHistoryDiv = document.getElementById("searchHistory");

    // โหลดประวัติการค้นหาจาก Local Storage
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    function updateSearchHistory() {
        searchHistoryDiv.innerHTML = "";

        if (searchHistory.length === 0) {
            searchHistoryDiv.innerHTML = '<div class="no-history">ไม่มีประวัติล่าสุด</div>';
        } else {
            searchHistory.forEach((item, index) => {
                let historyItem = document.createElement("div");
                historyItem.classList.add("history-item");
                historyItem.textContent = item;

                // คลิกเพื่อเลือกค่าในช่องค้นหา
                historyItem.addEventListener("click", () => {
                    searchInput.value = item;
                });

                // ปุ่มลบแต่ละรายการ
                let deleteBtn = document.createElement("span");
                deleteBtn.classList.add("delete-btn");

                // สร้างไอคอน trash โดยใช้ <i> tag
                let trashIcon = document.createElement("i");
                trashIcon.classList.add("fas", "fa-trash");
                deleteBtn.appendChild(trashIcon);

                deleteBtn.addEventListener("click", (event) => {
                    event.stopPropagation(); // ไม่ให้คลิกเลือกค่า
                    searchHistory.splice(index, 1);
                    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                    updateSearchHistory();
                });

                historyItem.appendChild(deleteBtn);
                searchHistoryDiv.appendChild(historyItem);
            });
        }

        // ทำให้ div แสดงตลอดเวลา
        searchHistoryDiv.style.display = "block";
    }

    // โหลดประวัติการค้นหาเมื่อหน้าเว็บโหลด
    updateSearchHistory();

    // เมื่อกดปุ่มค้นหา (ไอคอนแว่นขยาย)
    searchButton.addEventListener("click", (event) => {
        event.preventDefault();
        let query = searchInput.value.trim();
        if (query && !searchHistory.includes(query)) {
            searchHistory.unshift(query);
            if (searchHistory.length > 12) searchHistory.pop();
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        }
        // รีเฟรชประวัติการค้นหา
        updateSearchHistory();
        // ล้างข้อความในช่องกรอก
        searchInput.value = '';
    });

    // เมื่อกด Enter ในช่องค้นหา
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            let query = searchInput.value.trim();
            if (query && !searchHistory.includes(query)) {
                searchHistory.unshift(query);
                if (searchHistory.length > 14) searchHistory.pop();
                localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            }
            // รีเฟรชประวัติการค้นหา
            updateSearchHistory();
            // ล้างข้อความในช่องกรอก
            searchInput.value = '';
        }
    });
});
