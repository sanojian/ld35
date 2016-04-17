/**
 * Created by jonas on 2016-04-17.
 */

function createShipTextures(game) {

	var palette = g_game.palette;
	var bmdUnits = game.add.bitmapData(14 * palette.length, 11);

	var atlasData = { frames: {} };
	for (var i=0; i<palette.length; i++) {
		bmdUnits.copyRect('ship', new Phaser.Rectangle(0, 0, 14, 11), 14*i, 0);
		bmdUnits.update();

		var loc = new Phaser.Rectangle(14*i, 0, 14, 11);
		var lookups = palette[0].colors;
		for (var j=0; j<palette[i].colors.length; j++) {
			var color = palette[i].colors[j];
			bmdUnits.replaceRGB(
				(lookups[j] >> 16) & 0xff, (lookups[j] >> 8) & 0xff, lookups[j] & 0xff, 0xff,
				(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff, 0xff, loc
			);
		}
		atlasData.frames['ship_' + palette[i].name] = { frame: { x: 14*i, y: 0, w: 14, h: 11 }};
	}

	bmdUnits.update();

	game.cache.addTextureAtlas('ships', '', bmdUnits.canvas, atlasData, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

}
