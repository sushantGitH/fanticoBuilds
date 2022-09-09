mapboxgl.accessToken =
  "pk.eyJ1Ijoic3VzaGFudHBvb2phcnkiLCJhIjoiY2o2MzlvazJ0MWV0dDMxdDZqZDc3ZGdzYiJ9.31HRLf_8ptgpMagd91t4sQ";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/sushantpoojary/cl7ss96tt000g14ryyt2z45sv", // style URL
  center: [72.81170735701167, 18.90031991846802], // starting position [lng, lat]
  zoom: 15.41, // starting zoom
  projection: "globe", // display the map as a 3D globe
  antialias: true,
  hash: true,
});
map
  .on("style.load", () => {
    map.setFog({
      range: [-1, 20],
      "horizon-blend": 1,
      color: "white",
      "high-color": "#add8e6",
      "space-color": "#d8f2ff",
      "star-intensity": 0.0,
    });
    generateTree();
    addLogistics();
  })
  .on("click", function (e) {
    var pt = [e.lngLat.lng, e.lngLat.lat];
    travelPath(pt);
  });

// //use geojson -----------
// {
// map.on("load", () => {
//   map.addSource("floorplan", {
//     type: "geojson",
//     // Use a URL for the value for the `data` property.
//     data: "features.geojson",
//   });

//   // map.addLayer({
//   // 'id': 'earthquakes-layer',
//   // 'type': 'circle',
//   // 'source': 'earthquakes',
//   // 'paint': {
//   // 'circle-radius': 4,
//   // 'circle-stroke-width': 2,
//   // 'circle-color': 'red',
//   // 'circle-stroke-color': 'white'
//   // }
//   // });
//   map.addLayer({
//     id: "room-extrusion",
//     type: "fill-extrusion",
//     source: "floorplan",
//     paint: {
//       // Get the `fill-extrusion-color` from the source `color` property.
//       "fill-extrusion-color": "indigo",

//       // Get `fill-extrusion-height` from the source `height` property.
//       "fill-extrusion-height": ["get", "plot"], //== 'sale' ? 30 : 200,

//       // Get `fill-extrusion-base` from the source `base_height` property.
//       "fill-extrusion-base": 2,

//       // Make extrusions slightly opaque to see through indoor walls.
//       "fill-extrusion-opacity": 1,
//     },
//   });
// });

// //add model
// {
// // parameters to ensure the model is georeferenced correctly on the map
// const modelOrigin = [72.81170735701167, 18.90031991846802];
// const modelAltitude = 0;
// const modelRotate = [Math.PI / 2, 0, 0];

// const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
//   modelOrigin,
//   modelAltitude
// );

// // transformation parameters to position, rotate and scale the 3D model onto the map
// const modelTransform = {
//   translateX: modelAsMercatorCoordinate.x,
//   translateY: modelAsMercatorCoordinate.y,
//   translateZ: modelAsMercatorCoordinate.z,
//   rotateX: modelRotate[0],
//   rotateY: modelRotate[1],
//   rotateZ: modelRotate[2],
//   /* Since the 3D model is in real world meters, a scale transform needs to be
//    * applied since the CustomLayerInterface expects units in MercatorCoordinates.
//    */
//   scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
// };

// const THREE = window.THREE;
// }

// // configuration of the custom layer for a 3D model per the CustomLayerInterface --------------
// {
// const customLayer = {
//   id: "3d-model",
//   type: "custom",
//   renderingMode: "3d",
//   onAdd: function (map, gl) {
//     this.camera = new THREE.Camera();
//     this.scene = new THREE.Scene();

//     // use the three.js GLTF loader to add the 3D model to the three.js scene
//     const loader = new THREE.GLTFLoader();
//     loader.load(
//       "https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf",
//       (gltf) => {
//         this.scene.add(gltf.scene);
//       }
//     );
//     this.map = map;

//     // use the Mapbox GL JS map canvas for three.js
//     this.renderer = new THREE.WebGLRenderer({
//       canvas: map.getCanvas(),
//       context: gl,
//       antialias: true,
//     });

//     this.renderer.autoClear = false;
//   },
//   render: function (gl, matrix) {
//     // modelTransform.translateX = modelTransform.translateX + 0.0001;

//     const rotationX = new THREE.Matrix4().makeRotationAxis(
//       new THREE.Vector3(1, 0, 0),
//       modelTransform.rotateX
//     );
//     const rotationY = new THREE.Matrix4().makeRotationAxis(
//       new THREE.Vector3(0, 1, 0),
//       modelTransform.rotateY
//     );
//     const rotationZ = new THREE.Matrix4().makeRotationAxis(
//       new THREE.Vector3(0, 0, 1),
//       modelTransform.rotateZ
//     );
//     const m = new THREE.Matrix4().fromArray(matrix);
//     const l = new THREE.Matrix4()
//       .makeTranslation(
//         modelTransform.translateX,
//         modelTransform.translateY,
//         modelTransform.translateZ
//       )
//       .scale(
//         new THREE.Vector3(
//           modelTransform.scale,
//           -modelTransform.scale,
//           modelTransform.scale
//         )
//       )
//       .multiply(rotationX)
//       .multiply(rotationY)
//       .multiply(rotationZ);
//     this.camera.projectionMatrix = m.multiply(l);
//     this.renderer.resetState();
//     this.renderer.render(this.scene, this.camera);
//     this.map.triggerRepaint();
//   },
// };

// map.on("style.load", () => {
//   map.addLayer(customLayer, "block");
// });
// }

//add logistics ------------------------------------
{
  var destination, line;
  var origin = [72.80842277573004, 18.89469883205426];
  var truck;
  function addLogistics() {
    var destination, line;
    function animate() {
      requestAnimationFrame(animate);
    }
    animate();

    map.addLayer({
      id: "custom_layer",
      type: "custom",
      renderingMode: "3d",
      onAdd: function (map, mbxContext) {
        window.tb = new Threebox(map, mbxContext, {
          defaultLights: true,
        });

        // Royalty Free License: Vehicles by https://www.cgtrader.com/antonmoek
        // from https://www.cgtrader.com/free-3d-models/car/concept/cartoon-low-poly-city-cars-pack
        var options = {
          type: "gltf",
          obj: "models/vehicles/toycar.glb",
          scale: 4,
          units: "meters",
          anchor: "bottom",
          rotation: { x: 90, y: 90, z: 0 }, //rotation to postiion the truck and heading properly
        };

        tb.loadObj(options, function (model) {
          truck = model.setCoords(origin);
          truck.addEventListener("ObjectChanged", onObjectChanged, false);
          tb.add(truck);
        });
      },

      render: function (gl, matrix) {
        tb.update();
      },
    });

    function onObjectChanged(e) {
      let model = e.detail.object; //here's the object already modified
      let action = e.detail.action; //here's the action that changed the object
    }
  }

  function travelPath(destination) {
    // request directions. See https://docs.mapbox.com/api/navigation/#directions for details

    var url =
      "https://api.mapbox.com/directions/v5/mapbox/driving/" +
      [origin, destination].join(";") +
      "?geometries=geojson&access_token=" +
      "pk.eyJ1Ijoic3VzaGFudHBvb2phcnkiLCJhIjoiY2o2MzlvazJ0MWV0dDMxdDZqZDc3ZGdzYiJ9.31HRLf_8ptgpMagd91t4sQ";

    fetchFunction(url, function (data) {
      // extract path geometry from callback geojson, and set duration of travel
      var options = {
        path: data.routes[0].geometry.coordinates,
        duration: 10000,
      };

      // start the truck animation with above options, and remove the line when animation ends
      truck.followPath(options, function () {
        tb.remove(line);
      });

      // set up geometry for a line to be added to map, lofting it up a bit for *style*
      var lineGeometry = options.path.map(function (coordinate) {
        return coordinate.concat([15]);
      });

      // create and add line object
      line = tb.line({
        geometry: lineGeometry,
        width: 5,
        color: "steelblue",
      });

      tb.add(line);

      // set destination as the new origin, for the next trip
      origin = destination;
    });
  }

  //convenience function for fetch

  function fetchFunction(url, cb) {
    fetch(url).then(function (response) {
      if (response.status === 200) {
        response.json().then(function (data) {
          cb(data);
        });
      }
    });
  }
}

//move lots of car-------------------------------
{
  var carData = [
    {
      name: "greencar.glb",
      scale: 1,
      rotation: { x: 90, y: 90, z: 0 },
    },
    {
      name: "gtacar.glb",
      scale: 1,
      rotation: { x: 90, y: 180, z: 0 },
    },
    {
      name: "constuction_vehicle.gltf",
      scale: 2.5,
      rotation: { x: 90, y: 180, z: 0 },
    },
    {
      name: "racecar.glb",
      scale: 1,
      rotation: { x: 90, y: 180, z: 0 },
    },
    {
      name: "Spacetruck.glb",
      scale: 0.5,
      rotation: { x: 90, y: 180, z: 0 },
    },
    {
      name: "sedan.glb",
      scale: 5,
      rotation: { x: 90, y: 180, z: 0 },
    },
    {
      name: "gcar.glb",
      scale: 1,
      rotation: { x: 90, y: 90, z: 0 },
    },
    {
      name: "toycar.glb",
      scale: 1,
      rotation: { x: 90, y: 90, z: 0 },
    },
  ];

  function animate() {
    requestAnimationFrame(animate);
  }

  map.on("style.load", function () {
    animate();

    map.addLayer({
      id: "custom_layer2",
      type: "custom",
      renderingMode: "3d",
      onAdd: function (map, mbxContext) {
        window.tb = new Threebox(map, mbxContext, {
          defaultLights: true,
        });

        for (let i = 0; i < 20; i++) {
          const element = carData[Math.floor(Math.random() * carData.length)];

          var options = {
            type: "gltf",
            obj: "models/vehicles/" + element.name,
            scale: element.scale,
            units: "meters",
            anchor: "center",
            rotation: element.rotation, //rotation to postiion the truck and heading properly
          };
          tb.loadObj(options, function (model) {
            var car = model.setCoords([72.81149414052663, 18.89645526593143]);
            tb.add(car);

            var num = Math.round(Math.random());
            var location;
            if (num)
              location =
                '{"country_crossed":false,"weight_name":"auto","weight":325.855,"duration":317.297,"distance":1589,"legs":[{"via_waypoints":[],"admins":[{"iso_3166_1_alpha3":"IND","iso_3166_1":"IN"}],"weight":325.855,"duration":317.297,"steps":[],"distance":1589,"summary":"Nanabhai Moos Marg, Somnath Marg"}],"geometry":{"coordinates":[[72.81149414052663,18.89645526593143],[72.8124153594382,18.89776655516963],[72.81271992494229,18.897572661014983],[72.8129180887429,18.897497108256893],[72.81318723689418,18.89784968736059],[72.81298067135869,18.898001987984152],[72.81270809421736,18.898207862165975],[72.81313687262337,18.89877380501487],[72.81338531694952,18.89922431925533],[72.81363359940646,18.899740112801894],[72.81181089482446,18.90029964665671],[72.81180202194965,18.900366803618173],[72.8117339954493,18.900428364075623],[72.81174214126092,18.90189671363455],[72.81165636878545,18.90228006340767],[72.81164306812825,18.902344421287612],[72.81109885680145,18.902235292668156],[72.81091856286329,18.902117365470435],[72.81094813956364,18.901638877265498],[72.81012590743613,18.901641675403464],[72.81011481290759,18.902557670306265],[72.80963714426642,18.902550043131352],[72.8095919649869,18.903199374224748],[72.80954923661442,18.90376670632093],[72.8094552387014,18.904478129131185],[72.8094047735519,18.90476394149678],[72.80939066510354,18.905219656854584],[72.80938209707898,18.90542177284702],[72.80941434471907,18.90566393041851],[72.80947077805104,18.905772615207066],[72.8095554282794,18.905862232401685],[72.80970757089169,18.906739150237573],[72.80981842226056,18.90721774092176],[72.80825174845366,18.907421172219046],[72.80620572723686,18.907711663886747],[72.80603581011376,18.906410375705335],[72.80583061345766,18.90488750002614],[72.80647606574604,18.904819322321817],[72.80636686887603,18.90357632318074],[72.80634738491784,18.903000290209178],[72.80821289959496,18.902989921493045],[72.80825186713984,18.902441536333235],[72.80830544774646,18.90154291793707],[72.80930886769471,18.901570567383903],[72.80931591612128,18.90143467475805],[72.81013461220611,18.90144374806216],[72.81013794796412,18.90117943848539],[72.81016060172296,18.900810465527005],[72.81070684052874,18.90071499817927],[72.81124830883745,18.900484198142035],[72.81159245225282,18.90033552090291],[72.81160412759748,18.900277924741435],[72.8116616708641,18.900228810183794],[72.81142899816594,18.899846150085068],[72.81087796489183,18.898941948094542],[72.81030364603656,18.898114700172478],[72.8097278144216,18.897127354860526],[72.8101141273379,18.89706028956005],[72.81038413490253,18.89707606963482],[72.81075351037796,18.896976457871556],[72.81117753693147,18.896732852620566],[72.81149014752577,18.89645816373209]],"type":"LineString"}}';
            else
              location =
                '{"country_crossed":false,"weight_name":"auto","weight":325.855,"duration":317.297,"distance":1589,"legs":[{"via_waypoints":[],"admins":[{"iso_3166_1_alpha3":"IND","iso_3166_1":"IN"}],"weight":325.855,"duration":317.297,"steps":[],"distance":1589,"summary":"Nanabhai Moos Marg, Somnath Marg"}],"geometry":{"coordinates":[[72.81464848504025,18.906657659061736],[72.81468139485438,18.906610107023376],[72.81479548354798,18.90655614034891],[72.81492124032052,18.90645556602713],[72.81505607238611,18.906345179517015],[72.81519997964624,18.906168560977363],[72.81526571389787,18.906091903533472],[72.8153694308561,18.90601585934967],[72.81548481599228,18.90598151678339],[72.81619786998216,18.905942268157734],[72.81639233927912,18.905997461554733],[72.81655291932661,18.906137317616565],[72.81675245166734,18.905858932513866],[72.81680283865332,18.90554813214651],[72.81687539603578,18.90539559188852],[72.81685927213901,18.905117205442636],[72.81667637639853,18.90456186161215],[72.8164260423712,18.9037364983063],[72.81561783514918,18.903930989054327],[72.81540435972353,18.903289545214154],[72.81516167684867,18.90272943046834],[72.81497168503137,18.90231043603015],[72.81522103680692,18.90223942789163],[72.8160123792009,18.902250358193722],[72.81613433334329,18.902018317067622],[72.81612627154838,18.901390981175048],[72.81658173138197,18.90112307557571],[72.81694451768014,18.90110591435698],[72.81699490466606,18.901044896635998],[72.81696467247436,18.900627306153254],[72.81643258587327,18.900650187794728],[72.81633987385003,18.900633026563792],[72.81600078825397,18.900368933353427],[72.81593629297377,18.899918925146224],[72.81565772367543,18.899571884351605],[72.81548237687242,18.899518493348427],[72.81514828777989,18.899106578202776],[72.81496138297817,18.899575074283643],[72.81471119729461,18.899661074361028],[72.81463780946886,18.89955377149099],[72.81462007745021,18.899236382271695],[72.81436891675212,18.898706196874546],[72.81339537755048,18.89922792714275],[72.81311235924944,18.89873242355062],[72.81279189798862,18.898312920273586],[72.81079599952953,18.89880887831529],[72.81164352787316,18.90020878968359],[72.8117468185688,18.900226733520242],[72.81181261706007,18.900277127048614],[72.81181261706007,18.900363092417447],[72.81189176290924,18.90058026025948],[72.81243066149007,18.90209798747571],[72.81273456941126,18.9029302120951],[72.81288493934532,18.903776512747605],[72.81284107360456,18.904197438363777],[72.81177774889338,18.90403165902156],[72.81181538880004,18.903510416593484],[72.81179112921173,18.903442144006906],[72.81170426619973,18.903397988588242],[72.80959510614707,18.90320204882664],[72.80963712390287,18.902549513944212],[72.80825263727849,18.902455857023266],[72.80746698133868,18.902436232309633],[72.80746599601235,18.902975604954467],[72.80635142821431,18.902985951593532],[72.8063576946462,18.903552128693963],[72.80800265836336,18.903602521333866],[72.80818752073459,18.90383077007964],[72.80814327420698,18.904626755418228],[72.80785274801838,18.904677888730554],[72.80791541329351,18.905158096904945],[72.80711878758987,18.90527370240964],[72.80742584753494,18.9057420518957],[72.80776536570495,18.90623693795271],[72.80812255782223,18.906684535261565],[72.80799329676492,18.905744876009525],[72.8094032654607,18.905540343748466],[72.80938540733179,18.905411312711312],[72.8113630218487,18.905438962046073],[72.81149441976173,18.906120758466706],[72.81265123527619,18.90603550707908],[72.81263175131795,18.90693870952647],[72.81387575565692,18.90684404145976],[72.81444101306025,18.90678026275819],[72.81465622582817,18.906704218864174],[72.81464601023029,18.906655392320438]],"type":"LineString"}}';

            var data = JSON.parse(location);

            var coordinate = data.geometry.coordinates;
            coordinate = coordinate.concat(
              coordinate.splice(
                0,
                Math.floor(Math.random() * (coordinate.length - 1)) + 1
              )
            );

            moveCarData(coordinate);
            function moveCarData(coordinates) {
              var options = {
                path: coordinates,
                duration: 100000 * Math.floor(Math.random() * 10) + 1,
              };
              // start the truck animation with above options, and remove the line when animation ends
              car.followPath(options, function (coordinates) {
                moveCarData(this.path);
              });
            }
          });
        }
      },

      render: function (gl, matrix) {
        tb.update();
      },
    });
  });
}

//move soldier-------------------------------
{
  var soldier;

  map.on("style.load", function () {
    map.addLayer({
      id: "custom_layer1",
      type: "custom",
      renderingMode: "3d",
      onAdd: function (map, mbxContext) {
        window.tb = new Threebox(map, mbxContext, {
          defaultLights: true,
        });

        var options = {
          type: "gltf",
          obj: "models/Soldier.glb",
          scale: 0.7,
          units: "meters",
          anchor: "center",
          rotation: { x: 90, y: 180, z: 0 }, //rotation to postiion the truck and heading properly
        };
        tb.loadObj(options, function (model) {
          soldier = model.setCoords([72.80842277573004, 18.89469883205426]);
          tb.add(soldier);
          soldier.addEventListener("ObjectChanged", onObjectChanged, false);
          soldier.addTooltip("Drive with WASD keys", true, "top", true, 2);
          soldier.castShadow = true;
          soldier.selected = true;
          init();
        });
      },

      render: function (gl, matrix) {
        tb.update();
      },
    });
  });

  function easing(t) {
    return t * (2 - t);
  }

  let velocity = 0.0,
    speed = 0.0,
    ds = 0.01;
  let keys;

  let api = {
    buildings: false,
    acceleration: 1,
    inertia: 1,
  };

  function init() {
    keys = {
      a: false,
      s: false,
      d: false,
      w: false,
    };

    document.body.addEventListener("keydown", function (e) {
      const key = e.code.replace("Key", "").toLowerCase();
      if (keys[key] !== undefined) keys[key] = true;
    });
    document.body.addEventListener("keyup", function (e) {
      const key = e.code.replace("Key", "").toLowerCase();
      if (keys[key] !== undefined) keys[key] = false;
    });

    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    speed = 0.0;

    if (!keys.w) {
      soldier.stop();
    }

    if (!(keys.w || keys.s)) {
      if (velocity > 0) {
        speed = -api.inertia * ds;
      } else if (velocity < 0) {
        speed = api.inertia * ds;
      }
      if (velocity > -0.0008 && velocity < 0.0008) {
        speed = velocity = 0.0;
        return;
      }
    }

    if (keys.w) speed = api.acceleration * ds;
    else if (keys.s) speed = -api.acceleration * ds;

    velocity += (speed - velocity) * api.acceleration * ds;
    if (speed == 0.0) {
      velocity = 0;
      return;
    }

    let options = {
      center: [soldier.coordinates[0], soldier.coordinates[1], 0],
      bearing: map.getBearing(),
      zoom: 50,
      pitch: 90,
      easing: easing,
    };
    soldier.set({
      worldTranslate: new THREE.Vector3(0, -velocity, 0),
    });

    function toDeg(rad) {
      return (rad / Math.PI) * 180;
    }

    function toRad(deg) {
      return (deg * Math.PI) / 180;
    }

    let deg = 1;
    let rad = toRad(deg);
    let zAxis = new THREE.Vector3(0, 0, 1);

    if (keys.a || keys.d) {
      rad *= keys.d ? -1 : 1;
      soldier.set({
        quaternion: [zAxis, soldier.rotation.z + rad],
      });
      options.bearing = -toDeg(soldier.rotation.z);
    }

    let duration = 10000;
    var options2 = {
      animation: 1,
      duration: duration,
    };
    soldier.playAnimation(options2);

    map.jumpTo(options);
    tb.map.update = true;
  }

  function onObjectChanged(e) {
    let model = e.detail.object; //here's the object already modified
    if (api.buildings) {
      let c = model.coordinates;
      let point = map.project(c);
      let features = map.queryRenderedFeatures(point, {
        layers: [mapConfig.names.compositeLayer],
      });
      if (features.length > 0) {
        light(features[0]); // crash!
      }
    }
  }

  function light(feature) {
    fHover = feature;
    map.setFeatureState(
      {
        source: fHover.source,
        sourceLayer: fHover.sourceLayer,
        id: fHover.id,
      },
      {
        select: true,
      }
    );
  }
}

// //read geojson
{
  function generateTree() {
    d3.json("features.geojson").then(function (fc) {
      // var features = map.getLayer("buildinglayer");
      map.addLayer({
        id: "custom_layer3",
        type: "custom",
        renderingMode: "3d",
        onAdd: function (map, mbxContext) {
          window.tb = new Threebox(map, mbxContext, {
            defaultLights: true,
          });
          for (let i = 0; i < fc.features.length; i++) {
            const plotList = fc.features[i];
            if (fc.features[i].properties.plot == "green") {
              var coordinateArray = fc.features[i].geometry.coordinates;
              for (let j = 0; j < coordinateArray.length; j++) {
                const newcoordinateArray = coordinateArray[j][0];

                for (let m = 0; m < newcoordinateArray.length; m++) {
                  const element = newcoordinateArray[m];
                  // Driver Code
                  // Given dimensions
                  let R = 0.001;
                  let X = newcoordinateArray[0][0];
                  let Y = newcoordinateArray[0][1];
                  let N = 10;
                  // Function Call
                  let val = randPoint(R, X, Y, N);
                  let data = [];

                  for (let m = 0; m < val.length; m++) {
                    const element = val[m];
                    if (inside([element[0], element[1]], newcoordinateArray)) {
                      data.push([element[0], element[1]]);
                    }
                  }

                  for (let k = 0; k < data.length; k++) {
                    const element = data[k];

                    var options = {
                      type: "gltf",
                      obj: "models/tree/tree3.glb",
                      scale: Math.random() * 1.5 + 1,
                      units: "meters",
                      anchor: "center",
                      rotation: {
                        x: 90,
                        y: Math.floor(Math.random() * 360) + 1,
                        z: 0,
                      }, //rotation to postiion the truck and heading properly
                    };
                    tb.loadObj(options, function (model) {
                      var tree = model.setCoords([element[0], element[1]]);
                      tb.add(tree);
                    });
                  }
                }
              }
            }
          }
        },

        render: function (gl, matrix) {
          tb.update();
        },
      });
    });
  }

  function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    var x = point[0],
      y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0],
        yi = vs[i][1];
      var xj = vs[j][0],
        yj = vs[j][1];

      var intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  function uniform() {
    return Math.random();
  }

  // Function to find the N random points on
  // the given circle
  function randPoint(r, x, y, n) {
    // Result vector
    let res = new Array();

    for (let i = 0; i < n; i++) {
      // Get Angle in radians
      let theta = 2 * Math.PI * uniform();

      // Get length from center
      let len = Math.sqrt(uniform()) * r;

      // Add point to results.
      res.push([x + len * Math.cos(theta), y + len * Math.sin(theta)]);
    }

    // Return the N points
    return res;
  }

  // Function to display the content of
  // the vector A
  function printVector(A) {
    // Iterate over A
    for (let i = 0; i < A.length; i++) {
      // Print the N random points stored
      console.log("(" + A[i][0].toFixed(2) + ", " + A[i][1].toFixed(2) + ")");
    }
  }
}
