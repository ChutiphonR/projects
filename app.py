import xml.etree.ElementTree as ET
from flask import Flask, render_template, request, jsonify
import json
import networkx as nx
import math
import csv

app = Flask(__name__)

def load_building_entries(csv_file):
    building_entries = {}
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader)  # ข้าม header
        for row in reader:
            building_entries[row[0]] = (float(row[1]), float(row[2]))  # {ชื่ออาคาร: (lat, lon)}
    return building_entries

building_entries = load_building_entries('building_entries.csv')

def parse_osm_footways(osm_file):
    tree = ET.parse(osm_file)
    root = tree.getroot()
    
    footways = []
    nodes = {}

    for node in root.findall('.//node'):
        node_id = node.get('id')
        lat = float(node.get('lat'))
        lon = float(node.get('lon'))
        nodes[node_id] = (lat, lon)

    for way in root.findall('.//way'):
        is_footway = any(tag.get('k') == 'highway' and tag.get('v') == 'footway' for tag in way.findall('tag'))
        
        if is_footway:
            way_coords = []
            way_nodes = []
            for nd in way.findall('nd'):
                node_id = nd.get('ref')
                if node_id in nodes:
                    way_coords.append(nodes[node_id])
                    way_nodes.append(node_id)
            
            if way_coords:
                footways.append(way_coords)

    return footways, nodes

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def build_graph(footways, nodes):
    G = nx.Graph()
    
    for footway in footways:
        for i in range(len(footway) - 1):
            lat1, lon1 = footway[i]
            lat2, lon2 = footway[i + 1]
            dist = haversine(lat1, lon1, lat2, lon2)

            node1 = list(nodes.keys())[list(nodes.values()).index(footway[i])]
            node2 = list(nodes.keys())[list(nodes.values()).index(footway[i + 1])]
            
            G.add_edge(node1, node2, weight=dist)

    return G

@app.route('/')
def index():
    footways, nodes = parse_osm_footways('map.osm')
    return render_template('index.html', 
                           footways=json.dumps(footways),
                           nodes=json.dumps(nodes),
                           building_entries=building_entries)

@app.route('/route', methods=['POST'])
def route():
    data = request.get_json()
    start_coords = tuple(data['start'])
    end_building = data['end']

    end_coords = building_entries[end_building]

    footways, nodes = parse_osm_footways('map.osm')
    G = build_graph(footways, nodes)

    start_node = min(nodes.keys(), key=lambda node: haversine(start_coords[0], start_coords[1], nodes[node][0], nodes[node][1]))
    end_node = min(nodes.keys(), key=lambda node: haversine(end_coords[0], end_coords[1], nodes[node][0], nodes[node][1]))

    path = nx.shortest_path(G, source=start_node, target=end_node, weight='weight')
    path_coords = [nodes[node] for node in path]

    return jsonify(path_coords=path_coords)

if __name__ == '__main__':
    app.run(debug=True)
