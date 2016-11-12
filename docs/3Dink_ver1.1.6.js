/**
 * 3Dんく（スリディンク）
 * "3Dんく" is a library that is aimed at adding every hyperlink to every 3D models.
 * 
 * @author 髭散化汰 / https://twitter.com/higechira
 * Copyright © 2014-2016 髭散化汰
 */


//---------------------------------------------------------------------------------
// 名前空間
// 
// 先頭の処理は多様な使用条件下においても名前空間を適用させるための雛形である。
// 外側の即時関数で、（5行目）thisと内側の即時関数を引数内で定義して渡しており、
// さらに（4行目）引数にした内側の即時関数(factory)を実行させることでexportにglobal.Js3Dinkを渡し、
// 内側の即時関数のexportのプロパティをグローバルに引き出してる（ブラウザで使用時）。
// また、即時関数の引数にglobalを渡すことによって、グローバルオブジェクトがwindow以外でも対応
//---------------------------------------------------------------------------------
(function ( global, factory ) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory( exports, global ) :
	typeof define === 'function' && define.amd ? define( ['exports', 'global'], factory ) :
	(factory( ( global.Js3Dink = global.Js3Dink || {} ), global ));
} ( this, (function ( exports, global ) {
"use strict";

	const VERSION = '1.1.6';
	console.log('3Dink.js Version', VERSION);

	
	// Three.js併用時読み込み
	if( THREE )
		var webGlLib = THREE;
	
	
	// Three.js互換のライブラリを利用する場合に設定。
	function setWrapperLib( name ) {
		webGlLib = name;
	}
	
	
	let WIDTH;
	let HEIGHT;
	
	
	// domElementからの取得では無く直接canvasのサイズを指定する。
	function setCanvasSize(arg_width, arg_height) {
		WIDTH = arg_width;
		HEIGHT = arg_height;
	}
	
	
	// モデルにURLを付与し、ハイパーリンクとする
	function addURL( model, arg_url ){
		if( !model.link )
			model.link = new Link();
		
		Object.defineProperty( model.link, 'url', { value : arg_url, enumerable : true } );
	}	
	

	// コンストラクタにすることでプロトタイプで共通のメソッドを定義できる
	function Link() {}
	
	Link.prototype = {
		
		// リンク先を新しいタブで開くか（'ON' or 'OFF'）のデフォルト値
		isNewTab: 'OFF',
		
		// 個別の設定
		// オンマウス時の3Dink発光機能（'ON' or 'OFF'）
		isShineOnMouse: 'OFF',
		
		// タッチ時の3Dink発光機能（'ON' or 'OFF'）
		isShineOnTouch: 'ON',
		
		shineColor: 0x888888, // THREE.Color( shineColor ) or THREE.Color( shineColer.r, shineColer.g, shineColer.b )
		
		// 個々の新規タブ設定関数
		// 第二引数が'ALL'のときはプロトタイプのプロパティを変更する。
		setNewTab: function( value, is_all = undefined ) {
			
			if( is_all === 'ALL' )
				Link.prototype.isNewTab = value;
			else
				this.isNewTab = value;
		},
		
		// 個々の値の変更関数
		setShineOnMouse: function( value, is_all = undefined ) {
			
			if( value !== 'OFF' && domEvent.isShineOnMouseCanvas === 'OFF' )
				// 発光機能をオフにする
				domEvent.isShineOnMouseCanvas = value;
			
			if( is_all === 'ALL' ) {
				
				// 全てのモデルの発光設定をオフにする
				Link.prototype.isShineOnMouse = value;
				// 発光機能をオフにする
				domEvent.isShineOnMouseCanvas = value;
			}
			else	
				this.isShineOnMouse = value;
		},
		
		setShineOnTouch: function( value, is_all = undefined ) {
			
			if( value !== 'OFF' && domEvent.isShineOnTouchCanvas === 'OFF' )
				domEvent.isShineOnTouchCanvas = value;
			
			if( is_all === 'ALL' ) {
				
				Link.prototype.isShineOnTouch = value;
				domEvent.isShineOnTouchCanvas = value;
			}
			else
				this.isShineOnTouch = value;
		},
	}
	
	
	// マウスやタッチ操作に関するオブジェクトを格納
	const domEvent = {
					
		
		renderer: undefined,
		
		
		// カーソルの座標が動いた回数を計測
		moveCount: 0,
		
		
		// マウスの座標にあるモデルを格納するオブジェクト
		itsModel: undefined,
		
		
		// 今マウスと交差するモデルの前に交差したモデルを格納するオブジェクト
		selectedModel: {
			material: {
				emissive: {}
			}
		},
		
		
		rect: undefined,
		
		
		touchLen: 0,
		

		// 全体の発光処理のフラグ
		// オンマウス時の3Dink発光機能（'ON' or 'OFF'）
		isShineOnMouseCanvas: 'OFF',
		
		// タッチ時の3Dink発光機能（'ON' or 'OFF'）
		isShineOnTouchCanvas: 'ON',
		

		// マウスの座標を得る
		getMousePoint:
			function (e) {
				
				// マウス位置(2D)
				// マウスの座標を取得し、-1～+1の範囲に正規化する
				const mouse = new webGlLib.Vector2();
				mouse.x = e.clientX - this.rect.left;
				mouse.y = e.clientY - this.rect.top;
				
				mouse.x =  ( mouse.x / WIDTH  ) * 2 - 1;
				mouse.y = -( mouse.y / HEIGHT ) * 2 + 1;
				
				return mouse;
			},

		// 指の座標を得る
		getTouchPoint:
			function (e) {
				
			    // 指の位置(2D)
				// 指の座標を取得し、-1～+1の範囲に正規化する
				const touch = new webGlLib.Vector2();
			    touch.x = e.touches[ 0 ].clientX - this.rect.left;
			    touch.y = e.touches[ 0 ].clientY - this.rect.top;
			
				touch.x =  ( touch.x / WIDTH  ) * 2 - 1;
				touch.y = -( touch.y / HEIGHT ) * 2 + 1;
		
				return touch;
			},
		
					
		// マウスカーソルが指した座標に存在する全てのオブジェクトを得る
		getIntersectObj:
			function ( mouse, camera, scene ) {
				
				const ray = new webGlLib.Raycaster();
				ray.setFromCamera( mouse, camera );
				
				// 外部から読み込んだオブジェクトも確認する場合はrecursive（第二引数）をtrueにする
				return ray.intersectObjects( scene.children, true );
			},
		
		
		// Aタグモードでのタグの追加
		// マウス
		addAnchorMouse:
			function ( e, el, parent ) {
			
				if( el !== null )
					parent.removeChild(el);
				
				const area = 1;
				
				el = document.createElement( 'a' );
				
				parent.appendChild( el, null );
				
				el.setAttribute( "href", this.itsModel.link.url );
				
				//el.innerHTML = "a";
				
				el.style.display = "inline-block";
				
				//el.style["z-index"] = "1";
				//el.sytle. = intersects[0].object.matrixWorld;
				
				el.style.top  = e.clientY - this.rect.top  - area/2 + 'px';
				el.style.left = e.clientX - this.rect.left - area/2 + 'px';
				
				el.style.width  = area + 'px';
				el.style.height = area + 'px';
				
				el.style.position = "absolute";
				
				parent.style.position = "relative";
			},
		
		// タッチ
		addAnchorTouch:
			function ( e, el, parent ) {
				
				if( el !== null )
					parent.removeChild(el);
				
				const area = 1;
				
				el = document.createElement( 'a' );
				
				parent.appendChild( el, null );
				
				el.setAttribute( "href", this.itsModel.link.url );
				
				//el.innerHTML = "a";
				
				el.style.display = "inline-block";
				
				//el.style["z-index"] = "1";
				//el.sytle. = intersects[0].object.matrixWorld;
				
				el.style.top  = e.touches[ 0 ].clientY - this.rect.top  - area/2 + 'px';
				el.style.left = e.touches[ 0 ].clientX - this.rect.left - area/2 + 'px';
				
				el.style.width  = area + 'px';
				el.style.height = area + 'px';
				
				el.style.position = "absolute";
				
				parent.style.position = "relative";
			},
		
		
		//
		// フレキシブルに変化する処理
		//
		// 関数モード
		// マウス
		//　発光有り
		// マウスの乗ったモデルを光らせる。イベント内関数なので常時繰り返される。
		shineModelFn:
			function () {
				
				let selectedMatl = this.selectedModel.material;
				
				const style = this.renderer.domElement.style;
				
				// マウスと交差しているオブジェクトが有るか
				if( this.itsModel ) {
					
					// オブジェクトが発光していないか（各プロパティが 0 か）確認
					if( !this.itsModel.material.emissive.r && !this.itsModel.material.emissive.g && !this.itsModel.material.emissive.b ) {
						
						if( this.itsModel.link || this.itsModel.parent.link ){
							
							// .objから読み込んだモデルの時
							if( !this.itsModel.link ) {
								
								this.itsModel = this.itsModel.parent;
								
								this.itsModel.isParent = true;
							}
							
							if( this.itsModel.link.isShineOnMouse !== 'OFF' && this.itsModel.link.url ) {
								
								if( this.itsModel.isParent ) {
									for( let i in this.itsModel.children ) {
										this.itsModel.children[i].material.emissive = new webGlLib.Color( this.itsModel.link.shineColor );
									}
								}
								else
									this.itsModel.material.emissive = new webGlLib.Color( this.itsModel.link.shineColor );
								
								style.cursor = 'pointer';
								
							}
						}
							
						else style.cursor = 'auto';
						
						// マウスの乗ってるモデルが変わったら
						if( this.selectedModel !== this.itsModel ) {
							
							// 以前カーソルを置いて光らせたモデルを元に戻す
							if( this.selectedModel.isParent ) {
								for( let i in this.selectedModel.children ) {
									this.selectedModel.children[i].material.emissive = new webGlLib.Color( 0 );
								}
							}
							else
								selectedMatl.emissive = new webGlLib.Color( 0 );
							
							// 現在カーソルを置いているモデルを代入
							this.selectedModel = this.itsModel;
						}
					}
				}
				
				// マウスと交差するオブジェクトがない場合は、以前発光させたモデルを元に戻す
				else if( style.cursor !== 'auto' ){
					
					style.cursor = 'auto'
					
					selectedMatl.emissive = new webGlLib.Color( 0 );
				}
			},


		// マウス
		// 発光なし
		// マウスポインタの変更のみ。イベント内関数なので常時繰り返される。
		changeCursorFn:
			function () {
									
				const style = this.renderer.domElement.style;
		
				// マウスと交差しているオブジェクトが有るか
				if( this.itsModel ) {
					
					if( this.itsModel.link || this.itsModel.parent.link ){
						
						// .objから読み込んだモデルの時
						if( !this.itsModel.link )
							this.itsModel = this.itsModel.parent;
						
						if( this.itsModel.link.url ) {
							
							style.cursor = 'pointer';
						}
						
						else style.cursor = 'auto';
					}
				}
				
				// マウスと交差するオブジェクトがない場合は、カーソルを元に戻す
				else if( style.cursor !== 'auto' ) {
					
					style.cursor = 'auto'
				}
			},


		// タッチ
		// 発光有り
		shineModelFnTouch:
			function () {
				console.log("FnTouch");
				let selectedMatl = this.selectedModel.material;
				
				// 指と交差しているオブジェクトが有るか
				if( this.itsModel ) {
					
					// オブジェクトが発光していない（各プロパティが 0 ）場合
					if( !this.itsModel.material.emissive.r && !this.itsModel.material.emissive.g && !this.itsModel.material.emissive.b ) {
						
						if( this.itsModel.link || this.itsModel.parent.link ){
							
							// .objから読み込んだモデルの時
							if( !this.itsModel.link ) {
								
								this.itsModel = this.itsModel.parent;
								
								this.itsModel.isParent = true;
							}
							
							if( this.itsModel.link.isShineOnTouch !== 'OFF' && this.itsModel.link.url ) {
							
								this.itsModel.material.emissive = new webGlLib.Color( this.itsModel.link.shineColor );
								
							}
							
							// 指の乗ってるモデルが変わったか
							if( this.selectedModel !== this.itsModel ) {
								
								// 以前指を置いて光らせたモデルを元に戻す
								selectedMatl.emissive = new webGlLib.Color( 0 );
								
								// 現在指を置いているモデルを代入
								this.selectedModel = this.itsModel;
							}
						}
					}
				}
				
				// 指と交差するオブジェクトがない場合は、以前発光させたモデルを元に戻す
				// オブジェクトが発光していないか（各プロパティが 0 以外か）確認
				else if( selectedMatl.emissive.r && selectedMatl.emissive.g && selectedMatl.emissive.b ){
					
					selectedMatl.emissive = new webGlLib.Color( 0 );
				}


			},
		
		
		// Aタグモード
		// マウス
		// マウスの乗ったモデルを光らせる。イベント内関数なので常時繰り返される。
		shineModelA:
			function (e) {
				console.log("A");
				let selectedMatl = this.selectedModel.material;
				
				const style = this.renderer.domElement.style;
				
				const el = this.renderer.domElement.parentNode.querySelector( "a" );
				
				const parent = this.renderer.domElement.parentNode;
		
				// マウスと交差しているオブジェクトが有るか
				if( this.itsModel ) {
					
					if( this.itsModel.link || this.itsModel.parent.link ){
						
						// .objから読み込んだモデルの時
						if( !this.itsModel.link )
							this.itsModel = this.itsModel.parent;
					
						if( this.itsModel.link.url ) {
							
							// オブジェクトが発光していないか（各プロパティが 0 か）確認
							if( this.itsModel.link.isShineOnMouse !== 'OFF' && !this.itsModel.material.emissive.r && !this.itsModel.material.emissive.g && !this.itsModel.material.emissive.b )
								this.itsModel.material.emissive = new webGlLib.Color( this.itsModel.link.shineColor );
							
							style.cursor = 'pointer';
							
							this.addAnchorMouse( e, el, parent );
						}
						
						else {
							style.cursor = 'auto';
							
							if(el !== null)
								parent.removeChild(el);
						}
						
						// マウスの乗ってるモデルが一緒か
						if( this.selectedModel !== this.itsModel ) {
							
							// 以前カーソルを置いて光らせたモデルを元に戻す
							selectedMatl.emissive = new webGlLib.Color( 0 );
							
							// 現在カーソルを置いているモデルを代入
							this.selectedModel = this.itsModel;
						}
					}
				}
				
				// マウスと交差するオブジェクトがない場合は、以前発光させたモデルを元に戻す
				else　if( style.cursor !== 'auto' ) {
					
					style.cursor = 'auto'
					
					selectedMatl.emissive = new webGlLib.Color( 0 );
				}
			},


		// マウス
		// 発光なし
		// マウスポインタの変更のみ。イベント内関数なので常時繰り返される。
		changeCursorA:
			function (e) {
									
				const style = this.renderer.domElement.style;
				
				const el = this.renderer.domElement.parentNode.querySelector( "a" );
				
				const parent = this.renderer.domElement.parentNode;
		
				// マウスと交差しているオブジェクトが有る場合
				if( this.itsModel ) {
					
					if( this.itsModel.link || this.itsModel.parent.link ){
						
						// .objから読み込んだモデルの時
						if( !this.itsModel.link )
							this.itsModel = this.itsModel.parent;
					
						if( this.itsModel.link.url ) {
							
							style.cursor = 'pointer';
							
							this.addAnchorMouse( e, el, parent );
						}
						
						else {
							style.cursor = 'auto';
			
							if(el !== null)
								parent.removeChild(el);
						}
					}
				}
				
				// マウスと交差するオブジェクトがない場合は、カーソルを元に戻す
				else if( style.cursor !== 'auto' ) {
					
					style.cursor = 'auto'
					
					if( el !== null )
						parent.removeChild(el);
				}
			},


		// タッチ
		// 発光有り
		// 指の乗ったモデルを光らせる。イベント内関数なので常時繰り返される。
		shineModelATouch:
			function (e) {
				
				let selectedMatl = this.selectedModel.material;
				
				const el = this.renderer.domElement.parentNode.querySelector( "a" );
				
				const parent = this.renderer.domElement.parentNode;
				
				// 指と交差しているオブジェクトが有るか
				if( this.itsModel ) {
					
					if( this.itsModel.link || this.itsModel.parent.link ){
						
						// .objから読み込んだモデルの時
						if( !this.itsModel.link )
							this.itsModel = this.itsModel.parent;
					
						if( this.itsModel.link.url ) {
							
							// オブジェクトが発光していない（各プロパティが 0 ）のとき
							if( this.itsModel.link.isShineOnTouch !== 'OFF' && !this.itsModel.material.emissive.r && !this.itsModel.material.emissive.g && !this.itsModel.material.emissive.b )
								this.itsModel.material.emissive = new webGlLib.Color( this.itsModel.link.shineColor );
							
							this.addAnchorTouch( e, el, parent );
						}
						
						else {
		
							if( el !== null )
								parent.removeChild(el);
						}
						
						// 指の乗ってるモデルが一緒か
						if( this.selectedModel !== this.itsModel ) {
							
							// 以前指を置いて光らせたモデルを元に戻す
							selectedMatl.emissive = new webGlLib.Color( 0 );
							
							// 現在指を置いているモデルを代入
							this.selectedModel = this.itsModel;
						}
					}
				}
				
				// 指と交差するオブジェクトがない場合は、以前発光させたモデルを元に戻す
				// オブジェクトが発光していないか（各プロパティが 0 以外か）確認
				else if( selectedMatl.emissive.r && selectedMatl.emissive.g && selectedMatl.emissive.b ){
					
					selectedMatl.emissive = new webGlLib.Color( 0 );
					
					if( el !== null )
						parent.removeChild(el);
				}
			},
		
		
			
		// タッチ
		// 発光なし
		// 指の位置と交差するオブジェクトの取得、移動カウントのみ行う
		getItsObjA:
			function (e) {
									
				const el = this.renderer.domElement.parentNode.querySelector( "a" );
				
				const parent = this.renderer.domElement.parentNode;
		
				// マウスと交差しているオブジェクトが有るか
				if( this.itsModel ) {
					
					if( this.itsModel.link || this.itsModel.parent.link ){
						
						// .objから読み込んだモデルの時
						if( !this.itsModel.link )
							this.itsModel = this.itsModel.parent;
						
						if( this.itsModel.link.url ) {
							
							this.addAnchorTouch( e, el, parent );
						}
						
						else {
			
							if(el !== null)
								parent.removeChild(el);
						}
					}
				}
				
				else if( el !== null )
					parent.removeChild(el);
			},

		
		// Eventを処理する共通のダイナミックな関数
		makeEventFnc:
			function ( getPoint, process ) {
				
				return function (e) {
//		console.time('t1');
					
					if( !this.rect )
						this.rect = this.renderer.domElement.getBoundingClientRect();
					
					const pointer = getPoint(e);
					
					const intersects = this.getIntersectObj( pointer, camera, scene );
					
					if( intersects[0] ) this.itsModel = intersects[0].object;
					else this.itsModel = undefined;
					this.moveCount++;
					
console.log(intersects[0].object);
					// モードによって動的に変化する関数
					process(e);
//		console.timeEnd('t1');			
				}
			},
		
		
		// モデルをクリックでリンク発動。イベント内関数なので常時繰り返される。
		loadPageLink:
			function (e) {
				
				if( this.moveCount < 2 ) {
					// 特定のモデルをクリックでリンク発動
					if( this.itsModel ) {
						
						if( !this.itsModel.link ){
							
							// .objから読み込んだモデルの時
							if( this.itsModel.parent.link )
								this.itsModel = this.itsModel.parent;
							
							else return;
						}
						
						if( this.itsModel.link.url ) {
console.log(e.button);
							
							if( e.button === 0 || this.touchLen === 1 ){
								
								if( this.itsModel.link.isNewTab === 'ON' )
									global.open( this.itsModel.link.url );
								
								else location.href = this.itsModel.link.url;
							}
							
							// ホイールクリックの時は別タブで開く
							else if( e.button === 1 ) global.open( this.itsModel.link.url );
							
							// *暫定* 右クリックでコンソールにリンク先を表示
							else if( e.button === 2 ) console.log( this.itsModel.link.url );
						}
					}
				}
			},



		//　ハイパーリンクEvent追加関数
		// 第一引数：リンク実装方法(関数モードとAタグモード) "Fn"(default) or "A"
		addFnc:
			function ( renderer, is_Hyperlink_mode = 'Fn', is_Hyperlink_mode_touch = 'Fn' ) {
				
				this.renderer = renderer;
				
				if( !WIDTH ){
					WIDTH = renderer.domElement.style.width;
					WIDTH = WIDTH.substr( 0, WIDTH.length-2 );
				}
				if( !HEIGHT ){
					HEIGHT = renderer.domElement.style.height;
					HEIGHT = HEIGHT.substr( 0, HEIGHT.length-2 );
				}
				
				let evfnc;
				
				//　ピッキング処理（マウスor指を乗っけた時 ）
				// ポインタ操作でのリンク読み込みをHTMLのアンカータグで実現する場合
				
				//　ピッキング処理（マウスor指を乗っけた時）
				// ポインタ操作でのリンク読み込みをJavaScriptの関数で実現する場合
				if( is_Hyperlink_mode === 'Fn' ) {
					
					// マウス操作での処理
					if( this.isShineOnMouseCanvas === 'ON' ){
						
						evfnc = this.makeEventFnc( this.getMousePoint.bind(this), this.shineModelFn.bind(this) );
						
						renderer.domElement.addEventListener( 'mousemove', evfnc.bind(this), false );
					}
					
					else {
						
						evfnc = this.makeEventFnc( this.getMousePoint.bind(this), this.changeCursorFn.bind(this) );
						
						renderer.domElement.addEventListener( 'mousemove', evfnc.bind(this), false );		
					}
					
					renderer.domElement.addEventListener( 'mousedown', function (){ this.moveCount = 0; }.bind(this), false );
					
					//　ピッキング処理（クリックしてリンクを作動）
					renderer.domElement.addEventListener( 'mouseup', this.loadPageLink.bind(this), false );	
				}
				
				
				// タッチ操作での処理
				if( is_Hyperlink_mode_touch === 'Fn' ) {
					
					if( this.isShineOnTouchCanvas === 'ON' ){
						
						evfnc = this.makeEventFnc( this.getTouchPoint.bind(this), this.shineModelFnTouch.bind(this) );
						
						renderer.domElement.addEventListener( 'touchstart', evfnc.bind(this), false );		
						renderer.domElement.addEventListener( 'touchmove', evfnc.bind(this), false );		
					}
					
					// カーソルの位置と交差するオブジェクトの取得、移動カウントのみ行う
					else {
						
						evfnc = this.makeEventFnc( this.getTouchPoint.bind(this), function (){} );
						
						renderer.domElement.addEventListener( 'touchstart', evfnc.bind(this), false );		
						renderer.domElement.addEventListener( 'touchmove', evfnc.bind(this), false );		
					}
					
					renderer.domElement.addEventListener( 'touchstart', function (e){ this.moveCount = 0; this.touchLen = e.touches.length; }.bind(this), false );
					
					//　ピッキング処理（クリックしてリンクを作動）
					renderer.domElement.addEventListener( 'touchend', this.loadPageLink.bind(this), false );	
				}
				
				
				// マウス操作での処理
				if( is_Hyperlink_mode === 'A' ) {
					
					if( this.isShineOnMouseCanvas === 'ON' ){
						
						evfnc = this.makeEventFnc( this.getMousePoint.bind(this), this.shineModelFn.bind(this) );
						
						renderer.domElement.addEventListener( 'mousemove', evfnc.bind(this), false );
						
						evfnc = this.makeEventFnc( this.getMousePoint.bind(this), this.shineModelA.bind(this) );
						
						renderer.domElement.addEventListener( 'mousedown', evfnc.bind(this), false );		
					}
					
					else {
						
						evfnc = this.makeEventFnc( this.getMousePoint.bind(this), this.changeCursorFn.bind(this) );
						
						renderer.domElement.addEventListener( 'mousemove', evfnc.bind(this), false );		
						
						evfnc = this.makeEventFnc( this.getMousePoint.bind(this), this.changeCursorA.bind(this) );
						
						renderer.domElement.addEventListener( 'mousedown', evfnc.bind(this), false );		
					}
				}
					
				// タッチ操作での処理
				if( is_Hyperlink_mode_touch === 'A' ) {
					
					if( this.isShineOnTouchCanvas === 'ON' ){
						
						evfnc = this.makeEventFnc( this.getTouchPoint.bind(this), this.shineModelATouch.bind(this) );
						
						renderer.domElement.addEventListener( 'touchstart', evfnc.bind(this), false );		
						renderer.domElement.addEventListener( 'touchmove', evfnc.bind(this), false );
						renderer.domElement.addEventListener( 'mouseup', function (e){console.log("m", e.button);}, false );		
					}
					
					else {
						
						evfnc = this.makeEventFnc( this.getTouchPoint.bind(this), this.getItsObjA.bind(this) );
						
						renderer.domElement.addEventListener( 'touchstart', evfnc.bind(this), false );		
						renderer.domElement.addEventListener( 'touchmove', evfnc.bind(this), false );		
						renderer.domElement.addEventListener( 'touchend', function (){}, false );		
					}
				}
				
			},
		

	}; // domEvent閉じ
		
		
	// ここにはオブジェクト同士の衝突によるリンク発動関数を置く予定
	
	
	function createBox( g_x, g_y, g_z, p_x, p_y, p_z, txr = undefined ){
		
		// モデル（直方体）を配置
		// 直方体のサイズをBoxGeometry(x, y, z)で指定。
		const geometry = new webGlLib.BoxGeometry(g_x, g_y, g_z);
		
		if( txr !== undefined ) {
			const texture = new webGlLib.TextureLoader().load( txr );
			texture.minFilter = webGlLib.LinearFilter;
			
			var material = new webGlLib.MeshPhongMaterial({ map: texture });
		}
			
//		else var material = new webGlLib.MeshPhongMaterial({ color: 0x839241 });
	
		//　モデルの座標を指定して追加
		const model = new webGlLib.Mesh(geometry, material);
		model.position.set(p_x, p_y, p_z);
		
/*			const element = document.createElement( 'a' );
			element.setAttribute("href","/");
			
			element.style.WIDTH  = 200 + 'px';  
			element.style.HEIGHT = 200 + 'px';  
	
			model.element = element;
			model.element.style.position = 'absolute';
*/
		// オブジェクトを返して代入させれば、参照（プロトタイプチェーン）は切れない
		return model;
	}


	//------------------------------------------------------------
	// グローバルに出すプロパティ
	//
	// exportsに渡さなければJs3Dinkのプロパティに加えられず、プライベートのままになる。
	//------------------------------------------------------------
	
	// value

	// function
	exports.setWrapperLib = setWrapperLib;
	exports.setCanvasSize = setCanvasSize;
	exports.addURL = addURL;
	exports.domEvent = domEvent;
	exports.createBox = createBox;

}) ));

