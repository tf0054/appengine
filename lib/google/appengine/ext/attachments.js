var db = require("google/appengine/ext/db");

/**
 * A database schema for mimemessage.
 */
var Attach = exports.Attach = db.Model.extend("Attach", {
	created: new db.DateProperty({autoNowAdd: true}),
	content: new db.BlobProperty({required: true}),
	contenttype: new db.StringProperty(),
	filename: new db.StringProperty()
});
