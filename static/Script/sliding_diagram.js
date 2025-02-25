document.addEventListener("DOMContentLoaded", function () {
    const buildings = [
        { id: 16, x: 868, y: 380 },
        { id: 17, x: 710, y: 387 },
        { id: 18, x: 816, y: 315 },
        { id: 19, x: 698, y: 225 },
        { id: 20, x: 585, y: 175 },
        { id: 21, x: 370, y: 190 }
    ];

    const mapContainer = document.querySelector('.bottom-part-in');
    const svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.setAttribute("viewBox", "0 0 1000 800");
    svgOverlay.style.position = "absolute";
    svgOverlay.style.top = "0";
    svgOverlay.style.left = "0";
    svgOverlay.style.width = "80%";
    svgOverlay.style.height = "80%";
    svgOverlay.style.pointerEvents = "none";

    // Dropdown toggle functionality
    const towerLinks = document.querySelectorAll('.tower');
    towerLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            towerLinks.forEach(otherLink => {
                if (otherLink !== link) {
                    otherLink.nextElementSibling.classList.remove('show');
                }
            });
            this.nextElementSibling.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.matches('.tower')) {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });

    // Floor details function
    function getFloorDetails(buildingId, floor) {
        const buildingDetails = {
            '21': {
                name: 'อาคาร 21',
                floors: {
                    '1': 'รายละเอียดชั้น 1 อาคาร 21',
                    '2': 'รายละเอียดชั้น 2 อาคาร 21',
                    '3': 'รายละเอียดชั้น 3 อาคาร 21'
                }
            },
            '20': {
                name: 'อาคาร 20',
                floors: {
                    '1': 'รายละเอียดชั้น 1 อาคาร 20',
                    '2': 'รายละเอียดชั้น 2 อาคาร 20',
                    '3': 'รายละเอียดชั้น 3 อาคาร 20'
                }
            },
            '19': {
                name: 'อาคาร 19',
                floors: {
                    '1': 'รายละเอียดชั้น 1 อาคาร 19',
                    '2': 'รายละเอียดชั้น 2 อาคาร 19',
                    '3': 'รายละเอียดชั้น 3 อาคาร 19'
                }
            },
            '18': {
                name: 'อาคาร 18',
                floors: {
                    '1': 'รายละเอียดชั้น 1 อาคาร 18',
                    '2': 'รายละเอียดชั้น 2 อาคาร 18',
                    '3': 'รายละเอียดชั้น 3 อาคาร 18'
                }
            },
            '17': {
                name: 'อาคาร 17',
                floors: {
                    '1': 'รายละเอียดชั้น 1 อาคาร 17',
                    '2': 'รายละเอียดชั้น 2 อาคาร 17',
                    '3': 'รายละเอียดชั้น 3 อาคาร 17'
                }
            },
            '16': {
                name: 'อาคาร 16',
                floors: {
                    '1': 'รายละเอียดชั้น 1 อาคาร 16',
                    '2': 'รายละเอียดชั้น 2 อาคาร 16',
                    '3': 'รายละเอียดชั้น 3 อาคาร 16'
                }
            }
        };

        // ตรวจสอบว่ามีอาคารที่ต้องการหรือไม่
        if (!buildingDetails[buildingId]) {
            return { name: 'ไม่มีข้อมูล', details: 'ไม่มีข้อมูล' };
        }

        const buildingName = buildingDetails[buildingId].name;
        const floorDetails = buildingDetails[buildingId].floors[floor] || 'ไม่มีข้อมูลชั้นนี้';

        return { name: buildingName, details: floorDetails };
    }


    // Floor selection integration with map markers
    const floorLinks = document.querySelectorAll('.dropdown-content a');
    floorLinks.forEach(floorLink => {
        floorLink.addEventListener('click', function (e) {
            e.preventDefault();
            const building = this.getAttribute('data-building');
            const floor = this.getAttribute('data-floor');
            const buildingId = building.replace('tower', '');

            // ค้นหาตำแหน่งของอาคารจากพิกัดที่กำหนดไว้
            const buildingMarker = buildings.find(b => b.id === parseInt(buildingId));

            if (buildingMarker) {
                const slidingInfo = document.querySelector(".sliding-info");

                const floorInfo = getFloorDetails(buildingId, floor);

                slidingInfo.innerHTML = `
    <div class="container">
        <div class="header">ชื่ออาคาร ${floorInfo.name} - ชั้น ${floor}</div>
        <div class="img">

                <span class="img-inside">1</span>
                <span class="img-inside">2</span>
                <span class="img-inside">3</span>
                <span class="img-inside">4</span>
        </div>
        <div class="info-building"> 
            ${floorInfo.details}
        </div>
        
    </div>
`;



                // ตรวจสอบว่าตอนนี้ sliding-info ซ่อนอยู่หรือไม่
                if (slidingInfo.style.right !== "-200px") {
                    // ใช้ setTimeout เพื่อให้ transition ทำงาน
                    setTimeout(() => {
                        slidingInfo.style.right = "-200px";
                    }, 10);
                } else {
                    slidingInfo.style.right = "-200px";
                }
            }
        });
    });


    // Existing marker creation and event listeners remain the same
    buildings.forEach(building => {
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
        marker.style.pointerEvents = "auto";

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", building.x);
        circle.setAttribute("cy", building.y);
        circle.setAttribute("r", "20");
        circle.setAttribute("fill", "#FFD700");
        circle.style.cursor = "pointer";

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", building.x);
        text.setAttribute("y", building.y + 5);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "black");
        text.textContent = building.id;
        text.style.pointerEvents = "none";

        marker.setAttribute("transform-origin", `${building.x} ${building.y}`);

        circle.addEventListener("mouseover", () => {
            circle.setAttribute("fill", "#FFC500");
            marker.style.transform = "scale(1.3)";
            marker.style.transition = "all 0.2s ease-out";
        });

        circle.addEventListener("mouseout", () => {
            circle.setAttribute("fill", "#FFD700");
            marker.style.transform = "scale(1)";
        });

        marker.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const slidingInfo = document.querySelector(".sliding-info");
            if (slidingInfo.style.right === "-200px") {
                slidingInfo.style.right = "-1800px";
            } else {
                slidingInfo.style.right = "-200px";
            }
            slidingInfo.innerHTML = `
                        <div class="container">
                        <div class="header">ชื่ออาคาร ${building.id}</div>
                        <div class="img">    
                            <span class="img-inside">1</span>
                            <span class="img-inside">2</span>
                            <span class="img-inside">3</span>
                            <span class="img-inside">4</span>
                        </div>
                        <div class="info-building">รายละเอียดตึก</div>
                        
                        </div>
                    `;
        });

        marker.appendChild(circle);
        marker.appendChild(text);
        svgOverlay.appendChild(marker);
    });

    mapContainer.style.position = "relative";
    mapContainer.appendChild(svgOverlay);

    document.addEventListener('click', function (event) {
        const slidingInfo = document.querySelector('.sliding-info');
        if (!slidingInfo.contains(event.target) &&
            !event.target.closest('circle') &&
            !event.target.closest('g') &&
            slidingInfo.style.right === '-200px') {
            slidingInfo.style.right = '-1800px';
        }
    });

    const slidingInfo = document.querySelector('.sliding-info');
    slidingInfo.addEventListener('click', function (event) {
        event.stopPropagation();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const btnNav = document.querySelector(".btn-navigation");
    const slidingInfo = document.querySelector(".sliding-info");

    let map = null;
    let startMarker = null;
    let startCoords = null;
    let routeLayer = null;

    btnNav.addEventListener("click", function () {
        let rightValue = getComputedStyle(slidingInfo).right;
        console.log("ค่า right ปัจจุบัน:", rightValue);

        if (rightValue === "0px") {
            slidingInfo.style.right = "-1800px"; // ซ่อน
            btnNav.style.visibility = "visible"; // แสดงปุ่ม
        } else {
            slidingInfo.style.right = "0"; // แสดง
            btnNav.style.visibility = "hidden"; // ซ่อนปุ่ม

            if (!document.getElementById("map")) {
                slidingInfo.innerHTML = `
                    <div class="container-title">
                        <p id="name">ระบบนำทางภายนอก</p>
                        <p id="title">🔹 คลิกบนแผนที่เพื่อเลือก <b>จุดเริ่มต้น</b></p>
                        <p id="sec-title">จุดเริ่มต้น: <span id="start-coords">ยังไม่เลือก</span></p>
                    </div>
                    <label for="end">เลือกจุดปลายทาง:</label>
                    <select id="end">
                        {% for name in building_entries.keys() %}
                        <option value="{{ name }}">{{ name }}</option>
                        {% endfor %}
                    </select>

                    <button id="btn-find-route" class="btn-nav">
                        <i class="fas fa-directions" style="font-size: 30px;"></i>
                    </button>
                    <div id="map" style="height: 500px;"></div>
                `;

                map = L.map('map', {
                    center: [13.868404, 100.482293],
                    zoom: 18,
                    dragging: true,
                    scrollWheelZoom: false,
                    doubleClickZoom: false
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                map.on('click', function (e) {
                    if (startMarker) {
                        map.removeLayer(startMarker);
                    }
                    startCoords = [e.latlng.lat, e.latlng.lng];
                    startMarker = L.marker(startCoords).addTo(map).bindPopup("จุดเริ่มต้น").openPopup();
                    document.getElementById("start-coords").innerText = `${startCoords[0].toFixed(6)}, ${startCoords[1].toFixed(6)}`;
                });

                document.getElementById("btn-find-route").addEventListener("click", findRoute);
            }
        }
        console.log("ค่า right ใหม่:", slidingInfo.style.right);
    });

    function findRoute() {
        if (!startCoords) {
            alert("กรุณาคลิกเลือกจุดเริ่มต้นบนแผนที่!");
            return;
        }

        const end = document.getElementById('end').value;

        fetch('/route', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start: startCoords, end: end })
        })
        .then(response => response.json())
        .then(data => {
            if (routeLayer) map.removeLayer(routeLayer);
            routeLayer = L.polyline(data.path_coords, { color: 'green', weight: 5 }).addTo(map);
        });
    }

    document.addEventListener("click", function (event) {
        if (!slidingInfo.contains(event.target) && !btnNav.contains(event.target)) {
            slidingInfo.style.right = "-1800px"; // ซ่อน
            btnNav.style.visibility = "visible"; // แสดงปุ่ม
        }
    });

    slidingInfo.addEventListener("click", function (event) {
        event.stopPropagation();
    });
});


