function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // แปลงตัวเลขให้เป็นสองหลัก (00-09 -> "00"-"09")
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // อัปเดตค่าใน HTML (ต้องมี element ที่มี id="hours", id="minutes", id="seconds")
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

// เรียกใช้งานฟังก์ชันทุกวินาที
setInterval(updateTime, 1000);

// เรียกครั้งแรกเพื่อแสดงผลทันที ไม่ต้องรอ 1 วินาที
updateTime();
