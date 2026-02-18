/**
 * 設定保持
 */
var defaultsSettings = {
	width: 920,
	height: 500,
	initIdo: 35.629902,
	initKeido: 139.66828,
	initZoomLevel: 16,
	panControl: false,
	scaleControl: false
};


/**
 * ロジック部
 */
if ( "undefined" == typeof(GMAPS) || !GMAPS ) {
	var GMAPS = {};
}
GMAPS = {
	// 表示オプション設定
	initMapOptions : function() {
		// 初期表示の緯度経度を設定
		var latlng = new google.maps.LatLng(defaultsSettings.initIdo, defaultsSettings.initKeido);

		return {
			// ズームレベル
			zoom: defaultsSettings.initZoomLevel,
			// 最小ズームレベル
			minZoom: 5,
			// 中心位置
			center: latlng,
			// マップタイプ
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			// ズームコントロール
			zoomControl: true,
			zoomControlOptions: {
				position: google.maps.ControlPosition.TOP_LEFT
			},
			// 移動コントロール
			panControl: defaultsSettings.panControl,
			panControlOptions: {
				position: google.maps.ControlPosition.TOP_LEFT
			},
			// スケールコントロール
			scaleControl: defaultsSettings.scaleControl,
			scaleControlOptions: {
				position: google.maps.ControlPosition.BOTTOM_LEFT
			},
			// マップタイプコントロール
			mapTypeControl: true,
			mapTypeControlOptions: {
				style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR
			},
			// ストリートビューコントロール
			streetViewControl: false,
			streetViewControlOptions: {
				position: google.maps.ControlPosition.TOP_LEFT
			}
		};
	},

	// 地図初期表示
	gMapsMap : null,
	googleMapsInit : function() {
		// 引数の設定内容を、デフォルトの設定内容に上書き
		defaultsSettings = $.extend({}, defaultsSettings , googleMapsSettings || {});

		// 地図キャンバスのスタイル設定
		GMAPS.addMapCanvas();

		// 表示オプションの設定
		var mapOptions = GMAPS.addMapOptions();

		// 地図の表示
		GMAPS.gMapsMap = new google.maps.Map($("#googleMapCanvas")[0], mapOptions);

		// 地図表示完了後にロード
		google.maps.event.addListenerOnce(GMAPS.gMapsMap, 'idle', function(){
			// 最初の位置に戻るボタン追加
			if (defaultsSettings.mapBackIcon == true) {
				GMAPS.addMapBackIcon();
			}

			// マーカー追加
			GMAPS.addMarkers(defaultsSettings.markers);
		});
	},

	// 地図キャンバスにスタイルを追加
	addMapCanvas : function() {
		// 高さ、幅、nowloading画像
		// border分の4pxを引いている
		var canvasStyle = {
			width: defaultsSettings.width -4,
			height: defaultsSettings.height,
			'border': '2px solid #6699FF',
			'background-image': 'url(/jj/jjcommon/img/spinner2.gif)',
			'background-repeat': 'no-repeat',
			'background-position': 'center'
		}
		$("#googleMapCanvas").css(canvasStyle);
	},

	// 表示オプションの追加と変更
	addMapOptions : function() {
		// 初期設定呼び出し
		var mapOptions = GMAPS.initMapOptions();

		// ストリートビューコントロール
		if (defaultsSettings.streetViewControl == '1') {
			mapOptions.streetViewControl = true;
		}

		return mapOptions;
	},

	// 最初の位置に戻るボタン追加
	addMapBackIcon : function() {
		// Icon表示
		var mapBackBtnStyle = {
			'margin-top': '50px',
			'cursor': 'pointer'
		}
		var mapBackBtn = document.createElement("img");
		mapBackBtn.src = '/jj/jjcommon/img/btn_map_901.gif';
		mapBackBtn.index = 1;
		$(mapBackBtn).css(mapBackBtnStyle);
		GMAPS.gMapsMap.controls[google.maps.ControlPosition.TOP_LEFT].push(mapBackBtn);

		// clickイベント 初期位置に戻る
		google.maps.event.addDomListener(mapBackBtn, 'click', function() {
			GMAPS.gMapsMap.panTo( new google.maps.LatLng(defaultsSettings.initIdo, defaultsSettings.initKeido));
		});
	},

	// 地図キャンバスにマーカーを追加
	addMarkers : function(markers) {
		for (var i in markers) {
			// iconの設定が無い場合は、表示しない
			if(!markers[i].icon){
				continue;
			}

			// クリックマーク設定
			markers[i].clickable = false;

			// 表示位置設定
			var latlng = new google.maps.LatLng(markers[i].lat, markers[i].lng);

			// マーカー表示
			var marker = new google.maps.Marker({
				clickable: markers[i].clickable,
				position: latlng,
				map: GMAPS.gMapsMap,
				icon: markers[i].icon,
				zIndex: Number(i) + 1
			});
		}
	}
}


/**
 * イベント部
 */
$(function(){
	 // 地図初期表示
	$("#googleMapCanvas").ready(GMAPS.googleMapsInit);
});
