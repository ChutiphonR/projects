const footways = JSON.parse('{{ footways|safe }}');

        const map = L.map('map').setView([13.868404, 100.482293], 18);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // footways.forEach(footway => {
        //     L.polyline(footway, {
        //         color: 'green',
        //         weight: 3,
        //         opacity: 0.7
        //     }).addTo(map);
        // });

        let startMarker = null;
        let startCoords = null;

        map.on('click', function (e) {
            if (startMarker) {
                map.removeLayer(startMarker);
            }
            startCoords = [e.latlng.lat, e.latlng.lng];
            startMarker = L.marker(startCoords).addTo(map).bindPopup("จุดเริ่มต้น").openPopup();
            document.getElementById("start-coords").innerText = `${startCoords[0].toFixed(6)}, ${startCoords[1].toFixed(6)}`;
        });

        let routeLayer;

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
                routeLayer = L.polyline(data.path_coords, { color: 'blue', weight: 5 }).addTo(map);
            });
        }