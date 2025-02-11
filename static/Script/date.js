function updateDay(){
    const now = new Date();

    let day = now.getDate();
    let monthIndex = now.getMonth() ;
    let year = now.getFullYear();

    const monthNames = [
        "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤกษภาคม","มิถุนายน","กรกฏาคม","สิงหาคม","กันยายน",
        "ตุลาคม","พฤศจิกายน","ธันวาคม"];

    let month = monthNames[monthIndex];

    document.getElementById("Days").textContent = day
    document.getElementById("Months").textContent = month
    document.getElementById("Years").textContent = year

}

setInterval(updateDay, 1000);

updateDay();