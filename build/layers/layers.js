var wms_layers = [];


        var lyr_OSMStandard_0 = new ol.layer.Tile({
            'title': 'OSM Standard',
            //'type': 'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
    attributions: ' &middot; <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors, CC-BY-SA</a>',
                url: 'http://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });
var format_jerusalem_1 = new ol.format.GeoJSON();
var features_jerusalem_1 = format_jerusalem_1.readFeatures(json_jerusalem_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_jerusalem_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_jerusalem_1.addFeatures(features_jerusalem_1);
var lyr_jerusalem_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_jerusalem_1,
maxResolution:14.00223307613098,
 
                style: style_jerusalem_1,
                popuplayertitle: "jerusalem",
                interactive: true,
                title: '<img src="styles/legend/jerusalem_1.png" /> jerusalem'
            });
var format_beerSheva_2 = new ol.format.GeoJSON();
var features_beerSheva_2 = format_beerSheva_2.readFeatures(json_beerSheva_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_beerSheva_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_beerSheva_2.addFeatures(features_beerSheva_2);
var lyr_beerSheva_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_beerSheva_2,
maxResolution:14.00223307613098,
 
                style: style_beerSheva_2,
                popuplayertitle: "beerSheva",
                interactive: true,
                title: '<img src="styles/legend/beerSheva_2.png" /> beerSheva'
            });

lyr_OSMStandard_0.setVisible(true);lyr_jerusalem_1.setVisible(true);lyr_beerSheva_2.setVisible(true);
var layersList = [lyr_OSMStandard_0,lyr_jerusalem_1,lyr_beerSheva_2];
lyr_jerusalem_1.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'מספר מקלט': 'מספר מקלט', 'x': 'x', 'y': 'y', });
lyr_beerSheva_2.set('fieldAliases', {'name': 'name', 'lon': 'lon', 'lat': 'lat', });
lyr_jerusalem_1.set('fieldImages', {'OBJECTID': 'Range', 'מספר מקלט': 'Range', 'x': 'TextEdit', 'y': 'TextEdit', });
lyr_beerSheva_2.set('fieldImages', {'name': 'TextEdit', 'lon': 'TextEdit', 'lat': 'TextEdit', });
lyr_jerusalem_1.set('fieldLabels', {'OBJECTID': 'no label', 'מספר מקלט': 'no label', 'x': 'no label', 'y': 'no label', });
lyr_beerSheva_2.set('fieldLabels', {'name': 'no label', 'lon': 'no label', 'lat': 'no label', });
lyr_beerSheva_2.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});