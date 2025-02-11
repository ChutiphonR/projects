document.addEventListener("DOMContentLoaded", function() {
    const floor1 = document.getElementById("floor1");
    const slidingInfo = document.querySelector(".sliding-info"); // แก้ไขจาก sliding-indo เป็น sliding-info

    floor1.addEventListener("click", function(event) {
        event.preventDefault();
        if (slidingInfo.style.right === "-200px") {
            slidingInfo.style.right = "-1800px";
        } else {
            slidingInfo.style.right = "-200px";
        }
    });
});
