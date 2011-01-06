/**
 * A util to get MimeMessage object for appenginejs!
 *
 * http://code.google.com/appengine/docs/python/datastore/queryclass.html#Query
 */
 
// http://bit.ly/9L18Vt "サブクラス化されません"
var JSession = Packages.javax.mail.Session;
var session = JSession.getDefaultInstance(new java.util.Properties(), null);

var JMailMimeMessage;
var JMimeMultipart;

var Attach = require("./attachments").Attach;
var logger = require("google/appengine/logging");

var MimeMessage = exports.MimeMessage = function(env) {
	// var strTmp = env['jack.request.form_vars'];
	var strTmp = env;

	if(strTmp.length > 0){
		var strPost = new Packages.java.lang.String(strTmp);
		var bais = new Packages.java.io.ByteArrayInputStream(strPost.getBytes());
		this.JMailMimeMessage = new Packages.javax.mail.internet.MimeMessage(session,bais);
		bais.close();
		
		// make object for multipart!(1layer)
		if(this.JMailMimeMessage.isMimeType("multipart/*")) {
			var ContentType = this.JMailMimeMessage.getContentType();
			bais = new Packages.java.io.ByteArrayInputStream(strPost.getBytes());
			var bads = new Packages.javax.mail.util.ByteArrayDataSource(bais,ContentType);
			bais.close();
			this.JMimeMultipart = new Packages.javax.mail.internet.MimeMultipart(bads);
			logger.info("mail content was setted. + multi("+ContentType+")");
			
			var aryParts = this.getParts();
			for(var i = 0; i<aryParts.length;i++){
				if(!aryParts[i].isMimeType("text/*")){
					this.setAttachments(aryParts[i]); 
					logger.info("part("+i+"): "+aryParts[i].getSize() +" "+aryParts[i].getContentType() +" bloded.");
				}
			}
		} else {
			this.JMimeMultipart = null;
			logger.info("mail content was setted.");
		}
	} else {
		logger.info("mail content was not found!");
	}
}

MimeMessage.prototype.getSubject = function() {
	return this.JMailMimeMessage.getSubject();
}

MimeMessage.prototype.getContent = function() {
	if(this.JMimeMultipart){
		return this.JMimeMultipart.getBodyPart(0).getContent();
	} else {
		return this.JMailMimeMessage.getContent();
	}
}

MimeMessage.prototype.hasPart = function() {
	if(this.JMimeMultipart){
		return this.JMimeMultipart.getCount();
	} else {
		return false;
	}
}

MimeMessage.prototype.getParts = function() {
	var aryTmp = new Array();
	if(this.JMimeMultipart){
		for(var i =0; i<this.JMimeMultipart.getCount();i++){
			aryTmp.push(this.JMimeMultipart.getBodyPart(i));
		}
		return aryTmp;
	} else {
		return null;
	}
}

/**
 * 添付ファイルを取得
 */
MimeMessage.prototype.setAttachments = function(part) {

	var disp = part.getDisposition();
	logger.info("disp: "+disp);
	// if (disp == null || disp.equalsIgnoreCase(part.ATTACHMENT)) {
		/* 添付ファイルの場合 --------------------------------------------------- */

		/* ファイル名 */
		var fileName = Packages.javax.mail.internet.MimeUtility.decodeText(part.getFileName());

		/* ファイルサイズ */
		var fileSize = part.getSize();

		/* コンテントタイプ */
		var contentType = part.getContentType();
		contentType = contentType.substring(0,contentType.indexOf(";",0));

		/* ファイル内容 */
		var blob = this.generateBlob(part.getInputStream());
		logger.info("saved: " + part.getSize());
		var {ByteString} = require('binary');
		var atc = new Attach({
			content: new ByteString(blob.toByteArray()),
			filename: fileName,
			contenttype: contentType
		});
		atc.put();
	// }
}

/**
 * Blob生成
 */
MimeMessage.prototype.generateBlob = function(inStrm) {

		var len;
		var out = new Packages.java.io.ByteArrayOutputStream();
		var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);

		while ((len = inStrm.read(buffer, 0, buffer.length)) != -1) {
				out.write(buffer, 0, len);
		}

		// var {ByteString} = require('binary');
		// return new ByteString(out.toByteArray());
		
		return out;
}

MimeMessage.prototype.getAttachment = function(key) {
	return Attach.get(key);
}

MimeMessage.prototype.getAttachments = function(intlimit) {
	var attachments = Attach.all().order("-created").limit(intlimit).fetch();
	return attachments;
}