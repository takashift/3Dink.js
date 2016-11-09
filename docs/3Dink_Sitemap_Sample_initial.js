//3Dんく（スリディンク）sample Copyright 髭散化汰.　All rights reserved.

onload = function(){
document.getElementById('canvas').appendChild(renderer.domElement);

document.getElementById('canvas').style.width = width + 'px';
document.getElementById('canvas').style.height = height + 'px';

// 撮影したものをレンダリングする
render();
}


//　レンダラーの追加。WebGLに対応していない場合はCanvasRendererを使うように設定
if (window.WebGLRenderingContext) {
var renderer = new THREE.WebGLRenderer({antialias: true});
}
else {
var renderer = new THREE.CanvasRenderer();
}


var width  = 800;
var height = 600;


// スクリーンのサイズ設定
renderer.setSize(width, height);


//背景色を白にする。
renderer.setClearColor( new THREE.Color(0xffffff) );


// シーンを作る
var scene = new THREE.Scene();


//////// 平行投影の場合 ///////////
var left   = width / 2 * -1;
var right  = width / 2;
var top    = height / 2 * -1;
var bottom = height / 2;
//////// 透視投影の場合 ///////////
var fov    = 60;
var aspect = width / height;
/////////// 共通項目 ////////////
var near   = 1;
var far    = 10000;

var view_x = -100;
var view_y = 300;
var view_z = 400;


// カメラオブジェクト(平行投影)を作成( left, right, top, bottom, near, far)
//	var camera = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
// カメラオブジェクト(透視投影)を作成(視野角,アス比,near限界,far限界)
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


// カメラの配置位置を設定（x, y, z）
camera.position.set(view_x, view_y, view_z);
//	camera.position.z = 500;


// カメラの上向きの軸をどの軸にするか（１にした軸に設定される。）
camera.up.set(0,1,0);


// モデルにカメラを向ける(OrbitControls.jsとは併用不可)
//camera.lookAt(0,0,0);


scene.add(camera);


/*	// 環境光
AmbientLight = new THREE.AmbientLight("rgb(100,100,100)");  
scene.add(AmbientLight);
*/	
// ライトオブジェクトを作成(カラー, 光の強さ)
var directionalLight0 = new THREE.DirectionalLight('#ffffff', 0.85);	
// 光源（平行光源、無限遠光源）の座標を設定（x, y, z）
directionalLight0.position.set(0, 1000, 10).normalize();
// ライトオブジェクトをシーンに追加
scene.add(directionalLight0);

// ライトオブジェクトを作成(カラー, 光の強さ)
var directionalLight1 = new THREE.DirectionalLight('#ffffff', 1);	
// 光源（平行光源、無限遠光源）の座標を設定（x, y, z）
directionalLight1.position.set(500, 20, 0);
// ライトオブジェクトをシーンに追加
scene.add(directionalLight1);

// ライトオブジェクトを作成(カラー, 光の強さ)
var directionalLight2 = new THREE.DirectionalLight('#ffffff', 1);	
// 光源（平行光源、無限遠光源）の座標を設定（x, y, z）
directionalLight2.position.set(-500, 20, 0);
// ライトオブジェクトをシーンに追加
scene.add(directionalLight2);

// ライトオブジェクトを作成(カラー, 光の強さ)
var directionalLight3 = new THREE.DirectionalLight('#ffffff', 1);	
// 光源（平行光源、無限遠光源）の座標を設定（x, y, z）
directionalLight3.position.set(0, 20, 500);
// ライトオブジェクトをシーンに追加
scene.add(directionalLight3);

// ライトオブジェクトを作成(カラー, 光の強さ)
var directionalLight4 = new THREE.DirectionalLight('#ffffff', 1);	
// 光源（平行光源、無限遠光源）の座標を設定（x, y, z）
directionalLight4.position.set(0, 20, -500);
// ライトオブジェクトをシーンに追加
scene.add(directionalLight4);
//影の有効化（レンダラー）
//	renderer.shadowMapEnabled = true; 




//地面（PlaneGeometry）の生成
var plane = new THREE.Mesh( new THREE.PlaneGeometry(10000, 10000, 1, 1),
				new THREE.MeshLambertMaterial({
				side: THREE.DoubleSide,	color: "rgb(202,245,255)" })
			);

plane.rotation.x = Math.PI/2;
//	plane.position.set(0,0,0);


//影の有効化（地面）          
//	plane.receiveShadow = true;
//シーンオブジェクトに追加 
scene.add(plane);                 


/*********************** 3Dink.js でモデルを生成 *************************/
/*// ハイパーリンクモデルを追加するコード其の１
var gijutu = [];	

var gijutu_texture = [];

var gijutu_color = [];

var gijutu_url = ["engineering.html"];

//gijutu_url[0] = "engineering.html";
gijutu_texture[0] = new THREE.TextureLoader().load('link_texture/engine.png');
//siyo_color[0] = "#ff4af0";

// 各モデルの色とURLを定義（モデル配列名, モデルの要素数, URL配列, テクスチャ名, 色配列）
new create_link_model_Obj( gijutu, 1, gijutu_url, gijutu_texture, gijutu_color );

var gj_x = 300;
// モデルを直方体と定義
//（ シーン, モデル配列名, 色の配列, モデルのサイズ X方向, Y方向, Z方向, モデルのX座標, Y座標, Z座標 ）
// Z座標はモデルサイズの２分の１の値にしないと地面めり込むか浮く。
new add_link_cube( scene, gijutu, 200, 36, 200, gj_x, 18, 0 );


// ハイパーリンクモデルを追加するコード其の２
var katei = [];
var katei_t = [new THREE.TextureLoader().load('link_texture/link_top.png')];
katei_t[0].minFilter = THREE.LinearFilter
var katei_c = [];
var katei_u = ["/"];
new create_link_model_Obj( katei, 1, katei_u, katei_t, katei_c );
new add_link_cube( scene, katei, 50, 50, 50, 140, 200, 0 );


var gj_ct_y = 53;

// ハイパーリンクモデルを追加するコード其の３　３行でまとまる。
var katei = [];
new create_link_model_Obj( katei, 1, [], [new THREE.TextureLoader().load('link_texture/link_kodawari.png')], [] );
new add_link_cube( scene, katei, 50, 30, 50, gj_x+75, gj_ct_y, -75 );

var katei = [];
new create_link_model_Obj( katei, 1, [], [new THREE.TextureLoader().load('link_texture/kufu.png')], [] );
new add_link_cube( scene, katei, 50, 30, 50, gj_x+75, gj_ct_y, 75 );

var katei = [];
new create_link_model_Obj( katei, 1, ["download.html"], [new THREE.TextureLoader().load('link_texture/link_download.png')], [] );
new add_link_cube( scene, katei, 50, 40, 50, gj_x-75, gj_ct_y+5, -75 );


var site_ct_x = -20;

var katei = [];
new create_link_model_Obj( katei, 1, ["about3Dink.html"], [new THREE.TextureLoader().load('link_texture/sitemap.png')], [] );
new add_link_cube( scene, katei, 200, 30, 200, site_ct_x, 15, 0 );

var site_ct_y = 45;

var katei = [];
new create_link_model_Obj( katei, 1, ["about3Dink.html"], [new THREE.TextureLoader().load('link_texture/link_tokutyo.png')], [] );
new add_link_cube( scene, katei, 50, 30, 50, site_ct_x-75, site_ct_y, -75 );

var katei = [];
new create_link_model_Obj( katei, 1, ["sousa.html"], [new THREE.TextureLoader().load('link_texture/link_sousa.png')], [] );
new add_link_cube( scene, katei, 50, 30, 50, site_ct_x, site_ct_y, -75 );

var katei = [];
new create_link_model_Obj( katei, 1, ["possibility.html"], [new THREE.TextureLoader().load('link_texture/link_katsuyo.png')], [] );
new add_link_cube( scene, katei, 50, 30, 50, site_ct_x+75, site_ct_y, -75 );



var katei = [];
new create_link_model_Obj( katei, 1, [], [new THREE.TextureLoader().load('link_texture/link_keii.png')], [] );
new add_link_cube( scene, katei, 200, 100, 50, 140, 50, -215 );

var katei = [];
new create_link_model_Obj( katei, 1, ["author.html"], [new THREE.TextureLoader().load('link_texture/gaiyo.png')], [] );
new add_link_cube( scene, katei, 75, 30, 50, 78, 115, -215 );

var katei = [];
new create_link_model_Obj( katei, 1, ["development.html"], [new THREE.TextureLoader().load('link_texture/link_kankyo.png')], [] );
new add_link_cube( scene, katei, 75, 30, 50, 200, 115, -215 );


var licence = [];
new create_link_model_Obj( licence, 1, ["licence.html"], [new THREE.TextureLoader().load('link_texture/link_LICENSE.png')], [] );
new add_link_cube( scene, licence, 75, 40, 75, 140, 20, -65 );

var katei = [];
new create_link_model_Obj( katei, 1, ["about3Dink.html"], [new THREE.TextureLoader().load('link_texture/about.png')], [] );
new add_link_cube( scene, katei, 75, 40, 75, 140, 20, 65 );
*/




var top1 = Js3Dink.createBox( 50, 50, 50, 140, 200, 0 , 'link_texture/link_top.png' );
Js3Dink.addURL(top1, "./");
scene.add(top1);

var about1 = Js3Dink.createBox( 50, 50, 50, 140, 200, 70 , 'link_texture/about.png' );
scene.add(about1);
Js3Dink.addURL(about1, "about3Dink.html");

//Js3Dink.setCanvasSize(width, height);
top1.link.setNewTab( 'ON' );
console.log(1 ,top1.link.isNewTab);
top1.link.setShineOnMouse('ON');
//top1.link.setShineOnTouch('OFF', 'ALL');
//Js3Dink.domEvent.isShineOnMouseCanvas = 'OFF'
Js3Dink.domEvent.addFnc(renderer, 'Fn', 'Fn');

//top1.link.setShineOnMouse('fuga');
console.log(top1.link.isShineOnMouse);
console.log(about1.link.isShineOnMouse);
console.log(Js3Dink.domEvent.isShineOnMouseCanvas );
//console.log(about1.link.isShineOnMouseCanvas );
/*top1.link.setShineOnMouse('OFF');
console.log(top1.link.isShineOnMouse);
console.log(about1.link.isShineOnMouse);
console.log(top1.link.isShineOnMouseCanvas );
console.log(about1.link.isShineOnMouseCanvas );
*/
/*************************************************************/

// Controls3DinkFieldMapsを使うと、カメラの操作をPCやスマホで容易に実現できる。
var controls = new Controls3DinkFieldMaps(camera, renderer.domElement);

// 動かせるカメラの角度（縦方向）の最大値と最小値を指定する。
// 0 から Math.PI までの間で変更可能（ラジアン）.
controls.minPolarAngle = -90 * Math.PI / 180; // radians
controls.maxPolarAngle = 90 * Math.PI / 180; // radians

// ズームできる範囲（Z座標）の最大と最小
controls.minDistance = 30;
controls.maxDistance = 1000;

controls.zoomSpeed = 2.0;

/* 追加　与えた値の + - の範囲で移動可能 */
controls.spaceX = 1000;
controls.spaceZ = 1000;


// 撮影したものをレンダリングする
function render() {
	requestAnimationFrame(render);
	
	renderer.render(scene, camera);
}

